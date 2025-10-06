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
    })
    
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }
    
    const body = await request.json()
    const { subscription } = body
    
    if (!subscription) {
      return NextResponse.json(
        { error: "subscription is required" },
        { status: 400 }
      )
    }
    
    await prisma.notificationSubscription.create({
      data: {
        userId: user.id,
        endpoint: subscription.endpoint,
        keys: subscription.keys,
      },
    })
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Notification subscription error:", error)
    return NextResponse.json(
      { error: "Failed to save notification subscription" },
      { status: 500 }
    )
  }
}
