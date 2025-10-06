import { prisma } from "@/lib/prisma"

export async function saveConversation(
  threadId: string,
  userId: string,
  agentType: string,
  agentId: string | null,
  userMessage: string,
  assistantMessage: string
) {
  try {
    await prisma.message.createMany({
      data: [
        {
          threadId,
          userId,
          role: "user",
          content: userMessage,
        },
        {
          threadId,
          userId,
          role: "assistant",
          content: assistantMessage,
          agentId,
        },
      ],
    })
    
    await prisma.thread.update({
      where: { id: threadId },
      data: { lastActivity: new Date() },
    })
  } catch (error) {
    console.error("Error saving conversation:", error)
    throw error
  }
}

export async function loadConversationHistory(threadId: string) {
  try {
    const messages = await prisma.message.findMany({
      where: { threadId },
      orderBy: { createdAt: "asc" },
      take: 50,
    })
    
    return messages.map(m => ({
      role: m.role as "user" | "assistant",
      content: m.content,
    }))
  } catch (error) {
    console.error("Error loading conversation history:", error)
    return []
  }
}
