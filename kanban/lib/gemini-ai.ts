import { GoogleGenerativeAI } from "@google/generative-ai"
import { promises as fs } from 'fs'
import path from 'path'

let genAI: GoogleGenerativeAI | null = null

/**
 * Get project context including epics and current task structure
 */
async function getProjectContext(): Promise<string> {
  try {
    const projectRoot = process.cwd().replace('/kanban', '')
    const planPath = path.join(projectRoot, 'project', 'plan.json')
    
    const planContent = await fs.readFile(planPath, 'utf-8')
    const plan = JSON.parse(planContent)
    
    const epics = plan.epics.map((epic: any) => 
      `${epic.id}: ${epic.title} - ${epic.motivation}`
    ).join('\n')
    
    return `
Available Epics:
${epics}

Task ID Pattern: T-{number} (sequential)
Epic Assignment: Based on requirement content, assign to most relevant epic
`
  } catch (error) {
    console.warn('Could not load project context:', error)
    return `
Available Epics:
E-1: UI Skeleton - Core kanban interface components
E-2: Data Bridge - File system integration  
E-3: AI Generation - Gemini integration features
E-4: AI Pulse - Automation and background processing
E-5: Doc Viewer - Documentation and context management
E-6: Testing - Quality assurance and testing

Task ID Pattern: T-{number} (sequential)
`
  }
}

export function initializeGemini(apiKey: string) {
  try {
    genAI = new GoogleGenerativeAI(apiKey)
    return true
  } catch (error) {
    console.error("Failed to initialize Gemini:", error)
    return false
  }
}

export async function validateGeminiKey(apiKey: string): Promise<boolean> {
  try {
    const testAI = new GoogleGenerativeAI(apiKey)
    const model = testAI.getGenerativeModel({ model: "gemini-1.5-flash" })

    // Simple test prompt
    const result = await model.generateContent("Say 'API key is valid' if you can read this.")
    const response = await result.response
    const text = response.text()

    return text.toLowerCase().includes("api key is valid")
  } catch (error) {
    console.error("Gemini API key validation failed:", error)
    return false
  }
}

export async function generateTasksFromRequirement(requirement: string): Promise<{
  title: string
  summary: string
  description: string
  checklist: Array<{ text: string; completed: boolean }>
  labels: string[]
  epic?: string
}> {
  if (!genAI) {
    throw new Error("Gemini AI not initialized. Please set your API key in settings.")
  }

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" })

    // Get project context for better task generation
    const projectContext = await getProjectContext()
    
    const prompt = `
You are a project management AI assistant for a CPM Kanban Board project. Transform the following feature requirement into a structured task that fits within this project context.

Project Context: This is a CPM (Critical Path Method) Kanban Board application built with Next.js, TypeScript, and Tailwind CSS. The system manages tasks using markdown files, provides drag-and-drop functionality, context pack for documentation, and integrates with Gemini AI for task generation.

Current Project Structure:
${projectContext}

Requirement: "${requirement}"

Please respond with a JSON object in this exact format:
{
  "title": "Action-oriented title specific to CPM Kanban (verb + object, max 50 chars)",
  "summary": "One-line summary relevant to the project (max 80 chars)",
  "description": "Detailed description explaining what, why, and how it fits in the CPM Kanban system (max 140 words)",
  "checklist": [
    {"text": "Specific actionable step 1 for CPM Kanban", "completed": false},
    {"text": "Specific actionable step 2 for CPM Kanban", "completed": false},
    {"text": "Specific actionable step 3 for CPM Kanban", "completed": false},
    {"text": "Specific actionable step 4 for CPM Kanban", "completed": false}
  ],
  "labels": ["epic-name", "feature", "ui", "frontend", "enhancement", "bugfix", "testing", "docs", "api"],
  "epic": "E-X"
}

Guidelines:
- Title should start with an action verb (Build, Create, Implement, Design, Fix, Enhance, etc.)
- Make tasks specific to the CPM Kanban Board project context
- Assign to the most relevant epic (E-1 through E-6) based on the requirement
- Use relevant labels including epic name: e-ui-skeleton, e-data-bridge, e-ai-generation, e-ai-pulse, e-doc-viewer, e-testing
- Technology labels: frontend, ui, feature, enhancement, bugfix, testing, docs, api, integration
- Checklist should have 3-6 specific, actionable steps that fit the project
- Consider the existing codebase structure (components, lib, types, etc.)
- Keep everything concise and actionable

Epic Mapping:
- E-1 (UI Skeleton): UI components, layout, styling, drag-drop interface
- E-2 (Data Bridge): File system, data persistence, markdown parsing
- E-3 (AI Generation): Gemini integration, task creation, AI features
- E-4 (AI Pulse): Automation, background processing, AI indicators
- E-5 (Doc Viewer): Documentation, context pack, resource management
- E-6 (Testing): Tests, quality assurance, CI/CD

Respond only with the JSON object, no additional text.
`

    const result = await model.generateContent(prompt)
    const response = await result.response
    const text = response.text()

    // Clean up the response and parse JSON
    const cleanedText = text.replace(/```json\n?|\n?```/g, "").trim()
    const taskData = JSON.parse(cleanedText)

    // Add unique IDs to checklist items
    taskData.checklist = taskData.checklist.map((item: any, index: number) => ({
      ...item,
      id: `checklist-${Date.now()}-${index}`,
    }))

    return taskData
  } catch (error) {
    console.error("Failed to generate task:", error)
    throw new Error("Failed to generate task. Please check your requirement and try again.")
  }
}

// Settings management
export function saveGeminiKey(apiKey: string) {
  localStorage.setItem("gemini-api-key", apiKey)
  initializeGemini(apiKey)
}

export function getGeminiKey(): string | null {
  return localStorage.getItem("gemini-api-key")
}

export function removeGeminiKey() {
  localStorage.removeItem("gemini-api-key")
  genAI = null
}

// Initialize on load if key exists
if (typeof window !== "undefined") {
  const savedKey = getGeminiKey()
  if (savedKey) {
    initializeGemini(savedKey)
  }
}
