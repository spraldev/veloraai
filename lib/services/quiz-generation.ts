import { prisma } from "@/lib/prisma"
import { createFastLLM } from "@/lib/agents/base"
import { hybridSearch } from "./hybrid-search"

export async function generateQuiz(
  userId: string,
  classId: string,
  topic: string,
  numQuestions: number,
  difficulty: "easy" | "medium" | "hard" = "medium"
): Promise<{
  id: string
  questions: Array<{
    question: string
    options: string[]
    correctAnswer: number
    explanation: string
  }>
}> {
  try {
    const materials = await hybridSearch(topic, userId, classId, 10)
    
    if (materials.length === 0) {
      throw new Error("No materials found for this topic. Please upload class materials first.")
    }
    
    const context = materials.map(m => m.content).join("\n\n")
    
    const llm = createFastLLM(0.8)
    
    const prompt = `You are a study assistant helping create practice quiz questions.

Context from class materials:
${context.substring(0, 3000)}

Generate ${numQuestions} ${difficulty} difficulty multiple choice questions about "${topic}".

For each question:
1. Create a clear, specific question
2. Provide 4 answer options
3. Mark the correct answer
4. Include a brief explanation

Return ONLY a JSON array with this structure:
[
  {
    "question": "Question text here?",
    "options": ["Option A", "Option B", "Option C", "Option D"],
    "correctAnswer": 0,
    "explanation": "Brief explanation of why this is correct"
  }
]`

    const response = await llm.invoke(prompt)
    const content = response.content as string
    
    const jsonMatch = content.match(/\[[\s\S]*\]/)
    if (!jsonMatch) {
      throw new Error("Failed to parse quiz questions from LLM response")
    }
    
    const questions = JSON.parse(jsonMatch[0])
    
    const practiceSet = await prisma.practiceSet.create({
      data: {
        classId,
        title: `${topic} - ${difficulty} practice`,
        difficulty,
        questions: numQuestions,
        questionsData: questions,
      },
    })
    
    return {
      id: practiceSet.id,
      questions,
    }
  } catch (error) {
    console.error("Quiz generation error:", error)
    throw new Error(`Failed to generate quiz: ${error instanceof Error ? error.message : "Unknown error"}`)
  }
}
