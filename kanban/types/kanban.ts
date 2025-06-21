export interface Job {
  id: string
  title: string
  description: string
  status: "backlog" | "action-needed" | "running" | "done"
  checklist: ChecklistItem[]
  tags: string[]
  progress: number
  createdAt: Date
  updatedAt: Date
}

export interface ChecklistItem {
  id: string
  text: string
  completed: boolean
}

export interface Column {
  id: string
  title: string
  jobs: Job[]
}

export interface KanbanBoard {
  id: string
  title: string
  columns: Column[]
}
