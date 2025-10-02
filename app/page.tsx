import { ChatPanel } from "@/components/chat/chat-panel"
import { agents } from "@/lib/agent-data"
import { StudyBriefCard } from "@/components/dashboard/study-brief-card"
import { DueSoonCard } from "@/components/dashboard/due-soon-card"
import { ClassesCard } from "@/components/dashboard/classes-card"
import { CaptureCard } from "@/components/dashboard/capture-card"
import { RecentNotesCard } from "@/components/dashboard/recent-notes-card"
import { FocusTimerCard } from "@/components/dashboard/focus-timer-card"

export default function DashboardPage() {
  const velora = agents.find((a) => a.type === "velora")!

  const quickChips = [
    { label: "Plan Today", action: "plan-today" },
    { label: "Reschedule Tonight", action: "reschedule" },
    { label: "Generate Mixed Practice", action: "generate-practice" },
  ]

  return (
    <div className="flex h-screen">
      {/* Main content area */}
      <div className="flex-1 p-6 overflow-y-auto">
        <div className="max-w-[800px] mx-auto">
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-2xl font-semibold mb-1.5 text-balance">Welcome back, Jordan</h1>
            <p className="text-sm text-[#8D93A1]">Chat with Velora or explore your dashboard</p>
          </div>

          <div className="space-y-4">
            {/* Study Brief Hero */}
            <StudyBriefCard />

            {/* Due Soon */}
            <DueSoonCard />

            {/* Classes */}
            <ClassesCard />

            {/* Capture */}
            <CaptureCard />

            {/* Recent Notes */}
            <RecentNotesCard />

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
