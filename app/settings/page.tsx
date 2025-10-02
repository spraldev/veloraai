"use client"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Link2, Bell, Shield, Download, Trash2, CheckCircle2 } from "lucide-react"
import { motion } from "framer-motion"

export default function SettingsPage() {
  const [googleConnected, setGoogleConnected] = useState(true)
  const [dailyBrief, setDailyBrief] = useState(true)
  const [criticalAlerts, setCriticalAlerts] = useState(true)
  const [weeklyDigest, setWeeklyDigest] = useState(false)

  return (
    <div className="p-8">
      <div className="max-w-[900px] mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-semibold mb-2 text-balance">Settings</h1>
          <p className="text-[#8D93A1]">Manage your account and preferences</p>
        </div>

        <div className="space-y-6">
          {/* Connections */}
          <motion.div
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-6 rounded-2xl bg-[#151517] border border-border shadow-gem"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-full bg-[#EB1F3A]/10 flex items-center justify-center">
                <Link2 className="w-5 h-5 text-[#EB1F3A]" />
              </div>
              <div>
                <h2 className="text-xl font-semibold">Connections</h2>
                <p className="text-sm text-[#8D93A1]">Manage your integrations</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 rounded-xl bg-[#0A0A0C]/50 border border-border/50">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center">
                    <svg className="w-6 h-6" viewBox="0 0 24 24">
                      <path
                        fill="#4285F4"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      />
                      <path
                        fill="#34A853"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      />
                      <path
                        fill="#FBBC05"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      />
                      <path
                        fill="#EA4335"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-[#F5F7FA]">Google Classroom</h3>
                    <p className="text-xs text-[#8D93A1]">Sync assignments and deadlines</p>
                  </div>
                </div>
                {googleConnected ? (
                  <div className="flex items-center gap-2">
                    <Badge className="bg-[#37E08D]/10 text-[#37E08D] border-0">
                      <CheckCircle2 className="w-3 h-3 mr-1" />
                      Connected
                    </Badge>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setGoogleConnected(false)}
                      className="text-[#8D93A1] hover:text-[#FF4D57]"
                    >
                      Disconnect
                    </Button>
                  </div>
                ) : (
                  <Button
                    size="sm"
                    onClick={() => setGoogleConnected(true)}
                    className="bg-[#EB1F3A] hover:bg-[#FF4D57] text-white"
                  >
                    Connect
                  </Button>
                )}
              </div>
            </div>
          </motion.div>

          {/* Study Preferences */}
          <motion.div
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="p-6 rounded-2xl bg-[#151517] border border-border shadow-gem"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-full bg-[#FFC857]/10 flex items-center justify-center">
                <svg className="w-5 h-5 text-[#FFC857]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </div>
              <div>
                <h2 className="text-xl font-semibold">Study Preferences</h2>
                <p className="text-sm text-[#8D93A1]">Customize your study experience</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 rounded-xl bg-[#0A0A0C]/50 border border-border/50">
                <div>
                  <h3 className="text-sm font-medium text-[#F5F7FA] mb-1">Default Focus Block</h3>
                  <p className="text-xs text-[#8D93A1]">Standard Pomodoro timer length</p>
                </div>
                <select className="px-3 py-2 rounded-lg bg-[#121214] border border-border text-sm text-[#F5F7FA] focus:outline-none focus:ring-2 focus:ring-[#EB1F3A]/35">
                  <option>25 minutes</option>
                  <option>30 minutes</option>
                  <option>45 minutes</option>
                  <option>60 minutes</option>
                </select>
              </div>

              <div className="flex items-center justify-between p-4 rounded-xl bg-[#0A0A0C]/50 border border-border/50">
                <div>
                  <h3 className="text-sm font-medium text-[#F5F7FA] mb-1">Break Duration</h3>
                  <p className="text-xs text-[#8D93A1]">Time between focus sessions</p>
                </div>
                <select className="px-3 py-2 rounded-lg bg-[#121214] border border-border text-sm text-[#F5F7FA] focus:outline-none focus:ring-2 focus:ring-[#EB1F3A]/35">
                  <option>5 minutes</option>
                  <option>10 minutes</option>
                  <option>15 minutes</option>
                </select>
              </div>

              <div className="flex items-center justify-between p-4 rounded-xl bg-[#0A0A0C]/50 border border-border/50">
                <div>
                  <h3 className="text-sm font-medium text-[#F5F7FA] mb-1">Brief Cutoff Time</h3>
                  <p className="text-xs text-[#8D93A1]">When tomorrow's brief becomes editable</p>
                </div>
                <select className="px-3 py-2 rounded-lg bg-[#121214] border border-border text-sm text-[#F5F7FA] focus:outline-none focus:ring-2 focus:ring-[#EB1F3A]/35">
                  <option>6:00 PM</option>
                  <option>7:00 PM</option>
                  <option>8:00 PM</option>
                  <option>9:00 PM</option>
                </select>
              </div>
            </div>
          </motion.div>

          {/* Notifications */}
          <motion.div
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="p-6 rounded-2xl bg-[#151517] border border-border shadow-gem"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-full bg-[#EB1F3A]/10 flex items-center justify-center">
                <Bell className="w-5 h-5 text-[#EB1F3A]" />
              </div>
              <div>
                <h2 className="text-xl font-semibold">Notifications</h2>
                <p className="text-sm text-[#8D93A1]">Manage your alerts and reminders</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 rounded-xl bg-[#0A0A0C]/50 border border-border/50">
                <div>
                  <h3 className="text-sm font-medium text-[#F5F7FA] mb-1">Daily Study Brief</h3>
                  <p className="text-xs text-[#8D93A1]">Receive your study plan each morning at 7:00 AM</p>
                </div>
                <Switch checked={dailyBrief} onCheckedChange={setDailyBrief} />
              </div>

              <div className="flex items-center justify-between p-4 rounded-xl bg-[#0A0A0C]/50 border border-border/50">
                <div>
                  <h3 className="text-sm font-medium text-[#F5F7FA] mb-1">Critical Alerts</h3>
                  <p className="text-xs text-[#8D93A1]">Urgent reminders for upcoming deadlines</p>
                </div>
                <Switch checked={criticalAlerts} onCheckedChange={setCriticalAlerts} />
              </div>

              <div className="flex items-center justify-between p-4 rounded-xl bg-[#0A0A0C]/50 border border-border/50">
                <div>
                  <h3 className="text-sm font-medium text-[#F5F7FA] mb-1">Weekly Digest</h3>
                  <p className="text-xs text-[#8D93A1]">Summary of your progress every Sunday</p>
                </div>
                <Switch checked={weeklyDigest} onCheckedChange={setWeeklyDigest} />
              </div>
            </div>
          </motion.div>

          {/* Privacy */}
          <motion.div
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="p-6 rounded-2xl bg-[#151517] border border-border shadow-gem"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-full bg-[#8D93A1]/10 flex items-center justify-center">
                <Shield className="w-5 h-5 text-[#8D93A1]" />
              </div>
              <div>
                <h2 className="text-xl font-semibold">Privacy & Data</h2>
                <p className="text-sm text-[#8D93A1]">Manage your information</p>
              </div>
            </div>

            <div className="space-y-3">
              <Button
                variant="outline"
                className="w-full justify-start border-border bg-transparent text-[#C9CDD6] hover:bg-[#121214]"
              >
                <Download className="w-4 h-4 mr-2" />
                Export All Data
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start border-[#FF4D57]/30 bg-transparent text-[#FF4D57] hover:bg-[#FF4D57]/10"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Delete Account
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
