import { redirect } from "next/navigation"
import { Clock, Sparkles, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export default async function BriefPage() {
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

  const briefDate = today.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-[800px] mx-auto">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <h1 className="text-3xl font-semibold">Today's Study Brief</h1>
            <Button variant="outline" className="border-border bg-transparent text-[#8D93A1]">
              <Sparkles className="w-4 h-4 mr-2" />
              Regenerate
            </Button>
          </div>
          <p className="text-[#8D93A1]">
            {briefDate} • Total: {todayBrief?.totalTime || 0} minutes
          </p>
        </div>

        {todayBrief ? (
          <>
            <div className="p-6 rounded-2xl bg-[#151517] border border-border shadow-gem mb-6">
              <h2 className="text-lg font-semibold mb-3">Summary</h2>
              <p className="text-[#C9CDD6] leading-relaxed">{todayBrief.summary}</p>
            </div>

            <div className="space-y-4">
              {todayBrief.blocks.map((block, index) => (
                <div
                  key={block.id}
                  className="p-5 rounded-2xl bg-[#151517] border border-border shadow-gem hover:border-[#EB1F3A]/30 transition-all"
                >
                  <div className="flex items-start gap-4">
                    <div
                      className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center font-semibold"
                      style={{ backgroundColor: `${block.class.color}15`, color: block.class.color }}
                    >
                      {index + 1}
                    </div>

                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span
                              className="w-2 h-2 rounded-full"
                              style={{ backgroundColor: block.class.color }}
                            />
                            <h3 className="text-base font-semibold text-[#F5F7FA]">{block.subject}</h3>
                          </div>
                          <Badge className="bg-[#8D93A1]/10 text-[#8D93A1] border-0 mb-2">{block.method}</Badge>
                          <p className="text-sm text-[#C9CDD6]">{block.topic}</p>
                        </div>
                        <div className="flex items-center gap-2 text-[#C9CDD6]">
                          <Clock className="w-4 h-4" />
                          <span className="text-sm font-medium">{block.duration} min</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 mt-3">
                        <button className="text-xs text-[#8D93A1] hover:text-[#EB1F3A] transition-colors">
                          /shorter
                        </button>
                        <button className="text-xs text-[#8D93A1] hover:text-[#EB1F3A] transition-colors">
                          /longer
                        </button>
                        <button className="text-xs text-[#8D93A1] hover:text-[#EB1F3A] transition-colors">
                          /skip
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 flex items-center justify-between p-5 rounded-2xl bg-[#151517] border border-border shadow-gem">
              <div className="flex items-center gap-3">
                <Button className="bg-[#EB1F3A] hover:bg-[#FF4D57] text-white font-medium">Start Plan</Button>
                <Button variant="outline" className="border-border bg-transparent text-[#8D93A1]">
                  Generate Practice
                </Button>
              </div>
              <Button variant="ghost" className="text-[#8D93A1]">
                <ChevronDown className="w-4 h-4 mr-2" />
                More Options
              </Button>
            </div>
          </>
        ) : (
          <div className="p-12 rounded-2xl bg-[#151517] border border-border shadow-gem text-center">
            <div className="w-16 h-16 rounded-full bg-[#EB1F3A]/10 flex items-center justify-center mx-auto mb-4">
              <Sparkles className="w-8 h-8 text-[#EB1F3A]" />
            </div>
            <h3 className="text-xl font-semibold mb-2">No brief yet</h3>
            <p className="text-[#8D93A1] mb-6">Generate a study brief for today</p>
            <Button className="bg-[#EB1F3A] hover:bg-[#FF4D57] text-white font-medium">
              <Sparkles className="w-4 h-4 mr-2" />
              Generate Brief
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
