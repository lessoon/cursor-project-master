export interface CPMTask {
  id: string
  title: string
  summary: string
  labels: string[]
  status: "inbox" | "next-up" | "running" | "done"
  checklist: ChecklistItem[]
  description?: string
  filePath: string
  progress: number
  createdAt: Date
  updatedAt: Date
}

export interface ChecklistItem {
  id: string
  text: string
  completed: boolean
}

export interface CPMPlan {
  taskId: string
  activities: string[]
}

export interface ProjectStatus {
  phase: string
  health: "good" | "warning" | "critical"
}

export interface CPMColumn {
  id: "inbox" | "next-up" | "running" | "done"
  title: string
  tasks: CPMTask[]
}

export interface CPMBoard {
  columns: CPMColumn[]
  projectStatus: ProjectStatus
}

export interface Attachment {
  id: string
  name: string
  type: "doc" | "repo" | "link"
  url: string
}
