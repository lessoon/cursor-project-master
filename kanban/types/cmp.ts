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

export interface CPMColumn {
  id: "inbox" | "next-up" | "running" | "done"
  title: string
  tasks: CPMTask[]
}

export interface CPMBoard {
  columns: CPMColumn[]
  projectStatus: ProjectStatus
}

export interface ProjectStatus {
  phase: string
  health: "good" | "warning" | "critical"
}

// AI Automation Types
export interface TaskUpdate {
  taskId: string
  type: "status" | "checklist" | "progress"
  data: any
}

export interface AIActivity {
  taskId: string
  description: string
  timestamp: Date
  type: "checklist" | "transition" | "analysis"
}

// Document Management Types
export interface Resource {
  id: string
  name: string
  type: "doc" | "repo" | "env" | "config" | "markdown" | "text"
  content?: string
  url?: string
  createdAt?: Date
  updatedAt?: Date
  size?: number
}

export interface DocumentViewerProps {
  resource: Resource | null
  isOpen: boolean
  onClose: () => void
}

export interface AddResourceProps {
  isOpen: boolean
  onClose: () => void
  onAddResource: (resource: Omit<Resource, "id" | "createdAt" | "updatedAt">) => void
}

// Gemini AI Integration Types
export interface GeminiTaskGeneration {
  title: string
  summary: string
  description: string
  checklist: Array<{ text: string; completed: boolean }>
  labels: string[]
}

export interface GeminiSettings {
  apiKey: string | null
  isValid: boolean
  lastValidated?: Date
}

// Animation and UI State Types
export interface AnimationState {
  isTransitioning: boolean
  transitionDirection: "left" | "right"
  isAIWorking: boolean
  recentActivity?: string
}

export interface UIState {
  selectedTask: CPMTask | null
  isModalOpen: boolean
  isCreateModalOpen: boolean
  isSettingsModalOpen: boolean
  isContextPackOpen: boolean
  dragOverColumn: string | null
}

// Metrics and Analytics Types
export interface ProjectMetrics {
  totalTasks: number
  activeTasks: number
  completedTasks: number
  overallProgress: number
  aiAutomationRate: number
  averageCompletionTime: number
}

export interface AIMetrics {
  tasksAutomated: number
  checklistItemsCompleted: number
  averageTransitionTime: number
  automationAccuracy: number
}
