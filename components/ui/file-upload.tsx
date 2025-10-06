"use client"

import React, { useState } from "react"
import { Upload, Loader2 } from "lucide-react"

interface FileUploadProps {
  classId: string
  onUploadComplete?: (materialId: string) => void
  accept?: string
  uploadType: "audio" | "text"
}

export function FileUpload({ classId, onUploadComplete, accept, uploadType }: FileUploadProps) {
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    setError(null)

    try {
      const formData = new FormData()
      formData.append(uploadType, file)
      formData.append("classId", classId)
      formData.append("title", file.name)

      const response = await fetch(`/api/upload/${uploadType}`, {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        throw new Error("Upload failed")
      }

      const data = await response.json()
      onUploadComplete?.(data.materialId)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed")
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="relative">
      <input
        type="file"
        accept={accept}
        onChange={handleFileChange}
        disabled={uploading}
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
      />
      <div className="flex items-center gap-2 p-3 rounded-xl bg-[#0A0A0C]/50 border border-border/50 hover:border-[#EB1F3A]/30 transition-all">
        {uploading ? (
          <Loader2 className="w-5 h-5 text-[#EB1F3A] animate-spin" />
        ) : (
          <Upload className="w-5 h-5 text-[#EB1F3A]" />
        )}
        <span className="text-sm text-[#C9CDD6]">
          {uploading ? "Uploading..." : "Choose file"}
        </span>
      </div>
      {error && (
        <p className="mt-2 text-xs text-red-500">{error}</p>
      )}
    </div>
  )
}
