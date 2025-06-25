import { NextRequest, NextResponse } from 'next/server'
import { parseCPMTasksFromFiles } from '@/lib/file-system-reader'
import { writeTaskFile, moveTaskFile, updateTaskFile, deleteTaskFile } from '@/lib/file-system-writer'
import type { CPMTask } from '@/types/cmp'

export async function GET() {
  try {
    const board = await parseCPMTasksFromFiles()
    return NextResponse.json(board)
  } catch (error) {
    console.error('Error fetching tasks:', error)
    return NextResponse.json({ error: 'Failed to fetch tasks' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { action, ...data } = await request.json()

    switch (action) {
      case 'create':
        await writeTaskFile(data.task as CPMTask)
        return NextResponse.json({ success: true })

      case 'move':
        await moveTaskFile(data.taskId, data.oldStatus, data.newStatus)
        return NextResponse.json({ success: true })

      case 'update':
        console.log('🚀 API ROUTE: Processing update for task:', (data.task as CPMTask).id)
        await updateTaskFile(data.task as CPMTask)
        console.log('🚀 API ROUTE: Update completed successfully')
        return NextResponse.json({ success: true })

      case 'delete':
        await deleteTaskFile(data.taskId, data.status)
        return NextResponse.json({ success: true })

      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
    }
  } catch (error) {
    console.error('Error processing task operation:', error)
    return NextResponse.json({ error: 'Operation failed' }, { status: 500 })
  }
} 