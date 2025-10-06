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

    const notes = await prisma.note.findMany({
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

    return NextResponse.json(notes)
  } catch (error) {
    console.error("Notes fetch error:", error)
    return NextResponse.json(
      { error: "Failed to fetch notes" },
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
    const { classId, materialId, title, content, outline } = body

    if (!classId || !title || !content) {
      return NextResponse.json(
        { error: "classId, title, and content are required" },
        { status: 400 }
      )
    }

    const classData = await prisma.class.findFirst({
      where: { id: classId, userId: user.id },
    })

    if (!classData) {
      return NextResponse.json({ error: "Class not found" }, { status: 404 })
    }

    const note = await prisma.note.create({
      data: {
        classId,
        materialId: materialId || null,
        title,
        content,
        outline: outline || {},
      },
    })

    return NextResponse.json(note, { status: 201 })
  } catch (error) {
    console.error("Note creation error:", error)
    return NextResponse.json(
      { error: "Failed to create note" },
      { status: 500 }
    )
  }
}
