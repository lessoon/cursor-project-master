import type { Job, KanbanBoard } from "@/types/kanban"

export const mockJobs: Job[] = [
  {
    id: "1",
    title: "Build Authentication System",
    description: "Implement secure user authentication with OAuth and JWT tokens",
    status: "backlog",
    checklist: [
      { id: "1-1", text: "Set up OAuth providers", completed: false },
      { id: "1-2", text: "Implement JWT handling", completed: false },
      { id: "1-3", text: "Create login/signup UI", completed: false },
      { id: "1-4", text: "Add password reset flow", completed: false },
    ],
    tags: ["auth", "security"],
    progress: 0,
    createdAt: new Date("2024-01-15"),
    updatedAt: new Date("2024-01-15"),
  },
  {
    id: "2",
    title: "Database Schema Design",
    description: "Design and implement the core database schema for user data",
    status: "action-needed",
    checklist: [
      { id: "2-1", text: "Define user table structure", completed: true },
      { id: "2-2", text: "Create migration scripts", completed: true },
      { id: "2-3", text: "Set up relationships", completed: false },
      { id: "2-4", text: "Add indexes for performance", completed: false },
    ],
    tags: ["database", "backend"],
    progress: 50,
    createdAt: new Date("2024-01-14"),
    updatedAt: new Date("2024-01-16"),
  },
  {
    id: "3",
    title: "API Rate Limiting",
    description: "Implement rate limiting to prevent API abuse",
    status: "running",
    checklist: [
      { id: "3-1", text: "Research rate limiting strategies", completed: true },
      { id: "3-2", text: "Implement Redis-based limiter", completed: true },
      { id: "3-3", text: "Add rate limit headers", completed: true },
      { id: "3-4", text: "Test with load testing", completed: false },
    ],
    tags: ["api", "performance"],
    progress: 75,
    createdAt: new Date("2024-01-13"),
    updatedAt: new Date("2024-01-17"),
  },
  {
    id: "4",
    title: "User Dashboard UI",
    description: "Create responsive dashboard interface for user management",
    status: "done",
    checklist: [
      { id: "4-1", text: "Design dashboard layout", completed: true },
      { id: "4-2", text: "Implement responsive grid", completed: true },
      { id: "4-3", text: "Add data visualization", completed: true },
      { id: "4-4", text: "Test across devices", completed: true },
    ],
    tags: ["ui", "dashboard"],
    progress: 100,
    createdAt: new Date("2024-01-10"),
    updatedAt: new Date("2024-01-16"),
  },
]

export const initialBoard: KanbanBoard = {
  id: "main-board",
  title: "CPM Project Board",
  columns: [
    {
      id: "backlog",
      title: "Backlog",
      jobs: mockJobs.filter((job) => job.status === "backlog"),
    },
    {
      id: "action-needed",
      title: "Action Needed",
      jobs: mockJobs.filter((job) => job.status === "action-needed"),
    },
    {
      id: "running",
      title: "Running",
      jobs: mockJobs.filter((job) => job.status === "running"),
    },
    {
      id: "done",
      title: "Done",
      jobs: mockJobs.filter((job) => job.status === "done"),
    },
  ],
}
