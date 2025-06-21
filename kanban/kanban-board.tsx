"use client"

import { useState, useMemo } from "react"
import {
  DndContext,
  type DragEndEvent,
  type DragOverEvent,
  DragOverlay,
  type DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
  closestCorners,
} from "@dnd-kit/core"
import { arrayMove } from "@dnd-kit/sortable"
import type { Job } from "@/types/kanban"
import { initialBoard } from "@/lib/kanban-data"
import { KanbanColumn } from "@/components/kanban-column"
import { JobCard } from "@/components/job-card"
import { ContextBackpack } from "@/components/context-backpack"
import { PreviewModal } from "@/components/preview-modal"
import { Navbar } from "@/components/navbar"

export default function KanbanBoard() {
  const [board, setBoard] = useState(initialBoard)
  const [activeJob, setActiveJob] = useState<Job | null>(null)
  const [previewJob, setPreviewJob] = useState<Job | null>(null)
  const [isBackpackOpen, setIsBackpackOpen] = useState(false)
  const [isPreviewOpen, setIsPreviewOpen] = useState(false)

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
  )

  const jobsById = useMemo(() => {
    const jobs: Record<string, Job> = {}
    board.columns.forEach((column) => {
      column.jobs.forEach((job) => {
        jobs[job.id] = job
      })
    })
    return jobs
  }, [board])

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event
    setActiveJob(jobsById[active.id as string] || null)
  }

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event
    if (!over) return

    const activeId = active.id as string
    const overId = over.id as string

    // Find the columns
    const activeColumn = board.columns.find((col) => col.jobs.some((job) => job.id === activeId))
    const overColumn = board.columns.find((col) => col.id === overId || col.jobs.some((job) => job.id === overId))

    if (!activeColumn || !overColumn) return
    if (activeColumn.id === overColumn.id) return

    setBoard((prev) => {
      const newColumns = [...prev.columns]
      const activeColIndex = newColumns.findIndex((col) => col.id === activeColumn.id)
      const overColIndex = newColumns.findIndex((col) => col.id === overColumn.id)

      // Remove job from active column
      const activeJob = newColumns[activeColIndex].jobs.find((job) => job.id === activeId)
      if (!activeJob) return prev

      newColumns[activeColIndex] = {
        ...newColumns[activeColIndex],
        jobs: newColumns[activeColIndex].jobs.filter((job) => job.id !== activeId),
      }

      // Add job to over column
      const updatedJob = {
        ...activeJob,
        status: overColumn.id as Job["status"],
      }

      newColumns[overColIndex] = {
        ...newColumns[overColIndex],
        jobs: [...newColumns[overColIndex].jobs, updatedJob],
      }

      return {
        ...prev,
        columns: newColumns,
      }
    })
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    setActiveJob(null)

    if (!over) return

    const activeId = active.id as string
    const overId = over.id as string

    // Find the column containing the active job
    const activeColumn = board.columns.find((col) => col.jobs.some((job) => job.id === activeId))

    if (!activeColumn) return

    // If dropping on another job in the same column, reorder
    if (activeColumn.jobs.some((job) => job.id === overId)) {
      const oldIndex = activeColumn.jobs.findIndex((job) => job.id === activeId)
      const newIndex = activeColumn.jobs.findIndex((job) => job.id === overId)

      if (oldIndex !== newIndex) {
        setBoard((prev) => {
          const newColumns = [...prev.columns]
          const columnIndex = newColumns.findIndex((col) => col.id === activeColumn.id)

          newColumns[columnIndex] = {
            ...newColumns[columnIndex],
            jobs: arrayMove(newColumns[columnIndex].jobs, oldIndex, newIndex),
          }

          return {
            ...prev,
            columns: newColumns,
          }
        })
      }
    }
  }

  const handleToggleChecklistItem = (jobId: string, itemId: string) => {
    setBoard((prev) => {
      const newColumns = prev.columns.map((column) => ({
        ...column,
        jobs: column.jobs.map((job) => {
          if (job.id === jobId) {
            const newChecklist = job.checklist.map((item) =>
              item.id === itemId ? { ...item, completed: !item.completed } : item,
            )
            const completedCount = newChecklist.filter((item) => item.completed).length
            const progress = newChecklist.length > 0 ? (completedCount / newChecklist.length) * 100 : 0

            return {
              ...job,
              checklist: newChecklist,
              progress,
              updatedAt: new Date(),
            }
          }
          return job
        }),
      }))

      return {
        ...prev,
        columns: newColumns,
      }
    })
  }

  const handlePreview = (job: Job) => {
    setPreviewJob(job)
    setIsPreviewOpen(true)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#10141C] to-[#0B0E14]">
      <Navbar onToggleBackpack={() => setIsBackpackOpen(!isBackpackOpen)} />

      <div className="p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-white mb-2">Project Board</h1>
          <p className="text-white/60">Manage your CPM jobs with AI-assisted workflows</p>
        </div>

        <DndContext
          sensors={sensors}
          collisionDetection={closestCorners}
          onDragStart={handleDragStart}
          onDragOver={handleDragOver}
          onDragEnd={handleDragEnd}
        >
          <div className="flex gap-6 overflow-x-auto pb-6">
            {board.columns.map((column) => (
              <KanbanColumn
                key={column.id}
                column={column}
                onPreview={handlePreview}
                onToggleChecklistItem={handleToggleChecklistItem}
              />
            ))}
          </div>

          <DragOverlay>
            {activeJob ? (
              <div className="rotate-3 scale-105">
                <JobCard job={activeJob} onPreview={handlePreview} onToggleChecklistItem={handleToggleChecklistItem} />
              </div>
            ) : null}
          </DragOverlay>
        </DndContext>
      </div>

      <ContextBackpack isOpen={isBackpackOpen} onClose={() => setIsBackpackOpen(false)} />

      <PreviewModal
        job={previewJob}
        isOpen={isPreviewOpen}
        onClose={() => {
          setIsPreviewOpen(false)
          setPreviewJob(null)
        }}
      />
    </div>
  )
}
