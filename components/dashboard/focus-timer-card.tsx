"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Play, RotateCcw } from "lucide-react"
import { FocusSessionModal } from "../modals/focus-session-modal"

const mockTasks = [
  { id: "1", title: "AP Bio - 60m Retrieval Practice", completed: false },
  { id: "2", title: "AP Calc - 45m Mixed Practice", completed: false },
  { id: "3", title: "English - 30m Reading", completed: false },
]

export function FocusTimerCard() {
  const [isRunning, setIsRunning] = useState(false)
  const [time, setTime] = useState(25 * 60)
  const [focusSessionOpen, setFocusSessionOpen] = useState(false)
  const progress = ((25 * 60 - time) / (25 * 60)) * 100

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 4, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.3, delay: 0.5 }}
        className="p-5 rounded-2xl bg-[#151517] border border-border shadow-gem"
      >
        <h3 className="text-base font-semibold mb-4">Focus Timer</h3>

        <div className="flex items-center gap-6">
          {/* Circular progress */}
          <div className="relative w-32 h-32 flex-shrink-0">
            <svg className="w-32 h-32 -rotate-90">
              <circle cx="64" cy="64" r="56" stroke="#26262A" strokeWidth="6" fill="none" />
              <circle
                cx="64"
                cy="64"
                r="56"
                stroke="#EB1F3A"
                strokeWidth="6"
                fill="none"
                strokeDasharray={`${2 * Math.PI * 56}`}
                strokeDashoffset={`${2 * Math.PI * 56 * (1 - progress / 100)}`}
                strokeLinecap="round"
                className="transition-all duration-1000"
                style={{
                  filter: "drop-shadow(0 0 8px rgba(235, 31, 58, 0.4))",
                }}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-2xl font-semibold text-[#F5F7FA]">
                {Math.floor(time / 60)}:{(time % 60).toString().padStart(2, "0")}
              </span>
              <span className="text-[10px] text-[#8D93A1] mt-0.5">Focus Session</span>
            </div>
          </div>

          {/* Controls and info */}
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-3">
              <Button
                size="sm"
                className="bg-[#EB1F3A] hover:bg-[#FF4D57] text-white font-medium h-9"
                onClick={() => setFocusSessionOpen(true)}
              >
                <Play className="w-4 h-4 mr-1.5" />
                Start
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="border-border hover:bg-[#121214] text-[#C9CDD6] bg-transparent h-9"
                onClick={() => {
                  setTime(25 * 60)
                  setIsRunning(false)
                }}
              >
                <RotateCcw className="w-4 h-4" />
              </Button>
            </div>
            <div className="text-xs text-[#8D93A1]">25 min focus / 5 min break</div>
          </div>
        </div>
      </motion.div>

      <FocusSessionModal open={focusSessionOpen} onOpenChange={setFocusSessionOpen} tasks={mockTasks} />
    </>
  )
}
