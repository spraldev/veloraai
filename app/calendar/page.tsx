"use client"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ChatPanel } from "@/components/chat/chat-panel"
import { agents } from "@/lib/agent-data"
import { calendarEvents } from "@/lib/calendar-data"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { motion } from "framer-motion"

const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
const monthNames = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
]

export default function CalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date(2025, 9, 1)) // October 2025
  const [view, setView] = useState<"month" | "week">("month")

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    const firstDay = new Date(year, month, 1).getDay()
    const daysInMonth = new Date(year, month + 1, 0).getDate()
    const days = []

    // Add empty cells for days before month starts
    for (let i = 0; i < firstDay; i++) {
      days.push(null)
    }

    // Add days of month
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(i)
    }

    return days
  }

  const getEventsForDay = (day: number | null) => {
    if (!day) return []
    const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`
    return calendarEvents.filter((event) => event.date === dateStr)
  }

  const days = getDaysInMonth(currentDate)
  const today = new Date()
  const isToday = (day: number | null) => {
    if (!day) return false
    return (
      day === today.getDate() &&
      currentDate.getMonth() === today.getMonth() &&
      currentDate.getFullYear() === today.getFullYear()
    )
  }

  const previousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1))
  }

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1))
  }

  const velora = agents.find((a) => a.type === "velora")!

  const quickChips = [
    { label: "Add deadline", action: "add-deadline" },
    { label: "Reschedule event", action: "reschedule" },
    { label: "View conflicts", action: "conflicts" },
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
                <h1 className="text-3xl font-semibold mb-2 text-balance">Calendar</h1>
                <p className="text-[#8D93A1]">View your assignments and deadlines</p>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant={view === "month" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setView("month")}
                  className={
                    view === "month"
                      ? "bg-[#EB1F3A] hover:bg-[#FF4D57] text-white"
                      : "border-border bg-transparent text-[#8D93A1]"
                  }
                >
                  Month
                </Button>
                <Button
                  variant={view === "week" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setView("week")}
                  className={
                    view === "week"
                      ? "bg-[#EB1F3A] hover:bg-[#FF4D57] text-white"
                      : "border-border bg-transparent text-[#8D93A1]"
                  }
                >
                  Week
                </Button>
              </div>
            </div>
          </div>

          {/* Calendar controls */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold">
              {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
            </h2>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={previousMonth}
                className="border-border bg-transparent text-[#C9CDD6]"
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentDate(new Date())}
                className="border-border bg-transparent text-[#C9CDD6]"
              >
                Today
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={nextMonth}
                className="border-border bg-transparent text-[#C9CDD6]"
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Calendar grid */}
          <div className="rounded-2xl bg-[#151517] border border-border shadow-gem overflow-hidden">
            {/* Day headers */}
            <div className="grid grid-cols-7 border-b border-border">
              {daysOfWeek.map((day) => (
                <div key={day} className="p-4 text-center text-sm font-semibold text-[#8D93A1]">
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar days */}
            <div className="grid grid-cols-7">
              {days.map((day, index) => {
                const events = getEventsForDay(day)
                const isTodayCell = isToday(day)

                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: index * 0.01 }}
                    className={`min-h-[120px] p-3 border-r border-b border-border relative ${
                      !day ? "bg-[#0A0A0C]/30" : "hover:bg-[#121214] transition-colors"
                    } ${isTodayCell ? "bg-[#EB1F3A]/5" : ""}`}
                  >
                    {day && (
                      <>
                        <div
                          className={`text-sm font-medium mb-2 ${
                            isTodayCell
                              ? "w-7 h-7 rounded-full bg-[#EB1F3A] text-white flex items-center justify-center"
                              : "text-[#F5F7FA]"
                          }`}
                        >
                          {day}
                        </div>
                        <div className="space-y-1">
                          {events.slice(0, 3).map((event) => (
                            <div
                              key={event.id}
                              className="text-xs p-1.5 rounded truncate cursor-pointer hover:opacity-80 transition-opacity"
                              style={{ backgroundColor: `${event.color}15`, color: event.color }}
                            >
                              {event.title}
                            </div>
                          ))}
                          {events.length > 3 && (
                            <div className="text-xs text-[#8D93A1] pl-1.5">+{events.length - 3} more</div>
                          )}
                        </div>
                      </>
                    )}
                  </motion.div>
                )
              })}
            </div>
          </div>

          {/* Upcoming events list */}
          <div className="mt-8">
            <h3 className="text-xl font-semibold mb-4">Upcoming Events</h3>
            <div className="space-y-3">
              {calendarEvents.slice(0, 5).map((event, index) => (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, x: -4 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="p-4 rounded-xl bg-[#151517] border border-border shadow-gem hover:border-[#EB1F3A]/30 transition-all"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-1 h-12 rounded-full" style={{ backgroundColor: event.color }} />
                    <div className="flex-1">
                      <h4 className="text-sm font-semibold text-[#F5F7FA] mb-1">{event.title}</h4>
                      <div className="flex items-center gap-2 text-xs text-[#8D93A1]">
                        <span>{event.className}</span>
                        <span>•</span>
                        <span>
                          {new Date(event.date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                        </span>
                      </div>
                    </div>
                    <Badge
                      className="border-0 capitalize"
                      style={{ backgroundColor: `${event.color}15`, color: event.color }}
                    >
                      {event.type}
                    </Badge>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Docked Chat Panel */}
      <ChatPanel agent={velora} quickChips={quickChips} className="w-[400px] shrink-0" />
    </div>
  )
}
