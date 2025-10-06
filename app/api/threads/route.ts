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
    const agentType = searchParams.get('agentType')

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    })

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    const whereClause: any = { userId: user.id }
    if (agentType) {
      whereClause.agentType = agentType
    }

    const threads = await prisma.thread.findMany({
      where: whereClause,
      include: {
        messages: {
          orderBy: { createdAt: 'desc' },
          take: 1,
        },
      },
      orderBy: { lastActivity: 'desc' },
    })

    return NextResponse.json(threads)
  } catch (error) {
    console.error("Threads fetch error:", error)
    return NextResponse.json(
      { error: "Failed to fetch threads" },
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
    const { agentType, agentId, title } = body

    if (!agentType) {
      return NextResponse.json(
        { error: "agentType is required" },
        { status: 400 }
      )
    }

    const thread = await prisma.thread.create({
      data: {
        userId: user.id,
        agentType,
        agentId: agentId || null,
        title: title || "New conversation",
        pinned: false,
        lastActivity: new Date(),
      },
    })

    return NextResponse.json(thread, { status: 201 })
  } catch (error) {
    console.error("Thread creation error:", error)
    return NextResponse.json(
      { error: "Failed to create thread" },
      { status: 500 }
    )
  }
}
