import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
    })

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    return NextResponse.json({
      connected: user.googleConnected || false,
      lastSync: user.googleLastSync,
    })
  } catch (error) {
    console.error("Classroom connect status error:", error)
    return NextResponse.json(
      { error: "Failed to get connection status" },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const user = await prisma.user.update({
      where: { id: session.user.id },
      data: {
        googleConnected: true,
        googleLastSync: new Date(),
      },
    })

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        googleConnected: user.googleConnected,
      },
    })
  } catch (error) {
    console.error("Classroom connect error:", error)
    return NextResponse.json(
      { error: "Failed to connect Google Classroom" },
      { status: 500 }
    )
  }
}
