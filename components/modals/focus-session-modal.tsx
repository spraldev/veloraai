"use client"
import { useState, useEffect } from "react"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Pause, Play, SkipForward, X } from "lucide-react"
import { motion } from "framer-motion"

interface FocusSessionModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  tasks: Array<{ id: string; title: string; completed: boolean }>
}

export function FocusSessionModal({ open, onOpenChange, tasks: initialTasks }: FocusSessionModalProps) {
  const [isRunning, setIsRunning] = useState(false)
  const [time, setTime] = useState(25 * 60)
  const [isBreak, setIsBreak] = useState(false)
  const [tasks, setTasks] = useState(initialTasks)

  const progress = ((25 * 60 - time) / (25 * 60)) * 100

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null
    if (isRunning && time > 0) {
      interval = setInterval(() => {
        setTime((t) => t - 1)
      }, 1000)
    } else if (time === 0) {
      setIsRunning(false)
      setIsBreak(!isBreak)
      setTime(isBreak ? 25 * 60 : 5 * 60)
    }
    return () => {
      if (interval) clearInterval(interval)
    }
  }, [isRunning, time, isBreak])

  const toggleTask = (id: string) => {
    setTasks(tasks.map((task) => (task.id === id ? { ...task, completed: !task.completed } : task)))
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-[#0A0A0C] border-border max-w-4xl h-[600px] p-0">
        {/* Close button */}
        <button
          onClick={() => onOpenChange(false)}
          className="absolute top-4 right-4 z-50 w-8 h-8 rounded-full bg-[#151517] border border-border flex items-center justify-center hover:bg-[#1A1A1C] transition-colors"
        >
          <X className="w-4 h-4 text-[#8D93A1]" />
        </button>

        <div className="h-full flex flex-col">
          {/* Timer section */}
          <div className="flex-1 flex flex-col items-center justify-center ruby-radial midnight-sheen relative overflow-hidden">
            {/* Animated background particles */}
            {[...Array(5)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-2 h-2 rounded-full bg-[#EB1F3A]/20"
                animate={{
                  x: [Math.random() * 400 - 200, Math.random() * 400 - 200],
                  y: [Math.random() * 400 - 200, Math.random() * 400 - 200],
                  opacity: [0.2, 0.5, 0.2],
                }}
                transition={{
                  duration: 10 + Math.random() * 10,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "linear",
                }}
              />
            ))}

            <div className="relative z-10">
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                <h2 className="text-center text-xl font-semibold mb-2 text-[#8D93A1]">
                  {isBreak ? "Break Time" : "Focus Session"}
                </h2>

                {/* Circular progress */}
                <div className="relative w-64 h-64 mb-8">
                  <svg className="w-64 h-64 -rotate-90">
                    <circle cx="128" cy="128" r="120" stroke="#26262A" strokeWidth="12" fill="none" />
                    <motion.circle
                      cx="128"
                      cy="128"
                      r="120"
                      stroke="#EB1F3A"
                      strokeWidth="12"
                      fill="none"
                      strokeDasharray={`${2 * Math.PI * 120}`}
                      strokeDashoffset={`${2 * Math.PI * 120 * (1 - progress / 100)}`}
                      strokeLinecap="round"
                      style={{
                        filter: "drop-shadow(0 0 12px rgba(235, 31, 58, 0.5))",
                      }}
                      animate={{
                        strokeDashoffset: `${2 * Math.PI * 120 * (1 - progress / 100)}`,
                      }}
                      transition={{ duration: 1 }}
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-6xl font-semibold text-[#F5F7FA] tabular-nums">
                      {Math.floor(time / 60)}:{(time % 60).toString().padStart(2, "0")}
                    </span>
                  </div>
                </div>

                {/* Controls */}
                <div className="flex items-center justify-center gap-4">
                  <Button
                    size="lg"
                    className="bg-[#EB1F3A] hover:bg-[#FF4D57] text-white font-medium px-8"
                    onClick={() => setIsRunning(!isRunning)}
                  >
                    {isRunning ? (
                      <>
                        <Pause className="w-5 h-5 mr-2" />
                        Pause
                      </>
                    ) : (
                      <>
                        <Play className="w-5 h-5 mr-2" />
                        Start
                      </>
                    )}
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-border hover:bg-[#121214] text-[#C9CDD6] bg-transparent"
                    onClick={() => {
                      setIsBreak(!isBreak)
                      setTime(isBreak ? 25 * 60 : 5 * 60)
                      setIsRunning(false)
                    }}
                  >
                    <SkipForward className="w-5 h-5" />
                  </Button>
                </div>
              </motion.div>
            </div>
          </div>

          {/* Task checklist */}
          <div className="p-6 bg-[#151517] border-t border-border">
            <h3 className="text-sm font-semibold mb-3 text-[#8D93A1]">Today's Tasks</h3>
            <div className="space-y-2">
              {tasks.map((task) => (
                <button
                  key={task.id}
                  onClick={() => toggleTask(task.id)}
                  className="w-full flex items-center gap-3 p-3 rounded-lg bg-[#0A0A0C]/50 hover:bg-[#0A0A0C] transition-colors text-left"
                >
                  <div
                    className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${
                      task.completed ? "bg-[#EB1F3A] border-[#EB1F3A]" : "border-border hover:border-[#EB1F3A]/50"
                    }`}
                  >
                    {task.completed && (
                      <motion.svg
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="w-3 h-3 text-white"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </motion.svg>
                    )}
                  </div>
                  <span className={`text-sm ${task.completed ? "text-[#8D93A1] line-through" : "text-[#F5F7FA]"}`}>
                    {task.title}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
