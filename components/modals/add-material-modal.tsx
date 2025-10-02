"use client"
import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Mic, Camera, Link2, Upload, X } from "lucide-react"
import { classes } from "@/lib/seed-data"
import { motion, AnimatePresence } from "framer-motion"

interface AddMaterialModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

const captureTypes = [
  { id: "audio", icon: Mic, label: "Record Audio", color: "#37E08D" },
  { id: "photo", icon: Camera, label: "Scan/Photo", color: "#FFC857" },
  { id: "link", icon: Link2, label: "Paste Link", color: "#FF4D57" },
  { id: "file", icon: Upload, label: "Upload File", color: "#EB1F3A" },
]

export function AddMaterialModal({ open, onOpenChange }: AddMaterialModalProps) {
  const [step, setStep] = useState<"type" | "class" | "tags">("type")
  const [selectedType, setSelectedType] = useState<string | null>(null)
  const [selectedClass, setSelectedClass] = useState<string | null>(null)
  const [tags, setTags] = useState<string[]>([])
  const [tagInput, setTagInput] = useState("")

  const suggestedTags = ["Cellular Respiration", "Derivatives", "Chapter 12", "Lab Report", "Quiz Prep"]

  const handleTypeSelect = (typeId: string) => {
    setSelectedType(typeId)
    setStep("class")
  }

  const handleClassSelect = (classId: string) => {
    setSelectedClass(classId)
    setStep("tags")
  }

  const addTag = (tag: string) => {
    if (tag && !tags.includes(tag)) {
      setTags([...tags, tag])
      setTagInput("")
    }
  }

  const removeTag = (tag: string) => {
    setTags(tags.filter((t) => t !== tag))
  }

  const handleSave = () => {
    // Save logic here
    onOpenChange(false)
    // Reset state
    setTimeout(() => {
      setStep("type")
      setSelectedType(null)
      setSelectedClass(null)
      setTags([])
    }, 300)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-[#151517] border-border max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-semibold">Add Material</DialogTitle>
        </DialogHeader>

        <AnimatePresence mode="wait">
          {step === "type" && (
            <motion.div
              key="type"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.2 }}
              className="space-y-4"
            >
              <p className="text-sm text-[#8D93A1]">Choose how you want to capture your material</p>
              <div className="grid grid-cols-2 gap-4">
                {captureTypes.map((type) => {
                  const Icon = type.icon
                  return (
                    <button
                      key={type.id}
                      onClick={() => handleTypeSelect(type.id)}
                      className="p-6 rounded-xl bg-[#0A0A0C]/50 border border-border/50 hover:border-[#EB1F3A]/30 transition-all group"
                    >
                      <div
                        className="w-12 h-12 rounded-full mx-auto mb-3 flex items-center justify-center transition-all group-hover:scale-110"
                        style={{ backgroundColor: `${type.color}15` }}
                      >
                        <Icon className="w-6 h-6" style={{ color: type.color }} />
                      </div>
                      <span className="text-sm font-medium text-[#F5F7FA]">{type.label}</span>
                    </button>
                  )
                })}
              </div>
            </motion.div>
          )}

          {step === "class" && (
            <motion.div
              key="class"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.2 }}
              className="space-y-4"
            >
              <p className="text-sm text-[#8D93A1]">Which class is this for?</p>
              <div className="space-y-2">
                {classes.map((classItem) => (
                  <button
                    key={classItem.id}
                    onClick={() => handleClassSelect(classItem.id)}
                    className="w-full p-4 rounded-xl bg-[#0A0A0C]/50 border border-border/50 hover:border-[#EB1F3A]/30 transition-all text-left flex items-center gap-3"
                  >
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: classItem.color }} />
                    <div className="flex-1">
                      <h4 className="text-sm font-semibold text-[#F5F7FA]">{classItem.name}</h4>
                      <p className="text-xs text-[#8D93A1]">{classItem.teacher}</p>
                    </div>
                  </button>
                ))}
              </div>
              <Button variant="ghost" onClick={() => setStep("type")} className="text-[#8D93A1]">
                Back
              </Button>
            </motion.div>
          )}

          {step === "tags" && (
            <motion.div
              key="tags"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.2 }}
              className="space-y-4"
            >
              <p className="text-sm text-[#8D93A1]">Add concept tags (optional)</p>

              {/* Selected tags */}
              {tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {tags.map((tag) => (
                    <Badge key={tag} className="bg-[#EB1F3A]/10 text-[#EB1F3A] border-0 pr-1">
                      {tag}
                      <button onClick={() => removeTag(tag)} className="ml-1 hover:opacity-70">
                        <X className="w-3 h-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              )}

              {/* Tag input */}
              <div className="flex gap-2">
                <input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault()
                      addTag(tagInput)
                    }
                  }}
                  placeholder="Type a concept..."
                  className="flex-1 px-4 py-2 rounded-lg bg-[#0A0A0C]/50 border border-border text-sm text-[#F5F7FA] placeholder:text-[#8D93A1] focus:outline-none focus:ring-2 focus:ring-[#EB1F3A]/35"
                />
                <Button onClick={() => addTag(tagInput)} className="bg-[#EB1F3A] hover:bg-[#FF4D57] text-white">
                  Add
                </Button>
              </div>

              {/* Suggested tags */}
              <div>
                <p className="text-xs text-[#8D93A1] mb-2">Suggested:</p>
                <div className="flex flex-wrap gap-2">
                  {suggestedTags
                    .filter((tag) => !tags.includes(tag))
                    .map((tag) => (
                      <button
                        key={tag}
                        onClick={() => addTag(tag)}
                        className="px-3 py-1.5 rounded-full text-xs bg-[#121214] text-[#8D93A1] hover:text-[#C9CDD6] hover:bg-[#1A1A1C] transition-all"
                      >
                        {tag}
                      </button>
                    ))}
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <Button variant="ghost" onClick={() => setStep("class")} className="text-[#8D93A1]">
                  Back
                </Button>
                <Button onClick={handleSave} className="flex-1 bg-[#EB1F3A] hover:bg-[#FF4D57] text-white">
                  Save Material
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  )
}
