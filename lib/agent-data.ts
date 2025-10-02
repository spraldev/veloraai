export interface Agent {
  id: string
  name: string
  type: "velora" | "helper"
  classId?: string
  className?: string
  classColor?: string
  status: "idle" | "thinking" | "new-reply"
  avatar: string
  description: string
}

export interface Message {
  id: string
  agentId: string
  role: "user" | "assistant"
  content: string
  timestamp: Date
  sources?: { type: string; title: string; date: string }[]
  actions?: { label: string; action: string }[]
}

export interface Thread {
  id: string
  title: string
  agentId: string
  messages: Message[]
  pinned: boolean
  lastActivity: Date
}

export const agents: Agent[] = [
  {
    id: "velora",
    name: "Velora",
    type: "velora",
    status: "idle",
    avatar: "ruby",
    description: "Your main study assistant. Knows your schedule and priorities across all classes.",
  },
  {
    id: "bio-helper",
    name: "Biology Helper",
    type: "helper",
    classId: "ap-bio",
    className: "AP Biology",
    classColor: "#37E08D",
    status: "idle",
    avatar: "facet-green",
    description: "Specialized in AP Biology. Helps with notes, practice, and explanations.",
  },
  {
    id: "calc-helper",
    name: "Calculus Helper",
    type: "helper",
    classId: "ap-calc",
    className: "AP Calculus AB",
    classColor: "#5B9FFF",
    status: "idle",
    avatar: "facet-blue",
    description: "Specialized in AP Calculus. Helps with problem-solving and practice.",
  },
  {
    id: "lit-helper",
    name: "Literature Helper",
    type: "helper",
    classId: "eng-lit",
    className: "English Literature",
    classColor: "#FFC857",
    status: "idle",
    avatar: "facet-yellow",
    description: "Specialized in English Literature. Helps with analysis and writing.",
  },
]

export const sampleMessages: Message[] = [
  {
    id: "1",
    agentId: "velora",
    role: "assistant",
    content:
      "Hi! I'm Velora, your study assistant. I can help you plan your day, generate practice sets, and coordinate with your class Helpers. What would you like to work on?",
    timestamp: new Date(Date.now() - 3600000),
    actions: [
      { label: "Plan Today", action: "plan-today" },
      { label: "Generate Practice", action: "generate-practice" },
      { label: "Reschedule", action: "reschedule" },
    ],
  },
]
