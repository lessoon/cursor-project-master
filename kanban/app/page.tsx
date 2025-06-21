"use client"

import { KanbanBoard } from "@/components/kanban-board"

export default function HomePage() {
  const handleStatusChange = (taskId: string, newStatus: string) => {
    console.log(`Task ${taskId} moved to ${newStatus}`)
    // In real app, this would update the markdown file
  }

  return <KanbanBoard onStatusChange={handleStatusChange} />
}
