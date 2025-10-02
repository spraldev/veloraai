"use client"
import { classes } from "@/lib/seed-data"
import Link from "next/link"
import { Plus, TrendingUp } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function ClassesPage() {
  return (
    <div className="p-8">
      <div className="max-w-[1280px] mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-semibold mb-2 text-balance">All Classes</h1>
            <p className="text-[#8D93A1]">Manage your courses and study materials</p>
          </div>
          <Button className="bg-[#EB1F3A] hover:bg-[#FF4D57] text-white font-medium">
            <Plus className="w-4 h-4 mr-2" />
            Add Class
          </Button>
        </div>

        {/* Classes grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {classes.map((classItem, index) => (
            <Link
              key={classItem.id}
              href={`/classes/${classItem.id}`}
              className="group p-6 rounded-2xl bg-[#151517] border border-border shadow-gem hover:border-[#EB1F3A]/30 transition-all"
            >
              {/* Progress ring */}
              <div className="flex items-start justify-between mb-4">
                <div className="relative w-16 h-16">
                  <svg className="w-16 h-16 -rotate-90">
                    <circle cx="32" cy="32" r="28" stroke="#26262A" strokeWidth="4" fill="none" />
                    <circle
                      cx="32"
                      cy="32"
                      r="28"
                      stroke={classItem.color}
                      strokeWidth="4"
                      fill="none"
                      strokeDasharray={`${2 * Math.PI * 28}`}
                      strokeDashoffset={`${2 * Math.PI * 28 * (1 - classItem.progress / 100)}`}
                      strokeLinecap="round"
                      className="transition-all duration-500"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-sm font-semibold" style={{ color: classItem.color }}>
                      {classItem.progress}%
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-1 text-[#37E08D] text-xs">
                  <TrendingUp className="w-3 h-3" />
                  <span>+12%</span>
                </div>
              </div>

              <h3 className="text-xl font-semibold mb-1 text-[#F5F7FA]">{classItem.name}</h3>
              <p className="text-sm text-[#8D93A1] mb-4">{classItem.teacher}</p>

              <div className="flex items-center gap-4 text-xs text-[#8D93A1]">
                <div>
                  <span className="text-[#F5F7FA] font-medium">24</span> materials
                </div>
                <div>
                  <span className="text-[#F5F7FA] font-medium">12</span> notes
                </div>
                <div>
                  <span className="text-[#F5F7FA] font-medium">8</span> quizzes
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
