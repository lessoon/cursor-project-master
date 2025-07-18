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
  type CollisionDetection,
  rectIntersection,
  pointerWithin,
} from "@dnd-kit/core"
import { arrayMove } from "@dnd-kit/sortable"
import type { CPMTask, CPMBoard, CPMColumn } from "@/types/cmp"
import { taskApi } from "@/lib/api-client"

import { KanbanColumn } from "./kanban-column"
import { KanbanCard } from "./kanban-card"
import { CardModal } from "./card-modal"
import { CreateTaskModal } from "./create-task-modal"
import { SettingsModal } from "./settings-modal"
import { Navbar } from "./navbar"
import { ContextPack } from "./context-pack"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Activity, Clock, Pencil } from "lucide-react"
import { cn } from "@/lib/utils"

interface KanbanBoardProps {
  onStatusChange?: (taskId: string, newStatus: CPMTask["status"]) => void
}

export function KanbanBoard({ onStatusChange }: KanbanBoardProps) {
  const [board, setBoard] = useState<CPMBoard | null>(null)
  const [activeTask, setActiveTask] = useState<CPMTask | null>(null)
  const [dragOverColumn, setDragOverColumn] = useState<string | null>(null)
  const [selectedTask, setSelectedTask] = useState<CPMTask | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [isContextPackOpen, setIsContextPackOpen] = useState(false)
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false)
  const [contextPackCount, setContextPackCount] = useState(0)
  
  // Editable project name state
  const [projectName, setProjectName] = useState("CPM Project Board")
  const [isEditingName, setIsEditingName] = useState(false)



  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
        delay: 100,
        tolerance: 5,
      },
    }),
  )

  // Enhanced collision detection with better performance and accuracy
  const customCollisionDetection: CollisionDetection = (args) => {
    const { active, droppableContainers } = args
    
    // Get the active task being dragged
    const activeId = active.id as string
    const activeTask = tasksById[activeId]
    
    if (!activeTask) {
      return closestCorners(args)
    }
    
    // First, check for column droppables (inbox, next-up, running, done)
    const columnIds = ['inbox', 'next-up', 'running', 'done']
    const columnDroppables = droppableContainers.filter(container => 
      columnIds.includes(container.id as string)
    )
    
    // Use pointerWithin for more accurate column detection
    const columnCollisions = pointerWithin({
      ...args,
      droppableContainers: columnDroppables
    })
    
    if (columnCollisions.length > 0) {
      return columnCollisions
    }
    
    // Fallback to rectIntersection for task-to-task positioning
    const taskDroppables = droppableContainers.filter(container => 
      !columnIds.includes(container.id as string)
    )
    
    if (taskDroppables.length === 0) {
      return []
    }
    
    const taskCollisions = rectIntersection({
      ...args,
      droppableContainers: taskDroppables
    })
    
    return taskCollisions
  }

  useEffect(() => {
    taskApi.fetchTasks().then(setBoard).catch(console.error)
    
    // Optional: Refresh when tab becomes visible (user returns to app)
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        taskApi.fetchTasks().then(setBoard).catch(console.error)
      }
    }
    
    document.addEventListener('visibilitychange', handleVisibilityChange)
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange)
  }, [])



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

    const overId = over.id as string

    // Only update visual drag over state, don't move tasks during drag
    const overColumn = board.columns.find((col) => col.id === overId)
    if (overColumn) {
      setDragOverColumn(overId)
    } else {
      // Check if dragging over a task and set the column highlight
      const targetColumn = board.columns.find((col) => col.tasks.some((task) => task.id === overId))
      if (targetColumn) {
        setDragOverColumn(targetColumn.id)
      }
    }
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    setActiveTask(null)
    setDragOverColumn(null)

    if (!over || !board) {
      return
    }

    const activeId = active.id as string
    const overId = over.id as string

    // Find the column containing the active task
    const activeColumn = board.columns.find((col) => col.tasks.some((task) => task.id === activeId))
    if (!activeColumn) {
      return
    }

    // Determine target column - prioritize column IDs over task IDs
    let targetColumn: CPMColumn | undefined
    
    // First check if overId is a column ID (direct drop on column)
    targetColumn = board.columns.find((col) => col.id === overId)
    
    if (targetColumn) {
      // Direct column drop
    } else {
      // overId is a task - find which column contains that task
      for (const column of board.columns) {
        if (column.tasks.some(task => task.id === overId)) {
          targetColumn = column
          break
        }
      }
      
      if (!targetColumn) {
        return
      }
    }

    // Handle same-column reordering (only if dropped on a task, not column header)
    if (targetColumn.id === activeColumn.id && board.columns.find(col => col.id === overId) === undefined) {
      const oldIndex = activeColumn.tasks.findIndex((task) => task.id === activeId)
      const newIndex = activeColumn.tasks.findIndex((task) => task.id === overId)

      if (oldIndex !== -1 && newIndex !== -1 && oldIndex !== newIndex) {
        setBoard((prev) => {
          if (!prev) return prev

          const newColumns = [...prev.columns]
          const columnIndex = newColumns.findIndex((col) => col.id === activeColumn.id)

          newColumns[columnIndex] = {
            ...newColumns[columnIndex],
            tasks: arrayMove(newColumns[columnIndex].tasks, oldIndex, newIndex),
          }

          return { ...prev, columns: newColumns }
        })
      }
      return // Don't continue with move between columns
    }

    // Handle column changes - move task between columns
    if (targetColumn && activeColumn.id !== targetColumn.id) {
      const task = activeColumn.tasks.find((t) => t.id === activeId)
      if (task) {
        // Optimistically update UI first for immediate feedback
        setBoard((prev) => {
          if (!prev) return prev

          const newColumns = prev.columns.map((col) => {
            if (col.id === activeColumn.id) {
              return {
                ...col,
                tasks: col.tasks.filter((t) => t.id !== activeId),
              }
            }
            if (col.id === targetColumn.id) {
              return {
                ...col,
                tasks: [...col.tasks, { ...task, status: targetColumn.id as CPMTask["status"] }],
              }
            }
            return col
          })

          return { ...prev, columns: newColumns }
        })

        // Then move the actual file
        taskApi.moveTask(task.id, task.status, targetColumn.id as CPMTask["status"])
          .then(() => {
            // Refresh board data to ensure consistency
            return taskApi.fetchTasks()
          })
          .then(setBoard)
          .catch((error: Error) => {
            console.error("❌ Failed to move task file:", error)
            // Revert UI on error
            taskApi.fetchTasks().then(setBoard)
          })

        // Fire status change callback
        if (onStatusChange) {
          onStatusChange(activeId, targetColumn.id as CPMTask["status"])
        }
      }
    }
  }

  const handleCardClick = (task: CPMTask) => {
    setSelectedTask(task)
    setIsModalOpen(true)
  }

  const handleCreateTask = (taskData: Omit<CPMTask, "id" | "status" | "createdAt" | "updatedAt" | "filePath">) => {
    // Generate sequential task ID
    const existingTaskIds = board?.columns.flatMap(col => col.tasks.map(t => t.id)) || []
    const existingNumbers = existingTaskIds
      .filter(id => id.startsWith('T-'))
      .map(id => parseInt(id.replace('T-', ''), 10))
      .filter(num => !isNaN(num))
    const nextNumber = existingNumbers.length > 0 ? Math.max(...existingNumbers) + 1 : 1
    const taskId = `T-${nextNumber}`
    
    const newTask: CPMTask = {
      ...taskData,
      id: taskId,
      status: "inbox",
      filePath: `project/tasks/todo/${taskId}.md`,
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

    // Write the task file asynchronously
    taskApi.createTask(newTask).catch((error: Error) => {
      console.error("Failed to create task file:", error)
      // TODO: Show error toast and remove from UI
    })
  }

  const handleToggleChecklistItem = async (taskId: string, itemId: string) => {
    // Find the task first, outside of setBoard
    let targetTask: CPMTask | null = null
    if (board) {
      for (const column of board.columns) {
        const task = column.tasks.find(t => t.id === taskId)
        if (task) {
          targetTask = task
          break
        }
      }
    }

    if (!targetTask) {
      console.error('🔧 ERROR: Task not found:', taskId)
      return
    }

    // Create the updated task
    const newChecklist = targetTask.checklist.map((item) =>
      item.id === itemId ? { ...item, completed: !item.completed } : item,
    )
    const completedCount = newChecklist.filter((item) => item.completed).length
    const progress = newChecklist.length > 0 ? (completedCount / newChecklist.length) * 100 : 0

    const updatedTask: CPMTask = {
      ...targetTask,
      checklist: newChecklist,
      progress,
      updatedAt: new Date(),
    }

    // Update the UI optimistically
    setBoard((prev) => {
      if (!prev) return prev

      const newColumns = prev.columns.map((column) => ({
        ...column,
        tasks: column.tasks.map((task) =>
          task.id === taskId ? updatedTask : task
        ),
      }))

      return { ...prev, columns: newColumns }
    })

    // Update selected task if it's the same one
    if (selectedTask?.id === taskId) {
      setSelectedTask(updatedTask)
    }

    // Now make the API call with the guaranteed updated task
    try {
      await taskApi.updateTask(updatedTask)
    } catch (error) {
      console.error('🔧 FAILED to update task file:', error)
      // Revert UI on error - refetch fresh data
      try {
        const freshBoard = await taskApi.fetchTasks()
        setBoard(freshBoard)
        if (selectedTask?.id === taskId) {
          const freshTask = freshBoard?.columns
            .flatMap(col => col.tasks)
            .find(t => t.id === taskId)
          setSelectedTask(freshTask || null)
        }
      } catch (refetchError) {
        console.error('🔧 FAILED to refetch after error:', refetchError)
      }
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
        contextPackCount={contextPackCount}
      />

      <div className="p-6">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            {/* Editable Project Name */}
            {isEditingName ? (
              <input
                type="text"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                onBlur={() => setIsEditingName(false)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') setIsEditingName(false)
                  if (e.key === 'Escape') {
                    setProjectName("CPM Project Board")
                    setIsEditingName(false)
                  }
                }}
                className="text-2xl font-bold text-white bg-transparent border-b border-primary focus:outline-none focus:border-white/50 px-2 py-1"
                autoFocus
              />
            ) : (
              <div 
                className="group flex items-center gap-2 cursor-pointer"
                onClick={() => setIsEditingName(true)}
                title="Click to edit project name"
              >
                <h1 className="text-2xl font-bold text-white group-hover:text-primary transition-colors">
                  {projectName}
                </h1>
                <Pencil className="h-4 w-4 text-white/40 group-hover:text-primary/60 transition-all duration-200 opacity-0 group-hover:opacity-100" />
              </div>
            )}
            
          </div>

          {/* Controls and Metrics */}
          <div className="flex items-center gap-4">


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
          collisionDetection={customCollisionDetection}
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

      <ContextPack 
        isOpen={isContextPackOpen} 
        onClose={() => setIsContextPackOpen(false)}
        onResourceCountChange={setContextPackCount}
      />

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
