import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

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
    const { classId, title, difficulty, questions, concepts } = body

    if (!classId || !title || !questions) {
      return NextResponse.json(
        { error: "classId, title, and questions are required" },
        { status: 400 }
      )
    }

    const classData = await prisma.class.findFirst({
      where: { id: classId, userId: user.id },
    })

    if (!classData) {
      return NextResponse.json({ error: "Class not found" }, { status: 404 })
    }

    const practiceSet = await prisma.practiceSet.create({
      data: {
        classId,
        title,
        difficulty: difficulty || "medium",
        questions,
        progress: 0,
        lastAttempt: null,
        concepts: concepts || [],
      },
    })

    return NextResponse.json(practiceSet, { status: 201 })
  } catch (error) {
    console.error("Practice set creation error:", error)
    return NextResponse.json(
      { error: "Failed to create practice set" },
      { status: 500 }
    )
  }
}
