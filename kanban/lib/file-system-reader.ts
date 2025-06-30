import type { CPMTask, CPMBoard, ChecklistItem } from "@/types/cmp"
import { promises as fs } from 'fs'
import path from 'path'

interface TaskFrontMatter {
  epic?: string
  type?: string
  effort?: number
  status?: string
  dependencies?: string[]
}

/**
 * Parse markdown frontmatter and content
 */
function parseTaskFile(content: string, filePath: string): CPMTask | null {
  try {
    const lines = content.split('\n')
    
    // Extract title from first heading
    const titleLine = lines.find(line => line.startsWith('# '))
    const title = titleLine ? titleLine.replace('# ', '').trim() : path.basename(filePath, '.md')
    
    // Extract frontmatter-style metadata
    const frontMatter: TaskFrontMatter = {}
    let description = ''
    let acceptanceCriteria: string[] = []
    let checklist: ChecklistItem[] = []
    let dependencies: string[] = []
    
    let currentSection = ''
    let checklistIndex = 0
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim()
      
      // Parse frontmatter-style fields
      if (line.startsWith('**Epic:**')) {
        frontMatter.epic = line.replace('**Epic:**', '').trim()
      } else if (line.startsWith('**Type:**')) {
        frontMatter.type = line.replace('**Type:**', '').trim()
      } else if (line.startsWith('**Effort:**')) {
        const effortMatch = line.match(/(\d+)/)
        frontMatter.effort = effortMatch ? parseInt(effortMatch[1]) : 1
      } else if (line.startsWith('**Status:**')) {
        frontMatter.status = line.replace('**Status:**', '').trim()
      }
      
      // Identify sections
      if (line.startsWith('## Description')) {
        currentSection = 'description'
        continue
      } else if (line.startsWith('## Acceptance Criteria')) {
        currentSection = 'criteria'
        continue
      } else if (line.startsWith('## Dependencies')) {
        currentSection = 'dependencies'
        continue
      } else if (line.startsWith('## Checklist')) {
        currentSection = 'checklist'
        continue
      } else if (line.startsWith('## ')) {
        currentSection = 'other'
        continue
      }
      
      // Parse section content
      if (currentSection === 'description' && line && !line.startsWith('##')) {
        description += line + ' '
      } else if (currentSection === 'criteria' && line.startsWith('- [ ]')) {
        acceptanceCriteria.push(line.replace('- [ ]', '').trim())
      } else if (currentSection === 'dependencies' && line && !line.startsWith('-') && line !== 'None') {
        const depMatch = line.match(/T-(\d+)/)
        if (depMatch) {
          dependencies.push(`T-${depMatch[1]}`)
        }
      } else if (currentSection === 'checklist' && line.startsWith('- [')) {
        const completed = line.startsWith('- [x]')
        const text = line.replace(/- \[[x ]\]/, '').trim()
        checklist.push({
          id: `${path.basename(filePath, '.md')}-${checklistIndex++}`,
          text,
          completed
        })
      }
    }
    
    // Determine status from file location
    const pathParts = filePath.split(path.sep)
    let status: CPMTask['status'] = 'inbox'
    
    if (pathParts.includes('in_progress')) {
      status = 'running'
    } else if (pathParts.includes('done')) {
      status = 'done'
    } else if (pathParts.includes('todo')) {
      status = 'next-up'
    } else if (pathParts.includes('backlog')) {
      status = 'inbox'
    }
    
    // Generate summary from description or title
    const summary = description.trim() 
      ? description.trim().substring(0, 100) + (description.length > 100 ? '...' : '')
      : `${frontMatter.type || 'Task'} for ${frontMatter.epic || 'project'}`
    
    // Calculate progress based on completed checklist items
    const completedItems = checklist.filter(item => item.completed).length
    const progress = checklist.length > 0 ? Math.round((completedItems / checklist.length) * 100) : 0
    
    // Extract labels from epic and type
    const labels: string[] = []
    if (frontMatter.type) labels.push(frontMatter.type)
    if (frontMatter.epic) {
      const epicLabel = frontMatter.epic.toLowerCase().replace(/[^a-z0-9]/g, '-')
      labels.push(epicLabel)
    }
    
    const task: CPMTask = {
      id: path.basename(filePath, '.md'),
      title,
      summary,
      labels,
      status,
      checklist,
      description: description.trim(),
      filePath,
      progress,
      createdAt: new Date(), // TODO: Get from file stats
      updatedAt: new Date()  // TODO: Get from file stats
    }
    
    return task
  } catch (error) {
    console.error(`Error parsing task file ${filePath}:`, error)
    return null
  }
}

/**
 * Read all task files from the project/tasks directory structure
 */
export async function readTaskFiles(): Promise<CPMTask[]> {
  const tasks: CPMTask[] = []
  const projectRoot = process.cwd().replace('/kanban', '') // Adjust for running from kanban directory
  const tasksDir = path.join(projectRoot, 'project', 'tasks')
  
  try {
    // Read from all subdirectories: todo, in_progress, done, backlog
    const subdirs = ['todo', 'in_progress', 'done', 'backlog']
    
    for (const subdir of subdirs) {
      const subdirPath = path.join(tasksDir, subdir)
      
      try {
        const files = await fs.readdir(subdirPath)
        
        for (const file of files) {
          if (file.endsWith('.md')) {
            const filePath = path.join(subdirPath, file)
            const content = await fs.readFile(filePath, 'utf-8')
            const task = parseTaskFile(content, filePath)
            
            if (task) {
              tasks.push(task)
            }
          }
        }
      } catch (error) {
        console.warn(`Could not read directory ${subdirPath}:`, error)
      }
    }
    
    return tasks
  } catch (error) {
    console.error('Error reading task files:', error)
    return []
  }
}

/**
 * Parse tasks into board structure
 */
export async function parseCPMTasksFromFiles(): Promise<CPMBoard> {
  const tasks = await readTaskFiles()
  
  const board: CPMBoard = {
    columns: [
      {
        id: "inbox",
        title: "Inbox",
        tasks: tasks.filter(task => task.status === "inbox")
      },
      {
        id: "next-up", 
        title: "Next Up",
        tasks: tasks.filter(task => task.status === "next-up")
      },
      {
        id: "running",
        title: "Running", 
        tasks: tasks.filter(task => task.status === "running")
      },
      {
        id: "done",
        title: "Done",
        tasks: tasks.filter(task => task.status === "done")
      }
    ],
    projectStatus: {
      phase: "Development",
      health: tasks.length > 0 ? "good" : "warning"
    }
  }
  
  return board
} 