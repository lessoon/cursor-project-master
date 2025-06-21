export interface TaskUpdate {
  taskId: string
  type: "status" | "checklist" | "progress"
  data: any
}

export class AIAutomationService {
  private listeners: ((update: TaskUpdate) => void)[] = []
  private isRunning = false

  subscribe(callback: (update: TaskUpdate) => void) {
    this.listeners.push(callback)
    return () => {
      this.listeners = this.listeners.filter((cb) => cb !== callback)
    }
  }

  private emit(update: TaskUpdate) {
    this.listeners.forEach((callback) => callback(update))
  }

  start() {
    if (this.isRunning) return
    this.isRunning = true
    this.simulateAIWork()
  }

  stop() {
    this.isRunning = false
  }

  private async simulateAIWork() {
    while (this.isRunning) {
      // Wait 3-8 seconds between actions
      await new Promise((resolve) => setTimeout(resolve, 3000 + Math.random() * 5000))

      if (!this.isRunning) break

      // Simulate different types of AI actions
      const actions = [
        () => this.simulateChecklistProgress(),
        () => this.simulateStatusTransition(),
        () => this.simulateNewTaskAnalysis(),
      ]

      const randomAction = actions[Math.floor(Math.random() * actions.length)]
      randomAction()
    }
  }

  private simulateChecklistProgress() {
    // Simulate AI completing checklist items
    const taskIds = ["task-7", "task-8", "task-9"] // Running tasks
    const randomTaskId = taskIds[Math.floor(Math.random() * taskIds.length)]

    this.emit({
      taskId: randomTaskId,
      type: "checklist",
      data: { itemIndex: Math.floor(Math.random() * 4) },
    })
  }

  private simulateStatusTransition() {
    // Simulate AI moving tasks between columns
    const transitions = [
      { from: "next-up", to: "running", taskIds: ["task-4", "task-5", "task-6"] },
      { from: "running", to: "done", taskIds: ["task-7", "task-8", "task-9"] },
    ]

    const randomTransition = transitions[Math.floor(Math.random() * transitions.length)]
    const randomTaskId = randomTransition.taskIds[Math.floor(Math.random() * randomTransition.taskIds.length)]

    this.emit({
      taskId: randomTaskId,
      type: "status",
      data: {
        from: randomTransition.from,
        to: randomTransition.to,
        reason: this.getTransitionReason(randomTransition.to),
      },
    })
  }

  private simulateNewTaskAnalysis() {
    // Simulate AI analyzing new tasks in inbox
    const inboxTasks = ["task-1", "task-2", "task-3"]
    const randomTaskId = inboxTasks[Math.floor(Math.random() * inboxTasks.length)]

    this.emit({
      taskId: randomTaskId,
      type: "progress",
      data: {
        activity: "Analyzing task requirements and dependencies...",
        progress: Math.floor(Math.random() * 30), // Small progress for analysis
      },
    })
  }

  private getTransitionReason(status: string): string {
    const reasons = {
      running: [
        "Dependencies resolved, starting implementation",
        "Prerequisites completed, moving to active development",
        "Resource allocation confirmed, beginning work",
      ],
      done: [
        "All acceptance criteria met, task completed",
        "Implementation finished and tested successfully",
        "Code review passed, ready for deployment",
      ],
    }

    const statusReasons = reasons[status as keyof typeof reasons] || ["Status updated"]
    return statusReasons[Math.floor(Math.random() * statusReasons.length)]
  }
}

export const aiAutomation = new AIAutomationService()
