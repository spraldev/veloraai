"use client"

import { motion } from "framer-motion"
import { recentNotes } from "@/lib/seed-data"
import { FileText, ChevronRight } from "lucide-react"

export function RecentNotesCard() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 4, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.3, delay: 0.4 }}
      className="p-5 rounded-2xl bg-[#151517] border border-border shadow-gem"
    >
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-base font-semibold">Recent Notes</h3>
        <button className="text-xs text-[#EB1F3A] hover:text-[#FF4D57] font-medium">View all</button>
      </div>

      <div className="space-y-2">
        {recentNotes.slice(0, 3).map((note) => (
          <button
            key={note.id}
            className="w-full text-left p-2.5 rounded-lg bg-[#0A0A0C]/50 border border-border/50 hover:border-[#EB1F3A]/30 transition-all group"
          >
            <div className="flex items-start gap-2.5">
              <div className="flex-shrink-0 w-7 h-7 rounded-lg bg-[#EB1F3A]/10 flex items-center justify-center">
                <FileText className="w-3.5 h-3.5 text-[#EB1F3A]" />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-medium text-[#F5F7FA] mb-0.5 leading-snug">{note.title}</h4>
                <p className="text-xs text-[#8D93A1] mb-1.5 line-clamp-1">{note.preview}</p>
                <div className="flex items-center gap-1.5 text-xs text-[#8D93A1]">
                  <span>{note.className}</span>
                  <span>•</span>
                  <span>{note.timestamp}</span>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-[#8D93A1] group-hover:text-[#EB1F3A] transition-colors flex-shrink-0" />
            </div>
          </button>
        ))}
      </div>
    </motion.div>
  )
}
