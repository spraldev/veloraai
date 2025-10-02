"use client"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ChatPanel } from "@/components/chat/chat-panel"
import { agents } from "@/lib/agent-data"
import { practiceQueue } from "@/lib/practice-data"
import { Play, Trophy, Flame, Target, Filter, Sparkles } from "lucide-react"
import { motion } from "framer-motion"

export default function PracticePage() {
  const [activeFilter, setActiveFilter] = useState("All")
  const filters = ["All", "AP Biology", "AP Calculus AB", "English Lit", "US History"]

  const velora = agents.find((a) => a.type === "velora")!
  const helpers = agents.filter((a) => a.type === "helper")
  const allAgents = [velora, ...helpers]
  const [activeAgent, setActiveAgent] = useState(velora)

  const quickChips = [
    { label: "Generate mixed set", action: "generate" },
    { label: "Explain answer", action: "explain" },
    { label: "Show similar", action: "similar" },
  ]

  return (
    <div className="flex h-screen">
      {/* Main content area */}
      <div className="flex-1 p-8 overflow-y-auto">
        <div className="max-w-[1280px] mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-3xl font-semibold mb-2 text-balance">Practice Queue</h1>
                <p className="text-[#8D93A1]">Adaptive practice from your recent classes</p>
              </div>
              <Button className="bg-[#EB1F3A] hover:bg-[#FF4D57] text-white font-medium">
                <Sparkles className="w-4 h-4 mr-2" />
                Generate Practice
              </Button>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <motion.div
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-6 rounded-2xl bg-[#151517] border border-border shadow-gem"
            >
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-full bg-[#37E08D]/10 flex items-center justify-center">
                  <Trophy className="w-5 h-5 text-[#37E08D]" />
                </div>
                <div>
                  <p className="text-2xl font-semibold text-[#F5F7FA]">847</p>
                  <p className="text-xs text-[#8D93A1]">Questions Completed</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="p-6 rounded-2xl bg-[#151517] border border-border shadow-gem"
            >
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-full bg-[#EB1F3A]/10 flex items-center justify-center">
                  <Flame className="w-5 h-5 text-[#EB1F3A]" />
                </div>
                <div>
                  <p className="text-2xl font-semibold text-[#F5F7FA]">12</p>
                  <p className="text-xs text-[#8D93A1]">Day Streak</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="p-6 rounded-2xl bg-[#151517] border border-border shadow-gem"
            >
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-full bg-[#FFC857]/10 flex items-center justify-center">
                  <Target className="w-5 h-5 text-[#FFC857]" />
                </div>
                <div>
                  <p className="text-2xl font-semibold text-[#F5F7FA]">87%</p>
                  <p className="text-xs text-[#8D93A1]">Average Accuracy</p>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Filters */}
          <div className="flex items-center gap-2 mb-6">
            <Filter className="w-4 h-4 text-[#8D93A1]" />
            {filters.map((filter) => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                  activeFilter === filter
                    ? "bg-[#EB1F3A] text-white"
                    : "bg-[#121214] text-[#8D93A1] hover:text-[#C9CDD6]"
                }`}
              >
                {filter}
              </button>
            ))}
          </div>

          {/* Practice cards */}
          <div className="space-y-4">
            {practiceQueue.map((practice, index) => (
              <motion.div
                key={practice.id}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="p-6 rounded-2xl bg-[#151517] border border-border shadow-gem hover:border-[#EB1F3A]/30 transition-all"
              >
                <div className="flex items-start justify-between gap-6">
                  <div className="flex-1">
                    {/* Header */}
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: practice.color }} />
                      <h3 className="text-lg font-semibold text-[#F5F7FA]">{practice.title}</h3>
                      {practice.streak > 0 && (
                        <div className="flex items-center gap-1 text-[#EB1F3A]">
                          <Flame className="w-4 h-4" />
                          <span className="text-sm font-semibold">{practice.streak}</span>
                        </div>
                      )}
                    </div>

                    {/* Meta info */}
                    <div className="flex items-center gap-4 text-sm text-[#8D93A1] mb-3">
                      <span>{practice.className}</span>
                      <span>•</span>
                      <span>{practice.questions} questions</span>
                      <span>•</span>
                      <span>{practice.timeEstimate}</span>
                      <span>•</span>
                      <Badge
                        className={`text-xs border-0 ${
                          practice.difficulty === "Easy"
                            ? "bg-[#37E08D]/10 text-[#37E08D]"
                            : practice.difficulty === "Hard"
                              ? "bg-[#EB1F3A]/10 text-[#EB1F3A]"
                              : "bg-[#FFC857]/10 text-[#FFC857]"
                        }`}
                      >
                        {practice.difficulty}
                      </Badge>
                    </div>

                    {/* Concepts */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      {practice.concepts.map((concept) => (
                        <Badge key={concept} className="bg-[#121214] text-[#8D93A1] border-0 text-xs">
                          {concept}
                        </Badge>
                      ))}
                    </div>

                    {/* Progress */}
                    {practice.progress > 0 && (
                      <div>
                        <div className="flex items-center justify-between text-xs text-[#8D93A1] mb-2">
                          <span>Progress</span>
                          <span>{practice.progress}%</span>
                        </div>
                        <div className="h-2 bg-[#26262A] rounded-full overflow-hidden">
                          <motion.div
                            className="h-full rounded-full"
                            style={{ backgroundColor: practice.color }}
                            initial={{ width: 0 }}
                            animate={{ width: `${practice.progress}%` }}
                            transition={{ duration: 0.5, delay: index * 0.1 + 0.3 }}
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Action */}
                  <Button className="bg-[#EB1F3A] hover:bg-[#FF4D57] text-white font-medium flex-shrink-0">
                    <Play className="w-4 h-4 mr-2" />
                    {practice.progress > 0 && practice.progress < 100
                      ? "Continue"
                      : practice.progress === 100
                        ? "Retry"
                        : "Start"}
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Empty state suggestion */}
          {practiceQueue.length === 0 && (
            <div className="text-center py-16">
              <div className="w-16 h-16 rounded-full bg-[#EB1F3A]/10 flex items-center justify-center mx-auto mb-4">
                <Target className="w-8 h-8 text-[#EB1F3A]" />
              </div>
              <h3 className="text-xl font-semibold mb-2">No practice sets yet</h3>
              <p className="text-[#8D93A1] mb-6">Generate a practice set from your recent classes</p>
              <Button className="bg-[#EB1F3A] hover:bg-[#FF4D57] text-white font-medium">
                <Sparkles className="w-4 h-4 mr-2" />
                Generate Practice
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Docked Chat Panel with Helper Switcher */}
      <ChatPanel
        agent={activeAgent}
        quickChips={quickChips}
        className="w-[400px] shrink-0"
        allAgents={allAgents}
        onAgentSwitch={setActiveAgent}
      />
    </div>
  )
}
