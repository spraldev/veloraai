"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { RubyLogo } from "@/components/ruby-logo"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronRight, ChevronLeft, Check, Plus } from "lucide-react"

const STEPS = [
  { id: 1, title: "Welcome to Velora", subtitle: "Your AI study teammate" },
  { id: 2, title: "Connect Google Classroom", subtitle: "Sync your courses and assignments" },
  { id: 3, title: "Create Class Helpers", subtitle: "AI assistants for each subject" },
  { id: 4, title: "Add Study Materials", subtitle: "Upload notes, audio, or links (optional)" },
  { id: 5, title: "Study Preferences", subtitle: "Customize your study blocks" },
  { id: 6, title: "Enable Notifications", subtitle: "Stay on track with timely reminders" },
  { id: 7, title: "You're All Set!", subtitle: "Start studying smarter" },
]

export default function OnboardingPage() {
  const [currentStep, setCurrentStep] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const [formData, setFormData] = useState({
    googleClassroomConnected: false,
    classes: [] as Array<{ name: string; teacher: string; color: string }>,
    focusBlockLength: 25,
    breakLength: 5,
    latestFinishTime: "22:00",
    notificationsEnabled: false,
  })

  const handleNext = async () => {
    if (currentStep === 7) {
      setIsLoading(true)
      try {
        const response = await fetch("/api/onboarding/complete", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        })
        
        if (response.ok) {
          router.push("/")
          router.refresh()
        }
      } catch (error) {
        console.error("Error completing onboarding:", error)
      } finally {
        setIsLoading(false)
      }
    } else {
      setCurrentStep((prev) => prev + 1)
    }
  }

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1)
    }
  }

  const handleSkip = () => {
    handleNext()
  }

  const connectGoogleClassroom = async () => {
    setIsLoading(true)
    try {
      window.location.href = "/api/classroom/connect"
    } catch (error) {
      console.error("Error connecting Google Classroom:", error)
      setIsLoading(false)
    }
  }

  const addDemoClass = () => {
    const demoClasses = [
      { name: "AP Biology", teacher: "Ms. Johnson", color: "#10B981" },
      { name: "AP Calculus AB", teacher: "Mr. Smith", color: "#3B82F6" },
      { name: "English Literature", teacher: "Mrs. Davis", color: "#8B5CF6" },
    ]
    setFormData((prev) => ({
      ...prev,
      classes: demoClasses,
    }))
  }

  const requestNotifications = async () => {
    if ("Notification" in window && "serviceWorker" in navigator) {
      const permission = await Notification.requestPermission()
      setFormData((prev) => ({
        ...prev,
        notificationsEnabled: permission === "granted",
      }))
    }
  }

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="text-center space-y-6">
            <div className="mx-auto w-20 h-20 flex items-center justify-center mb-6">
              <RubyLogo />
            </div>
            <div>
              <h2 className="text-3xl font-bold mb-3">Welcome to Velora</h2>
              <p className="text-[#8D93A1] text-lg">
                Your AI study teammate that turns class materials into personalized study plans and practice
              </p>
            </div>
            <div className="bg-[#1A1A1E] rounded-lg p-6 space-y-3 text-left">
              <div className="flex items-start gap-3">
                <Check className="w-5 h-5 text-[#EB1F3A] shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium">Daily Study Briefs</p>
                  <p className="text-sm text-[#8D93A1]">Prioritized plans based on your schedule</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Check className="w-5 h-5 text-[#EB1F3A] shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium">Smart Practice</p>
                  <p className="text-sm text-[#8D93A1]">Retrieval quizzes that boost retention</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Check className="w-5 h-5 text-[#EB1F3A] shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium">Class Helpers</p>
                  <p className="text-sm text-[#8D93A1]">AI assistants specialized for each subject</p>
                </div>
              </div>
            </div>
          </div>
        )

      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-2">Connect Google Classroom</h2>
              <p className="text-[#8D93A1]">
                Velora will sync your courses, assignments, and materials
              </p>
            </div>
            <div className="bg-[#1A1A1E] rounded-lg p-6 space-y-4">
              <div className="flex items-center gap-3 text-sm text-[#8D93A1]">
                <Check className="w-4 h-4 text-[#10B981]" />
                <span>Read your course list</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-[#8D93A1]">
                <Check className="w-4 h-4 text-[#10B981]" />
                <span>View assignments and due dates</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-[#8D93A1]">
                <Check className="w-4 h-4 text-[#10B981]" />
                <span>Access shared materials</span>
              </div>
            </div>
            <Button
              onClick={connectGoogleClassroom}
              disabled={isLoading}
              className="w-full bg-white hover:bg-gray-100 text-gray-900 font-medium py-6"
            >
              <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
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
              {isLoading ? "Connecting..." : "Connect Google Classroom"}
            </Button>
            <Button
              onClick={handleSkip}
              variant="ghost"
              className="w-full text-[#8D93A1] hover:text-white"
            >
              Skip for now
            </Button>
          </div>
        )

      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-2">Create Class Helpers</h2>
              <p className="text-[#8D93A1]">
                Specialized AI assistants for each of your classes
              </p>
            </div>
            {formData.classes.length === 0 ? (
              <div className="bg-[#1A1A1E] rounded-lg p-8 text-center space-y-4">
                <p className="text-[#8D93A1]">No classes yet</p>
                <Button
                  onClick={addDemoClass}
                  variant="outline"
                  className="border-[#2A2A2E]"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Demo Classes
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                {formData.classes.map((cls, idx) => (
                  <div
                    key={idx}
                    className="bg-[#1A1A1E] rounded-lg p-4 flex items-center gap-4"
                  >
                    <div
                      className="w-12 h-12 rounded-full flex items-center justify-center text-white font-semibold"
                      style={{ backgroundColor: cls.color }}
                    >
                      {cls.name.charAt(0)}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">{cls.name}</p>
                      <p className="text-sm text-[#8D93A1]">{cls.teacher}</p>
                    </div>
                    <Check className="w-5 h-5 text-[#10B981]" />
                  </div>
                ))}
              </div>
            )}
            <p className="text-xs text-[#8D93A1] text-center">
              You can add or modify classes later in Settings
            </p>
          </div>
        )

      case 4:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-2">Add Study Materials</h2>
              <p className="text-[#8D93A1]">
                Upload notes, audio recordings, or links (optional)
              </p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <button className="bg-[#1A1A1E] rounded-lg p-6 hover:bg-[#2A2A2E] transition-colors text-left">
                <div className="w-10 h-10 rounded-full bg-[#EB1F3A]/10 flex items-center justify-center mb-3">
                  <svg className="w-5 h-5 text-[#EB1F3A]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                  </svg>
                </div>
                <p className="font-medium text-sm">Record Audio</p>
                <p className="text-xs text-[#8D93A1] mt-1">Class lectures</p>
              </button>
              <button className="bg-[#1A1A1E] rounded-lg p-6 hover:bg-[#2A2A2E] transition-colors text-left">
                <div className="w-10 h-10 rounded-full bg-[#3B82F6]/10 flex items-center justify-center mb-3">
                  <svg className="w-5 h-5 text-[#3B82F6]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                </div>
                <p className="font-medium text-sm">Upload Files</p>
                <p className="text-xs text-[#8D93A1] mt-1">PDFs, images</p>
              </button>
              <button className="bg-[#1A1A1E] rounded-lg p-6 hover:bg-[#2A2A2E] transition-colors text-left">
                <div className="w-10 h-10 rounded-full bg-[#10B981]/10 flex items-center justify-center mb-3">
                  <svg className="w-5 h-5 text-[#10B981]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                  </svg>
                </div>
                <p className="font-medium text-sm">Paste Link</p>
                <p className="text-xs text-[#8D93A1] mt-1">YouTube, web</p>
              </button>
              <button className="bg-[#1A1A1E] rounded-lg p-6 hover:bg-[#2A2A2E] transition-colors text-left">
                <div className="w-10 h-10 rounded-full bg-[#8B5CF6]/10 flex items-center justify-center mb-3">
                  <svg className="w-5 h-5 text-[#8B5CF6]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <p className="font-medium text-sm">Type Notes</p>
                <p className="text-xs text-[#8D93A1] mt-1">Manual entry</p>
              </button>
            </div>
            <p className="text-xs text-[#8D93A1] text-center">
              You can add materials anytime from the dashboard
            </p>
          </div>
        )

      case 5:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-2">Study Preferences</h2>
              <p className="text-[#8D93A1]">
                Customize how Velora plans your study sessions
              </p>
            </div>
            <div className="space-y-4">
              <div className="bg-[#1A1A1E] rounded-lg p-4">
                <label className="block text-sm font-medium mb-2">Focus Block Length</label>
                <div className="flex items-center gap-4">
                  <input
                    type="range"
                    min="15"
                    max="60"
                    step="5"
                    value={formData.focusBlockLength}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        focusBlockLength: parseInt(e.target.value),
                      }))
                    }
                    className="flex-1"
                  />
                  <span className="text-[#EB1F3A] font-semibold w-16 text-right">
                    {formData.focusBlockLength} min
                  </span>
                </div>
              </div>
              <div className="bg-[#1A1A1E] rounded-lg p-4">
                <label className="block text-sm font-medium mb-2">Break Length</label>
                <div className="flex items-center gap-4">
                  <input
                    type="range"
                    min="5"
                    max="15"
                    step="5"
                    value={formData.breakLength}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        breakLength: parseInt(e.target.value),
                      }))
                    }
                    className="flex-1"
                  />
                  <span className="text-[#EB1F3A] font-semibold w-16 text-right">
                    {formData.breakLength} min
                  </span>
                </div>
              </div>
              <div className="bg-[#1A1A1E] rounded-lg p-4">
                <label className="block text-sm font-medium mb-2">Latest Study Time</label>
                <Input
                  type="time"
                  value={formData.latestFinishTime}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      latestFinishTime: e.target.value,
                    }))
                  }
                  className="bg-[#0A0A0C] border-[#2A2A2E]"
                />
                <p className="text-xs text-[#8D93A1] mt-2">
                  Velora won't schedule study blocks after this time on school nights
                </p>
              </div>
            </div>
          </div>
        )

      case 6:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-2">Enable Notifications</h2>
              <p className="text-[#8D93A1]">
                Stay on track with timely study reminders
              </p>
            </div>
            <div className="bg-[#1A1A1E] rounded-lg p-6 space-y-4">
              <div className="flex items-start gap-3">
                <Check className="w-5 h-5 text-[#EB1F3A] shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium">Daily Study Brief</p>
                  <p className="text-sm text-[#8D93A1]">Your plan for the day</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Check className="w-5 h-5 text-[#EB1F3A] shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium">Critical Alerts</p>
                  <p className="text-sm text-[#8D93A1]">Quiz or test tomorrow</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Check className="w-5 h-5 text-[#EB1F3A] shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium">Gentle Nudges</p>
                  <p className="text-sm text-[#8D93A1]">Break reminders during focus</p>
                </div>
              </div>
            </div>
            {formData.notificationsEnabled ? (
              <div className="bg-[#10B981]/10 border border-[#10B981]/20 rounded-lg p-4 flex items-center gap-3">
                <Check className="w-5 h-5 text-[#10B981]" />
                <p className="text-sm text-[#10B981]">Notifications enabled</p>
              </div>
            ) : (
              <Button
                onClick={requestNotifications}
                className="w-full bg-[#EB1F3A] hover:bg-[#C91830] text-white font-medium py-6"
              >
                Enable Notifications
              </Button>
            )}
            <Button
              onClick={handleSkip}
              variant="ghost"
              className="w-full text-[#8D93A1] hover:text-white"
            >
              Skip for now
            </Button>
          </div>
        )

      case 7:
        return (
          <div className="text-center space-y-6">
            <div className="mx-auto w-20 h-20 flex items-center justify-center mb-6">
              <div className="w-20 h-20 rounded-full bg-[#10B981]/10 flex items-center justify-center">
                <Check className="w-10 h-10 text-[#10B981]" />
              </div>
            </div>
            <div>
              <h2 className="text-3xl font-bold mb-3">You're All Set!</h2>
              <p className="text-[#8D93A1] text-lg">
                Velora and your class Helpers are ready to help you study smarter
              </p>
            </div>
            <div className="bg-[#1A1A1E] rounded-lg p-6 space-y-3 text-left">
              <p className="font-medium text-sm text-[#8D93A1] uppercase tracking-wide">
                Try asking Velora:
              </p>
              <div className="space-y-2">
                <div className="bg-[#0A0A0C] rounded-lg p-3 text-sm">
                  "Plan today"
                </div>
                <div className="bg-[#0A0A0C] rounded-lg p-3 text-sm">
                  "Generate mixed practice"
                </div>
                <div className="bg-[#0A0A0C] rounded-lg p-3 text-sm">
                  "What's due this week?"
                </div>
              </div>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-[#0A0A0C] flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        {/* Progress bar */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-[#8D93A1]">
              Step {currentStep} of {STEPS.length}
            </span>
            <span className="text-sm text-[#8D93A1]">
              {Math.round((currentStep / STEPS.length) * 100)}%
            </span>
          </div>
          <div className="h-2 bg-[#1A1A1E] rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-[#EB1F3A]"
              initial={{ width: 0 }}
              animate={{ width: `${(currentStep / STEPS.length) * 100}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>

        {/* Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="bg-[#0A0A0C] rounded-lg p-8"
          >
            {renderStepContent()}
          </motion.div>
        </AnimatePresence>

        {/* Navigation */}
        <div className="flex items-center justify-between mt-8">
          <Button
            onClick={handleBack}
            variant="ghost"
            disabled={currentStep === 1}
            className="text-[#8D93A1] hover:text-white"
          >
            <ChevronLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <Button
            onClick={handleNext}
            disabled={isLoading}
            className="bg-[#EB1F3A] hover:bg-[#C91830] text-white font-medium"
          >
            {isLoading ? "Loading..." : currentStep === 7 ? "Get Started" : "Continue"}
            <ChevronRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>
    </div>
  )
}
