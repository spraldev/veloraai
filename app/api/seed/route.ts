import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: { classes: true },
    })

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    if (user.classes.length === 0) {
      return NextResponse.json(
        { error: "No classes found. Please create classes first." },
        { status: 400 }
      )
    }

    const bioClass = user.classes.find(c => c.name.includes("Biology"))
    const calcClass = user.classes.find(c => c.name.includes("Calculus"))
    const litClass = user.classes.find(c => c.name.includes("Literature"))

    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)
    tomorrow.setHours(14, 0, 0, 0)

    const dayAfterTomorrow = new Date()
    dayAfterTomorrow.setDate(dayAfterTomorrow.getDate() + 2)
    dayAfterTomorrow.setHours(14, 0, 0, 0)

    const nextWeek = new Date()
    nextWeek.setDate(nextWeek.getDate() + 7)
    nextWeek.setHours(23, 59, 0, 0)

    type AssignmentData = {
      classId: string
      title: string
      description: string
      dueDate: Date
      type: string
      weight: number
      completed: boolean
    }

    const assignments: AssignmentData[] = []

    if (bioClass) {
      assignments.push({
        classId: bioClass.id,
        title: "AP Bio Quiz — Cellular Respiration",
        description: "Quiz covering glycolysis, Krebs cycle, and electron transport chain",
        dueDate: tomorrow,
        type: "quiz",
        weight: 10,
        completed: false,
      })
    }

    if (calcClass) {
      assignments.push({
        classId: calcClass.id,
        title: "AP Calc Quiz — Derivatives",
        description: "Quiz on derivative rules and applications",
        dueDate: tomorrow,
        type: "quiz",
        weight: 10,
        completed: false,
      })
    }

    if (litClass) {
      assignments.push({
        classId: litClass.id,
        title: "English Reading — Ch. 12",
        description: "Read chapter 12 and prepare for class discussion",
        dueDate: dayAfterTomorrow,
        type: "assignment",
        weight: 5,
        completed: false,
      })
    }

    if (bioClass) {
      assignments.push({
        classId: bioClass.id,
        title: "Lab Report — Photosynthesis",
        description: "Complete lab report on photosynthesis experiment",
        dueDate: nextWeek,
        type: "assignment",
        weight: 15,
        completed: false,
      })
    }

    await prisma.assignment.createMany({
      data: assignments,
      skipDuplicates: true,
    })

    return NextResponse.json({
      success: true,
      message: `Created ${assignments.length} test assignments`,
    })
  } catch (error) {
    console.error("Seed error:", error)
    return NextResponse.json(
      { error: "Failed to seed data" },
      { status: 500 }
    )
  }
}
