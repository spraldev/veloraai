"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Send, Paperclip, Mic, ImageIcon, LinkIcon, FileText } from "lucide-react"
import { Button } from "@/components/ui/button"

interface ChatComposerProps {
  onSend: (message: string) => void
  placeholder?: string
  quickChips?: { label: string; action: string }[]
}

export function ChatComposer({ onSend, placeholder = "Ask anything...", quickChips }: ChatComposerProps) {
  const [message, setMessage] = useState("")
  const [showAttachMenu, setShowAttachMenu] = useState(false)

  const handleSend = () => {
    if (message.trim()) {
      onSend(message)
      setMessage("")
    }
  }

  const attachOptions = [
    { icon: Mic, label: "Record Audio", color: "text-accent" },
    { icon: ImageIcon, label: "Photo/Scan", color: "text-success" },
    { icon: LinkIcon, label: "Paste Link", color: "text-blue-400" },
    { icon: FileText, label: "Upload File", color: "text-warning" },
  ]

  return (
    <div className="flex flex-col gap-3">
      {/* Quick chips */}
      {quickChips && quickChips.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {quickChips.map((chip, i) => (
            <button
              key={i}
              onClick={() => onSend(chip.label)}
              className="px-3 py-1.5 rounded-full bg-card border border-border text-xs text-text-med hover:border-accent/50 hover:text-text-hi transition-colors"
            >
              {chip.label}
            </button>
          ))}
        </div>
      )}

      {/* Composer */}
      <div className="relative flex items-end gap-2 p-3 rounded-2xl bg-card border border-border focus-within:border-accent/50 transition-colors">
        <div className="relative">
          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9 text-text-dim hover:text-accent"
            onClick={() => setShowAttachMenu(!showAttachMenu)}
          >
            <Paperclip className="w-4 h-4" />
          </Button>

          {/* Attach menu */}
          {showAttachMenu && (
            <motion.div
              initial={{ opacity: 0, y: 8, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              className="absolute bottom-full left-0 mb-2 p-2 rounded-xl bg-elev border border-border shadow-lg min-w-[160px]"
            >
              {attachOptions.map((option, i) => (
                <button
                  key={i}
                  className="flex items-center gap-3 w-full px-3 py-2 rounded-lg hover:bg-card transition-colors text-left"
                  onClick={() => setShowAttachMenu(false)}
                >
                  <option.icon className={`w-4 h-4 ${option.color}`} />
                  <span className="text-sm text-text-med">{option.label}</span>
                </button>
              ))}
            </motion.div>
          )}
        </div>

        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault()
              handleSend()
            }
          }}
          placeholder={placeholder}
          rows={1}
          className="flex-1 bg-transparent text-sm text-text-hi placeholder:text-text-dim resize-none outline-none max-h-32"
        />

        <Button
          size="icon"
          className="h-9 w-9 bg-accent hover:bg-accent-2 text-white shrink-0"
          onClick={handleSend}
          disabled={!message.trim()}
        >
          <Send className="w-4 h-4" />
        </Button>
      </div>
    </div>
  )
}
