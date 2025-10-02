"use client"

import { useState } from "react"
import type { Agent } from "@/lib/agent-data"
import { AgentAvatar } from "./agent-avatar"
import { HelperSwitcher } from "./helper-switcher"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { Send, Paperclip } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"

interface Message {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: Date
}

interface ChatPanelProps {
  agent: Agent
  quickChips?: { label: string; action: string }[]
  className?: string
  allAgents?: Agent[]
  onAgentSwitch?: (agent: Agent) => void
}

export function ChatPanel({ agent, quickChips = [], className, allAgents, onAgentSwitch }: ChatPanelProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [isMinimized, setIsMinimized] = useState(false)

  const handleSend = () => {
    if (!input.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
      timestamp: new Date(),
    }

    setMessages([...messages, userMessage])
    setInput("")

    // Simulate assistant response
    setTimeout(() => {
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: `I'm ${agent.name}, and I'm here to help! This is a simulated response.`,
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, assistantMessage])
    }, 1000)
  }

  const handleQuickChip = (chip: { label: string; action: string }) => {
    setInput(chip.label)
  }

  return (
    <div className={cn("flex flex-col border-l border-border bg-[#0A0A0C]", className)}>
      {/* Header */}
      <div className="p-4 border-b border-border">
        {allAgents && onAgentSwitch ? (
          <HelperSwitcher agents={allAgents} activeAgent={agent} onSwitch={onAgentSwitch} />
        ) : (
          <div className="flex items-center gap-3">
            <AgentAvatar agent={agent} size="md" showStatus />
            <div className="flex-1">
              <h3 className="text-sm font-semibold text-text-hi">{agent.name}</h3>
              <p className="text-xs text-text-dim">{agent.className || "Main Assistant"}</p>
            </div>
          </div>
        )}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 && (
          <div className="text-center py-8">
            <AgentAvatar agent={agent} size="lg" showStatus className="mx-auto mb-4" />
            <h4 className="text-sm font-semibold text-text-hi mb-2">Chat with {agent.name}</h4>
            <p className="text-xs text-text-dim mb-4">{agent.description}</p>

            {quickChips.length > 0 && (
              <div className="space-y-2">
                {quickChips.map((chip, i) => (
                  <button
                    key={i}
                    onClick={() => handleQuickChip(chip)}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#151517] border border-border text-sm text-text-med hover:border-accent/50 hover:text-text-hi transition-all text-left"
                  >
                    {chip.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        <AnimatePresence>
          {messages.map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className={`flex gap-3 ${message.role === "user" ? "flex-row-reverse" : ""}`}
            >
              {message.role === "assistant" && <AgentAvatar agent={agent} size="sm" />}
              <div
                className={`flex-1 px-4 py-3 rounded-xl text-sm ${
                  message.role === "user" ? "bg-accent text-white" : "bg-[#151517] border border-border text-text-med"
                }`}
              >
                {message.content}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Input */}
      <div className="p-4 border-t border-border">
        <div className="flex items-end gap-2">
          <div className="flex-1 relative">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              placeholder={`Ask ${agent.name}...`}
              className="pr-10 bg-[#151517] border-border text-text-hi placeholder:text-text-dim"
            />
            <button className="absolute right-3 top-1/2 -translate-y-1/2 text-text-dim hover:text-text-med transition-colors">
              <Paperclip className="w-4 h-4" />
            </button>
          </div>
          <Button
            onClick={handleSend}
            disabled={!input.trim()}
            className="bg-accent hover:bg-accent/90 text-white disabled:opacity-50"
            size="icon"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
