import { GoogleGenerativeAI } from "@google/generative-ai"

let genAI: GoogleGenerativeAI | null = null

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
}> {
  if (!genAI) {
    throw new Error("Gemini AI not initialized. Please set your API key in settings.")
  }

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" })
    
    const prompt = `
You are a project management AI assistant. Transform the following feature requirement into a structured task.

Requirement: "${requirement}"

Please respond with a JSON object in this exact format:
{
  "title": "Action-oriented title (verb + object, max 50 chars)",
  "summary": "One-line summary (max 80 chars)",
  "description": "Detailed description (max 140 words)",
  "checklist": [
    {"text": "Specific actionable step 1", "completed": false},
    {"text": "Specific actionable step 2", "completed": false},
    {"text": "Specific actionable step 3", "completed": false},
    {"text": "Specific actionable step 4", "completed": false}
  ],
  "labels": ["tag1", "tag2"]
}

Guidelines:
- Title should start with an action verb (Build, Create, Implement, Design, Fix, Enhance, etc.)
- Make tasks specific to the CPM Kanban Board project context
- Use exactly 2 relevant labels maximum from: feature, enhancement, bugfix, ui, frontend, backend, testing, docs, api, integration
- Prioritize type labels: feature (new functionality), enhancement (improvements), bugfix (fixes)
- Add technology/area labels: ui, frontend, backend, testing, docs, api, integration
- Checklist should have 3-6 specific, actionable steps that fit the project
- Consider the existing codebase structure (components, lib, types, etc.)
- Keep everything concise and actionable

Label Examples:
- ["feature", "ui"] - New UI component
- ["enhancement", "frontend"] - Improving existing frontend
- ["bugfix", "api"] - Fixing API issue
- ["feature", "testing"] - Adding tests
- ["enhancement", "docs"] - Improving documentation

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
