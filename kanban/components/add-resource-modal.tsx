"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { X, Upload, FileText, AlertCircle, CheckCircle2 } from "lucide-react"
import { extractTitle } from "@/lib/markdown-utils"
import { cn } from "@/lib/utils"

interface AddResourceModalProps {
  isOpen: boolean
  onClose: () => void
  onAddResource: (resource: {
    name: string
    content: string
    type: string
  }) => void
}

export function AddResourceModal({ isOpen, onClose, onAddResource }: AddResourceModalProps) {
  const [dragActive, setDragActive] = useState(false)
  const [file, setFile] = useState<File | null>(null)
  const [content, setContent] = useState("")
  const [customName, setCustomName] = useState("")
  const [error, setError] = useState("")
  const [uploadMethod, setUploadMethod] = useState<"file" | "text">("file")
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    const files = e.dataTransfer.files
    if (files && files[0]) {
      handleFileSelect(files[0])
    }
  }

  const handleFileSelect = (selectedFile: File) => {
    const validTypes = [".md", ".txt", ".markdown"]
    const fileExtension = "." + selectedFile.name.split(".").pop()?.toLowerCase()

    if (!validTypes.includes(fileExtension)) {
      setError("Please select a markdown (.md) or text (.txt) file")
      return
    }

    if (selectedFile.size > 5 * 1024 * 1024) {
      // 5MB limit
      setError("File size must be less than 5MB")
      return
    }

    setFile(selectedFile)
    setError("")

    // Read file content
    const reader = new FileReader()
    reader.onload = (e) => {
      const fileContent = e.target?.result as string
      setContent(fileContent)

      // Auto-generate name from file content or filename
      const autoName = extractTitle(fileContent, selectedFile.name)
      setCustomName(autoName)
    }
    reader.onerror = () => {
      setError("Failed to read file")
    }
    reader.readAsText(selectedFile)
  }

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files[0]) {
      handleFileSelect(files[0])
    }
  }

  const handleSubmit = () => {
    if (uploadMethod === "file" && !file) {
      setError("Please select a file")
      return
    }

    if (uploadMethod === "text" && !content.trim()) {
      setError("Please enter some content")
      return
    }

    if (!customName.trim()) {
      setError("Please enter a name for the resource")
      return
    }

    const resource = {
      name: customName.trim(),
      content: content.trim(),
      type: uploadMethod === "file" ? (file?.name.endsWith(".md") ? "markdown" : "text") : "text",
    }

    onAddResource(resource)
    handleClose()
  }

  const handleClose = () => {
    setFile(null)
    setContent("")
    setCustomName("")
    setError("")
    setDragActive(false)
    setUploadMethod("file")
    onClose()
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
            <div className="w-8 h-8 bg-green-500/20 rounded-lg flex items-center justify-center">
              <Upload className="h-4 w-4 text-green-300" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-white">Add Resource</h2>
              <p className="text-sm text-white/60">Upload a markdown file or enter text content</p>
            </div>
          </div>

          <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover:bg-white/10" onClick={handleClose}>
            <X className="h-4 w-4 text-white/60" />
          </Button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Upload Method Toggle */}
          <div className="flex gap-2">
            <Button
              variant={uploadMethod === "file" ? "default" : "ghost"}
              size="sm"
              onClick={() => setUploadMethod("file")}
              className={uploadMethod === "file" ? "bg-[#5B8EFF] text-white" : "hover:bg-white/10 text-white/80"}
            >
              <Upload className="h-4 w-4 mr-2" />
              Upload File
            </Button>
            <Button
              variant={uploadMethod === "text" ? "default" : "ghost"}
              size="sm"
              onClick={() => setUploadMethod("text")}
              className={uploadMethod === "text" ? "bg-[#5B8EFF] text-white" : "hover:bg-white/10 text-white/80"}
            >
              <FileText className="h-4 w-4 mr-2" />
              Enter Text
            </Button>
          </div>

          {uploadMethod === "file" ? (
            <>
              {/* File Upload Area */}
              <div
                className={cn(
                  "border-2 border-dashed rounded-lg p-8 text-center transition-colors",
                  dragActive ? "border-[#5B8EFF] bg-[#5B8EFF]/10" : "border-white/20 hover:border-white/40",
                  file ? "border-green-400 bg-green-400/10" : "",
                )}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".md,.txt,.markdown"
                  onChange={handleFileInputChange}
                  className="hidden"
                />

                {file ? (
                  <div className="space-y-3">
                    <CheckCircle2 className="h-12 w-12 text-green-400 mx-auto" />
                    <div>
                      <p className="text-white font-medium">{file.name}</p>
                      <p className="text-white/60 text-sm">{(file.size / 1024).toFixed(1)} KB</p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => fileInputRef.current?.click()}
                      className="hover:bg-white/10 text-white/80"
                    >
                      Choose Different File
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <Upload className="h-12 w-12 text-white/40 mx-auto" />
                    <div>
                      <p className="text-white font-medium">Drop your markdown file here</p>
                      <p className="text-white/60 text-sm">or click to browse (.md, .txt files only)</p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => fileInputRef.current?.click()}
                      className="hover:bg-white/10 text-white/80"
                    >
                      Browse Files
                    </Button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              {/* Text Input */}
              <div>
                <label className="block text-sm font-medium text-white mb-2">Content *</label>
                <Textarea
                  placeholder="Enter your markdown or text content here..."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="min-h-[200px] bg-white/5 border-white/10 text-white placeholder:text-white/40 resize-none font-mono text-sm"
                />
              </div>
            </>
          )}

          {/* Resource Name */}
          <div>
            <label className="block text-sm font-medium text-white mb-2">Resource Name *</label>
            <Input
              placeholder="Enter a name for this resource"
              value={customName}
              onChange={(e) => setCustomName(e.target.value)}
              className="bg-white/5 border-white/10 text-white placeholder:text-white/40"
            />
          </div>

          {/* Error Message */}
          {error && (
            <div className="flex items-center gap-3 p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
              <AlertCircle className="h-5 w-5 text-red-400 flex-shrink-0" />
              <p className="text-sm text-red-200">{error}</p>
            </div>
          )}

          {/* File Info */}
          {file && (
            <div className="p-4 bg-white/5 rounded-lg">
              <h4 className="text-sm font-medium text-white mb-2">File Information</h4>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-white/60">Size:</span>
                  <p className="text-white/80">{(file.size / 1024).toFixed(1)} KB</p>
                </div>
                <div>
                  <span className="text-white/60">Type:</span>
                  <p className="text-white/80">{file.type || "text/plain"}</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 p-6 border-t border-white/10">
          <Button variant="ghost" onClick={handleClose} className="hover:bg-white/10 text-white/80">
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={
              (uploadMethod === "file" && !file) || (uploadMethod === "text" && !content.trim()) || !customName.trim()
            }
            className="bg-[#4ADE80] hover:bg-[#4ADE80]/80 text-white"
          >
            <CheckCircle2 className="h-4 w-4 mr-2" />
            Add Resource
          </Button>
        </div>
      </div>
    </>
  )
}
