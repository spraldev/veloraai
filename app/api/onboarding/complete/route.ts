import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { classes, preferences } = body

    await prisma.user.update({
      where: { email: session.user.email },
      data: {
        onboardingComplete: true,
        preferences: preferences || {},
      },
    })

    if (classes && classes.length > 0) {
      const user = await prisma.user.findUnique({
        where: { email: session.user.email },
      })

      if (user) {
        await prisma.class.createMany({
          data: classes.map((cls: any) => ({
            userId: user.id,
            name: cls.name,
            teacher: cls.teacher || "",
            color: cls.color || "#EB1F3A",
          })),
          skipDuplicates: true,
        })
      }
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Onboarding completion error:", error)
    return NextResponse.json(
      { error: "Failed to complete onboarding" },
      { status: 500 }
    )
  }
}
