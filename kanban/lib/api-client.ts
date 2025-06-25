import type { CPMTask, CPMBoard } from "@/types/cmp"

/**
 * Client-side API service for task operations
 */
export class TaskApiClient {
  private baseUrl = '/api/tasks'

  async fetchTasks(): Promise<CPMBoard> {
    const response = await fetch(this.baseUrl)
    if (!response.ok) {
      throw new Error('Failed to fetch tasks')
    }
    return response.json()
  }

  async createTask(task: CPMTask): Promise<void> {
    const response = await fetch(this.baseUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        action: 'create',
        task,
      }),
    })

    if (!response.ok) {
      throw new Error('Failed to create task')
    }
  }

  async moveTask(taskId: string, oldStatus: CPMTask['status'], newStatus: CPMTask['status']): Promise<void> {
    const response = await fetch(this.baseUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        action: 'move',
        taskId,
        oldStatus,
        newStatus,
      }),
    })

    if (!response.ok) {
      throw new Error('Failed to move task')
    }
  }

  async updateTask(task: CPMTask): Promise<void> {
    console.log('🔗 API CLIENT: Sending update request for task:', task.id, 'checklist length:', task.checklist.length)
    
    const response = await fetch(this.baseUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        action: 'update',
        task,
      }),
    })

    console.log('🔗 API CLIENT: Response status:', response.status, response.statusText)

    if (!response.ok) {
      const errorText = await response.text()
      console.error('🔗 API CLIENT: Response error:', errorText)
      throw new Error('Failed to update task')
    }
    
    console.log('🔗 API CLIENT: Update request completed successfully')
  }

  async deleteTask(taskId: string, status: CPMTask['status']): Promise<void> {
    const response = await fetch(this.baseUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        action: 'delete',
        taskId,
        status,
      }),
    })

    if (!response.ok) {
      throw new Error('Failed to delete task')
    }
  }
}

export const taskApi = new TaskApiClient() 