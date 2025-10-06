import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { createVeloraAgent } from "@/lib/agents/velora"
import { createHelperAgent } from "@/lib/agents/helper"
import { saveConversation, loadConversationHistory } from "@/lib/agents/memory"

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
    const { message, threadId, agentType, agentId } = body
    
    if (!message || !threadId) {
      return NextResponse.json(
        { error: "message and threadId are required" },
        { status: 400 }
      )
    }
    
    const thread = await prisma.thread.findUnique({
      where: { id: threadId },
      include: { messages: { orderBy: { createdAt: "asc" }, take: 20 } },
    })
    
    if (!thread) {
      return NextResponse.json({ error: "Thread not found" }, { status: 404 })
    }
    
    const history = thread.messages.map(m => ({
      role: m.role as "user" | "assistant",
      content: m.content,
    }))
    
    let agent
    if (agentType === "velora") {
      agent = createVeloraAgent(user.id)
    } else if (agentType === "helper" && agentId) {
      const classData = await prisma.class.findUnique({
        where: { id: agentId },
      })
      
      if (!classData) {
        return NextResponse.json({ error: "Class not found" }, { status: 404 })
      }
      
      agent = createHelperAgent(user.id, agentId, classData.name)
    } else {
      return NextResponse.json(
        { error: "Invalid agent type or missing agentId" },
        { status: 400 }
      )
    }
    
    const result = await agent.invoke({
      messages: [...history, { role: "user" as const, content: message }],
      userId: user.id,
      agentId: agentId || "velora",
      agentType,
      classId: agentType === "helper" ? agentId : null,
      context: {},
    })
    
    const assistantMessage = result.messages[result.messages.length - 1]?.content || "I apologize, but I encountered an error processing your request."
    
    await saveConversation(
      threadId,
      user.id,
      agentType,
      agentId,
      message,
      assistantMessage
    )
    
    return NextResponse.json({
      message: assistantMessage,
      threadId,
    })
  } catch (error) {
    console.error("Chat error:", error)
    return NextResponse.json(
      { error: "Failed to process chat message" },
      { status: 500 }
    )
  }
}
