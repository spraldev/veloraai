"use client"

import { useState } from "react"
import { Mic, Camera, Link2, Upload } from "lucide-react"
import { useRouter } from "next/navigation"

const captureOptions = [
  { icon: Mic, label: "Record Audio", color: "#37E08D", action: "audio" },
  { icon: Camera, label: "Scan/Photo", color: "#FFC857", action: "photo" },
  { icon: Link2, label: "Paste Link", color: "#FF4D57", action: "link" },
  { icon: Upload, label: "Upload File", color: "#EB1F3A", action: "file" },
]

interface CaptureActionsProps {
  classes: Array<{ id: string; name: string }>
}

export function CaptureActions({ classes }: CaptureActionsProps) {
  const router = useRouter()
  const [uploading, setUploading] = useState(false)

  const getClassId = () => {
    if (classes.length === 0) {
      alert("Please create a class first before uploading materials")
      return null
    }
    if (classes.length === 1) {
      return classes[0].id
    }
    const classNames = classes.map((c, i) => `${i + 1}. ${c.name}`).join("\n")
    const choice = prompt(`Select class:\n${classNames}\n\nEnter number:`)
    const index = parseInt(choice || "0") - 1
    if (index >= 0 && index < classes.length) {
      return classes[index].id
    }
    return null
  }

  const handleAction = async (action: string) => {
    if (action === "audio") {
      const classId = getClassId()
      if (!classId) return
      
      const input = document.createElement("input")
      input.type = "file"
      input.accept = "audio/*"
      input.onchange = async (e) => {
        const file = (e.target as HTMLInputElement).files?.[0]
        if (!file) return
        
        setUploading(true)
        try {
          const formData = new FormData()
          formData.append("audio", file)
          formData.append("classId", classId)
          formData.append("title", file.name)
          
          const response = await fetch("/api/upload/audio", {
            method: "POST",
            body: formData,
          })
          
          if (response.ok) {
            alert("Audio uploaded successfully! Processing in background...")
            router.refresh()
          } else {
            const data = await response.json()
            alert(`Upload failed: ${data.error}`)
          }
        } catch (error) {
          console.error("Upload error:", error)
          alert("Upload failed. Please try again.")
        } finally {
          setUploading(false)
        }
      }
      input.click()
    } else if (action === "file") {
      const classId = getClassId()
      if (!classId) return
      
      const input = document.createElement("input")
      input.type = "file"
      input.accept = ".pdf,.txt,.doc,.docx"
      input.onchange = async (e) => {
        const file = (e.target as HTMLInputElement).files?.[0]
        if (!file) return
        
        setUploading(true)
        try {
          const text = await file.text()
          const response = await fetch("/api/upload/text", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              text,
              classId,
              title: file.name,
            }),
          })
          
          if (response.ok) {
            alert("File uploaded successfully! Processing in background...")
            router.refresh()
          } else {
            const data = await response.json()
            alert(`Upload failed: ${data.error}`)
          }
        } catch (error) {
          console.error("Upload error:", error)
          alert("Upload failed. Please try again.")
        } finally {
          setUploading(false)
        }
      }
      input.click()
    } else if (action === "link") {
      const classId = getClassId()
      if (!classId) return
      
      const url = prompt("Enter URL to capture:")
      if (!url) return
      
      setUploading(true)
      try {
        const response = await fetch("/api/upload/text", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            text: url,
            classId,
            title: url,
            type: "link",
          }),
        })
        
        if (response.ok) {
          alert("Link captured successfully! Processing in background...")
          router.refresh()
        } else {
          const data = await response.json()
          alert(`Upload failed: ${data.error}`)
        }
      } catch (error) {
        console.error("Upload error:", error)
        alert("Upload failed. Please try again.")
      } finally {
        setUploading(false)
      }
    } else if (action === "photo") {
      const input = document.createElement("input")
      input.type = "file"
      input.accept = "image/*"
      input.onchange = async (e) => {
        const file = (e.target as HTMLInputElement).files?.[0]
        if (!file) return
        alert("Photo OCR not yet implemented - coming soon!")
      }
      input.click()
    }
  }

  return (
    <div className="grid grid-cols-4 gap-2">
      {captureOptions.map((option) => {
        const Icon = option.icon
        return (
          <button
            key={option.label}
            onClick={() => handleAction(option.action)}
            disabled={uploading}
            className="flex flex-col items-center gap-1.5 p-3 rounded-xl bg-[#0A0A0C]/50 border border-border/50 hover:border-[#EB1F3A]/30 transition-all group disabled:opacity-50"
          >
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center transition-all group-hover:scale-110"
              style={{ backgroundColor: `${option.color}15` }}
            >
              <Icon className="w-4 h-4" style={{ color: option.color }} />
            </div>
            <span className="text-[10px] font-medium text-[#C9CDD6] text-center leading-tight">
              {option.label}
            </span>
          </button>
        )
      })}
    </div>
  )
}
