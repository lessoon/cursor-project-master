"use client"

import { useState, useEffect, useMemo } from "react"
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
import type { CPMTask, CPMBoard } from "@/types/cmp"
import { parseCPMTasks } from "@/lib/parse-cmp-tasks"
import { aiAutomation, type TaskUpdate } from "@/lib/ai-automation"
import { KanbanColumn } from "./kanban-column"
import { KanbanCard } from "./kanban-card"
import { CardModal } from "./card-modal"
import { CreateTaskModal } from "./create-task-modal"
import { SettingsModal } from "./settings-modal"
import { Navbar } from "./navbar"
import { ContextPack } from "./context-pack"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Activity, Clock, Play, Pause, Sparkles } from "lucide-react"
import { cn } from "@/lib/utils"

interface KanbanBoardProps {
  onStatusChange?: (taskId: string, newStatus: CPMTask["status"]) => void
}

export function KanbanBoard({ onStatusChange }: KanbanBoardProps) {
  const [board, setBoard] = useState<CPMBoard | null>(null)
  const [activeTask, setActiveTask] = useState<CPMTask | null>(null)
  const [selectedTask, setSelectedTask] = useState<CPMTask | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false)
  const [isContextPackOpen, setIsContextPackOpen] = useState(false)
  const [dragOverColumn, setDragOverColumn] = useState<string | null>(null)

  // AI Automation State
  const [isAIActive, setIsAIActive] = useState(true)
  const [aiWorkingTasks, setAIWorkingTasks] = useState<Set<string>>(new Set())
  const [taskActivities, setTaskActivities] = useState<Record<string, string>>({})
  const [transitioningTasks, setTransitioningTasks] = useState<Set<string>>(new Set())

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
  )

  useEffect(() => {
    parseCPMTasks().then(setBoard)
  }, [])

  // AI Automation Effect
  useEffect(() => {
    if (!isAIActive) return

    const unsubscribe = aiAutomation.subscribe((update: TaskUpdate) => {
      handleAIUpdate(update)
    })

    aiAutomation.start()

    return () => {
      unsubscribe()
      aiAutomation.stop()
    }
  }, [isAIActive])

  const handleAIUpdate = (update: TaskUpdate) => {
    const { taskId, type, data } = update

    switch (type) {
      case "checklist":
        handleAIChecklistUpdate(taskId, data.itemIndex)
        break
      case "status":
        handleAIStatusUpdate(taskId, data.from, data.to, data.reason)
        break
      case "progress":
        handleAIProgressUpdate(taskId, data.activity, data.progress)
        break
    }
  }

  const handleAIChecklistUpdate = (taskId: string, itemIndex: number) => {
    setAIWorkingTasks((prev) => new Set(prev).add(taskId))
    setTaskActivities((prev) => ({ ...prev, [taskId]: "Completing checklist item..." }))

    setTimeout(
      () => {
        setBoard((prev) => {
          if (!prev) return prev

          const newColumns = prev.columns.map((column) => ({
            ...column,
            tasks: column.tasks.map((task) => {
              if (task.id === taskId && task.checklist[itemIndex] && !task.checklist[itemIndex].completed) {
                const newChecklist = [...task.checklist]
                newChecklist[itemIndex] = { ...newChecklist[itemIndex], completed: true }
                const completedCount = newChecklist.filter((item) => item.completed).length
                const progress = (completedCount / newChecklist.length) * 100

                return {
                  ...task,
                  checklist: newChecklist,
                  progress,
                  updatedAt: new Date(),
                }
              }
              return task
            }),
          }))

          return { ...prev, columns: newColumns }
        })

        setAIWorkingTasks((prev) => {
          const newSet = new Set(prev)
          newSet.delete(taskId)
          return newSet
        })

        setTaskActivities((prev) => {
          const newActivities = { ...prev }
          delete newActivities[taskId]
          return newActivities
        })
      },
      1500 + Math.random() * 1000,
    ) // 1.5-2.5 seconds
  }

  const handleAIStatusUpdate = (taskId: string, fromStatus: string, toStatus: string, reason: string) => {
    setTransitioningTasks((prev) => new Set(prev).add(taskId))
    setTaskActivities((prev) => ({ ...prev, [taskId]: reason }))

    setTimeout(() => {
      setBoard((prev) => {
        if (!prev) return prev

        const newColumns = [...prev.columns]
        const fromColumnIndex = newColumns.findIndex((col) => col.id === fromStatus)
        const toColumnIndex = newColumns.findIndex((col) => col.id === toStatus)

        if (fromColumnIndex === -1 || toColumnIndex === -1) return prev

        const taskIndex = newColumns[fromColumnIndex].tasks.findIndex((task) => task.id === taskId)
        if (taskIndex === -1) return prev

        const task = newColumns[fromColumnIndex].tasks[taskIndex]
        const updatedTask = {
          ...task,
          status: toStatus as CPMTask["status"],
          updatedAt: new Date(),
        }

        // Remove from source column
        newColumns[fromColumnIndex] = {
          ...newColumns[fromColumnIndex],
          tasks: newColumns[fromColumnIndex].tasks.filter((t) => t.id !== taskId),
        }

        // Add to destination column
        newColumns[toColumnIndex] = {
          ...newColumns[toColumnIndex],
          tasks: [...newColumns[toColumnIndex].tasks, updatedTask],
        }

        return { ...prev, columns: newColumns }
      })

      setTransitioningTasks((prev) => {
        const newSet = new Set(prev)
        newSet.delete(taskId)
        return newSet
      })

      setTimeout(() => {
        setTaskActivities((prev) => {
          const newActivities = { ...prev }
          delete newActivities[taskId]
          return newActivities
        })
      }, 2000)
    }, 800) // Transition delay
  }

  const handleAIProgressUpdate = (taskId: string, activity: string, progressIncrease: number) => {
    setAIWorkingTasks((prev) => new Set(prev).add(taskId))
    setTaskActivities((prev) => ({ ...prev, [taskId]: activity }))

    setTimeout(() => {
      setBoard((prev) => {
        if (!prev) return prev

        const newColumns = prev.columns.map((column) => ({
          ...column,
          tasks: column.tasks.map((task) => {
            if (task.id === taskId) {
              return {
                ...task,
                progress: Math.min(task.progress + progressIncrease, 100),
                updatedAt: new Date(),
              }
            }
            return task
          }),
        }))

        return { ...prev, columns: newColumns }
      })

      setAIWorkingTasks((prev) => {
        const newSet = new Set(prev)
        newSet.delete(taskId)
        return newSet
      })

      setTimeout(() => {
        setTaskActivities((prev) => {
          const newActivities = { ...prev }
          delete newActivities[taskId]
          return newActivities
        })
      }, 2000)
    }, 2000)
  }

  const tasksById = useMemo(() => {
    if (!board) return {}
    const tasks: Record<string, CPMTask> = {}
    board.columns.forEach((column) => {
      column.tasks.forEach((task) => {
        tasks[task.id] = task
      })
    })
    return tasks
  }, [board])

  // Calculate project metrics
  const projectMetrics = useMemo(() => {
    if (!board) return { totalTasks: 0, activeTasks: 0, completedTasks: 0, overallProgress: 0 }

    const totalTasks = board.columns.reduce((sum, col) => sum + col.tasks.length, 0)
    const activeTasks = board.columns
      .filter((col) => col.id === "running" || col.id === "next-up")
      .reduce((sum, col) => sum + col.tasks.length, 0)
    const completedTasks = board.columns.find((col) => col.id === "done")?.tasks.length || 0
    const overallProgress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0

    return { totalTasks, activeTasks, completedTasks, overallProgress }
  }, [board])

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event
    setActiveTask(tasksById[active.id as string] || null)
  }

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event
    if (!over || !board) return

    const activeId = active.id as string
    const overId = over.id as string

    // Check if dragging over a column
    const overColumn = board.columns.find((col) => col.id === overId)
    if (overColumn) {
      setDragOverColumn(overId)
    }

    // Find the columns
    const activeColumn = board.columns.find((col) => col.tasks.some((task) => task.id === activeId))
    const targetColumn = board.columns.find((col) => col.id === overId || col.tasks.some((task) => task.id === overId))

    if (!activeColumn || !targetColumn) return
    if (activeColumn.id === targetColumn.id) return

    setBoard((prev) => {
      if (!prev) return prev

      const newColumns = [...prev.columns]
      const activeColIndex = newColumns.findIndex((col) => col.id === activeColumn.id)
      const targetColIndex = newColumns.findIndex((col) => col.id === targetColumn.id)

      // Remove task from active column
      const activeTask = newColumns[activeColIndex].tasks.find((task) => task.id === activeId)
      if (!activeTask) return prev

      newColumns[activeColIndex] = {
        ...newColumns[activeColIndex],
        tasks: newColumns[activeColIndex].tasks.filter((task) => task.id !== activeId),
      }

      // Add task to target column
      const updatedTask = {
        ...activeTask,
        status: targetColumn.id,
        updatedAt: new Date(),
      }

      newColumns[targetColIndex] = {
        ...newColumns[targetColIndex],
        tasks: [...newColumns[targetColIndex].tasks, updatedTask],
      }

      return {
        ...prev,
        columns: newColumns,
      }
    })
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    setActiveTask(null)
    setDragOverColumn(null)

    if (!over || !board) return

    const activeId = active.id as string
    const overId = over.id as string

    // Find the column containing the active task
    const activeColumn = board.columns.find((col) => col.tasks.some((task) => task.id === activeId))
    if (!activeColumn) return

    // If dropping on another task in the same column, reorder
    if (activeColumn.tasks.some((task) => task.id === overId)) {
      const oldIndex = activeColumn.tasks.findIndex((task) => task.id === activeId)
      const newIndex = activeColumn.tasks.findIndex((task) => task.id === overId)

      if (oldIndex !== newIndex) {
        setBoard((prev) => {
          if (!prev) return prev

          const newColumns = [...prev.columns]
          const columnIndex = newColumns.findIndex((col) => col.id === activeColumn.id)

          newColumns[columnIndex] = {
            ...newColumns[columnIndex],
            tasks: arrayMove(newColumns[columnIndex].tasks, oldIndex, newIndex),
          }

          return {
            ...prev,
            columns: newColumns,
          }
        })
      }
    }

    // Fire status change callback
    const task = tasksById[activeId]
    if (task && onStatusChange) {
      const targetColumn = board.columns.find((col) => col.id === overId)
      if (targetColumn && task.status !== targetColumn.id) {
        onStatusChange(activeId, targetColumn.id)
      }
    }
  }

  const handleCardClick = (task: CPMTask) => {
    setSelectedTask(task)
    setIsModalOpen(true)
  }

  const handleCreateTask = (taskData: Omit<CPMTask, "id" | "status" | "createdAt" | "updatedAt" | "filePath">) => {
    const newTask: CPMTask = {
      ...taskData,
      id: `task-${Date.now()}`,
      status: "inbox",
      filePath: `/docs/generated/task-${Date.now()}.md`,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    setBoard((prev) => {
      if (!prev) return prev

      const newColumns = [...prev.columns]
      const inboxIndex = newColumns.findIndex((col) => col.id === "inbox")

      if (inboxIndex !== -1) {
        newColumns[inboxIndex] = {
          ...newColumns[inboxIndex],
          tasks: [newTask, ...newColumns[inboxIndex].tasks],
        }
      }

      return {
        ...prev,
        columns: newColumns,
      }
    })
  }

  const handleToggleChecklistItem = (taskId: string, itemId: string) => {
    setBoard((prev) => {
      if (!prev) return prev

      const newColumns = prev.columns.map((column) => ({
        ...column,
        tasks: column.tasks.map((task) => {
          if (task.id === taskId) {
            const newChecklist = task.checklist.map((item) =>
              item.id === itemId ? { ...item, completed: !item.completed } : item,
            )
            const completedCount = newChecklist.filter((item) => item.completed).length
            const progress = newChecklist.length > 0 ? (completedCount / newChecklist.length) * 100 : 0

            return {
              ...task,
              checklist: newChecklist,
              progress,
              updatedAt: new Date(),
            }
          }
          return task
        }),
      }))

      return {
        ...prev,
        columns: newColumns,
      }
    })

    // Update selected task if it's the same one
    if (selectedTask?.id === taskId) {
      setSelectedTask((prev) => {
        if (!prev) return prev
        const newChecklist = prev.checklist.map((item) =>
          item.id === itemId ? { ...item, completed: !item.completed } : item,
        )
        const completedCount = newChecklist.filter((item) => item.completed).length
        const progress = newChecklist.length > 0 ? (completedCount / newChecklist.length) * 100 : 0

        return {
          ...prev,
          checklist: newChecklist,
          progress,
          updatedAt: new Date(),
        }
      })
    }
  }

  if (!board) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#10141C] to-[#0B0E14] flex items-center justify-center">
        <div className="text-white/60">Loading CPM tasks...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#10141C] to-[#0B0E14]">
      <Navbar
        onToggleContextPack={() => setIsContextPackOpen(!isContextPackOpen)}
        onOpenSettings={() => setIsSettingsModalOpen(true)}
      />

      <div className="p-6">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white mb-2">CPM Project Board</h1>
            <p className="text-white/60">AI-powered task automation in progress</p>
          </div>

          {/* Controls and Metrics */}
          <div className="flex items-center gap-4">
            {/* AI Toggle */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsAIActive(!isAIActive)}
              className={cn(
                "flex items-center gap-2 transition-all",
                isAIActive
                  ? "text-primary hover:text-primary/80 bg-primary/10 hover:bg-primary/20"
                  : "text-white/60 hover:text-white/80 hover:bg-white/10",
              )}
            >
              {isAIActive ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
              AI Agent {isAIActive ? "Active" : "Paused"}
              {isAIActive && <Sparkles className="h-3 w-3 animate-pulse" />}
            </Button>

            {/* Metrics */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Activity className="h-4 w-4 text-primary" />
                <span className="text-sm text-white/80">{projectMetrics.activeTasks} active</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-success" />
                <span className="text-sm text-white/80">{projectMetrics.overallProgress}% complete</span>
              </div>
              <Badge variant="secondary" className="bg-white/10 text-white/80">
                {projectMetrics.totalTasks} total tasks
              </Badge>
            </div>
          </div>
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
                onCardClick={handleCardClick}
                onCreateTask={() => setIsCreateModalOpen(true)}
                isDragOver={dragOverColumn === column.id}
                aiWorkingTasks={aiWorkingTasks}
                taskActivities={taskActivities}
                transitioningTasks={transitioningTasks}
              />
            ))}
          </div>

          <DragOverlay>
            {activeTask ? (
              <div className="rotate-2 scale-105">
                <KanbanCard task={activeTask} />
              </div>
            ) : null}
          </DragOverlay>
        </DndContext>
      </div>

      <ContextPack isOpen={isContextPackOpen} onClose={() => setIsContextPackOpen(false)} />

      <CardModal
        task={selectedTask}
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false)
          setSelectedTask(null)
        }}
        onToggleChecklistItem={handleToggleChecklistItem}
      />

      <CreateTaskModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onCreateTask={handleCreateTask}
      />

      <SettingsModal isOpen={isSettingsModalOpen} onClose={() => setIsSettingsModalOpen(false)} />
    </div>
  )
}
