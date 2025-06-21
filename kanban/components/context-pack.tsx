"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { DocumentViewerModal } from "./document-viewer-modal"
import { AddResourceModal } from "./add-resource-modal"
import { X, Search, FileText, Database, Settings, Plus } from "lucide-react"
import { cn } from "@/lib/utils"

interface Resource {
  id: string
  name: string
  type: "doc" | "repo" | "env" | "config" | "markdown" | "text"
  content?: string
  url?: string
}

interface ContextPackProps {
  isOpen: boolean
  onClose: () => void
}

// Mock resources with markdown content
const mockResources: Resource[] = [
  {
    id: "1",
    name: "API Documentation",
    type: "doc",
    content: `# API Documentation

## Overview
This document describes the REST API endpoints for our application.

## Authentication
All API requests require authentication using JWT tokens.

### Getting a Token
\`\`\`bash
POST /api/auth/login
{
  "email": "user@example.com",
  "password": "password"
}
\`\`\`

## Endpoints

### Users
- **GET** \`/api/users\` - Get all users
- **POST** \`/api/users\` - Create a new user
- **GET** \`/api/users/:id\` - Get user by ID

### Tasks
- **GET** \`/api/tasks\` - Get all tasks
- **POST** \`/api/tasks\` - Create a new task
- **PUT** \`/api/tasks/:id\` - Update a task
- **DELETE** \`/api/tasks/:id\` - Delete a task

## Error Handling
All errors return a JSON object with the following structure:
\`\`\`json
{
  "error": "Error message",
  "code": "ERROR_CODE",
  "details": {}
}
\`\`\``,
    url: "/docs/api",
  },
  {
    id: "2",
    name: "Database Schema",
    type: "doc",
    content: `# Database Schema

## Tables

### Users Table
\`\`\`sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
\`\`\`

### Tasks Table
\`\`\`sql
CREATE TABLE tasks (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  status VARCHAR(50) DEFAULT 'inbox',
  user_id INTEGER REFERENCES users(id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
\`\`\`

## Relationships
- Users can have many tasks
- Tasks belong to one user

## Indexes
- \`users.email\` - Unique index for fast lookups
- \`tasks.user_id\` - Foreign key index
- \`tasks.status\` - Index for filtering by status`,
    url: "/docs/schema",
  },
  {
    id: "3",
    name: "Main Repository",
    type: "repo",
    content: `# Project Repository

## Structure
\`\`\`
project/
├── src/
│   ├── components/
│   ├── pages/
│   ├── utils/
│   └── types/
├── docs/
├── tests/
└── package.json
\`\`\`

## Getting Started
1. Clone the repository
2. Install dependencies: \`npm install\`
3. Start development server: \`npm run dev\`

## Contributing
Please read our contributing guidelines before submitting PRs.`,
    url: "https://github.com/...",
  },
  {
    id: "4",
    name: "Environment Variables",
    type: "env",
    content: `# Environment Configuration

## Required Variables

### Database
- \`DATABASE_URL\` - PostgreSQL connection string
- \`DATABASE_SSL\` - Enable SSL for database connections

### Authentication
- \`JWT_SECRET\` - Secret key for JWT token signing
- \`JWT_EXPIRES_IN\` - Token expiration time (default: 24h)

### External APIs
- \`GEMINI_API_KEY\` - Google Gemini API key
- \`STRIPE_SECRET_KEY\` - Stripe payment processing

### Application
- \`NODE_ENV\` - Environment (development/production)
- \`PORT\` - Server port (default: 3000)
- \`CORS_ORIGIN\` - Allowed CORS origins

## Example .env file
\`\`\`
DATABASE_URL=postgresql://user:pass@localhost:5432/db
JWT_SECRET=your-secret-key
GEMINI_API_KEY=your-gemini-key
NODE_ENV=development
PORT=3000
\`\`\``,
  },
  {
    id: "5",
    name: "Deployment Config",
    type: "config",
    content: `# Deployment Configuration

## Docker Setup
\`\`\`dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
\`\`\`

## Kubernetes Deployment
\`\`\`yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: cpm-app
spec:
  replicas: 3
  selector:
    matchLabels:
      app: cpm-app
  template:
    metadata:
      labels:
        app: cpm-app
    spec:
      containers:
      - name: app
        image: cpm-app:latest
        ports:
        - containerPort: 3000
\`\`\`

## CI/CD Pipeline
- Build and test on every PR
- Deploy to staging on merge to main
- Deploy to production on release tags`,
  },
]

