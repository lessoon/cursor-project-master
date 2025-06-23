# CPM Kanban Board - Complete Development Guide

## 📋 Table of Contents
1. [Project Overview](#project-overview)
2. [Code Structure](#code-structure)
3. [Component Breakdown](#component-breakdown)
4. [AI Automation System](#ai-automation-system)
5. [Context Pack & Document Management](#context-pack--document-management)
6. [Styling and Design Guide](#styling-and-design-guide)
7. [State Management](#state-management)
8. [Testing](#testing)
9. [Future Development](#future-development)
10. [Deployment](#deployment)

---

## 🎯 Project Overview

### What is CPM Kanban Board?
CPM (Cursor Project Master) Kanban Board is an AI-powered task management system that automates workflow progression. Unlike traditional Kanban boards where users manually move tasks, this system features an AI agent that automatically transitions tasks through the development lifecycle.

### Key Features
✅ **AI-Powered Automation** - Background AI agent moves tasks automatically  
✅ **Intelligent Transitions** - Tasks flow from inbox → next-up → running → done  
✅ **Real-time Progress** - Live checklist completion and progress tracking  
✅ **Beautiful Animations** - Smooth transitions with visual feedback  
✅ **Document Management** - Context Pack for project resources  
✅ **Gemini AI Integration** - AI-generated task creation  
✅ **Minimal User Interaction** - Users focus on planning, AI handles execution  

### Workflow Philosophy
- **User Role**: Strategic planning (moving tasks from inbox to next-up)
- **AI Agent Role**: Execution management (next-up → running → done)
- **Automatic Updates**: Checklist completion, progress tracking, status transitions
- **Live Experience**: Board feels alive with constant, purposeful activity

---

## 📁 Code Structure

### Directory Layout
\`\`\`
project/
├── app/
│   └── page.tsx                     # Main application entry point
├── components/
│   ├── ui/
│   │   ├── progress-ring.tsx        # Animated circular progress indicator
│   │   └── textarea.tsx             # Form textarea component
│   ├── kanban-board.tsx             # Main board with AI automation
│   ├── kanban-column.tsx            # Column container with AI state
│   ├── kanban-card.tsx              # Task cards with animations
│   ├── card-modal.tsx               # Task detail modal
│   ├── create-task-modal.tsx        # AI-powered task creation
│   ├── settings-modal.tsx           # Gemini API key management
│   ├── document-viewer-modal.tsx    # Markdown document viewer
│   ├── add-resource-modal.tsx       # File upload for documents
│   ├── navbar.tsx                   # Top navigation with AI controls
│   └── context-pack.tsx             # Document management sidebar
├── types/
│   ├── cmp.ts                       # Core CPM type definitions
│   └── kanban.ts                    # Legacy Kanban types (deprecated)
├── lib/
│   ├── parse-cmp-tasks.ts           # Mock data and task parsing
│   ├── ai-automation.ts             # AI agent simulation service
│   ├── gemini-ai.ts                 # Gemini API integration
│   └── markdown-utils.ts            # Markdown parsing utilities
└── tailwind.config.ts               # Enhanced styling with animations
\`\`\`

### What Each File Does

**🤖 lib/ai-automation.ts**
- Core AI automation service
- Simulates background AI agent activity
- Handles task transitions, checklist updates, progress tracking
- Event-driven architecture with subscribers

**🧠 lib/gemini-ai.ts**
- Google Gemini API integration
- AI-powered task generation from requirements
- API key validation and secure storage
- Structured task creation with checklists

**📄 lib/markdown-utils.ts**
- Enhanced markdown to HTML conversion with comprehensive feature support
- Advanced syntax highlighting for code blocks with language detection
- Table rendering with responsive design and dark theme styling
- Robust link parsing with proper URL handling (fixed regex bug)
- XSS protection through HTML escaping
- Smart list processing with proper nesting and indentation
- Title extraction from content with fallback handling
- Optimized for document viewing with performance considerations

**📄 app/page.tsx**
- This is the main page users see
- Shows the Kanban board
- Very simple - just displays the KanbanBoard component

**🎯 components/kanban-board.tsx**
- Main orchestrator with AI automation
- Real-time task updates and transitions
- AI agent controls (pause/resume)
- Live metrics and activity tracking

**🎴 components/kanban-card.tsx**
- Enhanced with AI working indicators
- Smooth transition animations
- Activity notifications
- Progress ring animations

**📋 components/kanban-column.tsx**
- AI state propagation to cards
- Visual feedback for AI activity
- Drag & drop with automation awareness

**📋 components/kanban-column.tsx**
- Represents one column (like "Inbox" or "Done")
- Shows the column title and task count
- Contains all the task cards for that column
- Has a "Create Task" button for the Inbox column

**🎴 components/kanban-card.tsx**
- Shows individual tasks
- Displays task title, summary, progress, and tags
- Can be dragged between columns
- Click to open detailed view

---

## 🧩 Component Breakdown

### 1. KanbanBoard Component (Enhanced)

**Purpose:** Main container with AI automation orchestration.

**New AI Features:**
- **AI Agent Service**: Background automation with configurable timing
- **Real-time Updates**: Live task transitions and progress updates
- **Activity Tracking**: Monitor what AI is working on
- **Control Interface**: Pause/resume AI automation

**Key State Variables:**
\`\`\`typescript
const [board, setBoard] = useState<CPMBoard | null>(null)           // All tasks and columns
const [isAIActive, setIsAIActive] = useState(true)                  // AI automation toggle
const [aiWorkingTasks, setAIWorkingTasks] = useState<Set<string>>() // Tasks AI is processing
const [taskActivities, setTaskActivities] = useState<Record<string, string>>() // AI activity descriptions
const [transitioningTasks, setTransitioningTasks] = useState<Set<string>>() // Tasks in transition
\`\`\`

**AI Update Handlers:**
- `handleAIChecklistUpdate()` - Automatic checklist completion
- `handleAIStatusUpdate()` - Task column transitions
- `handleAIProgressUpdate()` - Progress increments

### 2. KanbanCard Component (Enhanced)

**Purpose:** Task cards with AI automation visual feedback.

**New Props:**
\`\`\`typescript
interface KanbanCardProps {
  task: CPMTask
  onClick?: (task: CPMTask) => void
  isAIWorking?: boolean           // Show AI working indicator
  recentActivity?: string         // Display AI activity
  isTransitioning?: boolean       // Show transition animation
  transitionDirection?: "left" | "right" // Animation direction
}
\`\`\`

**Visual Enhancements:**
- **AI Working Indicator**: Pulsing sparkles when AI is active
- **Activity Notifications**: Slide-up notifications with AI actions
- **Transition Effects**: Shimmer overlay during status changes
- **Progress Animations**: Smooth ring updates with pulse effects

### 3. CreateTaskModal Component (New)

**Purpose:** AI-powered task creation with Gemini integration.

**Features:**
- **Requirement Input**: Natural language task descriptions
- **AI Generation**: Structured task creation with checklists
- **Preview & Edit**: Review generated tasks before creation
- **Validation**: API key verification and error handling

**Workflow:**
1. User enters feature requirement in natural language
2. Gemini AI generates structured task with title, summary, description, checklist
3. User reviews and customizes generated content
4. Task is added to inbox column

### 4. SettingsModal Component (New)

**Purpose:** Gemini API key management and configuration.

**Features:**
- **Secure Storage**: Local storage with validation
- **Key Testing**: Real-time API key validation
- **Visual Feedback**: Status indicators and error messages
- **Help Documentation**: Setup instructions for users

### 5. DocumentViewerModal Component (Enhanced)

**Purpose:** Rich markdown document viewing experience with advanced rendering capabilities.

**Features:**
- **Enhanced Markdown Rendering**: Complete markdown support with improved parsing
  - Headers (H1-H4) with proper hierarchy
  - Tables with borders and responsive design
  - Code blocks with syntax highlighting and proper escaping
  - Inline code with distinct styling
  - Links with hover effects and external link handling
  - Lists (bulleted and numbered) with proper nesting
  - Horizontal rules and text formatting (bold, italic)
  - XSS protection with HTML escaping
- **Download Function**: Export documents as .md files
- **External Links**: Open original document sources
- **Responsive Design**: Optimized for all screen sizes with dark theme support

### 6. AddResourceModal Component (New)

**Purpose:** Document upload and text input for Context Pack.

**Features:**
- **Dual Input Methods**: File upload or direct text entry
- **Drag & Drop**: Intuitive file upload interface
- **File Validation**: Type checking and size limits
- **Auto-naming**: Smart title extraction from content

### 7. ContextPack Component (Enhanced)

**Purpose:** Comprehensive document management system.

**New Features:**
- **Rich Content Storage**: Full markdown documents with metadata
- **Interactive Actions**: Click to view, search, and organize
- **Dynamic Updates**: Real-time resource list updates
- **File Management**: Upload, view, and organize project documents

---

## 🤖 AI Automation System

### Architecture Overview

The AI automation system simulates a background agent (like Cursor) that continuously works on tasks. It's designed to feel natural and purposeful rather than random.

### AIAutomationService Class

**Core Methods:**
\`\`\`typescript
class AIAutomationService {
  subscribe(callback: (update: TaskUpdate) => void)  // Event subscription
  start()                                            // Begin automation
  stop()                                             // Pause automation
  private simulateAIWork()                          // Main automation loop
  private simulateChecklistProgress()               // Complete checklist items
  private simulateStatusTransition()                // Move tasks between columns
  private simulateNewTaskAnalysis()                 // Analyze inbox tasks
}
\`\`\`

### Automation Types

**1. Checklist Progress**
- **Frequency**: Every 3-8 seconds
- **Target**: Tasks in "running" status
- **Action**: Complete individual checklist items
- **Visual**: Progress ring animation, AI working indicator

**2. Status Transitions**
- **Next-up → Running**: "Dependencies resolved, starting implementation"
- **Running → Done**: "All acceptance criteria met, task completed"
- **Timing**: Realistic delays based on task complexity

**3. Task Analysis**
- **Target**: New tasks in inbox
- **Action**: Small progress increments for analysis
- **Purpose**: Show AI is evaluating and planning

### Animation Timing

**Transition Phases:**
1. **Pre-transition** (0.5s): AI working indicator appears
2. **Transition** (0.8s): Smooth movement with shimmer effect
3. **Post-transition** (2s): Activity notification display
4. **Cleanup** (0.5s): Remove indicators and notifications

**Easing Functions:**
- **Status Transitions**: `cubic-bezier(0.4, 0, 0.2, 1)` - Natural movement
- **Progress Updates**: `ease-out` - Smooth completion feeling
- **Activity Notifications**: `ease-out` - Gentle appearance

---

## 📚 Context Pack & Document Management

### Document Storage Architecture

**Resource Interface:**
\`\`\`typescript
interface Resource {
  id: string
  name: string
  type: "doc" | "repo" | "env" | "config" | "markdown" | "text"
  content?: string  // Full markdown content
  url?: string      // External link
}
\`\`\`

### Enhanced Markdown Processing

**Features Supported:**
- **Headers**: H1, H2, H3, H4 with proper hierarchy and spacing
- **Text Formatting**: Bold and italic text with proper styling
- **Code**: 
  - Multi-line code blocks with language detection and syntax highlighting
  - Inline code snippets with distinct background and styling
  - Proper escaping to prevent XSS attacks
- **Links**: Internal and external links with hover effects and transition animations
- **Lists**: 
  - Bulleted and numbered lists with proper nesting
  - Improved spacing and indentation
  - Support for mixed list types
- **Tables**: 
  - Full table support with borders and responsive design
  - Header and data cell styling
  - Dark theme compatible colors
- **Layout Elements**:
  - Horizontal rules for section separation
  - Proper paragraph spacing and line breaks
  - Responsive design for all screen sizes

**Enhanced Rendering Pipeline:**
1. **Security**: HTML escaping to prevent XSS attacks
2. **Parse**: Convert markdown to HTML with enhanced regex patterns
3. **Structure**: Process complex elements like tables and nested lists
4. **Style**: Apply comprehensive Tailwind classes for dark theme consistency
5. **Display**: Render in modal with optimized scroll and responsive design

**Recent Improvements:**
- ✅ Fixed link parsing (corrected regex pattern bug)
- ✅ Added table support with proper styling
- ✅ Enhanced list processing with better nesting
- ✅ Improved code block handling with language detection
- ✅ Added XSS protection with HTML escaping
- ✅ Better paragraph and line break handling

### File Upload System

**Supported Formats:**
- `.md` - Markdown files
- `.txt` - Plain text files
- `.markdown` - Alternative markdown extension

**Validation Rules:**
- Maximum file size: 5MB
- File type validation
- Content encoding: UTF-8
- Automatic title extraction

**Upload Methods:**
1. **Drag & Drop**: Visual feedback with drop zones
2. **File Browser**: Traditional file selection
3. **Direct Input**: Type or paste content directly

---

## 🎨 Styling and Design Guide

### Enhanced Design Principles

**1. Living Interface**
- Subtle animations indicate AI activity
- Smooth transitions between states
- Visual feedback for all AI actions
- Purposeful motion design

**2. Information Hierarchy**
- AI status prominently displayed
- Activity notifications contextual
- Progress indicators always visible
- Clear visual separation of user vs AI actions

**3. Responsive Feedback**
- Immediate visual response to AI actions
- Contextual activity descriptions
- Non-intrusive notification system
- Smooth state transitions

### New Animation Classes

\`\`\`css
/* Shimmer effect for transitions */
@keyframes shimmer {
  0% { transform: translateX(-100%); }
  100% { transform: translateX(100%); }
}

/* Slide-up for notifications */
@keyframes slide-up {
  0% { transform: translateY(100%); opacity: 0; }
  100% { transform: translateY(0); opacity: 1; }
}

/* AI working glow */
.ai-working {
  box-shadow: 0 0 20px rgba(91, 142, 255, 0.3);
  border: 2px solid rgba(91, 142, 255, 0.4);
}
\`\`\`

### Color Enhancements

**AI Activity Colors:**
- **Primary AI**: `#5B8EFF` - Main AI actions
- **Success**: `#4ADE80` - Completed actions
- **Warning**: `#F59E0B` - Pending actions
- **Activity**: `rgba(91, 142, 255, 0.1)` - Background highlights

**Status Indicators:**
- **AI Active**: Pulsing blue with sparkles
- **Transitioning**: Shimmer overlay
- **Completed**: Green pulse effect
- **Working**: Subtle glow animation

---

## 🔧 Technical Deep Dive: Markdown Rendering System

### Problem Statement
The original markdown rendering system had several limitations:
- **Link parsing bug**: Regex pattern used `$$` instead of `()` for URL capture
- **Limited table support**: No table rendering capability
- **Basic list handling**: Poor nested list processing
- **Security concerns**: No XSS protection
- **Inconsistent styling**: Limited dark theme support

### Solution Architecture

**Enhanced parseMarkdown() Function:**
```typescript
// Security-first approach with HTML escaping
export function parseMarkdown(markdown: string): string {
  let html = markdown
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    
    // Headers with proper hierarchy
    .replace(/^#### (.*$)/gim, '<h4 class="text-base font-semibold text-white mb-2 mt-3">$1</h4>')
    .replace(/^### (.*$)/gim, '<h3 class="text-lg font-semibold text-white mb-2 mt-4">$1</h3>')
    
    // Fixed link parsing - corrected regex pattern
    .replace(
      /\[([^\]]+)\]\(([^)]+)\)/g,  // Fixed: was using $$
      '<a href="$2" class="text-blue-400 hover:text-blue-300 underline transition-colors">$1</a>'
    )
    
    // Enhanced table support
    .replace(/\|(.+)\|/g, (match, content) => {
      const cells = content.split('|').map(cell => cell.trim())
      const cellsHtml = cells.map(cell => 
        `<td class="px-3 py-2 border border-white/10 text-white/80">${cell}</td>`
      ).join('')
      return `<tr>${cellsHtml}</tr>`
    })
    
  // Smart list processing with proper nesting...
}
```

### Key Improvements

**1. Link Parsing Fix**
```typescript
// Before (broken):
.replace(/\[([^\]]+)\]$$([^)]+)$$/g, ...)

// After (working):
.replace(/\[([^\]]+)\]\(([^)]+)\)/g, ...)
```

**2. Table Support**
- Automatic table detection and rendering
- Responsive design with proper borders
- Dark theme compatible styling
- Overflow handling for mobile devices

**3. Enhanced List Processing**
- Line-by-line processing for better control
- Proper nesting support for sub-lists
- Consistent indentation and spacing
- Support for mixed list types (* and -)

**4. Security Enhancements**
- HTML escaping to prevent XSS attacks
- Safe content handling
- Validated input processing

### Usage Examples

**Basic Usage:**
```typescript
import { parseMarkdown, extractTitle } from '@/lib/markdown-utils'

const content = `# My Document
This is **bold** text with a [link](https://example.com).

| Column 1 | Column 2 |
|----------|----------|
| Data 1   | Data 2   |
`

const htmlContent = parseMarkdown(content)
const title = extractTitle(content, 'fallback-title')
```

**In Components:**
```typescript
// DocumentViewerModal.tsx
const htmlContent = parseMarkdown(resource.content)

<div 
  className="markdown-content prose prose-invert max-w-none..."
  dangerouslySetInnerHTML={{ __html: htmlContent }} 
/>
```

### Performance Considerations
- Efficient regex processing
- Minimal DOM manipulations
- Cached rendering where possible
- Optimized for large documents

---

## 🔄 State Management

### Enhanced State Architecture

The application now manages complex AI automation state alongside the core Kanban functionality.

**Core State Structure:**
\`\`\`typescript
// Main board data
const [board, setBoard] = useState<CPMBoard | null>(null)

// AI automation state
const [isAIActive, setIsAIActive] = useState(true)
const [aiWorkingTasks, setAIWorkingTasks] = useState<Set<string>>(new Set())
const [taskActivities, setTaskActivities] = useState<Record<string, string>>({})
const [transitioningTasks, setTransitioningTasks] = useState<Set<string>>(new Set())

// UI state
const [selectedTask, setSelectedTask] = useState<CPMTask | null>(null)
const [isModalOpen, setIsModalOpen] = useState(false)
const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false)
const [isContextPackOpen, setIsContextPackOpen] = useState(false)

// Document management state
const [resources, setResources] = useState<Resource[]>(mockResources)
const [selectedDocument, setSelectedDocument] = useState<Resource | null>(null)
\`\`\`

### Event-Driven Updates

**AI Automation Events:**
\`\`\`typescript
interface TaskUpdate {
  taskId: string
  type: "status" | "checklist" | "progress"
  data: any
}
\`\`\`

**Event Flow:**
1. **AI Service** generates update events
2. **Board Component** subscribes to events
3. **State Updates** trigger re-renders
4. **Visual Feedback** shows changes
5. **Cleanup** removes temporary indicators

### Data Persistence Strategy

**Current Implementation:**
- In-memory state management
- Local storage for API keys
- Mock data for development

**Future Implementation:**
- File system integration (`/docs/**/task.md`)
- Real-time database synchronization
- Collaborative editing support

---

## 🧪 Testing

### Current Testing Status
⚠️ **Enhanced testing needed for AI automation features**

### Recommended Testing Strategy

**1. AI Automation Tests**
\`\`\`typescript
describe('AI Automation Service', () => {
  test('should emit checklist updates', async () => {
    const mockCallback = jest.fn()
    aiAutomation.subscribe(mockCallback)
    
    // Trigger automation
    await waitFor(() => {
      expect(mockCallback).toHaveBeenCalledWith({
        taskId: expect.any(String),
        type: 'checklist',
        data: expect.any(Object)
      })
    })
  })
})
\`\`\`

**2. Animation Tests**
\`\`\`typescript
test('should show AI working indicator', () => {
  render(<KanbanCard task={mockTask} isAIWorking={true} />)
  expect(screen.getByTestId('ai-working-indicator')).toBeInTheDocument()
})
\`\`\`

**3. Document Management Tests**
\`\`\`typescript
test('should upload and display markdown file', async () => {
  const file = new File(['# Test Document'], 'test.md', { type: 'text/markdown' })
  // Test file upload and rendering
})
\`\`\`

**4. Integration Tests**
- End-to-end AI automation workflows
- Task creation with Gemini AI
- Document upload and viewing
- Real-time state synchronization

---

## 🚀 Future Development

### High Priority Features

**1. Real File System Integration**
\`\`\`typescript
// Replace mock data with actual file reading
async function parseCPMTasks(): Promise<CPMBoard> {
  const taskFiles = await glob('/docs/**/task.md')
  return taskFiles.map(parseMarkdownTask)
}
\`\`\`

**2. Enhanced AI Capabilities**
- **Smart Scheduling**: AI considers task dependencies
- **Resource Allocation**: Automatic workload balancing
- **Predictive Analytics**: Completion time estimates
- **Learning System**: Adapt to user patterns

**3. Collaboration Features**
- **Real-time Sync**: Multiple users, live updates
- **Activity Feed**: Detailed AI and user action log
- **Team Metrics**: Productivity insights and analytics
- **Notification System**: Smart alerts for important changes

### Medium Priority Features

**4. Advanced Document Management**
- **PDF Support**: Upload and view PDF documents
- **Version Control**: Track document changes over time
- **Search Integration**: Full-text search across all documents
- **Tagging System**: Organize documents with custom tags

**5. Workflow Customization**
- **Custom Columns**: User-defined workflow stages
- **Automation Rules**: Configurable AI behavior
- **Template System**: Reusable task templates
- **Integration APIs**: Connect with external tools

**6. Performance Optimization**
- **Virtual Scrolling**: Handle 1000+ tasks efficiently
- **Lazy Loading**: Load documents on demand
- **Caching Strategy**: Optimize API calls and rendering
- **Background Sync**: Offline-first architecture

### Low Priority Features

**7. Advanced Analytics**
- **Productivity Metrics**: Task completion rates and trends
- **AI Efficiency**: Automation success rates
- **Time Tracking**: Automatic time estimation and tracking
- **Reporting Dashboard**: Visual analytics and insights

**8. Mobile Experience**
- **Touch Interactions**: Optimized for mobile devices
- **Offline Support**: Work without internet connection
- **Push Notifications**: Mobile alerts for important updates
- **Progressive Web App**: Install as native app

---

## 🌐 Deployment

### Development Setup

1. **Clone and Install:**
   \`\`\`bash
   git clone <repository-url>
   cd cpm-kanban-board
   npm install
   \`\`\`

2. **Environment Setup:**
   \`\`\`bash
   # Create .env.local file
   NEXT_PUBLIC_GEMINI_API_KEY=your-gemini-key-here
   \`\`\`

3. **Run Development Server:**
   \`\`\`bash
   npm run dev
   \`\`\`

### Production Deployment

**Vercel Deployment (Recommended):**
\`\`\`bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
\`\`\`

**Environment Variables:**
\`\`\`env
# AI Integration
NEXT_PUBLIC_GEMINI_API_KEY=your-gemini-api-key

# Future additions
DATABASE_URL=postgresql://...
REDIS_URL=redis://...
WEBHOOK_SECRET=your-webhook-secret
\`\`\`

### Build Optimization

**Bundle Analysis:**
\`\`\`bash
npm install --save-dev @next/bundle-analyzer
npm run analyze
\`\`\`

**Performance Tips:**
- Use \`next/dynamic\` for large components
- Optimize images with \`next/image\`
- Enable compression in production

---

## 📊 Metrics and Monitoring

### Key Performance Indicators

**User Experience:**
- Task creation time (target: <30 seconds with AI)
- AI automation accuracy (target: >95%)
- Document upload success rate (target: >99%)
- Page load time (target: <2 seconds)

**System Performance:**
- AI automation latency (target: <500ms)
- Document rendering time (target: <1 second)
- Memory usage (target: <100MB)
- Bundle size (target: <500KB)

### Monitoring Setup

**Error Tracking:**
\`\`\`typescript
// Sentry integration for error monitoring
import * as Sentry from "@sentry/nextjs"

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  tracesSampleRate: 1.0,
})
\`\`\`

**Analytics:**
\`\`\`typescript
// Track AI automation events
analytics.track('AI_Task_Transition', {
  taskId: task.id,
  fromStatus: oldStatus,
  toStatus: newStatus,
  duration: transitionTime
})
\`\`\`

---

## 📚 Additional Resources

### Learning Materials
- [Next.js 14 Documentation](https://nextjs.org/docs)
- [DnD Kit Documentation](https://dndkit.com/)
- [Gemini AI API Guide](https://ai.google.dev/docs)
- [Framer Motion Animations](https://www.framer.com/motion/)

### Design Inspiration
- [Linear](https://linear.app) - AI-powered project management
- [Notion](https://notion.so) - Document-centric workflows
- [Cursor](https://cursor.sh) - AI-assisted development

### Code Style
- Use TypeScript for all new files
- Follow React hooks best practices
- Keep components small and focused
- Use meaningful variable names
- Add comments for complex logic

---

## 🤝 Contributing

### Development Workflow

**Before You Start:**
1. Read this complete guide
2. Set up development environment
3. Test AI automation features
4. Explore document management system

### Making Changes
1. Create a new branch for your feature
2. Write tests for new functionality
3. Update this documentation if needed
4. Test thoroughly before submitting

### Code Review Checklist
- [ ] Code follows existing patterns
- [ ] TypeScript types are correct
- [ ] Components are properly tested
- [ ] Documentation is updated
- [ ] No console errors or warnings

---

## 🤝 Contributing

### Development Workflow

**Before You Start:**
1. Read this complete guide
2. Set up development environment
3. Test AI automation features
4. Explore document management system

**Code Standards:**
- TypeScript for all new files
- Comprehensive error handling
- Accessibility best practices
- Performance-conscious implementations

**AI Feature Guidelines:**
- Realistic timing for automation
- Clear visual feedback for all actions
- Graceful degradation when AI is disabled
- Comprehensive state management

**Testing Requirements:**
- Unit tests for AI automation logic
- Integration tests for user workflows
- Visual regression tests for animations
- Performance tests for large datasets

### Code Review Checklist

- [ ] AI automation works smoothly
- [ ] Animations are performant
- [ ] Document management functions correctly
- [ ] Error handling is comprehensive
- [ ] TypeScript types are accurate
- [ ] Accessibility standards met
- [ ] Performance impact assessed
- [ ] Documentation updated

---

## 📚 Additional Resources

### Learning Materials
- [Next.js 14 Documentation](https://nextjs.org/docs)
- [DnD Kit Documentation](https://dndkit.com/)
- [Gemini AI API Guide](https://ai.google.dev/docs)
- [Framer Motion Animations](https://www.framer.com/motion/)

### Design Inspiration
- [Linear](https://linear.app) - AI-powered project management
- [Notion](https://notion.so) - Document-centric workflows
- [Cursor](https://cursor.sh) - AI-assisted development

### Technical References
- [React 18 Concurrent Features](https://react.dev/blog/2022/03/29/react-v18)
- [TypeScript Best Practices](https://typescript-eslint.io/rules/)
- [Web Animations API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Animations_API)

---

*This guide reflects the current state of the CPM Kanban Board with full AI automation, document management, and enhanced user experience. The system represents a new paradigm in task management where AI handles execution while humans focus on strategic planning.*

**Last Updated:** December 2024  
**Version:** 2.0 - AI Automation Release
