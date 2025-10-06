import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { generateQuiz } from "@/lib/services/quiz-generation"

export async function GET(request: NextRequest) {
  try {
    const session = await auth()
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const classId = searchParams.get('classId')

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    })

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    const whereClause: any = {}
    if (classId) {
      const classData = await prisma.class.findFirst({
        where: { id: classId, userId: user.id },
      })
      if (!classData) {
        return NextResponse.json({ error: "Class not found" }, { status: 404 })
      }
      whereClause.classId = classId
    } else {
      const userClasses = await prisma.class.findMany({
        where: { userId: user.id },
        select: { id: true },
      })
      whereClause.classId = { in: userClasses.map(c => c.id) }
    }

    const practiceSets = await prisma.practiceSet.findMany({
      where: whereClause,
      include: {
        class: {
          select: {
            id: true,
            name: true,
            color: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json(practiceSets)
  } catch (error) {
    console.error("Practice sets fetch error:", error)
    return NextResponse.json(
      { error: "Failed to fetch practice sets" },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    })

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    const body = await request.json()
    const { classId, title, difficulty, questionsData, topic, numQuestions } = body

    if (!classId) {
      return NextResponse.json(
        { error: "classId is required" },
        { status: 400 }
      )
    }

    const classData = await prisma.class.findFirst({
      where: { id: classId, userId: user.id },
    })

    if (!classData) {
      return NextResponse.json({ error: "Class not found" }, { status: 404 })
    }

    let practiceSet

    if (questionsData && questionsData.length > 0) {
      practiceSet = await prisma.practiceSet.create({
        data: {
          classId,
          title: title || `${classData.name} Practice`,
          difficulty: difficulty || "medium",
          questions: questionsData.length,
          questionsData,
        },
      })
    } else if (topic && numQuestions) {
      const quiz = await generateQuiz(
        user.id,
        classId,
        topic,
        numQuestions,
        difficulty || "medium"
      )
      
      practiceSet = await prisma.practiceSet.findUnique({
        where: { id: quiz.id },
        include: {
          class: {
            select: {
              id: true,
              name: true,
              color: true,
            },
          },
        },
      })
    } else {
      return NextResponse.json(
        { error: "Either questionsData or (topic and numQuestions) are required" },
        { status: 400 }
      )
    }

    return NextResponse.json(practiceSet, { status: 201 })
  } catch (error) {
    console.error("Practice set creation error:", error)
    return NextResponse.json(
      { error: "Failed to create practice set" },
      { status: 500 }
    )
  }
}
