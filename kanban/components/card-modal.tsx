"use client"

import { useState, useEffect } from "react"
import type { CPMTask, Attachment } from "@/types/cpm"
import { getCPMPlan } from "@/lib/parse-cpm-tasks"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { X, CheckCircle2, Circle, FileText, ExternalLink, MoreHorizontal } from "lucide-react"
import { cn } from "@/lib/utils"

interface CardModalProps {
  task: CPMTask | null
  isOpen: boolean
  onClose: () => void
  onToggleChecklistItem?: (taskId: string, itemId: string) => void
}

const mockAttachments: Attachment[] = [
  { id: "1", name: "API Documentation", type: "doc", url: "/docs/api" },
  { id: "2", name: "GitHub Repository", type: "repo", url: "https://github.com/..." },
  { id: "3", name: "Design System", type: "link", url: "https://design.company.com" },
]

export function CardModal({ task, isOpen, onClose, onToggleChecklistItem }: CardModalProps) {
  const [activities, setActivities] = useState<string[]>([])
  const [showMore, setShowMore] = useState(false)

  useEffect(() => {
    if (task && isOpen) {
      getCPMPlan(task.id).then(setActivities)
    }
  }, [task, isOpen])

  if (!task) return null

  const getAttachmentIcon = (type: Attachment["type"]) => {
    switch (type) {
      case "doc":
        return <FileText className="h-3 w-3" />
      case "repo":
        return <ExternalLink className="h-3 w-3" />
      case "link":
        return <ExternalLink className="h-3 w-3" />
      default:
        return <FileText className="h-3 w-3" />
    }
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
          "w-[90vw] max-w-2xl max-h-[80vh] bg-[#0B0E14]/95 backdrop-blur-[24px]",
          "border border-white/10 rounded-[18px] z-50 transition-all duration-150",
          "flex flex-col overflow-hidden",
          isOpen ? "scale-100 opacity-100" : "scale-95 opacity-0 pointer-events-none",
        )}
      >
        {/* Header */}
        <div className="flex items-start justify-between p-6 border-b border-white/10">
          <div className="flex-1 min-w-0 pr-4">
            <h2 className="text-xl font-semibold text-white mb-2">{task.title}</h2>
            <p className="text-sm text-white/70 leading-relaxed">{task.summary}</p>

            {/* Tags */}
            <div className="flex gap-2 mt-3">
              {task.labels.map((tag) => (
                <Badge key={tag} variant="secondary" className="bg-white/10 text-white/80">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>

          <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover:bg-white/10 flex-shrink-0" onClick={onClose}>
            <X className="h-4 w-4 text-white/60" />
          </Button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Description */}
          {task.description && (
            <div>
              <h3 className="text-sm font-medium text-white mb-2">Description</h3>
              <p className="text-sm text-white/70 leading-relaxed">{task.description}</p>
            </div>
          )}

          {/* Checklist */}
          {task.checklist.length > 0 && (
            <div>
              <h3 className="text-sm font-medium text-white mb-3">
                Checklist ({task.checklist.filter((item) => item.completed).length}/{task.checklist.length})
              </h3>
              <div className="space-y-2">
                {task.checklist.slice(0, 8).map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center gap-3 text-sm group/item cursor-pointer hover:bg-white/5 rounded-lg p-2 -m-2"
                    onClick={() => onToggleChecklistItem?.(task.id, item.id)}
                  >
                    <button className="flex-shrink-0 hover:scale-110 transition-transform">
                      {item.completed ? (
                        <CheckCircle2 className="h-4 w-4 text-success" />
                      ) : (
                        <Circle className="h-4 w-4 text-white/40 group-hover/item:text-white/60" />
                      )}
                    </button>
                    <span
                      className={cn(
                        "transition-all duration-180",
                        item.completed ? "text-white/50 line-through" : "text-white/80",
                      )}
                    >
                      {item.text}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Recent Activity */}
          {activities.length > 0 && (
            <div>
              <h3 className="text-sm font-medium text-white mb-3">Recent Activity</h3>
              <div className="space-y-2">
                {activities.map((activity, index) => (
                  <div key={index} className="flex items-start gap-3 text-sm">
                    <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0" />
                    <p className="text-white/70 leading-relaxed">{activity}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Attachments */}
          <div>
            <h3 className="text-sm font-medium text-white mb-3">Attachments</h3>
            <div className="flex flex-wrap gap-2">
              {mockAttachments.map((attachment) => (
                <button
                  key={attachment.id}
                  className="flex items-center gap-2 px-3 py-2 bg-white/5 hover:bg-white/10 rounded-lg text-sm text-white/80 hover:text-white transition-colors"
                >
                  {getAttachmentIcon(attachment.type)}
                  {attachment.name}
                </button>
              ))}
            </div>
          </div>

          {/* More Section */}
          {!showMore && (
            <button
              onClick={() => setShowMore(true)}
              className="flex items-center gap-2 text-sm text-white/60 hover:text-white transition-colors"
            >
              <MoreHorizontal className="h-4 w-4" />
              More details
            </button>
          )}

          {showMore && (
            <div className="space-y-4 pt-4 border-t border-white/10">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-white/60">Created:</span>
                  <p className="text-white/80">{task.createdAt.toLocaleDateString()}</p>
                </div>
                <div>
                  <span className="text-white/60">Updated:</span>
                  <p className="text-white/80">{task.updatedAt.toLocaleDateString()}</p>
                </div>
                <div>
                  <span className="text-white/60">File Path:</span>
                  <p className="text-white/80 font-mono text-xs">{task.filePath}</p>
                </div>
                <div>
                  <span className="text-white/60">Progress:</span>
                  <p className="text-white/80">{task.progress}% complete</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  )
}
