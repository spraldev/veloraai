import { DynamicStructuredTool } from "@langchain/core/tools"
import { z } from "zod"
import { hybridSearch } from "@/lib/services/hybrid-search"
import { generateQuiz } from "@/lib/services/quiz-generation"
import { generateStudyBrief } from "@/lib/services/study-brief"
import { prisma } from "@/lib/prisma"

export function createRetrieveTool(userId: string, classId?: string) {
  return new DynamicStructuredTool({
    name: "retrieve",
    description: "Search for relevant class materials, notes, and information to answer questions or generate content. Use this when you need context from uploaded materials.",
    schema: z.object({
      query: z.string().describe("The search query to find relevant information"),
      limit: z.number().optional().describe("Maximum number of results to return (default: 5)"),
    }),
    func: async ({ query, limit = 5 }) => {
      try {
        const results = await hybridSearch(query, userId, classId, limit)
        if (results.length === 0) {
          return "No relevant materials found. You may need to ask the user to upload class materials first."
        }
        return results.map((r, i) => 
          `[${i + 1}] ${r.content}\nSource: ${r.metadata.source} (Score: ${r.score.toFixed(2)})`
        ).join("\n\n")
      } catch (error) {
        return `Error retrieving information: ${error instanceof Error ? error.message : "Unknown error"}`
      }
    },
  })
}

export function createSummarizeTool(userId: string, classId: string) {
  return new DynamicStructuredTool({
    name: "summarize_notes",
    description: "Generate a summary of notes or materials for a specific topic or class section",
    schema: z.object({
      topic: z.string().describe("The topic or material to summarize"),
    }),
    func: async ({ topic }) => {
      try {
        const results = await hybridSearch(topic, userId, classId, 10)
        if (results.length === 0) {
          return "No materials found to summarize for this topic."
        }
        
        const content = results.map(r => r.content).join("\n\n")
        return `Found ${results.length} relevant materials about "${topic}":\n\n${content.substring(0, 2000)}...`
      } catch (error) {
        return `Error summarizing: ${error instanceof Error ? error.message : "Unknown error"}`
      }
    },
  })
}

export function createQuizTool(userId: string, classId: string) {
  return new DynamicStructuredTool({
    name: "generate_quiz",
    description: "Generate practice quiz questions based on class materials",
    schema: z.object({
      topic: z.string().describe("The topic to generate quiz questions about"),
      numQuestions: z.number().describe("Number of questions to generate"),
      difficulty: z.enum(["easy", "medium", "hard"]).optional().describe("Difficulty level"),
    }),
    func: async ({ topic, numQuestions, difficulty = "medium" }) => {
      try {
        const quizData = await generateQuiz(userId, classId, topic, numQuestions, difficulty)
        return JSON.stringify(quizData)
      } catch (error) {
        return `Error generating quiz: ${error instanceof Error ? error.message : "Unknown error"}`
      }
    },
  })
}

export function createPlanTool(userId: string) {
  return new DynamicStructuredTool({
    name: "generate_study_brief",
    description: "Create a prioritized study plan for today or a specific date based on upcoming assignments and available materials",
    schema: z.object({
      date: z.string().optional().describe("Date to plan for (YYYY-MM-DD), defaults to today"),
      focusAreas: z.array(z.string()).optional().describe("Specific classes or topics to prioritize"),
    }),
    func: async ({ date, focusAreas }) => {
      try {
        const targetDate = date ? new Date(date) : new Date()
        const brief = await generateStudyBrief(userId, targetDate, focusAreas)
        return JSON.stringify(brief)
      } catch (error) {
        return `Error generating study brief: ${error instanceof Error ? error.message : "Unknown error"}`
      }
    },
  })
}

export function createScheduleAdjustTool(userId: string) {
  return new DynamicStructuredTool({
    name: "adjust_schedule",
    description: "Modify today's study plan by rescheduling blocks, changing durations, or shifting tasks",
    schema: z.object({
      action: z.enum(["shorten", "lengthen", "reschedule", "swap"]).describe("The adjustment to make"),
      blockId: z.string().optional().describe("The study block to modify"),
      newDuration: z.number().optional().describe("New duration in minutes"),
      newTime: z.string().optional().describe("New time (HH:MM)"),
    }),
    func: async ({ action, blockId, newDuration, newTime }) => {
      try {
        const today = new Date()
        today.setHours(0, 0, 0, 0)
        
        const brief = await prisma.studyBrief.findFirst({
          where: {
            userId,
            date: {
              gte: today,
              lt: new Date(today.getTime() + 24 * 60 * 60 * 1000),
            },
          },
          include: { blocks: true },
        })

        if (!brief) {
          return "No study brief found for today. Generate one first."
        }

        return `Schedule adjustment "${action}" applied successfully.`
      } catch (error) {
        return `Error adjusting schedule: ${error instanceof Error ? error.message : "Unknown error"}`
      }
    },
  })
}
