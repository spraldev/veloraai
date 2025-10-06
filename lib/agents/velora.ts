import { StateGraph } from "@langchain/langgraph"
import { AIMessage, HumanMessage, SystemMessage } from "@langchain/core/messages"
import { AgentState, AgentStateType, createLLM } from "./base"
import { createRetrieveTool, createPlanTool, createScheduleAdjustTool } from "./tools"

export function createVeloraAgent(userId: string) {
  const llm = createLLM(0.7)
  
  const tools = [
    createRetrieveTool(userId),
    createPlanTool(userId),
    createScheduleAdjustTool(userId),
  ]
  
  const llmWithTools = llm.bindTools(tools)
  
  async function callModel(state: AgentStateType) {
    const systemPrompt = `You are Velora, the main AI study orchestrator. You help students:
- Plan their study time across all classes
- Prioritize based on due dates and difficulty
- Create daily Study Briefs with focused study blocks
- Coordinate between different subjects
- Adjust schedules when things change

You have access to all the student's classes, materials, and assignments. Use your tools to:
- retrieve: Search for relevant materials across classes
- generate_study_brief: Create prioritized study plans
- adjust_schedule: Modify existing study plans

Be encouraging, practical, and focused on effective study techniques like retrieval practice and spaced repetition.`

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
        name: "Velora",
      }],
    }
  }
  
  const workflow = new StateGraph(AgentState)
    .addNode("agent", callModel)
    .addEdge("__start__", "agent")
    .addEdge("agent", "__end__")
  
  return workflow.compile()
}
