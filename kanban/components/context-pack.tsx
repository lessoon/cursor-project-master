"use client"

import { useState, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { DocumentViewerModal } from "./document-viewer-modal"
import { X, Search, FileText, Book, FileCode, Cog, Plus } from "lucide-react"
import { cn } from "@/lib/utils"

interface Resource {
  id: string
  title: string
  type: "doc" | "spec" | "guide" | "config"
  path: string
  size: number
  lastModified: Date
  content?: string
}

interface ContextPackProps {
  isOpen: boolean
  onClose: () => void
  onResourceCountChange?: (count: number) => void
}

// Context pack service functions
const fetchResources = async (): Promise<Resource[]> => {
  try {
    const response = await fetch('/api/context-pack')
    if (!response.ok) throw new Error('Failed to fetch resources')
    const data = await response.json()
    return data.resources || []
  } catch (error) {
    console.error('Failed to fetch context pack resources:', error)
    return []
  }
}

const fetchResourceContent = async (id: string): Promise<Resource | null> => {
  try {
    const response = await fetch(`/api/context-pack?id=${encodeURIComponent(id)}`)
    if (!response.ok) throw new Error('Failed to fetch resource content')
    return await response.json()
  } catch (error) {
    console.error('Failed to fetch resource content:', error)
    return null
  }
}

export function ContextPack({ isOpen, onClose, onResourceCountChange }: ContextPackProps) {
  const [resources, setResources] = useState<Resource[]>([])
  const [filteredResources, setFilteredResources] = useState<Resource[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedResource, setSelectedResource] = useState<Resource | null>(null)
  const [isDocumentModalOpen, setIsDocumentModalOpen] = useState(false)
  const [loading, setLoading] = useState(true)

  const loadResources = useCallback(async () => {
    setLoading(true)
    try {
      const resourceList = await fetchResources()
      setResources(resourceList)
      onResourceCountChange?.(resourceList.length)
    } catch (error) {
      console.error('Failed to load resources:', error)
    } finally {
      setLoading(false)
    }
  }, [onResourceCountChange])

  // Load resources on mount
  useEffect(() => {
    if (isOpen) {
      loadResources()
    }
  }, [isOpen, loadResources])

  // Filter resources based on search
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredResources(resources)
    } else {
      const query = searchQuery.toLowerCase()
      const filtered = resources.filter(resource =>
        resource.title.toLowerCase().includes(query) ||
        resource.path.toLowerCase().includes(query) ||
        resource.type.toLowerCase().includes(query)
      )
      setFilteredResources(filtered)
    }
  }, [searchQuery, resources])

  const handleOpenDocument = async (resource: Resource) => {
    try {
      const resourceWithContent = await fetchResourceContent(resource.id)
      if (resourceWithContent) {
        setSelectedResource(resourceWithContent)
        setIsDocumentModalOpen(true)
      }
    } catch (error) {
      console.error('Failed to load document:', error)
    }
  }

  const getResourceIcon = (type: Resource["type"]) => {
    switch (type) {
      case "spec":
        return FileCode
      case "guide":
        return Book
      case "config":
        return Cog
      default:
        return FileText
    }
  }

  const getResourceColor = (type: Resource["type"]) => {
    switch (type) {
      case "spec":
        return "bg-blue-500/10 text-blue-600 border-blue-500/20"
      case "guide":
        return "bg-green-500/10 text-green-600 border-green-500/20"
      case "config":
        return "bg-purple-500/10 text-purple-600 border-purple-500/20"
      default:
        return "bg-gray-500/10 text-gray-600 border-gray-500/20"
    }
  }

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  }

  const formatDate = (date: Date): string => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
  }

  if (!isOpen) return null

  return (
    <>
      <div className="fixed inset-0 bg-black/50 z-40" onClick={onClose} />
      <div className="fixed right-0 top-0 h-full w-96 bg-gray-900 border-l border-white/10 z-50 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/10">
          <h2 className="text-xl font-semibold text-white">Context Pack</h2>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="text-gray-400 hover:text-white hover:bg-white/10"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Search */}
        <div className="p-4 border-b border-white/10">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search resources..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-white/5 border-white/10 text-white placeholder-gray-400 focus:border-white/20"
            />
          </div>
        </div>

        {/* Resource List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {loading ? (
            <div className="text-center text-gray-400 py-8">
              Loading resources...
            </div>
          ) : filteredResources.length === 0 ? (
            <div className="text-center text-gray-400 py-8">
              {searchQuery ? 'No resources found' : 'No resources available'}
            </div>
          ) : (
            filteredResources.map((resource) => {
              const Icon = getResourceIcon(resource.type)
              return (
                <div
                  key={resource.id}
                  className="group bg-white/5 rounded-lg p-3 border border-white/10 hover:bg-white/10 transition-colors cursor-pointer"
                  onClick={() => handleOpenDocument(resource)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={cn(
                        "p-1.5 rounded border flex-shrink-0",
                        getResourceColor(resource.type)
                      )}>
                        <Icon className="h-3 w-3" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-white text-sm group-hover:text-[#5B8EFF] transition-colors truncate">
                          {resource.title}
                        </h3>
                        <p className="text-xs text-gray-400">
                          {resource.type}
                        </p>
                      </div>
                    </div>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="opacity-0 group-hover:opacity-100 transition-opacity text-xs px-2 py-1 h-auto text-white hover:text-white"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleOpenDocument(resource)
                      }}
                    >
                      Open
                    </Button>
                  </div>
                </div>
              )
            })
          )}
        </div>

        {/* Footer with Add Resource Button */}
        <div className="p-6">
          <Button
            onClick={() => {/* TODO: Implement add resource functionality */}}
            className="w-full bg-[#5B8EFF] hover:bg-[#5B8EFF]/80 text-white font-medium py-3"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Resource
          </Button>
        </div>
      </div>

      {/* Document Viewer Modal */}
      <DocumentViewerModal
        isOpen={isDocumentModalOpen}
        onClose={() => {
          setIsDocumentModalOpen(false)
          setSelectedResource(null)
        }}
        resource={selectedResource ? {
          id: selectedResource.id,
          name: selectedResource.title,
          content: selectedResource.content || '',
          type: selectedResource.type
        } : null}
      />
    </>
  )
}
