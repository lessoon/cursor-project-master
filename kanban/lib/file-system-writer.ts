import type { CPMTask } from "@/types/cmp"
import { promises as fs } from 'fs'
import path from 'path'

/**
 * Convert a CPMTask back to markdown format
 */
function taskToMarkdown(task: CPMTask): string {
  const lines: string[] = []
  
  // Title
  lines.push(`# ${task.title}`)
  lines.push('')
  
  // Frontmatter-style metadata
  if (task.labels.includes('feature') || task.labels.includes('enhancement') || task.labels.includes('bugfix')) {
    const type = task.labels.find(label => ['feature', 'enhancement', 'bugfix', 'testing', 'docs'].includes(label)) || 'feature'
    lines.push(`**Type:** ${type}`)
  }
  
  // Add labels as metadata (limit to 2 as specified)
  if (task.labels.length > 0) {
    const displayLabels = task.labels.slice(0, 2) // Show at most 2 labels
    lines.push(`**Labels:** ${displayLabels.join(', ')}`)
  }
  
  // Calculate effort from progress or default
  const effort = Math.ceil(task.checklist.length / 3) || 1
  lines.push(`**Effort:** ${effort} points`)
  
  // Status (though this will be overridden by file location)
  lines.push(`**Status:** ${task.status}`)
  lines.push('')
  
  // UI review flag if needed
  if (task.labels.includes('ui') || task.labels.includes('design')) {
    lines.push('design-stop: pending')
    lines.push('')
  }
  
  // Description
  lines.push('## Description')
  lines.push(task.description || task.summary)
  lines.push('')
  
  // Acceptance Criteria (derived from first part of checklist if available)
  if (task.checklist.length > 0) {
    lines.push('## Acceptance Criteria')
    // Take first few checklist items as acceptance criteria
    const criteriaCount = Math.min(5, Math.ceil(task.checklist.length / 2))
    for (let i = 0; i < criteriaCount; i++) {
      if (task.checklist[i]) {
        const checked = task.checklist[i].completed ? 'x' : ' '
        lines.push(`- [${checked}] ${task.checklist[i].text}`)
      }
    }
    lines.push('')
  }
  
  // Dependencies (placeholder)
  lines.push('## Dependencies')
  lines.push('None')
  lines.push('')
  
  // Checklist
  if (task.checklist.length > 0) {
    lines.push('## Checklist')
    task.checklist.forEach(item => {
      const checked = item.completed ? 'x' : ' '
      lines.push(`- [${checked}] ${item.text}`)
    })
    lines.push('')
  }
  
  // Notes
  lines.push('## Notes')
  lines.push(`Task progress: ${task.progress}% complete`)
  if (task.filePath) {
    lines.push(`File path: ${task.filePath}`)
  }
  lines.push('')
  
  return lines.join('\n')
}

/**
 * Get the directory path for a task based on its status
 */
function getTaskDirectory(status: CPMTask['status']): string {
  const projectRoot = process.cwd().replace('/kanban', '')
  const tasksDir = path.join(projectRoot, 'project', 'tasks')
  
  switch (status) {
    case 'inbox':
      return path.join(tasksDir, 'backlog')
    case 'next-up':
      return path.join(tasksDir, 'todo')
    case 'running':
      return path.join(tasksDir, 'in_progress')
    case 'done':
      return path.join(tasksDir, 'done')
    default:
      return path.join(tasksDir, 'backlog')
  }
}

/**
 * Write a task to a markdown file
 */
export async function writeTaskFile(task: CPMTask): Promise<void> {
  try {
    const targetDir = getTaskDirectory(task.status)
    const fileName = `${task.id}.md`
    const filePath = path.join(targetDir, fileName)
    
    // Ensure directory exists
    await fs.mkdir(targetDir, { recursive: true })
    
    // Convert task to markdown
    const markdown = taskToMarkdown(task)
    
    // Write file
    await fs.writeFile(filePath, markdown, 'utf-8')
    
    console.log(`Task ${task.id} written to ${filePath}`)
  } catch (error) {
    console.error(`Error writing task file for ${task.id}:`, error)
    throw error
  }
}

/**
 * Move a task file to a different directory based on status change
 */
export async function moveTaskFile(taskId: string, oldStatus: CPMTask['status'], newStatus: CPMTask['status']): Promise<void> {
  try {
    const oldDir = getTaskDirectory(oldStatus)
    const newDir = getTaskDirectory(newStatus)
    
    const fileName = `${taskId}.md`
    const oldPath = path.join(oldDir, fileName)
    const newPath = path.join(newDir, fileName)
    
    // Check if source file exists
    try {
      await fs.access(oldPath)
    } catch (error) {
      console.warn(`Source file ${oldPath} does not exist, skipping move`)
      return
    }
    
    // Ensure target directory exists
    await fs.mkdir(newDir, { recursive: true })
    
    // Read, update status in content, and write to new location
    const content = await fs.readFile(oldPath, 'utf-8')
    const updatedContent = content.replace(
      /\*\*Status:\*\* \w+/,
      `**Status:** ${newStatus}`
    )
    
    await fs.writeFile(newPath, updatedContent, 'utf-8')
    
    // Remove old file
    await fs.unlink(oldPath)
    
    console.log(`Task ${taskId} moved from ${oldPath} to ${newPath}`)
  } catch (error) {
    console.error(`Error moving task file ${taskId}:`, error)
    throw error
  }
}

/**
 * Update a task file with new checklist state
 */
export async function updateTaskFile(task: CPMTask): Promise<void> {
  try {
    const targetDir = getTaskDirectory(task.status)
    const fileName = `${task.id}.md`
    const filePath = path.join(targetDir, fileName)
    
    // Read existing file
    let content: string
    try {
      content = await fs.readFile(filePath, 'utf-8')
    } catch (error) {
      // File doesn't exist, create new one
      await writeTaskFile(task)
      return
    }
    
    // Update checklist items in the content
    const lines = content.split('\n')
    let inChecklistSection = false
    let checklistIndex = 0
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim()
      
      if (line === '## Checklist') {
        inChecklistSection = true
        continue
      } else if (line.startsWith('## ') && inChecklistSection) {
        inChecklistSection = false
        continue
      }
      
      if (inChecklistSection && line.startsWith('- [')) {
        if (checklistIndex < task.checklist.length) {
          const item = task.checklist[checklistIndex]
          const checked = item.completed ? 'x' : ' '
          console.log(`📝 Updating checklist item ${checklistIndex}: "${item.text}" -> ${checked ? 'CHECKED' : 'UNCHECKED'}`)
          // Update the line regardless of the original text - just match the checkbox pattern
          lines[i] = `- [${checked}] ${item.text}`
          checklistIndex++
        }
      }
    }
    
    console.log(`Updated ${checklistIndex} checklist items for task ${task.id}`)
    
    // Write updated content
    await fs.writeFile(filePath, lines.join('\n'), 'utf-8')
    
    console.log(`Task ${task.id} updated in ${filePath}`)
  } catch (error) {
    console.error(`Error updating task file for ${task.id}:`, error)
    throw error
  }
}

/**
 * Delete a task file
 */
export async function deleteTaskFile(taskId: string, status: CPMTask['status']): Promise<void> {
  try {
    const targetDir = getTaskDirectory(status)
    const fileName = `${taskId}.md`
    const filePath = path.join(targetDir, fileName)
    
    await fs.unlink(filePath)
    console.log(`Task ${taskId} deleted from ${filePath}`)
  } catch (error) {
    console.error(`Error deleting task file ${taskId}:`, error)
    throw error
  }
} 