export function ContextPack({ isOpen, onClose }: ContextPackProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [resources, setResources] = useState<Resource[]>(mockResources)
  const [selectedDocument, setSelectedDocument] = useState<Resource | null>(null)
  const [isDocumentModalOpen, setIsDocumentModalOpen] = useState(false)
  const [isAddResourceModalOpen, setIsAddResourceModalOpen] = useState(false)

  const filteredResources = resources.filter((resource) =>
    resource.name.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const handleOpenDocument = (resource: Resource) => {
    setSelectedDocument(resource)
    setIsDocumentModalOpen(true)
  }

  const handleAddResource = (newResource: { name: string; content: string; type: string }) => {
    const resource: Resource = {
      id: `resource-${Date.now()}`,
      name: newResource.name,
      type: newResource.type as Resource["type"],
      content: newResource.content,
    }

    setResources((prev) => [resource, ...prev])
  }

  const getResourceIcon = (type: Resource["type"]) => {
    switch (type) {
      case "doc":
      case "markdown":
      case "text":
        return <FileText className="h-4 w-4" />
      case "repo":
        return <Database className="h-4 w-4" />
      case "env":
      case "config":
        return <Settings className="h-4 w-4" />
      default:
        return <FileText className="h-4 w-4" />
    }
  }

  const getResourceColor = (type: Resource["type"]) => {
    switch (type) {
      case "doc":
      case "markdown":
      case "text":
        return "bg-blue-500/20 text-blue-300"
      case "repo":
        return "bg-green-500/20 text-green-300"
      case "env":
        return "bg-yellow-500/20 text-yellow-300"
      case "config":
        return "bg-purple-500/20 text-purple-300"
      default:
        return "bg-gray-500/20 text-gray-300"
    }
  }

  return (
    <>
      {/* Backdrop */}
      <div
        className={cn(
          "fixed inset-0 bg-black/40 backdrop-blur-sm z-40 transition-opacity duration-300",
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none",
        )}
        onClick={onClose}
      />

      {/* Panel */}
      <div
        className={cn(
          "fixed right-0 top-0 h-full w-[400px] bg-[#0B0E14]/95 backdrop-blur-[24px]",
          "border-l border-white/10 z-50 transition-transform duration-300 ease-out",
          "flex flex-col",
          isOpen ? "translate-x-0" : "translate-x-full",
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/10">
          <h2 className="text-lg font-semibold text-white">Context Pack</h2>
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover:bg-white/10" onClick={onClose}>
            <X className="h-4 w-4 text-white/60" />
          </Button>
        </div>

        {/* Search */}
        <div className="p-6 pb-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/40" />
            <Input
              placeholder="Search resources..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-white/40"
            />
          </div>
        </div>

        {/* Resources */}
        <div className="flex-1 overflow-y-auto px-6">
          <div className="space-y-2">
            {filteredResources.map((resource) => (
              <div
                key={resource.id}
                className="group flex items-center gap-3 p-3 rounded-lg hover:bg-white/5 transition-colors"
              >
                <div className={cn("p-2 rounded-md", getResourceColor(resource.type))}>
                  {getResourceIcon(resource.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white truncate">{resource.name}</p>
                  <p className="text-xs text-white/60 capitalize">{resource.type}</p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="opacity-0 group-hover:opacity-100 transition-opacity bg-white/10 text-white/70 text-xs px-2 py-1 h-auto hover:bg-white/20"
                  onClick={() => handleOpenDocument(resource)}
                >
                  Open
                </Button>
              </div>
            ))}

            {filteredResources.length === 0 && (
              <div className="text-center py-8 text-white/40">
                <FileText className="h-8 w-8 mx-auto mb-2" />
                <p className="text-sm">No resources found</p>
              </div>
            )}
          </div>
        </div>

        {/* Add Resource Button */}
        <div className="p-6 border-t border-white/10">
          <Button
            className="w-full bg-[#5B8EFF] hover:bg-[#5B8EFF]/80 text-white"
            size="sm"
            onClick={() => setIsAddResourceModalOpen(true)}
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
          setSelectedDocument(null)
        }}
        document={
          selectedDocument
            ? {
                id: selectedDocument.id,
                name: selectedDocument.name,
                content: selectedDocument.content || "",
                type: selectedDocument.type,
                url: selectedDocument.url,
              }
            : null
        }
      />

      {/* Add Resource Modal */}
      <AddResourceModal
        isOpen={isAddResourceModalOpen}
        onClose={() => setIsAddResourceModalOpen(false)}
        onAddResource={handleAddResource}
      />
    </>
  )
}
