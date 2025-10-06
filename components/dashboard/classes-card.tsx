"use client"

import { motion } from "framer-motion"
import { Plus } from "lucide-react"
import Link from "next/link"

interface ClassesCardProps {
  classes?: Array<{
    id: string
    name: string
    color: string
    progress?: number
    teacher?: string
  }>
}

export function ClassesCard({ classes = [] }: ClassesCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 4, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.3, delay: 0.2 }}
      className="p-5 rounded-2xl bg-[#151517] border border-border shadow-gem"
    >
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-base font-semibold">Classes</h3>
        <span className="text-xs text-[#8D93A1]">Today's progress</span>
      </div>

      <div className="grid grid-cols-3 gap-2.5">
        {classes.map((classItem) => (
          <Link
            key={classItem.id}
            href={`/classes/${classItem.id}`}
            className="group relative p-3 rounded-xl bg-[#0A0A0C]/50 border border-border/50 hover:border-[#EB1F3A]/30 transition-all"
          >
            {/* Progress ring */}
            <div className="relative w-10 h-10 mb-2 mx-auto">
              <svg className="w-10 h-10 -rotate-90">
                <circle cx="20" cy="20" r="16" stroke="#26262A" strokeWidth="3" fill="none" />
                <circle
                  cx="20"
                  cy="20"
                  r="16"
                  stroke={classItem.color}
                  strokeWidth="3"
                  fill="none"
                  strokeDasharray={`${2 * Math.PI * 16}`}
                  strokeDashoffset={`${2 * Math.PI * 16 * (1 - classItem.progress / 100)}`}
                  strokeLinecap="round"
                  className="transition-all duration-500"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-[10px] font-semibold" style={{ color: classItem.color }}>
                  {classItem.progress}%
                </span>
              </div>
            </div>

            <h4 className="text-xs font-medium text-[#F5F7FA] mb-0.5 leading-snug text-center">{classItem.name}</h4>
            <p className="text-[10px] text-[#8D93A1] text-center truncate">{classItem.teacher}</p>

            {/* Quick add button */}
            <button className="absolute top-1.5 right-1.5 w-5 h-5 rounded-full bg-[#121214] border border-border flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <Plus className="w-3 h-3 text-[#EB1F3A]" />
            </button>
          </Link>
        ))}
      </div>
    </motion.div>
  )
}
