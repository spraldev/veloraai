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

    const materials = await prisma.material.findMany({
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

    return NextResponse.json(materials)
  } catch (error) {
    console.error("Materials fetch error:", error)
    return NextResponse.json(
      { error: "Failed to fetch materials" },
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
    const { classId, type, title, source, content, filePath, duration, metadata } = body

    if (!classId || !type || !title) {
      return NextResponse.json(
        { error: "classId, type, and title are required" },
        { status: 400 }
      )
    }

    const classData = await prisma.class.findFirst({
      where: { id: classId, userId: user.id },
    })

    if (!classData) {
      return NextResponse.json({ error: "Class not found" }, { status: 404 })
    }

    const material = await prisma.material.create({
      data: {
        classId,
        type,
        title,
        source: source || "",
        content: content || "",
        filePath: filePath || null,
        duration: duration || null,
        metadata: metadata || {},
      },
    })

    return NextResponse.json(material, { status: 201 })
  } catch (error) {
    console.error("Material creation error:", error)
    return NextResponse.json(
      { error: "Failed to create material" },
      { status: 500 }
    )
  }
}
