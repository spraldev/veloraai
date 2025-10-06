"use client"

import { motion } from "framer-motion"
import { CaptureActions } from "./capture-actions"

interface CaptureCardProps {
  classes: Array<{ id: string; name: string }>
}

export function CaptureCard({ classes }: CaptureCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 4, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.3, delay: 0.3 }}
      className="p-5 rounded-2xl bg-[#151517] border border-border shadow-gem"
    >
      <h3 className="text-base font-semibold mb-3">Capture</h3>
      <CaptureActions classes={classes} />
    </motion.div>
  )
}
