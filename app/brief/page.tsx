"use client"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ChatPanel } from "@/components/chat/chat-panel"
import { agents } from "@/lib/agent-data"
import { Play, Clock, GripVertical, Plus, Minus, Sparkles } from "lucide-react"
import { motion } from "framer-motion"

const todayBlocks = [
  {
    id: "1",
    subject: "AP Biology",
    duration: 60,
    method: "Retrieval",
    topic: "Cellular Respiration",
    color: "#37E08D",
  },
  {
    id: "2",
    subject: "AP Calculus AB",
    duration: 45,
    method: "Mixed Practice",
    topic: "Derivatives",
    color: "#FFC857",
  },
  {
    id: "3",
    subject: "English Lit",
    duration: 30,
    method: "Reading",
    topic: "Chapter 12",
    color: "#FF4D57",
  },
]

const tomorrowBlocks = [
  {
    id: "4",
    subject: "US History",
    duration: 40,
    method: "Review",
    topic: "Civil War Era",
    color: "#EB1F3A",
  },
  {
    id: "5",
    subject: "AP Biology",
    duration: 30,
    method: "Worked Examples",
    topic: "Lab Report Prep",
    color: "#37E08D",
  },
]

export default function BriefPage() {
  const [intensity, setIntensity] = useState(50)
  const totalToday = todayBlocks.reduce((sum, block) => sum + block.duration, 0)
  const totalTomorrow = tomorrowBlocks.reduce((sum, block) => sum + block.duration, 0)

  const velora = agents.find((a) => a.type === "velora")!

  const quickChips = [
    { label: "Adjust intensity", action: "adjust" },
    { label: "Reschedule block", action: "reschedule" },
    { label: "Add study block", action: "add-block" },
  ]

  return (
    <div className="flex h-screen">
      {/* Main content area */}
      <div className="flex-1 p-8 overflow-y-auto">
        <div className="max-w-[1280px] mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-semibold mb-2 text-balance">Study Brief</h1>
            <p className="text-[#8D93A1]">Your personalized daily study plan</p>
          </div>

          {/* Intensity slider */}
          <div className="mb-8 p-6 rounded-2xl bg-[#151517] border border-border shadow-gem">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold mb-1">Plan Intensity</h3>
                <p className="text-sm text-[#8D93A1]">Adjust study duration to fit your schedule</p>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  className="border-border bg-transparent text-[#C9CDD6]"
                  onClick={() => setIntensity(Math.max(0, intensity - 10))}
                >
                  <Minus className="w-4 h-4" />
                </Button>
                <span className="text-lg font-semibold w-16 text-center">{intensity}%</span>
                <Button
                  size="sm"
                  variant="outline"
                  className="border-border bg-transparent text-[#C9CDD6]"
                  onClick={() => setIntensity(Math.min(100, intensity + 10))}
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            </div>
            <div className="relative h-2 bg-[#26262A] rounded-full overflow-hidden">
              <motion.div
                className="absolute left-0 top-0 h-full bg-gradient-to-r from-[#37E08D] via-[#FFC857] to-[#EB1F3A] rounded-full"
                initial={{ width: "50%" }}
                animate={{ width: `${intensity}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
          </div>

          {/* Two column layout */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Today */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-semibold mb-1">Today</h2>
                  <p className="text-sm text-[#8D93A1]">
                    {todayBlocks.length} blocks • {Math.floor(totalToday / 60)}h {totalToday % 60}m total
                  </p>
                </div>
                <Button className="bg-[#EB1F3A] hover:bg-[#FF4D57] text-white font-medium">
                  <Play className="w-4 h-4 mr-2" />
                  Start Plan
                </Button>
              </div>

              <div className="space-y-3">
                {todayBlocks.map((block, index) => (
                  <motion.div
                    key={block.id}
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="group p-4 rounded-xl bg-[#151517] border border-border shadow-gem hover:border-[#EB1F3A]/30 transition-all cursor-move"
                  >
                    <div className="flex items-start gap-3">
                      <GripVertical className="w-5 h-5 text-[#8D93A1] flex-shrink-0 mt-1 opacity-0 group-hover:opacity-100 transition-opacity" />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: block.color }} />
                          <h4 className="text-sm font-semibold text-[#F5F7FA]">{block.subject}</h4>
                          <Badge
                            className="text-xs border-0"
                            style={{ backgroundColor: `${block.color}15`, color: block.color }}
                          >
                            {block.method}
                          </Badge>
                        </div>
                        <p className="text-sm text-[#C9CDD6] mb-2">{block.topic}</p>
                        <div className="flex items-center gap-2 text-xs text-[#8D93A1]">
                          <Clock className="w-3 h-3" />
                          <span>{block.duration} minutes</span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              <Button variant="outline" className="w-full border-border bg-transparent text-[#C9CDD6]">
                <Plus className="w-4 h-4 mr-2" />
                Add Block
              </Button>
            </div>

            {/* Tomorrow */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-semibold mb-1">Tomorrow</h2>
                  <p className="text-sm text-[#8D93A1]">
                    {tomorrowBlocks.length} blocks • {Math.floor(totalTomorrow / 60)}h {totalTomorrow % 60}m total
                  </p>
                </div>
                <Badge className="bg-[#8D93A1]/10 text-[#8D93A1] border-0">Preview</Badge>
              </div>

              <div className="space-y-3 opacity-60">
                {tomorrowBlocks.map((block, index) => (
                  <motion.div
                    key={block.id}
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 + 0.3 }}
                    className="p-4 rounded-xl bg-[#151517] border border-border shadow-gem"
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: block.color }} />
                          <h4 className="text-sm font-semibold text-[#F5F7FA]">{block.subject}</h4>
                          <Badge
                            className="text-xs border-0"
                            style={{ backgroundColor: `${block.color}15`, color: block.color }}
                          >
                            {block.method}
                          </Badge>
                        </div>
                        <p className="text-sm text-[#C9CDD6] mb-2">{block.topic}</p>
                        <div className="flex items-center gap-2 text-xs text-[#8D93A1]">
                          <Clock className="w-3 h-3" />
                          <span>{block.duration} minutes</span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              <Button variant="outline" className="w-full border-border bg-transparent text-[#8D93A1]" disabled>
                <Sparkles className="w-4 h-4 mr-2" />
                Editable after 6pm
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Docked Chat Panel */}
      <ChatPanel agent={velora} quickChips={quickChips} className="w-[400px] shrink-0" />
    </div>
  )
}
