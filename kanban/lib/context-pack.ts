import { promises as fs } from 'fs'
import path from 'path'

export interface ContextResource {
  id: string
  title: string
  type: 'doc' | 'spec' | 'guide' | 'config'
  path: string
  content?: string
  size: number
  lastModified: Date
}

export class ContextPackService {
  private docsPath: string
  private cache: Map<string, ContextResource> = new Map()
  private lastScan: Date | null = null
  // Environment-based cache duration: fast updates in dev, efficient in production
  private readonly CACHE_DURATION = process.env.NODE_ENV === 'development' ? 2000 : 30000

  constructor() {
    // Path to docs directory relative to the kanban app
    this.docsPath = path.join(process.cwd(), '..', 'docs')
  }

  async getResources(): Promise<ContextResource[]> {
    // Check if cache is still valid
    if (this.lastScan && Date.now() - this.lastScan.getTime() < this.CACHE_DURATION) {
      return Array.from(this.cache.values())
    }

    await this.scanDocuments()
    return Array.from(this.cache.values())
  }

  async getResource(id: string): Promise<ContextResource | null> {
    await this.getResources() // Ensure cache is fresh
    const resource = this.cache.get(id)
    
    if (resource && !resource.content) {
      // Load content on demand
      try {
        const fullPath = path.join(this.docsPath, resource.path)
        resource.content = await fs.readFile(fullPath, 'utf-8')
      } catch (error) {
        console.error(`Failed to load content for ${id}:`, error)
        return null
      }
    }
    
    return resource || null
  }

  private async scanDocuments(): Promise<void> {
    this.cache.clear()
    
    try {
      await this.scanDirectory('', this.docsPath)
      this.lastScan = new Date()
    } catch (error) {
      console.error('Failed to scan documents:', error)
    }
  }

  private async scanDirectory(relativePath: string, fullPath: string): Promise<void> {
    try {
      const entries = await fs.readdir(fullPath, { withFileTypes: true })
      
      for (const entry of entries) {
        const entryPath = path.join(relativePath, entry.name)
        const entryFullPath = path.join(fullPath, entry.name)
        
        // Skip template directory and hidden files
        if (entry.name === '_templates' || entry.name.startsWith('.')) {
          continue
        }
        
        if (entry.isDirectory()) {
          await this.scanDirectory(entryPath, entryFullPath)
        } else if (entry.isFile() && this.isDocumentFile(entry.name)) {
          const stats = await fs.stat(entryFullPath)
          const resource: ContextResource = {
            id: this.generateId(entryPath),
            title: this.generateTitle(entry.name),
            type: this.getDocumentType(entry.name),
            path: entryPath,
            size: stats.size,
            lastModified: stats.mtime
          }
          
          this.cache.set(resource.id, resource)
        }
      }
    } catch (error) {
      console.error(`Failed to scan directory ${fullPath}:`, error)
    }
  }

  private isDocumentFile(filename: string): boolean {
    const ext = path.extname(filename).toLowerCase()
    return ['.md', '.txt', '.json', '.yaml', '.yml'].includes(ext)
  }

  private generateId(filePath: string): string {
    return filePath.replace(/[^a-zA-Z0-9]/g, '-').toLowerCase()
  }

  private generateTitle(filename: string): string {
    const nameWithoutExt = path.parse(filename).name
    
    // Convert kebab-case and snake_case to Title Case
    return nameWithoutExt
      .replace(/[-_]/g, ' ')
      .replace(/\b\w/g, l => l.toUpperCase())
  }

  private getDocumentType(filename: string): ContextResource['type'] {
    const name = filename.toLowerCase()
    
    if (name.includes('prd') || name.includes('requirement')) {
      return 'spec'
    }
    if (name.includes('guide') || name.includes('how') || name.includes('tutorial')) {
      return 'guide'
    }
    if (name.includes('config') || name.includes('env') || name.includes('setting')) {
      return 'config'
    }
    
    return 'doc'
  }

  async searchResources(query: string): Promise<ContextResource[]> {
    const resources = await this.getResources()
    const lowercaseQuery = query.toLowerCase()
    
    return resources.filter(resource => 
      resource.title.toLowerCase().includes(lowercaseQuery) ||
      resource.path.toLowerCase().includes(lowercaseQuery)
    )
  }
}

// Singleton instance
export const contextPack = new ContextPackService() 