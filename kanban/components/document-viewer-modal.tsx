"use client"

import { Button } from "@/components/ui/button"
import { X, FileText, Download, ExternalLink } from "lucide-react"
import { parseMarkdown, extractTitle } from "@/lib/markdown-utils"
import { cn } from "@/lib/utils"

interface DocumentViewerModalProps {
  isOpen: boolean
  onClose: () => void
  resource: {
    id: string
    name: string
    content: string
    type: string
    url?: string
  } | null
}

export function DocumentViewerModal({ isOpen, onClose, resource }: DocumentViewerModalProps) {
  if (!resource || !isOpen) return null

  const title = extractTitle(resource.content, resource.name)
  const htmlContent = parseMarkdown(resource.content)

  const handleDownload = () => {
    const blob = new Blob([resource.content], { type: "text/markdown" })
    const url = URL.createObjectURL(blob)
    const a = window.document.createElement("a")
    a.href = url
    a.download = resource.name.endsWith(".md") ? resource.name : `${resource.name}.md`
    window.document.body.appendChild(a)
    a.click()
    window.document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return (
    <>
      {/* Backdrop */}
      <div
        className={cn(
          "fixed inset-0 bg-black/60 backdrop-blur-sm z-50 transition-opacity duration-150",
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none",
        )}
        onClick={onClose}
      />

      {/* Modal */}
      <div
        className={cn(
          "fixed left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2",
          "w-[90vw] max-w-4xl h-[85vh] bg-[#0B0E14]/95 backdrop-blur-[24px]",
          "border border-white/10 rounded-[18px] z-50 transition-all duration-150",
          "flex flex-col overflow-hidden",
          isOpen ? "scale-100 opacity-100" : "scale-95 opacity-0 pointer-events-none",
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/10">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
              <FileText className="h-4 w-4 text-blue-300" />
            </div>
            <div className="min-w-0 flex-1">
              <h2 className="text-xl font-semibold text-white truncate">{title}</h2>
              <p className="text-sm text-white/60 truncate">{resource.name}</p>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-shrink-0">
            <Button
              variant="ghost"
              size="sm"
              className="hover:bg-white/10 text-white/60 hover:text-white"
              onClick={handleDownload}
            >
              <Download className="h-4 w-4" />
            </Button>

            {resource.url && (
              <Button
                variant="ghost"
                size="sm"
                className="hover:bg-white/10 text-white/60 hover:text-white"
                onClick={() => window.open(resource.url, "_blank")}
              >
                <ExternalLink className="h-4 w-4" />
              </Button>
            )}

            <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover:bg-white/10" onClick={onClose}>
              <X className="h-4 w-4 text-white/60" />
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="max-w-none prose prose-invert">
            <div className="markdown-content" dangerouslySetInnerHTML={{ __html: htmlContent }} />
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-between items-center p-6 border-t border-white/10 text-sm text-white/60">
          <span>Document type: {resource.type}</span>
          <span>Press ESC to close</span>
        </div>
      </div>
    </>
  )
}
