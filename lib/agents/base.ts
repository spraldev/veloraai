import { ChatOpenAI } from "@langchain/openai"
import { StateGraph, Annotation } from "@langchain/langgraph"

export const AgentState = Annotation.Root({
  messages: Annotation<Array<{ role: string; content: string; name?: string }>>({
    reducer: (x, y) => x.concat(y),
    default: () => [],
  }),
  userId: Annotation<string>(),
  agentId: Annotation<string>(),
  agentType: Annotation<string>(),
  classId: Annotation<string | null>({
    reducer: (x, y) => y ?? x,
    default: () => null,
  }),
  context: Annotation<Record<string, any>>({
    reducer: (x, y) => ({ ...x, ...y }),
    default: () => ({}),
  }),
})

export type AgentStateType = typeof AgentState.State

export function createLLM(temperature = 0.7) {
  const apiKey = process.env.OPENAI_API_KEY
  if (!apiKey) {
    throw new Error("OPENAI_API_KEY environment variable is required")
  }
  return new ChatOpenAI({
    modelName: "gpt-4",
    temperature,
    openAIApiKey: apiKey,
  })
}

export function createFastLLM(temperature = 0.7) {
  const apiKey = process.env.OPENAI_API_KEY
  if (!apiKey) {
    throw new Error("OPENAI_API_KEY environment variable is required")
  }
  return new ChatOpenAI({
    modelName: "gpt-3.5-turbo",
    temperature,
    openAIApiKey: apiKey,
  })
}
