"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Clock, Sparkles, Calendar, Zap } from "lucide-react"
import { studyBrief } from "@/lib/seed-data"

export function StudyBriefCard() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 4, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.3 }}
      className="relative p-5 rounded-2xl bg-[#151517] border border-border shadow-gem overflow-hidden group"
    >
      {/* Ruby gradient overlay */}
      <div className="absolute inset-0 ruby-radial opacity-50" />
      <div className="absolute inset-0 midnight-sheen" />

      {/* Sparkle indicator */}
      <motion.div
        className="absolute top-3 right-3"
        animate={{
          opacity: [0.5, 1, 0.5],
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 2,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
        }}
      >
        <Sparkles className="w-4 h-4 text-[#EB1F3A]" />
      </motion.div>

      <div className="relative z-10">
        <div className="mb-4">
          <h2 className="text-xl font-semibold mb-1.5 text-balance">Today's Study Brief</h2>
          <p className="text-xs text-[#C9CDD6] leading-relaxed">{studyBrief.summary}</p>
        </div>

        <div className="space-y-2 mb-4">
          {studyBrief.blocks.map((block, index) => (
            <div key={block.id} className="p-3 rounded-lg bg-[#0A0A0C]/50 border border-border/50">
              <div className="flex items-start gap-3 mb-2">
                <div className="flex-shrink-0 w-7 h-7 rounded-full bg-[#EB1F3A]/10 flex items-center justify-center text-[#EB1F3A] text-xs font-semibold">
                  {index + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <span className="text-sm font-medium text-[#F5F7FA]">{block.subject}</span>
                    <span
                      className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                        block.method === "Retrieval"
                          ? "bg-[#37E08D]/10 text-[#37E08D]"
                          : block.method === "Mixed Practice"
                            ? "bg-[#FFC857]/10 text-[#FFC857]"
                            : "bg-[#8D93A1]/10 text-[#8D93A1]"
                      }`}
                    >
                      {block.method}
                    </span>
                  </div>
                  <p className="text-xs text-[#8D93A1] mb-1.5">{block.topic}</p>
                  <div className="flex items-center gap-1.5 text-[#C9CDD6]">
                    <Clock className="w-3.5 h-3.5" />
                    <span className="text-xs font-medium">{block.duration}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="space-y-2 mb-3">
          <Button className="w-full bg-[#EB1F3A] hover:bg-[#FF4D57] text-white font-medium text-sm h-9">
            <Zap className="w-4 h-4 mr-2" />
            Start Plan
          </Button>
          <div className="flex gap-2">
            <Button
              variant="outline"
              className="flex-1 border-border hover:bg-[#121214] text-[#C9CDD6] bg-transparent text-xs h-9"
            >
              <Sparkles className="w-3.5 h-3.5 mr-1.5" />
              Generate Practice
            </Button>
            <Button
              variant="ghost"
              className="flex-1 text-[#8D93A1] hover:text-[#C9CDD6] hover:bg-[#121214] text-xs h-9"
            >
              <Calendar className="w-3.5 h-3.5 mr-1.5" />
              Reschedule
            </Button>
          </div>
        </div>

        {/* Total time */}
        <div className="pt-3 border-t border-border/50 flex items-center justify-between">
          <span className="text-xs text-[#8D93A1]">Total estimated time</span>
          <span className="text-sm font-semibold text-[#F5F7FA]">{studyBrief.totalTime}</span>
        </div>
      </div>
    </motion.div>
  )
}
