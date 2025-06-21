import type { CPMTask, ProjectStatus, CPMBoard } from "@/types/cpm"

// Mock implementation - in real app, this would scan /docs/**/task.md files
export async function parseCPMTasks(): Promise<CPMBoard> {
  // Simulate parsing markdown files with front-matter
  const mockTasks: CPMTask[] = [
    {
      id: "task-1",
      title: "Implement OAuth Authentication",
      summary: "Set up secure user authentication with Google and GitHub providers",
      labels: ["auth", "security"],
      status: "inbox",
      checklist: [
        { id: "1-1", text: "Configure OAuth providers", completed: false },
        { id: "1-2", text: "Create login UI components", completed: false },
        { id: "1-3", text: "Add session management", completed: false },
        { id: "1-4", text: "Test authentication flow", completed: false },
      ],
      description:
        "Build a comprehensive authentication system supporting multiple OAuth providers. This includes setting up provider configurations, creating secure session management, and implementing proper error handling for authentication failures.",
      filePath: "/docs/auth/task.md",
      progress: 0,
      createdAt: new Date("2024-01-15"),
      updatedAt: new Date("2024-01-15"),
    },
    {
      id: "task-2",
      title: "Design Database Schema",
      summary: "Create normalized schema for user data and application state",
      labels: ["database", "backend"],
      status: "next-up",
      checklist: [
        { id: "2-1", text: "Define user table structure", completed: true },
        { id: "2-2", text: "Create relationship mappings", completed: true },
        { id: "2-3", text: "Add performance indexes", completed: false },
        { id: "2-4", text: "Write migration scripts", completed: false },
      ],
      description:
        "Design a scalable database schema that supports user management, application data, and future feature expansion. Focus on normalization and query performance optimization.",
      filePath: "/docs/database/task.md",
      progress: 50,
      createdAt: new Date("2024-01-14"),
      updatedAt: new Date("2024-01-16"),
    },
    {
      id: "task-3",
      title: "Build API Rate Limiter",
      summary: "Implement Redis-based rate limiting for API endpoints",
      labels: ["api", "performance"],
      status: "running",
      checklist: [
        { id: "3-1", text: "Set up Redis connection", completed: true },
        { id: "3-2", text: "Implement sliding window algorithm", completed: true },
        { id: "3-3", text: "Add rate limit headers", completed: true },
        { id: "3-4", text: "Create monitoring dashboard", completed: false },
        { id: "3-5", text: "Load test implementation", completed: false },
      ],
      description:
        "Create a robust rate limiting system to prevent API abuse and ensure fair usage across all clients. Uses Redis for distributed rate limiting across multiple server instances.",
      filePath: "/docs/api/rate-limiter/task.md",
      progress: 60,
      createdAt: new Date("2024-01-13"),
      updatedAt: new Date("2024-01-17"),
    },
    {
      id: "task-4",
      title: "Create User Dashboard",
      summary: "Build responsive dashboard with data visualization components",
      labels: ["ui", "dashboard"],
      status: "done",
      checklist: [
        { id: "4-1", text: "Design dashboard layout", completed: true },
        { id: "4-2", text: "Implement chart components", completed: true },
        { id: "4-3", text: "Add responsive breakpoints", completed: true },
        { id: "4-4", text: "Optimize for mobile", completed: true },
      ],
      description:
        "A comprehensive user dashboard featuring real-time data visualization, responsive design, and intuitive navigation. Includes charts, metrics, and user management tools.",
      filePath: "/docs/ui/dashboard/task.md",
      progress: 100,
      createdAt: new Date("2024-01-10"),
      updatedAt: new Date("2024-01-16"),
    },
  ]

  const projectStatus: ProjectStatus = {
    phase: "Development",
    health: "good",
  }

  return {
    columns: [
      {
        id: "inbox",
        title: "Inbox",
        tasks: mockTasks.filter((task) => task.status === "inbox"),
      },
      {
        id: "next-up",
        title: "Next Up",
        tasks: mockTasks.filter((task) => task.status === "next-up"),
      },
      {
        id: "running",
        title: "Running",
        tasks: mockTasks.filter((task) => task.status === "running"),
      },
      {
        id: "done",
        title: "Done",
        tasks: mockTasks.filter((task) => task.status === "done"),
      },
    ],
    projectStatus,
  }
}

// Mock function to get AI plan activities
export async function getCPMPlan(taskId: string): Promise<string[]> {
  // In real app, this would read plan.json for the task
  const mockActivities = [
    "Analyzed authentication requirements and security constraints",
    "Researched OAuth 2.0 best practices and provider documentation",
    "Created initial implementation plan with 4 key milestones",
  ]

  return mockActivities.slice(0, 3) // Last 3 activities
}
