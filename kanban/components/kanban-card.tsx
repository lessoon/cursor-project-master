"use client"

import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { useState, useEffect } from "react"
import type { CPMTask } from "@/types/cmp"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ProgressRing } from "@/components/ui/progress-ring"
import { Sparkles, Zap } from "lucide-react"
import { cn } from "@/lib/utils"

interface KanbanCardProps {
  task: CPMTask
  onClick?: (task: CPMTask) => void
  isAIWorking?: boolean
  recentActivity?: string
  isTransitioning?: boolean
  transitionDirection?: "left" | "right"
}

export function KanbanCard({
  task,
  onClick,
  isAIWorking = false,
  recentActivity,
  isTransitioning = false,
  transitionDirection = "right",
}: KanbanCardProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: task.id,
  })

  const [showActivity, setShowActivity] = useState(false)
  const [previousProgress, setPreviousProgress] = useState(task.progress)

  // Show activity notification when AI is working
  useEffect(() => {
    if (recentActivity) {
      setShowActivity(true)
      const timer = setTimeout(() => setShowActivity(false), 3000)
      return () => clearTimeout(timer)
    }
  }, [recentActivity])

  // Animate progress changes
  useEffect(() => {
    if (task.progress !== previousProgress) {
      setPreviousProgress(task.progress)
    }
  }, [task.progress, previousProgress])

  const style = {
    transform: CSS.Transform.toString(transform),
    transition: transition || (isTransitioning ? "all 0.8s cubic-bezier(0.4, 0, 0.2, 1)" : undefined),
  }

  const getStatusBorderColor = () => {
    switch (task.status) {
      case "inbox":
        return "border-l-white/20"
      case "next-up":
        return "border-l-warning"
      case "running":
        return "border-l-primary"
      case "done":
        return "border-l-success"
      default:
        return "border-l-white/20"
    }
  }

  const getAIWorkingGlow = () => {
    if (!isAIWorking) return ""
    return "ring-2 ring-primary/40 shadow-[0_0_20px_rgba(91,142,255,0.3)]"
  }

  // Show max 2 tags
  const displayTags = task.labels.slice(0, 2)

  return (
    <Card
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      onClick={() => onClick?.(task)}
      className={cn(
        "group relative min-h-[88px] cursor-pointer overflow-hidden",
        "bg-white/6 backdrop-blur-[16px] border-l-4 border-r-0 border-t-0 border-b-0",
        "border-white/10 rounded-[14px] p-4 transition-all duration-300",
        "hover:bg-white/8 hover:shadow-[0_4px_12px_-2px_rgba(0,0,0,0.35)]",
        "hover:scale-[1.01] hover:-translate-y-0.5",
        getStatusBorderColor(),
        getAIWorkingGlow(),
        isDragging && "opacity-50 scale-105 shadow-[0_8px_24px_-4px_rgba(0,0,0,0.5)]",
        isTransitioning && `animate-pulse ${transitionDirection === "right" ? "translate-x-2" : "-translate-x-2"}`,
      )}
    >
      {/* AI Working Indicator */}
      {isAIWorking && (
        <div className="absolute top-2 right-2 flex items-center gap-1">
          <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
          <Sparkles className="h-3 w-3 text-primary animate-pulse" />
        </div>
      )}

      {/* Transition Effect Overlay */}
      {isTransitioning && (
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shimmer" />
      )}

      {/* Title */}
      <h3 className="font-semibold text-white text-[16px] leading-tight mb-2 pr-8">{task.title}</h3>

      {/* Summary */}
      <p className="text-white/70 text-[14px] font-normal leading-relaxed mb-3 line-clamp-1">{task.summary}</p>

      {/* Activity Notification */}
      {showActivity && recentActivity && (
        <div className="absolute inset-x-4 top-full mt-2 bg-primary/90 backdrop-blur-sm rounded-lg p-2 z-10 animate-slide-up">
          <div className="flex items-center gap-2">
            <Zap className="h-3 w-3 text-white flex-shrink-0" />
            <p className="text-xs text-white font-medium truncate">{recentActivity}</p>
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between">
        {/* Tags */}
        <div className="flex items-center gap-1.5 flex-1 min-w-0">
          {displayTags.map((tag) => (
            <Badge
              key={tag}
              variant="secondary"
              className="bg-white/10 text-white/80 text-xs px-2 py-0.5 rounded-md truncate"
            >
              {tag}
            </Badge>
          ))}
        </div>

        {/* Progress Ring with Animation */}
        <div className="relative">
          <ProgressRing
            progress={task.progress}
            size={32}
            className={cn("transition-all duration-500", task.progress !== previousProgress && "animate-pulse")}
          />
          {task.progress > previousProgress && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-8 h-8 border-2 border-success rounded-full animate-ping opacity-30" />
            </div>
          )}
        </div>
      </div>
    </Card>
  )
}
