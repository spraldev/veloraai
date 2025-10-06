import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { writeFile, mkdir } from "fs/promises"
import { join } from "path"
import { existsSync } from "fs"
import { ingestAudio } from "@/lib/services/ingestion"

export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    
    const formData = await request.formData()
    const file = formData.get("audio") as File
    const classId = formData.get("classId") as string
    const title = formData.get("title") as string
    
    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }
    
    if (!classId) {
      return NextResponse.json({ error: "classId is required" }, { status: 400 })
    }
    
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    
    const uploadsDir = join(process.cwd(), "uploads")
    if (!existsSync(uploadsDir)) {
      await mkdir(uploadsDir, { recursive: true })
    }
    
    const filename = `${Date.now()}-${file.name}`
    const filepath = join(uploadsDir, filename)
    
    await writeFile(filepath, buffer)
    
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    })
    
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }
    
    const materialId = await ingestAudio(
      filepath,
      user.id,
      classId,
      title || file.name
    )
    
    return NextResponse.json({
      success: true,
      materialId,
      message: "Audio uploaded and processing started",
    })
  } catch (error) {
    console.error("Audio upload error:", error)
    return NextResponse.json(
      { error: "Failed to upload audio" },
      { status: 500 }
    )
  }
}
