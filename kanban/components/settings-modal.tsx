"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { X, Settings, Key, CheckCircle2, AlertCircle, Loader2, Eye, EyeOff } from "lucide-react"
import { validateGeminiKey, saveGeminiKey, getGeminiKey, removeGeminiKey } from "@/lib/gemini-ai"
import { cn } from "@/lib/utils"

interface SettingsModalProps {
  isOpen: boolean
  onClose: () => void
}

export function SettingsModal({ isOpen, onClose }: SettingsModalProps) {
  const [apiKey, setApiKey] = useState("")
  const [isValidating, setIsValidating] = useState(false)
  const [validationStatus, setValidationStatus] = useState<"idle" | "valid" | "invalid">("idle")
  const [showApiKey, setShowApiKey] = useState(false)
  const [hasExistingKey, setHasExistingKey] = useState(false)

  useEffect(() => {
    if (isOpen) {
      const existingKey = getGeminiKey()
      if (existingKey) {
        setApiKey(existingKey)
        setHasExistingKey(true)
        setValidationStatus("valid") // Assume existing key is valid
      } else {
        setApiKey("")
        setHasExistingKey(false)
        setValidationStatus("idle")
      }
    }
  }, [isOpen])

  const handleValidateKey = async () => {
    if (!apiKey.trim()) {
      setValidationStatus("invalid")
      return
    }

    setIsValidating(true)
    setValidationStatus("idle")

    try {
      const isValid = await validateGeminiKey(apiKey.trim())
      setValidationStatus(isValid ? "valid" : "invalid")
    } catch (error) {
      setValidationStatus("invalid")
    } finally {
      setIsValidating(false)
    }
  }

  const handleSaveKey = () => {
    if (validationStatus === "valid" && apiKey.trim()) {
      saveGeminiKey(apiKey.trim())
      setHasExistingKey(true)
      onClose()
    }
  }

  const handleRemoveKey = () => {
    removeGeminiKey()
    setApiKey("")
    setHasExistingKey(false)
    setValidationStatus("idle")
  }

  const handleClose = () => {
    // Reset form if no changes were saved
    if (!hasExistingKey) {
      setApiKey("")
      setValidationStatus("idle")
    }
    setShowApiKey(false)
    onClose()
  }

  const getStatusIcon = () => {
    if (isValidating) return <Loader2 className="h-4 w-4 animate-spin text-[#5B8EFF]" />
    if (validationStatus === "valid") return <CheckCircle2 className="h-4 w-4 text-green-400" />
    if (validationStatus === "invalid") return <AlertCircle className="h-4 w-4 text-red-400" />
    return null
  }

  const getStatusText = () => {
    if (isValidating) return "Validating API key..."
    if (validationStatus === "valid") return "API key is valid and working"
    if (validationStatus === "invalid") return "API key is invalid or not working"
    return "Enter your Gemini API key to enable AI features"
  }

  const getStatusColor = () => {
    if (isValidating) return "text-[#5B8EFF]"
    if (validationStatus === "valid") return "text-green-300"
    if (validationStatus === "invalid") return "text-red-300"
    return "text-white/60"
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
          "w-[90vw] max-w-lg bg-[#0B0E14]/95 backdrop-blur-[24px]",
          "border border-white/10 rounded-[18px] z-50 transition-all duration-150",
          "flex flex-col overflow-hidden",
          isOpen ? "scale-100 opacity-100" : "scale-95 opacity-0 pointer-events-none",
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-[#5B8EFF] to-[#4ADE80] rounded-lg flex items-center justify-center">
              <Settings className="h-4 w-4 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-white">Settings</h2>
              <p className="text-sm text-white/60">Configure your AI integration</p>
            </div>
          </div>

          <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover:bg-white/10" onClick={handleClose}>
            <X className="h-4 w-4 text-white/60" />
          </Button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Gemini API Key Section */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Key className="h-4 w-4 text-white/60" />
              <label className="text-sm font-medium text-white">Gemini API Key</label>
              {hasExistingKey && (
                <Badge variant="secondary" className="bg-green-500/20 text-green-300 text-xs">
                  Configured
                </Badge>
              )}
            </div>

            <div className="space-y-3">
              {/* API Key Input */}
              <div className="relative">
                <Input
                  type={showApiKey ? "text" : "password"}
                  placeholder="Enter your Gemini API key (AIza...)"
                  value={apiKey}
                  onChange={(e) => {
                    setApiKey(e.target.value)
                    setValidationStatus("idle")
                  }}
                  className="bg-white/5 border-white/10 text-white placeholder:text-white/40 pr-10"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0 hover:bg-white/10"
                  onClick={() => setShowApiKey(!showApiKey)}
                >
                  {showApiKey ? (
                    <EyeOff className="h-3 w-3 text-white/60" />
                  ) : (
                    <Eye className="h-3 w-3 text-white/60" />
                  )}
                </Button>
              </div>

              {/* Status */}
              <div className="flex items-center gap-2">
                {getStatusIcon()}
                <span className={cn("text-sm", getStatusColor())}>{getStatusText()}</span>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2">
                <Button
                  onClick={handleValidateKey}
                  disabled={!apiKey.trim() || isValidating}
                  variant="outline"
                  size="sm"
                  className="bg-white/5 border-white/20 text-white/80 hover:bg-white/10"
                >
                  {isValidating ? (
                    <>
                      <Loader2 className="h-3 w-3 mr-2 animate-spin" />
                      Testing...
                    </>
                  ) : (
                    "Test Key"
                  )}
                </Button>

                {hasExistingKey && (
                  <Button
                    onClick={handleRemoveKey}
                    variant="outline"
                    size="sm"
                    className="bg-red-500/10 border-red-500/20 text-red-300 hover:bg-red-500/20"
                  >
                    Remove Key
                  </Button>
                )}
              </div>
            </div>

            {/* Help Text */}
            <div className="mt-4 p-4 bg-white/5 rounded-lg">
              <p className="text-xs text-white/70 mb-2">
                <strong>How to get your Gemini API key:</strong>
              </p>
              <ol className="text-xs text-white/60 space-y-1 list-decimal list-inside">
                <li>
                  Visit <span className="text-[#5B8EFF]">https://makersuite.google.com/app/apikey</span>
                </li>
                <li>Sign in with your Google account</li>
                <li>Click &quot;Create API Key&quot;</li>
                <li>Copy the key and paste it above</li>
              </ol>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 p-6 border-t border-white/10">
          <Button variant="ghost" onClick={handleClose} className="hover:bg-white/10 text-white/80">
            Cancel
          </Button>
          <Button
            onClick={handleSaveKey}
            disabled={validationStatus !== "valid"}
            className="bg-[#5B8EFF] hover:bg-[#5B8EFF]/80 text-white"
          >
            <CheckCircle2 className="h-4 w-4 mr-2" />
            Save Settings
          </Button>
        </div>
      </div>
    </>
  )
}
