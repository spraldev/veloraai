import { redirect } from "next/navigation"
import { ChatPanel } from "@/components/chat/chat-panel"
import { StudyBriefCard } from "@/components/dashboard/study-brief-card"
import { DueSoonCard } from "@/components/dashboard/due-soon-card"
import { ClassesCard } from "@/components/dashboard/classes-card"
import { CaptureCard } from "@/components/dashboard/capture-card"
import { RecentNotesCard } from "@/components/dashboard/recent-notes-card"
import { FocusTimerCard } from "@/components/dashboard/focus-timer-card"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export default async function DashboardPage() {
  const session = await auth()
  
  if (!session?.user) {
    redirect("/login")
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email! },
    include: {
      classes: {
        include: {
          _count: {
            select: { materials: true, assignments: true },
          },
        },
      },
    },
  })

  if (!user) {
    redirect("/login")
  }

  if (!user.onboardingComplete) {
    redirect("/onboarding")
  }

  const today = new Date()
  today.setHours(0, 0, 0, 0)
  
  const todayBrief = await prisma.studyBrief.findFirst({
    where: {
      userId: user.id,
      date: {
        gte: today,
        lt: new Date(today.getTime() + 24 * 60 * 60 * 1000),
      },
    },
    include: {
      blocks: {
        include: { class: true },
        orderBy: { order: "asc" },
      },
    },
  })

  const upcomingAssignments = await prisma.assignment.findMany({
    where: {
      class: { userId: user.id },
      dueDate: { gte: new Date() },
      completed: false,
    },
    include: { class: true },
    orderBy: { dueDate: "asc" },
    take: 5,
  })

  const threads = await prisma.thread.findMany({
    where: { userId: user.id },
    orderBy: { updatedAt: "desc" },
  })

  const veloraThread = threads.find(t => t.agentType === "velora")

  const velora = {
    id: veloraThread?.id || "velora",
    name: "Velora",
    type: "velora" as const,
    description: "Your AI study coordinator",
    threadId: veloraThread?.id,
  }

  const quickChips = [
    { label: "Plan Today", action: "plan-today" },
    { label: "Reschedule Tonight", action: "reschedule" },
    { label: "Generate Mixed Practice", action: "generate-practice" },
  ]

  const briefData = todayBrief ? {
    id: todayBrief.id,
    summary: todayBrief.summary,
    totalTime: todayBrief.totalTime,
    blocks: todayBrief.blocks.map(b => ({
      id: b.id,
      subject: b.subject,
      method: b.method,
      topic: b.topic,
      duration: b.duration,
    })),
  } : undefined

  const assignmentsData = upcomingAssignments.map(a => ({
    id: a.id,
    title: a.title,
    className: a.class.name,
    dueDate: a.dueDate.toLocaleDateString(),
    weight: a.weight > 80 ? "High" : a.weight > 50 ? "Med" : "Low",
    isOverdue: a.dueDate < new Date(),
  }))

  const classesData = user.classes.map(c => ({
    id: c.id,
    name: c.name,
    color: c.color,
    progress: 0,
    teacher: "",
  }))

  const recentNotes = await prisma.note.findMany({
    where: { userId: user.id },
    include: { class: true },
    orderBy: { createdAt: "desc" },
    take: 3,
  })

  const notesData = recentNotes.map(n => ({
    id: n.id,
    title: n.title,
    preview: n.content.substring(0, 100),
    className: n.class.name,
    timestamp: n.createdAt.toLocaleDateString(),
  }))

  return (
    <div className="flex h-screen">
      {/* Main content area */}
      <div className="flex-1 p-6 overflow-y-auto">
        <div className="max-w-[800px] mx-auto">
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-2xl font-semibold mb-1.5 text-balance">Welcome back, {user.name}</h1>
            <p className="text-sm text-[#8D93A1]">Chat with Velora or explore your dashboard</p>
          </div>

          <div className="space-y-4">
            {/* Study Brief Hero */}
            <StudyBriefCard brief={briefData} />

            {/* Due Soon */}
            <DueSoonCard assignments={assignmentsData} />

            {/* Classes */}
            <ClassesCard classes={classesData} />

            {/* Capture */}
            <CaptureCard classes={classesData.map(c => ({ id: c.id, name: c.name }))} />

            {/* Recent Notes */}
            <RecentNotesCard notes={notesData} />

            {/* Focus Timer */}
            <FocusTimerCard />
          </div>
        </div>
      </div>

      {/* Docked Chat Panel */}
      <ChatPanel agent={velora} quickChips={quickChips} className="w-[420px] shrink-0" />
    </div>
  )
}
