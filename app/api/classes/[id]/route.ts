import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    const classData = await prisma.class.findFirst({
      where: { 
        id: params.id,
        userId: user.id,
      },
      include: {
        materials: {
          orderBy: { createdAt: 'desc' },
        },
        notes: {
          orderBy: { createdAt: 'desc' },
        },
        assignments: {
          orderBy: { dueDate: 'asc' },
        },
        _count: {
          select: {
            materials: true,
            notes: true,
            assignments: true,
          },
        },
      },
    })

    if (!classData) {
      return NextResponse.json({ error: "Class not found" }, { status: 404 })
    }

    return NextResponse.json(classData)
  } catch (error) {
    console.error("Class fetch error:", error)
    return NextResponse.json(
      { error: "Failed to fetch class" },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    const existingClass = await prisma.class.findFirst({
      where: { 
        id: params.id,
        userId: user.id,
      },
    })

    if (!existingClass) {
      return NextResponse.json({ error: "Class not found" }, { status: 404 })
    }

    const body = await request.json()
    const { name, teacher, color, progress, googleClassroomId } = body

    const updatedClass = await prisma.class.update({
      where: { id: params.id },
      data: {
        ...(name !== undefined && { name }),
        ...(teacher !== undefined && { teacher }),
        ...(color !== undefined && { color }),
        ...(progress !== undefined && { progress }),
        ...(googleClassroomId !== undefined && { googleClassroomId }),
      },
    })

    return NextResponse.json(updatedClass)
  } catch (error) {
    console.error("Class update error:", error)
    return NextResponse.json(
      { error: "Failed to update class" },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    const existingClass = await prisma.class.findFirst({
      where: { 
        id: params.id,
        userId: user.id,
      },
    })

    if (!existingClass) {
      return NextResponse.json({ error: "Class not found" }, { status: 404 })
    }

    await prisma.class.delete({
      where: { id: params.id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Class deletion error:", error)
    return NextResponse.json(
      { error: "Failed to delete class" },
      { status: 500 }
    )
  }
}
