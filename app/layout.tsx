import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"
import { Sidebar } from "@/components/sidebar"
import { TopBar } from "@/components/top-bar"
import { Suspense } from "react"

export const metadata: Metadata = {
  title: "Velora - AI Study Management",
  description: "Your intelligent study companion",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable}`}>
        <Suspense fallback={<div>Loading...</div>}>
          <Sidebar />
          <TopBar />
          <main className="ml-[280px] mt-16 min-h-screen">{children}</main>
        </Suspense>
        <Analytics />
      </body>
    </html>
  )
}
