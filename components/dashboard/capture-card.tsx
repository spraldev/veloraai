"use client"

import { motion } from "framer-motion"
import { Mic, Camera, Link2, Upload } from "lucide-react"

const captureOptions = [
  { icon: Mic, label: "Record Audio", color: "#37E08D" },
  { icon: Camera, label: "Scan/Photo", color: "#FFC857" },
  { icon: Link2, label: "Paste Link", color: "#FF4D57" },
  { icon: Upload, label: "Upload File", color: "#EB1F3A" },
]

export function CaptureCard() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 4, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.3, delay: 0.3 }}
      className="p-5 rounded-2xl bg-[#151517] border border-border shadow-gem"
    >
      <h3 className="text-base font-semibold mb-3">Capture</h3>

      <div className="grid grid-cols-4 gap-2">
        {captureOptions.map((option) => {
          const Icon = option.icon
          return (
            <button
              key={option.label}
              className="flex flex-col items-center gap-1.5 p-3 rounded-xl bg-[#0A0A0C]/50 border border-border/50 hover:border-[#EB1F3A]/30 transition-all group"
            >
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center transition-all group-hover:scale-110"
                style={{ backgroundColor: `${option.color}15` }}
              >
                <Icon className="w-4 h-4" style={{ color: option.color }} />
              </div>
              <span className="text-[10px] font-medium text-[#C9CDD6] text-center leading-tight">{option.label}</span>
            </button>
          )
        })}
      </div>
    </motion.div>
  )
}
