import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { generateStudyBrief } from "@/lib/services/study-brief"

export async function GET(request: NextRequest) {
  try {
    const session = await auth()
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const date = searchParams.get('date')

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    })

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    const whereClause: any = { userId: user.id }
    if (date) {
      const targetDate = new Date(date)
      whereClause.date = {
        gte: new Date(targetDate.setHours(0, 0, 0, 0)),
        lt: new Date(targetDate.setHours(23, 59, 59, 999)),
      }
    }

    const briefs = await prisma.studyBrief.findMany({
      where: whereClause,
      include: {
        blocks: {
          include: {
            class: {
              select: {
                id: true,
                name: true,
                color: true,
              },
            },
          },
          orderBy: { order: 'asc' },
        },
      },
      orderBy: { date: 'desc' },
    })

    return NextResponse.json(briefs)
  } catch (error) {
    console.error("Study briefs fetch error:", error)
    return NextResponse.json(
      { error: "Failed to fetch study briefs" },
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
    const { date, summary, totalTime, blocks, focusAreas } = body

    if (!date) {
      return NextResponse.json({ error: "date is required" }, { status: 400 })
    }

    let createdBrief
    
    if (blocks && blocks.length > 0) {
      const brief = await prisma.studyBrief.create({
        data: {
          userId: user.id,
          date: new Date(date),
          summary: summary || "",
          totalTime: totalTime || "0 min",
        },
      })

      await prisma.studyBlock.createMany({
        data: blocks.map((block: any, index: number) => ({
          briefId: brief.id,
          classId: block.classId,
          subject: block.subject || "",
          duration: block.duration || 0,
          method: block.method || "retrieval",
          topic: block.topic || "",
          order: index,
          completed: false,
        })),
      })

      createdBrief = await prisma.studyBrief.findUnique({
        where: { id: brief.id },
        include: {
          blocks: {
            include: {
              class: {
                select: {
                  id: true,
                  name: true,
                  color: true,
                },
              },
            },
            orderBy: { order: 'asc' },
          },
        },
      })
    } else {
      const targetDate = new Date(date)
      const brief = await generateStudyBrief(user.id, targetDate, focusAreas)
      
      createdBrief = await prisma.studyBrief.findUnique({
        where: { id: brief.id },
        include: {
          blocks: {
            include: {
              class: {
                select: {
                  id: true,
                  name: true,
                  color: true,
                },
              },
            },
            orderBy: { order: 'asc' },
          },
        },
      })
    }

    return NextResponse.json(createdBrief, { status: 201 })
  } catch (error) {
    console.error("Study brief creation error:", error)
    return NextResponse.json(
      { error: "Failed to create study brief" },
      { status: 500 }
    )
  }
}
