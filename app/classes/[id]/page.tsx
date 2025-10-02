"use client"
import { useParams } from "next/navigation"
import { classes } from "@/lib/seed-data"
import { classMaterials, classNotes, practiceQuizzes } from "@/lib/class-data"
import { agents } from "@/lib/agent-data"
import { ChatPanel } from "@/components/chat/chat-panel"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  BookOpen,
  Plus,
  Sparkles,
  Mic,
  ImageIcon,
  Link2,
  FileText,
  Play,
  Clock,
  ChevronRight,
  ExternalLink,
} from "lucide-react"

export default function ClassWorkspacePage() {
  const params = useParams()
  const classItem = classes.find((c) => c.id === params.id)

  const helper = agents.find((a) => a.type === "helper" && a.classId === params.id)

  if (!classItem) {
    return <div className="p-8">Class not found</div>
  }

  const quickChips = [
    { label: "Summarize notes", action: "summarize" },
    { label: "Generate practice", action: "practice" },
    { label: "Explain concept", action: "explain" },
  ]

  return (
    <div className="flex h-screen">
      {/* Main content area */}
      <div className="flex-1 p-8 overflow-y-auto">
        <div className="max-w-[1000px] mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h1 className="text-3xl font-semibold mb-2 text-balance">{classItem.name}</h1>
                <p className="text-[#8D93A1]">{classItem.teacher}</p>
              </div>
              <div className="flex items-center gap-3">
                <Button variant="outline" className="border-border hover:bg-[#121214] text-[#C9CDD6] bg-transparent">
                  <Sparkles className="w-4 h-4 mr-2" />
                  Generate Brief
                </Button>
                <Button className="bg-[#EB1F3A] hover:bg-[#FF4D57] text-white font-medium">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Material
                </Button>
              </div>
            </div>

            {/* Next deadlines */}
            <div className="flex items-center gap-2">
              <span className="text-sm text-[#8D93A1]">Next:</span>
              <Badge className="bg-[#EB1F3A]/10 text-[#EB1F3A] border-0">Quiz Tomorrow</Badge>
              <Badge className="bg-[#FFC857]/10 text-[#FFC857] border-0">Lab Report - Fri</Badge>
            </div>
          </div>

          {/* Tabs */}
          <Tabs defaultValue="brief" className="w-full">
            <TabsList className="bg-[#151517] border border-border p-1 mb-6">
              <TabsTrigger
                value="brief"
                className="data-[state=active]:bg-[#EB1F3A] data-[state=active]:text-white text-[#8D93A1]"
              >
                <BookOpen className="w-4 h-4 mr-2" />
                Brief
              </TabsTrigger>
              <TabsTrigger
                value="materials"
                className="data-[state=active]:bg-[#EB1F3A] data-[state=active]:text-white text-[#8D93A1]"
              >
                <FileText className="w-4 h-4 mr-2" />
                Materials
              </TabsTrigger>
              <TabsTrigger
                value="notes"
                className="data-[state=active]:bg-[#EB1F3A] data-[state=active]:text-white text-[#8D93A1]"
              >
                <FileText className="w-4 h-4 mr-2" />
                Notes
              </TabsTrigger>
              <TabsTrigger
                value="practice"
                className="data-[state=active]:bg-[#EB1F3A] data-[state=active]:text-white text-[#8D93A1]"
              >
                <Play className="w-4 h-4 mr-2" />
                Practice
              </TabsTrigger>
            </TabsList>

            {/* Brief Tab */}
            <TabsContent value="brief" className="space-y-6">
              <div className="p-6 rounded-2xl bg-[#151517] border border-border shadow-gem">
                <h3 className="text-lg font-semibold mb-4">Study Plan for {classItem.name}</h3>
                <p className="text-[#C9CDD6] mb-6 leading-relaxed">
                  Focus on cellular respiration for tomorrow's quiz. Recommended: 60 minutes of retrieval practice
                  covering glycolysis, Krebs cycle, and electron transport chain.
                </p>

                <div className="space-y-3 mb-6">
                  <div className="flex items-center gap-4 p-4 rounded-lg bg-[#0A0A0C]/50 border border-border/50">
                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-[#37E08D]/10 flex items-center justify-center">
                      <span className="text-[#37E08D] font-semibold">1</span>
                    </div>
                    <div className="flex-1">
                      <h4 className="text-sm font-medium text-[#F5F7FA] mb-1">Retrieval Practice</h4>
                      <p className="text-xs text-[#8D93A1]">Answer practice questions without notes</p>
                    </div>
                    <div className="flex items-center gap-2 text-[#C9CDD6]">
                      <Clock className="w-4 h-4" />
                      <span className="text-sm font-medium">30 min</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 p-4 rounded-lg bg-[#0A0A0C]/50 border border-border/50">
                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-[#FFC857]/10 flex items-center justify-center">
                      <span className="text-[#FFC857] font-semibold">2</span>
                    </div>
                    <div className="flex-1">
                      <h4 className="text-sm font-medium text-[#F5F7FA] mb-1">Review Notes</h4>
                      <p className="text-xs text-[#8D93A1]">Focus on weak areas identified in practice</p>
                    </div>
                    <div className="flex items-center gap-2 text-[#C9CDD6]">
                      <Clock className="w-4 h-4" />
                      <span className="text-sm font-medium">20 min</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 p-4 rounded-lg bg-[#0A0A0C]/50 border border-border/50">
                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-[#EB1F3A]/10 flex items-center justify-center">
                      <span className="text-[#EB1F3A] font-semibold">3</span>
                    </div>
                    <div className="flex-1">
                      <h4 className="text-sm font-medium text-[#F5F7FA] mb-1">Mixed Practice</h4>
                      <p className="text-xs text-[#8D93A1]">Interleaved questions from all topics</p>
                    </div>
                    <div className="flex items-center gap-2 text-[#C9CDD6]">
                      <Clock className="w-4 h-4" />
                      <span className="text-sm font-medium">10 min</span>
                    </div>
                  </div>
                </div>

                <Button className="bg-[#EB1F3A] hover:bg-[#FF4D57] text-white font-medium w-full">
                  <Play className="w-4 h-4 mr-2" />
                  Start Plan
                </Button>
              </div>
            </TabsContent>

            {/* Materials Tab */}
            <TabsContent value="materials" className="space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <Button variant="outline" size="sm" className="border-border bg-transparent text-[#8D93A1]">
                  All
                </Button>
                <Button variant="ghost" size="sm" className="text-[#8D93A1]">
                  Audio
                </Button>
                <Button variant="ghost" size="sm" className="text-[#8D93A1]">
                  Photos
                </Button>
                <Button variant="ghost" size="sm" className="text-[#8D93A1]">
                  Links
                </Button>
                <Button variant="ghost" size="sm" className="text-[#8D93A1]">
                  Files
                </Button>
              </div>

              {classMaterials.map((material) => {
                const icons = {
                  audio: Mic,
                  photo: ImageIcon,
                  link: Link2,
                  file: FileText,
                }
                const Icon = icons[material.type as keyof typeof icons]

                return (
                  <div
                    key={material.id}
                    className="p-4 rounded-xl bg-[#151517] border border-border shadow-gem hover:border-[#EB1F3A]/30 transition-all group cursor-pointer"
                  >
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-[#EB1F3A]/10 flex items-center justify-center">
                        <Icon className="w-5 h-5 text-[#EB1F3A]" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-medium text-[#F5F7FA] mb-1">{material.title}</h4>
                        <div className="flex items-center gap-2 text-xs text-[#8D93A1]">
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
                      <ChevronRight className="w-5 h-5 text-[#8D93A1] group-hover:text-[#EB1F3A] transition-colors flex-shrink-0" />
                    </div>
                  </div>
                )
              })}
            </TabsContent>

            {/* Notes Tab */}
            <TabsContent value="notes">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Outline */}
                <div className="lg:col-span-1 p-6 rounded-2xl bg-[#151517] border border-border shadow-gem">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold">Outline</h3>
                    <button className="text-xs text-[#EB1F3A] hover:text-[#FF4D57] font-medium">
                      <ExternalLink className="w-3 h-3" />
                    </button>
                  </div>
                  <div className="space-y-2">
                    {classNotes.outline.map((section, index) => (
                      <button
                        key={section.id}
                        className="w-full text-left p-2 rounded-lg hover:bg-[#0A0A0C]/50 transition-colors text-sm text-[#C9CDD6] hover:text-[#F5F7FA]"
                      >
                        {index + 1}. {section.title}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Details */}
                <div className="lg:col-span-2 space-y-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-xl font-semibold">{classNotes.title}</h3>
                    <span className="text-xs text-[#8D93A1]">{classNotes.timestamp}</span>
                  </div>

                  {classNotes.outline.map((section) => (
                    <div key={section.id} className="p-6 rounded-2xl bg-[#151517] border border-border shadow-gem">
                      <div className="flex items-start justify-between mb-3">
                        <h4 className="text-lg font-semibold text-[#F5F7FA]">{section.title}</h4>
                        <Badge className="bg-[#8D93A1]/10 text-[#8D93A1] border-0 text-xs">{section.timestamp}</Badge>
                      </div>
                      <p className="text-[#C9CDD6] leading-relaxed mb-4">{section.content}</p>

                      {section.keyTerms && (
                        <div className="flex flex-wrap gap-2 mb-4">
                          {section.keyTerms.map((term) => (
                            <Badge key={term} className="bg-[#EB1F3A]/10 text-[#EB1F3A] border-0">
                              {term}
                            </Badge>
                          ))}
                        </div>
                      )}

                      {section.formula && (
                        <div className="p-4 rounded-lg bg-[#0A0A0C]/50 border border-border/50">
                          <code className="text-sm text-[#37E08D] font-mono">{section.formula}</code>
                        </div>
                      )}
                    </div>
                  ))}

                  <button className="text-sm text-[#EB1F3A] hover:text-[#FF4D57] font-medium">Show sources →</button>
                </div>
              </div>
            </TabsContent>

            {/* Practice Tab */}
            <TabsContent value="practice" className="space-y-4">
              {practiceQuizzes.map((quiz) => (
                <div
                  key={quiz.id}
                  className="p-6 rounded-2xl bg-[#151517] border border-border shadow-gem hover:border-[#EB1F3A]/30 transition-all"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="text-lg font-semibold text-[#F5F7FA] mb-2">{quiz.title}</h4>
                      <div className="flex items-center gap-4 text-sm text-[#8D93A1] mb-4">
                        <span>{quiz.questions} questions</span>
                        <span>•</span>
                        <span>{quiz.timeEstimate}</span>
                        <span>•</span>
                        <Badge
                          className={`border-0 ${
                            quiz.difficulty === "Easy"
                              ? "bg-[#37E08D]/10 text-[#37E08D]"
                              : quiz.difficulty === "Hard"
                                ? "bg-[#EB1F3A]/10 text-[#EB1F3A]"
                                : "bg-[#FFC857]/10 text-[#FFC857]"
                          }`}
                        >
                          {quiz.difficulty}
                        </Badge>
                      </div>

                      {quiz.progress > 0 && (
                        <div className="mb-4">
                          <div className="flex items-center justify-between text-xs text-[#8D93A1] mb-2">
                            <span>Progress</span>
                            <span>{quiz.progress}%</span>
                          </div>
                          <div className="h-2 bg-[#26262A] rounded-full overflow-hidden">
                            <div
                              className="h-full bg-[#EB1F3A] rounded-full transition-all"
                              style={{ width: `${quiz.progress}%` }}
                            />
                          </div>
                        </div>
                      )}

                      {quiz.lastAttempt && <p className="text-xs text-[#8D93A1]">Last attempt: {quiz.lastAttempt}</p>}
                    </div>

                    <Button className="bg-[#EB1F3A] hover:bg-[#FF4D57] text-white font-medium">
                      <Play className="w-4 h-4 mr-2" />
                      {quiz.progress > 0 ? "Continue" : "Start"}
                    </Button>
                  </div>
                </div>
              ))}
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {helper && <ChatPanel agent={helper} quickChips={quickChips} className="w-[400px] shrink-0" />}
    </div>
  )
}
