"use client"

import { motion } from "framer-motion"

export function RubyLogo({ className = "" }: { className?: string }) {
  return (
    <div className={`relative ${className}`}>
      <svg
        width="32"
        height="32"
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="relative z-10"
      >
        {/* Main ruby facets */}
        <defs>
          <linearGradient id="rubyGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#A5082B" />
            <stop offset="50%" stopColor="#EB1F3A" />
            <stop offset="100%" stopColor="#FF4D57" />
          </linearGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="2" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Low-poly gem structure */}
        <g filter="url(#glow)">
          {/* Top facet */}
          <path d="M16 4 L24 12 L16 10 L8 12 Z" fill="url(#rubyGradient)" opacity="0.9" />
          {/* Left facet */}
          <path d="M8 12 L16 10 L16 28 L6 20 Z" fill="url(#rubyGradient)" opacity="0.7" />
          {/* Right facet */}
          <path d="M24 12 L16 10 L16 28 L26 20 Z" fill="url(#rubyGradient)" opacity="0.8" />
          {/* Bottom left */}
          <path d="M6 20 L16 28 L12 24 Z" fill="#A5082B" opacity="0.9" />
          {/* Bottom right */}
          <path d="M26 20 L16 28 L20 24 Z" fill="#A5082B" opacity="0.9" />
          {/* Highlight facets */}
          <path d="M16 4 L20 8 L16 10 Z" fill="#FF8FA1" opacity="0.4" />
          <path d="M16 10 L18 14 L16 16 Z" fill="#FF8FA1" opacity="0.3" />
        </g>
      </svg>

      {/* Sparkle particles */}
      {[...Array(3)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 rounded-full bg-white"
          style={{
            top: "50%",
            left: "50%",
          }}
          animate={{
            x: [0, Math.cos((i * 120 * Math.PI) / 180) * 20, 0],
            y: [0, Math.sin((i * 120 * Math.PI) / 180) * 20, 0],
            opacity: [0, 1, 0],
            scale: [0, 1, 0],
          }}
          transition={{
            duration: 3,
            repeat: Number.POSITIVE_INFINITY,
            delay: i * 0.8 + 2,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  )
}
