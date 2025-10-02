"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { RubyLogo } from "./ruby-logo"
import { LayoutDashboard, BookOpen, GraduationCap, Target, Calendar, Settings, Plus } from "lucide-react"
import { AgentAvatar } from "./chat/agent-avatar"
import { agents } from "@/lib/agent-data"
import { Button } from "./ui/button"

const navItems = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/brief", label: "Study Brief", icon: BookOpen },
  { href: "/classes", label: "Classes", icon: GraduationCap },
  { href: "/practice", label: "Practice", icon: Target },
  { href: "/calendar", label: "Calendar", icon: Calendar },
  { href: "/settings", label: "Settings", icon: Settings },
]

export function Sidebar() {
  const pathname = usePathname()

  const velora = agents.find((a) => a.type === "velora")
  const helpers = agents.filter((a) => a.type === "helper")

  return (
    <aside className="fixed left-0 top-0 h-screen w-[280px] border-r border-border bg-[#0A0A0C] flex flex-col">
      {/* Logo */}
      <div className="flex items-center gap-3 px-6 py-6 border-b border-border">
        <RubyLogo />
        <span className="text-xl font-semibold tracking-tight">Velora</span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-6 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = pathname === item.href
          const Icon = item.icon

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`
                flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium
                transition-all duration-200 relative
                ${isActive ? "text-[#F5F7FA] bg-[#151517]" : "text-[#8D93A1] hover:text-[#C9CDD6] hover:bg-[#121214]"}
              `}
            >
              {isActive && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-8 bg-[#EB1F3A] rounded-r" />
              )}
              <Icon className="w-5 h-5" />
              <span>{item.label}</span>
              {isActive && (
                <div className="absolute inset-0 rounded-lg shadow-[0_0_20px_rgba(235,31,58,0.15)] pointer-events-none" />
              )}
            </Link>
          )
        })}

        <div className="pt-6 mt-6 border-t border-border">
          <div className="flex items-center justify-between px-3 mb-3">
            <h3 className="text-xs font-semibold text-text-dim uppercase tracking-wider">Helpers</h3>
            <Button variant="ghost" size="icon" className="h-6 w-6 text-text-dim hover:text-accent hover:bg-accent/10">
              <Plus className="w-4 h-4" />
            </Button>
          </div>

          {/* Velora main assistant */}
          {velora && (
            <Link
              href="/"
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-200 hover:bg-[#121214] group"
            >
              <AgentAvatar agent={velora} size="sm" showStatus />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-text-med group-hover:text-text-hi truncate">{velora.name}</p>
                <p className="text-xs text-text-dim truncate">Main Assistant</p>
              </div>
            </Link>
          )}

          {/* Class helpers */}
          <div className="mt-2 space-y-1">
            {helpers.map((helper) => (
              <Link
                key={helper.id}
                href={`/classes/${helper.classId}`}
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-200 hover:bg-[#121214] group"
              >
                <AgentAvatar agent={helper} size="sm" showStatus />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-text-med group-hover:text-text-hi truncate">{helper.name}</p>
                  <p className="text-xs text-text-dim truncate">{helper.className}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </nav>
    </aside>
  )
}
