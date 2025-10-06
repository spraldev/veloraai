"use client"

import { useState } from "react"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Sparkles, Plus, FileText, Clock, Play } from "lucide-react"
import { motion } from "framer-motion"

interface Material {
  id: string
  type: "audio" | "photo" | "link" | "file"
  title: string
  source: string
  date: string
  duration?: string
}

interface Assignment {
  id: string
  title: string
  dueDate: string
  weight: string
}

interface Note {
  id: string
  title: string
  content: string
  timestamp: string
}

interface Practice {
  id: string
  title: string
  difficulty: string
  questions: number
  timeEstimate: string
  progress: number
  lastAttempt: string
}

interface ClassWorkspaceClientProps {
  classData: {
    name: string
    teacher: string
    color: string
  }
  materials: Material[]
  assignments: Assignment[]
  notes: Note[]
  practices: Practice[]
}

export function ClassWorkspaceClient({
  classData,
  materials,
  assignments,
  notes,
  practices,
}: ClassWorkspaceClientProps) {
  const [activeTab, setActiveTab] = useState("brief")

  const getIcon = (type: string) => {
    switch (type) {
      case "audio":
        return "🎙️"
      case "photo":
        return "📷"
      case "link":
        return "🔗"
      case "file":
        return "📄"
      default:
        return "📄"
    }
  }

  return (
    <div className="flex-1">
      <div className="border-b border-border bg-[#0A0A0C] px-8 py-6">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: classData.color }} />
              <h1 className="text-2xl font-semibold">{classData.name}</h1>
            </div>
            {classData.teacher && (
              <p className="text-sm text-[#8D93A1]">Teacher: {classData.teacher}</p>
            )}
          </div>

          <div className="flex items-center gap-3">
            <Button className="bg-[#EB1F3A] hover:bg-[#FF4D57] text-white font-medium">
              <Sparkles className="w-4 h-4 mr-2" />
              Generate Brief
            </Button>
            <Button variant="outline" className="border-border bg-transparent text-[#C9CDD6]">
              <Plus className="w-4 h-4 mr-2" />
              Add Material
            </Button>
          </div>
        </div>

        {assignments.length > 0 && (
          <div className="mt-4 flex items-center gap-2">
            <span className="text-sm text-[#8D93A1]">Upcoming:</span>
            {assignments.map((deadline) => (
              <Badge
                key={deadline.id}
                className={`text-xs border-0 ${
                  deadline.weight === "High"
                    ? "bg-[#EB1F3A]/10 text-[#EB1F3A]"
                    : deadline.weight === "Med"
                      ? "bg-[#FFC857]/10 text-[#FFC857]"
                      : "bg-[#37E08D]/10 text-[#37E08D]"
                }`}
              >
                {deadline.title} - {deadline.dueDate}
              </Badge>
            ))}
          </div>
        )}
      </div>

      <div className="p-8">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-6">
            <TabsTrigger value="brief">Study Brief</TabsTrigger>
            <TabsTrigger value="materials">Materials ({materials.length})</TabsTrigger>
            <TabsTrigger value="notes">Notes ({notes.length})</TabsTrigger>
            <TabsTrigger value="practice">Practice ({practices.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="brief" className="space-y-4">
            <div className="text-center py-16">
              <div className="w-16 h-16 rounded-full bg-[#EB1F3A]/10 flex items-center justify-center mx-auto mb-4">
                <Sparkles className="w-8 h-8 text-[#EB1F3A]" />
              </div>
              <h3 className="text-xl font-semibold mb-2">No study brief yet</h3>
              <p className="text-[#8D93A1] mb-6">
                Generate a study brief for this class from your recent materials
              </p>
              <Button className="bg-[#EB1F3A] hover:bg-[#FF4D57] text-white font-medium">
                <Sparkles className="w-4 h-4 mr-2" />
                Generate Brief
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="materials" className="space-y-3">
            {materials.length === 0 ? (
              <div className="text-center py-16">
                <p className="text-[#8D93A1] mb-6">No materials yet. Upload your first one!</p>
                <Button variant="outline" className="border-border bg-transparent text-[#C9CDD6]">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Material
                </Button>
              </div>
            ) : (
              materials.map((material, index) => (
                <motion.div
                  key={material.id}
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="p-4 rounded-xl bg-[#151517] border border-border shadow-gem hover:border-[#EB1F3A]/30 transition-all"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3 flex-1">
                      <span className="text-2xl">{getIcon(material.type)}</span>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-semibold text-[#F5F7FA] mb-1">{material.title}</h4>
                        <div className="flex items-center gap-3 text-xs text-[#8D93A1]">
                          <span>{material.source}</span>
                          <span>•</span>
                          <span>{material.date}</span>
                          {material.duration && (
                            <>
                              <span>•</span>
                              <span>{material.duration}</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </TabsContent>

          <TabsContent value="notes" className="space-y-3">
            {notes.length === 0 ? (
              <div className="text-center py-16">
                <p className="text-[#8D93A1]">No notes yet. They'll appear here after processing materials.</p>
              </div>
            ) : (
              notes.map((note, index) => (
                <motion.div
                  key={note.id}
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="p-4 rounded-xl bg-[#151517] border border-border shadow-gem hover:border-[#EB1F3A]/30 transition-all"
                >
                  <div className="flex items-start gap-3">
                    <FileText className="w-5 h-5 text-[#8D93A1] flex-shrink-0 mt-0.5" />
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-semibold text-[#F5F7FA] mb-1">{note.title}</h4>
                      <p className="text-sm text-[#C9CDD6] mb-2 line-clamp-2">{note.content}</p>
                      <div className="flex items-center gap-2 text-xs text-[#8D93A1]">
                        <Clock className="w-3 h-3" />
                        <span>{note.timestamp}</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </TabsContent>

          <TabsContent value="practice" className="space-y-3">
            {practices.length === 0 ? (
              <div className="text-center py-16">
                <p className="text-[#8D93A1] mb-6">No practice sets yet. Generate one from your materials!</p>
                <Button className="bg-[#EB1F3A] hover:bg-[#FF4D57] text-white font-medium">
                  <Sparkles className="w-4 h-4 mr-2" />
                  Generate Practice
                </Button>
              </div>
            ) : (
              practices.map((practice, index) => (
                <motion.div
                  key={practice.id}
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="p-4 rounded-xl bg-[#151517] border border-border shadow-gem hover:border-[#EB1F3A]/30 transition-all"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <h4 className="text-sm font-semibold text-[#F5F7FA] mb-2">{practice.title}</h4>
                      <div className="flex items-center gap-3 text-xs text-[#8D93A1]">
                        <span>{practice.questions} questions</span>
                        <span>•</span>
                        <span>{practice.timeEstimate}</span>
                        <span>•</span>
                        <Badge
                          className={`text-xs border-0 ${
                            practice.difficulty === "Easy"
                              ? "bg-[#37E08D]/10 text-[#37E08D]"
                              : practice.difficulty === "Hard"
                                ? "bg-[#EB1F3A]/10 text-[#EB1F3A]"
                                : "bg-[#FFC857]/10 text-[#FFC857]"
                          }`}
                        >
                          {practice.difficulty}
                        </Badge>
                      </div>
                    </div>
                    <Button size="sm" className="bg-[#EB1F3A] hover:bg-[#FF4D57] text-white">
                      <Play className="w-4 h-4 mr-1" />
                      Start
                    </Button>
                  </div>
                </motion.div>
              ))
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
