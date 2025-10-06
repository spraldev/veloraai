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
    const upcoming = searchParams.get('upcoming') === 'true'

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

    if (upcoming) {
      whereClause.dueDate = {
        gte: new Date(),
      }
    }

    const assignments = await prisma.assignment.findMany({
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
      orderBy: { dueDate: 'asc' },
    })

    return NextResponse.json(assignments)
  } catch (error) {
    console.error("Assignments fetch error:", error)
    return NextResponse.json(
      { error: "Failed to fetch assignments" },
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
    const { classId, title, description, dueDate, type, weight, googleClassroomId } = body

    if (!classId || !title || !dueDate) {
      return NextResponse.json(
        { error: "classId, title, and dueDate are required" },
        { status: 400 }
      )
    }

    const classData = await prisma.class.findFirst({
      where: { id: classId, userId: user.id },
    })

    if (!classData) {
      return NextResponse.json({ error: "Class not found" }, { status: 404 })
    }

    const assignment = await prisma.assignment.create({
      data: {
        classId,
        title,
        description: description || "",
        dueDate: new Date(dueDate),
        type: type || "assignment",
        weight: weight || 0,
        completed: false,
        googleClassroomId: googleClassroomId || null,
      },
    })

    return NextResponse.json(assignment, { status: 201 })
  } catch (error) {
    console.error("Assignment creation error:", error)
    return NextResponse.json(
      { error: "Failed to create assignment" },
      { status: 500 }
    )
  }
}
