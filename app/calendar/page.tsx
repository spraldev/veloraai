import { redirect } from "next/navigation"
import { ChevronLeft, ChevronRight, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export default async function CalendarPage() {
  const session = await auth()

  if (!session?.user?.email) {
    redirect("/login")
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  })

  if (!user) {
    redirect("/login")
  }

  const now = new Date()
  const currentMonth = now.toLocaleDateString("en-US", { month: "long", year: "numeric" })
  
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
  const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0)
  
  const assignments = await prisma.assignment.findMany({
    where: {
      class: { userId: user.id },
      dueDate: {
        gte: startOfMonth,
        lte: endOfMonth,
      },
    },
    include: { class: true },
    orderBy: { dueDate: "asc" },
  })

  const daysInMonth = endOfMonth.getDate()
  const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
  
  const events = assignments.map((a) => ({
    id: a.id,
    date: a.dueDate.getDate(),
    title: a.title,
    type: a.type.toLowerCase() as "quiz" | "assignment" | "exam",
    class: a.class.name,
    fullDate: a.dueDate,
  }))

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-[1200px] mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-semibold mb-2">Calendar</h1>
            <p className="text-[#8D93A1]">View and manage your schedule</p>
          </div>
          <Button className="bg-[#EB1F3A] hover:bg-[#FF4D57] text-white font-medium">
            <Plus className="w-4 h-4 mr-2" />
            Add Event
          </Button>
        </div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold">{currentMonth}</h2>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" className="border-border bg-transparent">
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <Button variant="outline" size="icon" className="border-border bg-transparent">
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <div className="rounded-2xl bg-[#151517] border border-border shadow-gem overflow-hidden">
          <div className="grid grid-cols-7 border-b border-border">
            {weekDays.map((day) => (
              <div key={day} className="p-4 text-center text-sm font-medium text-[#8D93A1]">
                {day}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7">
            {Array.from({ length: daysInMonth }, (_, i) => i + 1).map((day) => {
              const dayEvents = events.filter((e) => e.date === day)
              const isToday = day === now.getDate()

              return (
                <div
                  key={day}
                  className={`min-h-[120px] p-3 border-r border-b border-border last:border-r-0 ${
                    isToday ? "bg-[#EB1F3A]/5" : ""
                  }`}
                >
                  <div
                    className={`text-sm font-medium mb-2 ${
                      isToday ? "w-6 h-6 rounded-full bg-[#EB1F3A] text-white flex items-center justify-center" : "text-[#C9CDD6]"
                    }`}
                  >
                    {day}
                  </div>
                  <div className="space-y-1">
                    {dayEvents.map((event) => (
                      <div
                        key={event.id}
                        className={`text-xs p-1.5 rounded truncate ${
                          event.type === "quiz" || event.type === "exam"
                            ? "bg-[#EB1F3A]/10 text-[#EB1F3A]"
                            : "bg-[#FFC857]/10 text-[#FFC857]"
                        }`}
                        title={event.title}
                      >
                        {event.title}
                      </div>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        <div className="mt-8">
          <h3 className="text-xl font-semibold mb-4">Upcoming Events</h3>
          {events.length === 0 ? (
            <div className="p-8 rounded-xl bg-[#151517] border border-border shadow-gem text-center">
              <p className="text-[#8D93A1]">No upcoming events</p>
            </div>
          ) : (
            <div className="space-y-3">
              {events.map((event) => (
                <div
                  key={event.id}
                  className="p-4 rounded-xl bg-[#151517] border border-border shadow-gem hover:border-[#EB1F3A]/30 transition-all"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-1">
                        <Badge
                          className={`border-0 ${
                            event.type === "quiz" || event.type === "exam"
                              ? "bg-[#EB1F3A]/10 text-[#EB1F3A]"
                              : "bg-[#FFC857]/10 text-[#FFC857]"
                          }`}
                        >
                          {event.type}
                        </Badge>
                        <span className="text-sm text-[#8D93A1]">{event.class}</span>
                      </div>
                      <h4 className="text-base font-semibold text-[#F5F7FA]">{event.title}</h4>
                    </div>
                    <div className="text-sm text-[#8D93A1]">
                      {event.fullDate.toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
