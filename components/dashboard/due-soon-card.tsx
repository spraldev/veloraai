"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Badge } from "@/components/ui/badge"
import { upcomingAssignments } from "@/lib/seed-data"
import { AlertCircle } from "lucide-react"

const filters = ["All", "Quizzes", "Assignments"]

export function DueSoonCard() {
  const [activeFilter, setActiveFilter] = useState("All")

  return (
    <motion.div
      initial={{ opacity: 0, y: 4, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.3, delay: 0.1 }}
      className="p-5 rounded-2xl bg-[#151517] border border-border shadow-gem"
    >
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-base font-semibold">Due Soon</h3>
        <span className="text-xs text-[#8D93A1]">Next 7 days</span>
      </div>

      {/* Filters */}
      <div className="flex gap-2 mb-3">
        {filters.map((filter) => (
          <button
            key={filter}
            onClick={() => setActiveFilter(filter)}
            className={`px-2.5 py-1 rounded-full text-xs font-medium transition-all ${
              activeFilter === filter ? "bg-[#EB1F3A] text-white" : "bg-[#121214] text-[#8D93A1] hover:text-[#C9CDD6]"
            }`}
          >
            {filter}
          </button>
        ))}
      </div>

      <div className="space-y-2">
        {upcomingAssignments.slice(0, 4).map((assignment) => (
          <div
            key={assignment.id}
            className={`p-2.5 rounded-lg border transition-all hover:border-[#EB1F3A]/30 ${
              assignment.isOverdue ? "bg-[#A5082B]/5 border-[#A5082B]/20" : "bg-[#0A0A0C]/50 border-border/50"
            }`}
          >
            <div className="flex items-start justify-between gap-2 mb-1.5">
              <h4 className="text-sm font-medium text-[#F5F7FA] leading-snug flex-1">{assignment.title}</h4>
              {assignment.isOverdue && <AlertCircle className="w-3.5 h-3.5 text-[#FF4D57] flex-shrink-0" />}
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <Badge variant="secondary" className="text-xs bg-[#121214] text-[#8D93A1] border-0 h-5">
                {assignment.className}
              </Badge>
              <span className="text-xs text-[#8D93A1]">{assignment.dueDate}</span>
              <Badge
                variant="outline"
                className={`text-xs border-0 h-5 ${
                  assignment.weight === "High"
                    ? "bg-[#EB1F3A]/10 text-[#EB1F3A]"
                    : assignment.weight === "Med"
                      ? "bg-[#FFC857]/10 text-[#FFC857]"
                      : "bg-[#8D93A1]/10 text-[#8D93A1]"
                }`}
              >
                {assignment.weight}
              </Badge>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  )
}
