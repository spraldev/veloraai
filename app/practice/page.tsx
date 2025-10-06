import { redirect } from "next/navigation"
import { Play, ChevronRight, Filter } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export default async function PracticePage() {
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

  const practiceSets = await prisma.practiceSet.findMany({
    where: {
      class: { userId: user.id },
    },
    include: { class: true },
    orderBy: { createdAt: "desc" },
  })

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-[1000px] mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-semibold mb-2">Practice Sets</h1>
          <p className="text-[#8D93A1]">Test your knowledge with AI-generated practice questions</p>
        </div>

        <div className="flex items-center gap-2 mb-6">
          <Button variant="outline" size="sm" className="border-border bg-transparent text-[#8D93A1]">
            <Filter className="w-4 h-4 mr-2" />
            All Classes
          </Button>
          <Button variant="ghost" size="sm" className="text-[#8D93A1]">
            In Progress
          </Button>
          <Button variant="ghost" size="sm" className="text-[#8D93A1]">
            Completed
          </Button>
          <Button variant="ghost" size="sm" className="text-[#8D93A1]">
            Not Started
          </Button>
        </div>

        {practiceSets.length === 0 ? (
          <div className="p-12 rounded-2xl bg-[#151517] border border-border shadow-gem text-center">
            <p className="text-[#8D93A1] mb-6">No practice sets yet. Generate one from your materials!</p>
            <Button className="bg-[#EB1F3A] hover:bg-[#FF4D57] text-white font-medium">
              Generate Practice Set
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {practiceSets.map((set) => {
              const questions = Array.isArray(set.questionsData) ? set.questionsData.length : 0
              const progress = 0

              return (
                <div
                  key={set.id}
                  className="p-6 rounded-2xl bg-[#151517] border border-border shadow-gem hover:border-[#EB1F3A]/30 transition-all group"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold text-[#F5F7FA]">{set.title}</h3>
                        <Badge
                          className={`border-0 ${
                            set.difficulty === "Easy"
                              ? "bg-[#37E08D]/10 text-[#37E08D]"
                              : set.difficulty === "Hard"
                                ? "bg-[#EB1F3A]/10 text-[#EB1F3A]"
                                : "bg-[#FFC857]/10 text-[#FFC857]"
                          }`}
                        >
                          {set.difficulty}
                        </Badge>
                      </div>

                      <p className="text-sm text-[#8D93A1] mb-4">{set.class.name}</p>

                      <div className="flex items-center gap-4 text-sm text-[#C9CDD6] mb-4">
                        <span>{questions} questions</span>
                        <span>•</span>
                        <span>{set.timeEstimate || "N/A"}</span>
                        <span>•</span>
                        <span className="text-[#8D93A1]">
                          Created {set.createdAt.toLocaleDateString()}
                        </span>
                      </div>

                      {progress > 0 && (
                        <div>
                          <div className="flex items-center justify-between text-xs text-[#8D93A1] mb-2">
                            <span>Progress</span>
                            <span>{progress}%</span>
                          </div>
                          <div className="h-2 bg-[#26262A] rounded-full overflow-hidden">
                            <div
                              className="h-full bg-[#EB1F3A] rounded-full transition-all"
                              style={{ width: `${progress}%` }}
                            />
                          </div>
                        </div>
                      )}
                    </div>

                    <Button className="bg-[#EB1F3A] hover:bg-[#FF4D57] text-white font-medium">
                      <Play className="w-4 h-4 mr-2" />
                      {progress > 0 && progress < 100 ? "Continue" : progress === 100 ? "Retry" : "Start"}
                    </Button>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
