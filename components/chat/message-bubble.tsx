"use client"

import { motion } from "framer-motion"
import { type Message, agents } from "@/lib/agent-data"
import { AgentAvatar } from "./agent-avatar"
import { Button } from "@/components/ui/button"
import { FileText, LinkIcon, Mic, ImageIcon } from "lucide-react"

interface MessageBubbleProps {
  message: Message
}

export function MessageBubble({ message }: MessageBubbleProps) {
  const agent = agents.find((a) => a.id === message.agentId)
  const isUser = message.role === "user"

  const sourceIcons = {
    audio: Mic,
    link: LinkIcon,
    photo: ImageIcon,
    file: FileText,
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 8, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.25 }}
      className={`flex gap-3 ${isUser ? "flex-row-reverse" : "flex-row"}`}
    >
      {!isUser && agent && <AgentAvatar agent={agent} size="sm" />}

      <div className={`flex flex-col gap-2 max-w-[80%] ${isUser ? "items-end" : "items-start"}`}>
        <div
          className={`px-4 py-3 rounded-2xl border ${
            isUser ? "bg-accent/10 border-accent/30 text-text-hi" : "bg-card border-border text-text-med shadow-gem"
          }`}
          style={
            !isUser
              ? {
                  boxShadow: "0 0 0 1px rgba(235,31,58,0.05), 0 4px 12px rgba(0,0,0,0.3)",
                }
              : undefined
          }
        >
          <p className="text-sm leading-relaxed">{message.content}</p>
        </div>

        {/* Sources */}
        {message.sources && message.sources.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {message.sources.map((source, i) => {
              const Icon = sourceIcons[source.type as keyof typeof sourceIcons] || FileText
              return (
                <button
                  key={i}
                  className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-card border border-border text-xs text-text-dim hover:text-text-med hover:border-accent/30 transition-colors"
                >
                  <Icon className="w-3 h-3" />
                  <span>{source.title}</span>
                </button>
              )
            })}
          </div>
        )}

        {/* Action buttons */}
        {message.actions && message.actions.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {message.actions.map((action, i) => (
              <Button
                key={i}
                variant="outline"
                size="sm"
                className="h-8 text-xs border-accent/30 hover:bg-accent/10 hover:border-accent bg-transparent"
              >
                {action.label}
              </Button>
            ))}
          </div>
        )}

        <span className="text-xs text-text-dim px-1">
          {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
        </span>
      </div>
    </motion.div>
  )
}
