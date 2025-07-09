"use client"

import { useDroppable } from "@dnd-kit/core"
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable"
import type { CPMColumn, CPMTask } from "@/types/cmp"
import { KanbanCard } from "./kanban-card"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { cn } from "@/lib/utils"

interface KanbanColumnProps {
  column: Omit<CPMColumn, "tasks"> & { tasks?: CPMTask[] }
  onCardClick?: (task: CPMTask) => void
  onCreateTask?: () => void
  isDragOver?: boolean
  aiWorkingTasks?: Set<string>
  taskActivities?: Record<string, string>
  transitioningTasks?: Set<string>
}

export function KanbanColumn({
  column,
  onCardClick,
  onCreateTask,
  isDragOver,
  aiWorkingTasks,
  taskActivities,
  transitioningTasks,
}: KanbanColumnProps) {
  const { setNodeRef, isOver } = useDroppable({
    id: column.id,
  })

  const tasks = column.tasks ?? []

  const getColumnColor = () => {
    switch (column.id) {
      case "inbox":
        return "text-white/60"
      case "next-up":
        return "text-warning"
      case "running":
        return "text-primary"
      case "done":
        return "text-success"
      default:
        return "text-white/60"
    }
  }

  return (
    <div className="flex flex-col min-w-[320px] max-w-[400px] h-full">
      {/* Column Header */}
      <div className="flex items-center justify-between p-4 pb-3">
        <div className="flex items-center gap-3">
          <h2 className={cn("font-semibold text-lg", getColumnColor())}>{column.title}</h2>
          <span className="bg-white/10 text-white/70 text-xs px-2.5 py-1 rounded-full font-medium">{tasks.length}</span>
        </div>

        {/* Create Task Button - Only for Inbox */}
        {column.id === "inbox" && (
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0 hover:bg-white/10 text-white/60 hover:text-white"
            onClick={onCreateTask}
          >
            <Plus className="h-4 w-4" />
          </Button>
        )}
      </div>

      {/* Column Content */}
      <div
        ref={setNodeRef}
        className={cn(
          "flex-1 bg-white/4 backdrop-blur-[12px] rounded-[18px] p-3",
          "border border-white/10 transition-all duration-200",
          "min-h-[400px] overflow-y-auto",
          (isOver || isDragOver) && "ring-2 ring-primary/40 bg-white/8 border-primary/30",
        )}
      >
        <SortableContext items={tasks.map((task) => task.filePath)} strategy={verticalListSortingStrategy}>
          <div className="space-y-3">
            {/* Create Task Card - Only for Inbox when empty or as first item */}
            {column.id === "inbox" && (
              <button
                onClick={onCreateTask}
                className="w-full p-4 border-2 border-dashed border-white/20 rounded-[14px] 
                         hover:border-white/40 hover:bg-white/5 transition-all duration-200
                         flex items-center justify-center gap-2 text-white/60 hover:text-white/80"
              >
                <Plus className="h-4 w-4" />
                <span className="text-sm font-medium">Create New Task</span>
              </button>
            )}

            {tasks.map((task) => (
              <KanbanCard
                key={task.filePath}
                task={task}
                onClick={onCardClick}
                isAIWorking={aiWorkingTasks?.has(task.id)}
                recentActivity={taskActivities?.[task.id]}
                isTransitioning={transitioningTasks?.has(task.id)}
                transitionDirection={column.id === "inbox" || column.id === "next-up" ? "right" : "left"}
              />
            ))}

            {tasks.length === 0 && column.id !== "inbox" && (
              <div className="flex items-center justify-center h-32 text-white/40 text-sm">
                No tasks in {column.title.toLowerCase()}
              </div>
            )}
          </div>
        </SortableContext>
      </div>
    </div>
  )
}
