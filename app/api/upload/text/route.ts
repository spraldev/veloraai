import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { ingestText } from "@/lib/services/ingestion"

export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    
    const body = await request.json()
    const { text, classId, title, type } = body
    
    if (!text || !classId || !title) {
      return NextResponse.json(
        { error: "text, classId, and title are required" },
        { status: 400 }
      )
    }
    
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    })
    
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }
    
    const materialId = await ingestText(
      text,
      user.id,
      classId,
      title,
      type || "text"
    )
    
    return NextResponse.json({
      success: true,
      materialId,
      message: "Text uploaded and processing started",
    })
  } catch (error) {
    console.error("Text upload error:", error)
    return NextResponse.json(
      { error: "Failed to upload text" },
      { status: 500 }
    )
  }
}
