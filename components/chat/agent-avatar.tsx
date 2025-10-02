"use client"

import { motion } from "framer-motion"
import type { Agent } from "@/lib/agent-data"

interface AgentAvatarProps {
  agent: Agent
  size?: "sm" | "md" | "lg"
  showStatus?: boolean
}

export function AgentAvatar({ agent, size = "md", showStatus = false }: AgentAvatarProps) {
  const sizeClasses = {
    sm: "w-6 h-6",
    md: "w-10 h-10",
    lg: "w-16 h-16",
  }

  const statusColors = {
    idle: "bg-neutral-600",
    thinking: "bg-accent animate-pulse",
    "new-reply": "bg-accent",
  }

  return (
    <div className="relative">
      <motion.div
        className={`${sizeClasses[size]} rounded-full flex items-center justify-center relative overflow-hidden`}
        whileHover={{ scale: 1.05 }}
      >
        {agent.type === "velora" ? (
          // Velora ruby avatar
          <div className="w-full h-full bg-gradient-to-br from-accent-deep via-accent to-accent-2 relative">
            <motion.div
              className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent"
              animate={{
                opacity: [0.3, 0.6, 0.3],
              }}
              transition={{
                duration: 3,
                repeat: Number.POSITIVE_INFINITY,
                ease: "easeInOut",
              }}
            />
            {/* Sparkle particles */}
            {[...Array(3)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 bg-white rounded-full"
                style={{
                  left: `${20 + i * 30}%`,
                  top: `${30 + i * 20}%`,
                }}
                animate={{
                  opacity: [0, 1, 0],
                  scale: [0.5, 1, 0.5],
                }}
                transition={{
                  duration: 2,
                  repeat: Number.POSITIVE_INFINITY,
                  delay: i * 0.7,
                }}
              />
            ))}
          </div>
        ) : (
          // Class Helper facet avatar
          <div
            className="w-full h-full relative"
            style={{
              background: `linear-gradient(135deg, ${agent.classColor}40, ${agent.classColor}20)`,
              border: `1.5px solid ${agent.classColor}80`,
            }}
          >
            <div
              className="absolute inset-0 opacity-30"
              style={{
                background: `linear-gradient(45deg, transparent 30%, ${agent.classColor}60 50%, transparent 70%)`,
              }}
            />
          </div>
        )}
      </motion.div>

      {showStatus && (
        <div
          className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-bg-primary ${statusColors[agent.status]}`}
        />
      )}
    </div>
  )
}
