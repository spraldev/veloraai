import { prisma } from "@/lib/prisma"
import { createFastLLM } from "@/lib/agents/base"
import { ExtractedEvent } from "./types"

export async function extractEvents(
  text: string,
  userId: string,
  classId: string,
  materialId: string
): Promise<ExtractedEvent[]> {
  try {
    const llm = createFastLLM(0.3)
    
    const prompt = `Extract any mentions of quizzes, tests, exams, assignments, or deadlines from this text.

Text: "${text}"

Return ONLY a JSON array of events:
[
  {
    "type": "quiz|test|exam|assignment|deadline",
    "when": "YYYY-MM-DD",
    "topic": "Brief topic",
    "confidence": 0.0-1.0,
    "context": "Relevant excerpt from text"
  }
]

If no events found, return: []`

    const response = await llm.invoke(prompt)
    const content = response.content as string
    
    const jsonMatch = content.match(/\[[\s\S]*\]/)
    if (!jsonMatch) {
      return []
    }
    
    const events: ExtractedEvent[] = JSON.parse(jsonMatch[0]).map((e: any) => ({
      type: e.type,
      when: new Date(e.when),
      topic: e.topic,
      confidence: e.confidence,
      sourceId: materialId,
      context: e.context,
    }))
    
    await Promise.all(
      events.map(event =>
        prisma.event.create({
          data: {
            classId,
            materialId,
            type: event.type,
            topic: event.topic,
            date: event.when,
            confidence: event.confidence,
          },
        })
      )
    )
    
    return events
  } catch (error) {
    console.error("Event extraction error:", error)
    return []
  }
}
