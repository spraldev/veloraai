import { prisma } from "@/lib/prisma"
import { createLLM } from "@/lib/agents/base"
import { hybridSearch } from "./hybrid-search"

export async function generateStudyBrief(
  userId: string,
  targetDate: Date,
  focusAreas?: string[]
): Promise<{
  id: string
  summary: string
  blocks: Array<{
    subject: string
    duration: number
    method: string
    topic: string
  }>
}> {
  try {
    const endDate = new Date(targetDate)
    endDate.setDate(endDate.getDate() + 7)
    
    const userClasses = await prisma.class.findMany({
      where: { userId },
      select: { id: true },
    })
    
    const assignments = await prisma.assignment.findMany({
      where: {
        classId: { in: userClasses.map(c => c.id) },
        dueDate: {
          gte: targetDate,
          lte: endDate,
        },
        completed: false,
      },
      include: {
        class: true,
      },
      orderBy: {
        dueDate: "asc",
      },
    })
    
    if (assignments.length === 0) {
      const defaultBrief = await prisma.studyBrief.create({
        data: {
          userId,
          date: targetDate,
          summary: "No upcoming assignments. Great time to review or get ahead!",
          totalTime: "0 min",
        },
      })
      
      return {
        id: defaultBrief.id,
        summary: defaultBrief.summary,
        blocks: [],
      }
    }
    
    const assignmentContext = assignments.map(a => 
      `${a.class.name}: "${a.title}" due ${a.dueDate.toLocaleDateString()} (${a.type}, weight: ${a.weight})`
    ).join("\n")
    
    const llm = createLLM(0.7)
    
    const prompt = `You are Velora, an AI study assistant. Create a prioritized study plan for today.

Upcoming assignments:
${assignmentContext}

Create a study plan with 2-4 focused blocks. For each block:
- Prioritize urgent/high-weight assignments
- Use effective study methods: retrieval practice, mixed practice, worked examples
- Keep blocks 25-60 minutes
- Total plan should be 60-180 minutes

Return ONLY JSON:
{
  "summary": "Brief 1-sentence overview",
  "blocks": [
    {
      "subject": "Class name",
      "duration": 45,
      "method": "Retrieval Practice",
      "topic": "Specific topic"
    }
  ]
}`

    const response = await llm.invoke(prompt)
    const content = response.content as string
    
    const jsonMatch = content.match(/\{[\s\S]*\}/)
    if (!jsonMatch) {
      throw new Error("Failed to parse study brief from LLM response")
    }
    
    const planData = JSON.parse(jsonMatch[0])
    
    const totalMinutes = planData.blocks.reduce((sum: number, b: any) => sum + b.duration, 0)
    
    const brief = await prisma.studyBrief.create({
      data: {
        userId,
        date: targetDate,
        summary: planData.summary,
        totalTime: `${totalMinutes} min`,
      },
    })
    
    const blocks = await Promise.all(
      planData.blocks.map((block: any, index: number) =>
        prisma.studyBlock.create({
          data: {
            briefId: brief.id,
            classId: assignments[0]?.classId || "",
            subject: block.subject,
            duration: block.duration,
            method: block.method,
            topic: block.topic,
            order: index,
            completed: false,
          },
        })
      )
    )
    
    return {
      id: brief.id,
      summary: brief.summary,
      blocks: blocks.map(b => ({
        subject: b.subject,
        duration: b.duration,
        method: b.method,
        topic: b.topic,
      })),
    }
  } catch (error) {
    console.error("Study brief generation error:", error)
    throw new Error(`Failed to generate study brief: ${error instanceof Error ? error.message : "Unknown error"}`)
  }
}
