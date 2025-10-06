import { StateGraph } from "@langchain/langgraph"
import { AIMessage, HumanMessage, SystemMessage } from "@langchain/core/messages"
import { AgentState, AgentStateType, createLLM } from "./base"
import { createRetrieveTool, createSummarizeTool, createQuizTool } from "./tools"

export function createHelperAgent(userId: string, classId: string, className: string) {
  const llm = createLLM(0.7)
  
  const tools = [
    createRetrieveTool(userId, classId),
    createSummarizeTool(userId, classId),
    createQuizTool(userId, classId),
  ]
  
  const llmWithTools = llm.bindTools(tools)
  
  async function callModel(state: AgentStateType) {
    const systemPrompt = `You are the ${className} Helper, a specialized AI assistant for this class. You help students:
- Answer questions about class materials
- Summarize notes and lectures
- Generate practice questions
- Explain difficult concepts
- Review for quizzes and tests

You only have access to materials from ${className}. Use your tools to:
- retrieve: Find relevant class materials
- summarize_notes: Create summaries of topics
- generate_quiz: Make practice questions

Be clear, encouraging, and focused on helping the student master this subject through active learning.`

    const messages = [
      new SystemMessage(systemPrompt),
      ...state.messages.map(m => 
        m.role === "user" ? new HumanMessage(m.content) : new AIMessage(m.content)
      ),
    ]
    
    const response = await llmWithTools.invoke(messages)
    
    return {
      messages: [{
        role: "assistant" as const,
        content: response.content as string,
        name: `${className} Helper`,
      }],
    }
  }
  
  const workflow = new StateGraph(AgentState)
    .addNode("agent", callModel)
    .addEdge("__start__", "agent")
    .addEdge("agent", "__end__")
  
  return workflow.compile()
}
