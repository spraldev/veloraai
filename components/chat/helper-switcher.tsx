"use client"

import { useState } from "react"
import type { Agent } from "@/lib/agent-data"
import { AgentAvatar } from "./agent-avatar"
import { Button } from "../ui/button"
import { Check, ChevronDown } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

interface HelperSwitcherProps {
  agents: Agent[]
  activeAgent: Agent
  onSwitch: (agent: Agent) => void
}

export function HelperSwitcher({ agents, activeAgent, onSwitch }: HelperSwitcherProps) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="relative">
      <Button
        variant="ghost"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full justify-between px-3 py-2 h-auto hover:bg-[#121214]"
      >
        <div className="flex items-center gap-3">
          <AgentAvatar agent={activeAgent} size="sm" showStatus />
          <div className="text-left">
            <p className="text-sm font-medium text-text-hi">{activeAgent.name}</p>
            <p className="text-xs text-text-dim">{activeAgent.className || "Main Assistant"}</p>
          </div>
        </div>
        <ChevronDown className={`w-4 h-4 text-text-dim transition-transform ${isOpen ? "rotate-180" : ""}`} />
      </Button>

      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />

            {/* Dropdown */}
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.15 }}
              className="absolute top-full left-0 right-0 mt-2 p-2 rounded-xl bg-[#151517] border border-border shadow-gem z-50"
            >
              <div className="space-y-1">
                {agents.map((agent) => {
                  const isActive = agent.id === activeAgent.id

                  return (
                    <button
                      key={agent.id}
                      onClick={() => {
                        onSwitch(agent)
                        setIsOpen(false)
                      }}
                      className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-[#121214] transition-colors group"
                    >
                      <AgentAvatar agent={agent} size="sm" showStatus />
                      <div className="flex-1 text-left min-w-0">
                        <p className="text-sm font-medium text-text-med group-hover:text-text-hi truncate">
                          {agent.name}
                        </p>
                        <p className="text-xs text-text-dim truncate">{agent.className || "Main Assistant"}</p>
                      </div>
                      {isActive && <Check className="w-4 h-4 text-accent flex-shrink-0" />}
                    </button>
                  )
                })}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}
