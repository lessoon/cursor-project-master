"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { X, Sparkles, Loader2, CheckCircle2, AlertCircle } from "lucide-react"
import { generateTasksFromRequirement, getGeminiKey } from "@/lib/gemini-ai"
import type { CPMTask } from "@/types/cmp"
import { cn } from "@/lib/utils"

interface CreateTaskModalProps {
  isOpen: boolean
  onClose: () => void
  onCreateTask: (task: Omit<CPMTask, "id" | "status" | "createdAt" | "updatedAt" | "filePath">) => void
}

export function CreateTaskModal({ isOpen, onClose, onCreateTask }: CreateTaskModalProps) {
  const [requirement, setRequirement] = useState("")
  const [language, setLanguage] = useState("en")
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedTask, setGeneratedTask] = useState<any>(null)
  const [error, setError] = useState("")
  const [step, setStep] = useState<"input" | "preview">("input")

  const hasGeminiKey = !!getGeminiKey()

  const handleGenerate = async () => {
    if (!requirement.trim()) {
      setError("Please enter a feature requirement")
      return
    }

    if (!hasGeminiKey) {
      setError("Please set your Gemini API key in settings first")
      return
    }

    setIsGenerating(true)
    setError("")

    try {
      const taskData = await generateTasksFromRequirement(requirement, language)
      setGeneratedTask(taskData)
      setStep("preview")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to generate task")
    } finally {
      setIsGenerating(false)
    }
  }

  const handleCreateTask = () => {
    if (!generatedTask) return

    const newTask = {
      title: generatedTask.title,
      summary: generatedTask.summary,
      description: generatedTask.description,
      labels: generatedTask.labels,
      checklist: generatedTask.checklist,
      progress: 0,
    }

    onCreateTask(newTask)
    handleClose()
  }

  const handleClose = () => {
    setRequirement("")
    setGeneratedTask(null)
    setError("")
    setStep("input")
    onClose()
  }

  const handleBack = () => {
    setStep("input")
    setGeneratedTask(null)
    setError("")
  }

  if (!isOpen) return null

  return (
    <>
      {/* Backdrop */}
      <div
        className={cn(
          "fixed inset-0 bg-black/60 backdrop-blur-sm z-50 transition-opacity duration-150",
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none",
        )}
        onClick={handleClose}
      />

      {/* Modal */}
      <div
        className={cn(
          "fixed left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2",
          "w-[90vw] max-w-2xl max-h-[80vh] bg-[#0B0E14]/95 backdrop-blur-[24px]",
          "border border-white/10 rounded-[18px] z-50 transition-all duration-150",
          "flex flex-col overflow-hidden",
          isOpen ? "scale-100 opacity-100" : "scale-95 opacity-0 pointer-events-none",
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-[#5B8EFF] to-[#4ADE80] rounded-lg flex items-center justify-center">
              <Sparkles className="h-4 w-4 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-white">
                {step === "input" ? "Create New Task" : "Review Generated Task"}
              </h2>
              <p className="text-sm text-white/60">
                {step === "input"
                  ? "Describe your feature and AI will create a structured task"
                  : "Review and customize your AI-generated task"}
              </p>
            </div>
          </div>

          <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover:bg-white/10" onClick={handleClose}>
            <X className="h-4 w-4 text-white/60" />
          </Button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {step === "input" ? (
            <div className="space-y-6">
              {/* Requirement Input */}
              <div>
                <label className="block text-sm font-medium text-white mb-2">Feature Requirement *</label>
                <Textarea
                  placeholder="Describe the feature you want to build. For example: 'I need a user authentication system with Google OAuth, password reset, and session management. Users should be able to sign up, log in, and manage their profiles.'"
                  value={requirement}
                  onChange={(e) => setRequirement(e.target.value)}
                  className="min-h-[120px] bg-white/5 border-white/10 text-white placeholder:text-white/40 resize-none"
                  disabled={isGenerating}
                />
                <p className="text-xs text-white/50 mt-1">
                  Be specific about what you want to build, including key features and requirements.
                </p>
              </div>

              {/* Language Selection */}
              <div>
                <label className="block text-sm font-medium text-white mb-2">Response Language</label>
                <RadioGroup
                  defaultValue="en"
                  onValueChange={setLanguage}
                  className="flex items-center gap-6"
                  disabled={isGenerating}
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="en" id="lang-en" className="text-white border-white/20" />
                    <Label htmlFor="lang-en" className="text-white/80">English</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="zh" id="lang-zh" className="text-white border-white/20" />
                    <Label htmlFor="lang-zh" className="text-white/80">中文</Label>
                  </div>
                </RadioGroup>
              </div>

              {/* API Key Warning */}
              {!hasGeminiKey && (
                <div className="flex items-center gap-3 p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                  <AlertCircle className="h-5 w-5 text-yellow-400 flex-shrink-0" />
                  <div>
                    <p className="text-sm text-yellow-200 font-medium">Gemini API Key Required</p>
                    <p className="text-xs text-yellow-300/80">
                      Please set your Gemini API key in settings to use AI task generation.
                    </p>
                  </div>
                </div>
              )}

              {/* Error Message */}
              {error && (
                <div className="flex items-center gap-3 p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
                  <AlertCircle className="h-5 w-5 text-red-400 flex-shrink-0" />
                  <p className="text-sm text-red-200">{error}</p>
                </div>
              )}

              {/* Generate Button */}
              <Button
                onClick={handleGenerate}
                disabled={isGenerating || !requirement.trim() || !hasGeminiKey}
                className="w-full bg-[#5B8EFF] hover:bg-[#5B8EFF]/80 text-white"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Generating Task...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4 mr-2" />
                    Generate Task with AI
                  </>
                )}
              </Button>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Generated Task Preview */}
              {generatedTask && (
                <>
                  {/* Title and Summary */}
                  <div>
                    <label className="block text-sm font-medium text-white mb-2">Title</label>
                    <Input
                      value={generatedTask.title}
                      onChange={(e) => setGeneratedTask({ ...generatedTask, title: e.target.value })}
                      className="bg-white/5 border-white/10 text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-white mb-2">Summary</label>
                    <Input
                      value={generatedTask.summary}
                      onChange={(e) => setGeneratedTask({ ...generatedTask, summary: e.target.value })}
                      className="bg-white/5 border-white/10 text-white"
                    />
                  </div>

                  {/* Description */}
                  <div>
                    <label className="block text-sm font-medium text-white mb-2">Description</label>
                    <Textarea
                      value={generatedTask.description}
                      onChange={(e) => setGeneratedTask({ ...generatedTask, description: e.target.value })}
                      className="min-h-[100px] bg-white/5 border-white/10 text-white resize-none"
                    />
                  </div>

                  {/* Labels */}
                  <div>
                    <label className="block text-sm font-medium text-white mb-2">Labels</label>
                    <div className="flex gap-2 flex-wrap">
                      {generatedTask.labels.map((label: string, index: number) => (
                        <Badge key={index} variant="secondary" className="bg-white/10 text-white/80">
                          {label}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Checklist */}
                  <div>
                    <label className="block text-sm font-medium text-white mb-2">
                      Checklist ({generatedTask.checklist.length} items)
                    </label>
                    <div className="space-y-2">
                      {generatedTask.checklist.map((item: any, index: number) => (
                        <div key={index} className="flex items-center gap-3 p-3 bg-white/5 rounded-lg">
                          <CheckCircle2 className="h-4 w-4 text-white/40" />
                          <span className="text-sm text-white/80">{item.text}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}

              {/* Action Buttons */}
              <div className="flex gap-3">
                <Button variant="ghost" onClick={handleBack} className="flex-1 hover:bg-white/10 text-white/80">
                  Back to Edit
                </Button>
                <Button onClick={handleCreateTask} className="flex-1 bg-[#4ADE80] hover:bg-[#4ADE80]/80 text-white">
                  <CheckCircle2 className="h-4 w-4 mr-2" />
                  Create Task
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  )
}
