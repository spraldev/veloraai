import { redirect } from "next/navigation"
import { ChatPanel } from "@/components/chat/chat-panel"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { ClassWorkspaceClient } from "./class-workspace-client"

export default async function ClassWorkspacePage({ params }: { params: { id: string } }) {
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

  const classData = await prisma.class.findUnique({
    where: { id: params.id, userId: user.id },
    include: {
      materials: {
        orderBy: { createdAt: "desc" },
        take: 10,
      },
      assignments: {
        where: { dueDate: { gte: new Date() }, completed: false },
        orderBy: { dueDate: "asc" },
        take: 5,
      },
      notes: {
        orderBy: { createdAt: "desc" },
        take: 5,
      },
    },
  })

  if (!classData) {
    redirect("/classes")
  }

  const practiceSets = await prisma.practiceSet.findMany({
    where: { classId: params.id },
    orderBy: { createdAt: "desc" },
    take: 5,
  })

  const threads = await prisma.thread.findMany({
    where: { userId: user.id },
    orderBy: { updatedAt: "desc" },
  })

  const helperThread = threads.find(
    (t) => t.agentType === "helper" && t.metadata?.classId === params.id
  )

  const helper = {
    id: helperThread?.id || `helper-${params.id}`,
    name: `${classData.name} Helper`,
    type: "helper" as const,
    description: `Your AI assistant for ${classData.name}`,
    threadId: helperThread?.id,
  }

  const quickChips = [
    { label: "Summarize notes", action: "summarize" },
    { label: "Generate practice", action: "practice" },
    { label: "Explain concept", action: "explain" },
  ]

  const materialsData = classData.materials.map((m) => ({
    id: m.id,
    type: m.type as "audio" | "photo" | "link" | "file",
    title: m.title,
    source: m.source || "Upload",
    date: m.createdAt.toLocaleDateString(),
    duration: m.duration ? `${m.duration} min` : undefined,
  }))

  const assignmentsData = classData.assignments.map((a) => ({
    id: a.id,
    title: a.title,
    dueDate: a.dueDate.toLocaleDateString(),
    weight: a.weight > 80 ? "High" : a.weight > 50 ? "Med" : "Low",
  }))

  const notesData = classData.notes.map((n) => ({
    id: n.id,
    title: n.title,
    content: n.content,
    timestamp: n.createdAt.toLocaleDateString(),
  }))

  const practiceData = practiceSets.map((p) => ({
    id: p.id,
    title: p.title,
    difficulty: p.difficulty,
    questions: Array.isArray(p.questionsData) ? p.questionsData.length : 0,
    timeEstimate: p.timeEstimate || "N/A",
    progress: 0,
    lastAttempt: p.createdAt.toLocaleDateString(),
  }))

  return (
    <div className="flex h-screen">
      <ClassWorkspaceClient
        classData={{
          name: classData.name,
          teacher: classData.teacher || "",
          color: classData.color,
        }}
        materials={materialsData}
        assignments={assignmentsData}
        notes={notesData}
        practices={practiceData}
      />

      <ChatPanel agent={helper} quickChips={quickChips} className="w-[400px] shrink-0" />
    </div>
  )
}
