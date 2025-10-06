import { redirect } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { Bell, User, Palette, Clock, Database, Shield } from "lucide-react"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export default async function SettingsPage() {
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

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-[800px] mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-semibold mb-2">Settings</h1>
          <p className="text-[#8D93A1]">Manage your account and preferences</p>
        </div>

        <div className="p-6 rounded-2xl bg-[#151517] border border-border shadow-gem mb-6">
          <div className="flex items-center gap-3 mb-6">
            <User className="w-5 h-5 text-[#EB1F3A]" />
            <h2 className="text-xl font-semibold">Account</h2>
          </div>

          <div className="space-y-4">
            <div>
              <Label htmlFor="email" className="text-sm text-[#C9CDD6] mb-2 block">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                defaultValue={user.email}
                className="bg-[#0A0A0C] border-border"
                disabled
              />
            </div>

            <div>
              <Label htmlFor="name" className="text-sm text-[#C9CDD6] mb-2 block">
                Display Name
              </Label>
              <Input id="name" defaultValue={user.name || ""} className="bg-[#0A0A0C] border-border" />
            </div>
          </div>
        </div>

        <div className="p-6 rounded-2xl bg-[#151517] border border-border shadow-gem mb-6">
          <div className="flex items-center gap-3 mb-6">
            <Bell className="w-5 h-5 text-[#EB1F3A]" />
            <h2 className="text-xl font-semibold">Notifications</h2>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 rounded-xl bg-[#0A0A0C]/50 border border-border/50">
              <div>
                <h3 className="text-sm font-medium text-[#F5F7FA] mb-1">Daily Study Brief</h3>
                <p className="text-xs text-[#8D93A1]">Receive your study plan each afternoon</p>
              </div>
              <Switch defaultChecked />
            </div>

            <div className="flex items-center justify-between p-4 rounded-xl bg-[#0A0A0C]/50 border border-border/50">
              <div>
                <h3 className="text-sm font-medium text-[#F5F7FA] mb-1">Critical Alerts</h3>
                <p className="text-xs text-[#8D93A1]">Urgent reminders for upcoming deadlines</p>
              </div>
              <Switch defaultChecked />
            </div>

            <div className="flex items-center justify-between p-4 rounded-xl bg-[#0A0A0C]/50 border border-border/50">
              <div>
                <h3 className="text-sm font-medium text-[#F5F7FA] mb-1">Gentle Nudges</h3>
                <p className="text-xs text-[#8D93A1]">Study reminders during focus sessions</p>
              </div>
              <Switch />
            </div>
          </div>
        </div>

        <div className="p-6 rounded-2xl bg-[#151517] border border-border shadow-gem mb-6">
          <div className="flex items-center gap-3 mb-6">
            <Clock className="w-5 h-5 text-[#EB1F3A]" />
            <h2 className="text-xl font-semibold">Study Preferences</h2>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 rounded-xl bg-[#0A0A0C]/50 border border-border/50">
              <div>
                <h3 className="text-sm font-medium text-[#F5F7FA] mb-1">Default Block Length</h3>
                <p className="text-xs text-[#8D93A1]">Standard study session duration</p>
              </div>
              <select className="px-3 py-2 rounded-lg bg-[#121214] border border-border text-sm text-[#F5F7FA]">
                <option>25 minutes</option>
                <option>30 minutes</option>
                <option>45 minutes</option>
                <option>60 minutes</option>
              </select>
            </div>

            <div className="flex items-center justify-between p-4 rounded-xl bg-[#0A0A0C]/50 border border-border/50">
              <div>
                <h3 className="text-sm font-medium text-[#F5F7FA] mb-1">Latest Finish Time</h3>
                <p className="text-xs text-[#8D93A1]">When to end study sessions on school nights</p>
              </div>
              <select className="px-3 py-2 rounded-lg bg-[#121214] border border-border text-sm text-[#F5F7FA]">
                <option>9:00 PM</option>
                <option>10:00 PM</option>
                <option>11:00 PM</option>
              </select>
            </div>
          </div>
        </div>

        <div className="p-6 rounded-2xl bg-[#151517] border border-border shadow-gem">
          <div className="flex items-center gap-3 mb-6">
            <Shield className="w-5 h-5 text-[#EB1F3A]" />
            <h2 className="text-xl font-semibold">Privacy & Data</h2>
          </div>

          <div className="space-y-3">
            <Button variant="outline" className="w-full justify-start border-border bg-transparent text-[#C9CDD6]">
              <Database className="w-4 h-4 mr-2" />
              Export All Data
            </Button>
            <Button variant="outline" className="w-full justify-start border-[#FF4D57]/30 bg-transparent text-[#FF4D57]">
              <Shield className="w-4 h-4 mr-2" />
              Delete Account
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
