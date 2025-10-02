"use client"

import { useState } from "react"
import { Search, Plus, Bell } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { AddMaterialModal } from "./modals/add-material-modal"

export function TopBar() {
  const [addMaterialOpen, setAddMaterialOpen] = useState(false)

  return (
    <>
      <header className="fixed top-0 left-[280px] right-0 h-16 glass-dark border-b border-border/50 ruby-radial z-40">
        <div className="h-full px-6 flex items-center justify-between">
          {/* Search */}
          <div className="flex-1 max-w-md">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8D93A1]" />
              <input
                type="text"
                placeholder="Search... (⌘K)"
                className="w-full h-10 pl-10 pr-4 bg-[#151517] border border-border rounded-lg text-sm text-[#F5F7FA] placeholder:text-[#8D93A1] focus:outline-none focus:ring-2 focus:ring-[#EB1F3A]/35"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3">
            <Button
              onClick={() => setAddMaterialOpen(true)}
              className="bg-[#EB1F3A] hover:bg-[#FF4D57] text-white font-medium"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Material
            </Button>

            <button className="relative p-2 hover:bg-[#151517] rounded-lg transition-colors">
              <Bell className="w-5 h-5 text-[#C9CDD6]" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#EB1F3A] rounded-full" />
            </button>

            <Avatar className="w-8 h-8 border border-border">
              <AvatarImage src="/placeholder.svg?height=32&width=32" />
              <AvatarFallback className="bg-[#151517] text-[#C9CDD6] text-xs">JD</AvatarFallback>
            </Avatar>
          </div>
        </div>
      </header>

      <AddMaterialModal open={addMaterialOpen} onOpenChange={setAddMaterialOpen} />
    </>
  )
}
