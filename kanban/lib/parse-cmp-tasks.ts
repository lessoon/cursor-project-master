import type { CPMTask, ProjectStatus, CPMBoard, AIActivity } from "@/types/cmp"

// Enhanced mock implementation with more realistic data
export async function parseCPMTasks(): Promise<CPMBoard> {
  // Simulate parsing markdown files with front-matter
  const mockTasks: CPMTask[] = [
    // INBOX TASKS - User planning phase
    {
      id: "task-1",
      title: "Implement OAuth Authentication",
      summary: "Set up secure user authentication with Google and GitHub providers",
      labels: ["auth", "security"],
      status: "inbox",
      checklist: [
        { id: "1-1", text: "Research OAuth 2.0 best practices and security requirements", completed: false },
        { id: "1-2", text: "Configure OAuth providers (Google, GitHub) in development", completed: false },
        { id: "1-3", text: "Create login/signup UI components with proper UX", completed: false },
        { id: "1-4", text: "Implement session management and token refresh logic", completed: false },
        { id: "1-5", text: "Add comprehensive error handling and user feedback", completed: false },
        { id: "1-6", text: "Write unit tests for authentication flows", completed: false },
      ],
      description:
        "Build a comprehensive authentication system supporting multiple OAuth providers. This includes setting up provider configurations, creating secure session management, implementing proper error handling for authentication failures, and ensuring a smooth user experience across all authentication flows.",
      filePath: "/docs/auth/oauth-implementation/task.md",
      progress: 0,
      createdAt: new Date("2024-01-15"),
      updatedAt: new Date("2024-01-15"),
    },
    {
      id: "task-2",
      title: "Setup CI/CD Pipeline",
      summary: "Configure automated testing and deployment workflows with GitHub Actions",
      labels: ["devops", "automation"],
      status: "inbox",
      checklist: [
        { id: "2-1", text: "Design CI/CD workflow architecture and deployment strategy", completed: false },
        { id: "2-2", text: "Setup GitHub Actions for automated testing on PR creation", completed: false },
        { id: "2-3", text: "Configure test runners for unit, integration, and e2e tests", completed: false },
        { id: "2-4", text: "Implement automated deployment to staging environment", completed: false },
        { id: "2-5", text: "Setup production deployment with manual approval gates", completed: false },
      ],
      description:
        "Establish a robust CI/CD pipeline for automated testing, building, and deployment of the application. This includes comprehensive test automation, environment management, and deployment strategies that ensure code quality and system reliability.",
      filePath: "/docs/devops/ci-cd-pipeline/task.md",
      progress: 0,
      createdAt: new Date("2024-01-16"),
      updatedAt: new Date("2024-01-16"),
    },
    {
      id: "task-3",
      title: "Create Error Monitoring System",
      summary: "Integrate comprehensive error tracking and performance monitoring",
      labels: ["monitoring", "observability"],
      status: "inbox",
      checklist: [
        { id: "3-1", text: "Evaluate and setup error monitoring service (Sentry/Bugsnag)", completed: false },
        { id: "3-2", text: "Install and configure monitoring SDK across all environments", completed: false },
        { id: "3-3", text: "Implement error boundaries and graceful error handling", completed: false },
        { id: "3-4", text: "Add performance tracking and user experience monitoring", completed: false },
        { id: "3-5", text: "Setup alerting rules and notification channels", completed: false },
        { id: "3-6", text: "Create monitoring dashboard and incident response procedures", completed: false },
      ],
      description:
        "Implement comprehensive error monitoring and performance tracking to maintain application health. This includes real-time error detection, performance metrics, user experience monitoring, and automated alerting systems.",
      filePath: "/docs/monitoring/error-tracking/task.md",
      progress: 0,
      createdAt: new Date("2024-01-17"),
      updatedAt: new Date("2024-01-17"),
    },

    // NEXT-UP TASKS - Ready for AI to start
    {
      id: "task-4",
      title: "Design Database Schema",
      summary: "Create normalized schema for user data and application state",
      labels: ["database", "backend"],
      status: "next-up",
      checklist: [
        { id: "4-1", text: "Analyze data requirements and create entity relationship diagrams", completed: true },
        { id: "4-2", text: "Define user table structure with proper constraints", completed: true },
        { id: "4-3", text: "Create relationship mappings between all entities", completed: true },
        { id: "4-4", text: "Add performance indexes for frequently queried columns", completed: false },
        { id: "4-5", text: "Write comprehensive database migration scripts", completed: false },
        { id: "4-6", text: "Implement database seeding for development and testing", completed: false },
      ],
      description:
        "Design a scalable database schema that supports user management, application data, and future feature expansion. Focus on normalization, query performance optimization, and maintainable migration strategies.",
      filePath: "/docs/database/schema-design/task.md",
      progress: 50,
      createdAt: new Date("2024-01-14"),
      updatedAt: new Date("2024-01-16"),
    },
    {
      id: "task-5",
      title: "Build Email Template System",
      summary: "Create responsive email templates for user communications",
      labels: ["email", "templates", "communication"],
      status: "next-up",
      checklist: [
        { id: "5-1", text: "Design email template architecture and component system", completed: true },
        { id: "5-2", text: "Create welcome email template with brand styling", completed: true },
        { id: "5-3", text: "Build password reset email template with security best practices", completed: false },
        { id: "5-4", text: "Develop notification email templates for various events", completed: false },
        { id: "5-5", text: "Test email rendering across major email clients", completed: false },
        { id: "5-6", text: "Implement email template versioning and A/B testing", completed: false },
      ],
      description:
        "Develop a comprehensive email template system for user communications and system notifications. This includes responsive design, cross-client compatibility, and template management capabilities.",
      filePath: "/docs/email/template-system/task.md",
      progress: 33,
      createdAt: new Date("2024-01-13"),
      updatedAt: new Date("2024-01-15"),
    },
    {
      id: "task-6",
      title: "Implement Search Functionality",
      summary: "Add full-text search with Elasticsearch integration",
      labels: ["search", "elasticsearch", "performance"],
      status: "next-up",
      checklist: [
        { id: "6-1", text: "Setup Elasticsearch cluster and configure indices", completed: true },
        { id: "6-2", text: "Design search data models and mapping strategies", completed: true },
        { id: "6-3", text: "Create search indexes with proper analyzers and filters", completed: false },
        { id: "6-4", text: "Build search API with advanced query capabilities", completed: false },
        { id: "6-5", text: "Implement search UI components with real-time suggestions", completed: false },
        { id: "6-6", text: "Add search analytics and performance monitoring", completed: false },
      ],
      description:
        "Integrate powerful search capabilities with Elasticsearch for fast and relevant content discovery. This includes advanced querying, real-time indexing, and comprehensive search analytics.",
      filePath: "/docs/search/elasticsearch-integration/task.md",
      progress: 33,
      createdAt: new Date("2024-01-12"),
      updatedAt: new Date("2024-01-14"),
    },

    // RUNNING TASKS - AI actively working
    {
      id: "task-7",
      title: "Build API Rate Limiter",
      summary: "Implement Redis-based rate limiting for API endpoints",
      labels: ["api", "performance", "security"],
      status: "running",
      checklist: [
        { id: "7-1", text: "Setup Redis connection and configure clustering", completed: true },
        { id: "7-2", text: "Implement sliding window rate limiting algorithm", completed: true },
        { id: "7-3", text: "Add comprehensive rate limit headers following RFC standards", completed: true },
        { id: "7-4", text: "Create monitoring dashboard for rate limit metrics", completed: true },
        { id: "7-5", text: "Implement different rate limits for various user tiers", completed: false },
        { id: "7-6", text: "Add bypass mechanisms for internal services", completed: false },
        { id: "7-7", text: "Load test implementation with realistic traffic patterns", completed: false },
      ],
      description:
        "Create a robust rate limiting system to prevent API abuse and ensure fair usage across all clients. Uses Redis for distributed rate limiting across multiple server instances with comprehensive monitoring and alerting.",
      filePath: "/docs/api/rate-limiter/task.md",
      progress: 70,
      createdAt: new Date("2024-01-13"),
      updatedAt: new Date("2024-01-17"),
    },
    {
      id: "task-8",
      title: "Optimize Image Processing Pipeline",
      summary: "Implement efficient image upload and transformation system",
      labels: ["images", "optimization", "performance"],
      status: "running",
      checklist: [
        { id: "8-1", text: "Setup cloud storage with CDN integration", completed: true },
        { id: "8-2", text: "Implement image compression with quality optimization", completed: true },
        { id: "8-3", text: "Add automatic thumbnail generation in multiple sizes", completed: true },
        { id: "8-4", text: "Implement WebP conversion with fallback support", completed: false },
        { id: "8-5", text: "Add image metadata extraction and EXIF processing", completed: false },
        { id: "8-6", text: "Create image processing queue with retry mechanisms", completed: false },
      ],
      description:
        "Build an efficient image processing pipeline with automatic optimization, multiple format support, and scalable processing capabilities. Includes CDN integration and comprehensive error handling.",
      filePath: "/docs/media/image-processing/task.md",
      progress: 60,
      createdAt: new Date("2024-01-11"),
      updatedAt: new Date("2024-01-16"),
    },
    {
      id: "task-9",
      title: "Setup Logging Infrastructure",
      summary: "Implement structured logging with centralized aggregation",
      labels: ["logging", "infrastructure", "observability"],
      status: "running",
      checklist: [
        { id: "9-1", text: "Choose and configure structured logging framework", completed: true },
        { id: "9-2", text: "Setup centralized log aggregation with ELK stack", completed: true },
        { id: "9-3", text: "Create comprehensive logging dashboards and visualizations", completed: true },
        { id: "9-4", text: "Implement intelligent alerting rules based on log patterns", completed: true },
        { id: "9-5", text: "Add log retention policies and archival strategies", completed: false },
        { id: "9-6", text: "Test log rotation and performance under high load", completed: false },
      ],
      description:
        "Establish comprehensive logging infrastructure for debugging, monitoring, and compliance requirements. This includes structured logging, centralized aggregation, intelligent alerting, and long-term retention strategies.",
      filePath: "/docs/infrastructure/logging-system/task.md",
      progress: 75,
      createdAt: new Date("2024-01-10"),
      updatedAt: new Date("2024-01-15"),
    },

    // DONE TASKS - Completed by AI
    {
      id: "task-10",
      title: "Create User Dashboard",
      summary: "Build responsive dashboard with data visualization components",
      labels: ["ui", "dashboard", "analytics"],
      status: "done",
      checklist: [
        { id: "10-1", text: "Design comprehensive dashboard layout and user experience", completed: true },
        { id: "10-2", text: "Implement interactive chart components with real-time data", completed: true },
        { id: "10-3", text: "Add responsive breakpoints for mobile and tablet devices", completed: true },
        { id: "10-4", text: "Optimize dashboard performance with lazy loading", completed: true },
        { id: "10-5", text: "Implement dashboard customization and user preferences", completed: true },
        { id: "10-6", text: "Add comprehensive accessibility features and keyboard navigation", completed: true },
      ],
      description:
        "A comprehensive user dashboard featuring real-time data visualization, responsive design, and intuitive navigation. Includes interactive charts, metrics, user management tools, and customizable layouts.",
      filePath: "/docs/ui/user-dashboard/task.md",
      progress: 100,
      createdAt: new Date("2024-01-10"),
      updatedAt: new Date("2024-01-16"),
    },
    {
      id: "task-11",
      title: "Setup Development Environment",
      summary: "Configure local development tools and Docker containers",
      labels: ["devops", "docker", "development"],
      status: "done",
      checklist: [
        { id: "11-1", text: "Create comprehensive Docker compose configuration", completed: true },
        { id: "11-2", text: "Setup database containers with persistent volumes", completed: true },
        { id: "11-3", text: "Configure hot reload and development optimizations", completed: true },
        { id: "11-4", text: "Add development scripts and automation tools", completed: true },
        { id: "11-5", text: "Create development documentation and onboarding guide", completed: true },
        { id: "11-6", text: "Setup code quality tools and pre-commit hooks", completed: true },
      ],
      description:
        "Streamlined development environment setup with Docker containers, automated tooling, and comprehensive developer experience optimizations. Includes database setup, hot reloading, and code quality enforcement.",
      filePath: "/docs/devops/development-environment/task.md",
      progress: 100,
      createdAt: new Date("2024-01-08"),
      updatedAt: new Date("2024-01-12"),
    },
    {
      id: "task-12",
      title: "Implement Core Navigation System",
      summary: "Create main navigation components and routing structure",
      labels: ["ui", "navigation", "routing"],
      status: "done",
      checklist: [
        { id: "12-1", text: "Design navigation architecture and user flow", completed: true },
        { id: "12-2", text: "Implement routing system with proper state management", completed: true },
        { id: "12-3", text: "Create responsive mobile navigation with hamburger menu", completed: true },
        { id: "12-4", text: "Add comprehensive accessibility features and ARIA labels", completed: true },
        { id: "12-5", text: "Implement navigation analytics and user behavior tracking", completed: true },
        { id: "12-6", text: "Add breadcrumb navigation and deep linking support", completed: true },
      ],
      description:
        "Core navigation system with responsive design, accessibility features, and comprehensive routing capabilities. Includes mobile optimization, user experience enhancements, and analytics integration.",
      filePath: "/docs/ui/navigation-system/task.md",
      progress: 100,
      createdAt: new Date("2024-01-05"),
      updatedAt: new Date("2024-01-10"),
    },
  ]

  const projectStatus: ProjectStatus = {
    phase: "Active Development",
    health: "good",
  }

  return {
    columns: [
      {
        id: "inbox",
        title: "Inbox",
        tasks: mockTasks.filter((task) => task.status === "inbox"),
      },
      {
        id: "next-up",
        title: "Next Up",
        tasks: mockTasks.filter((task) => task.status === "next-up"),
      },
      {
        id: "running",
        title: "Running",
        tasks: mockTasks.filter((task) => task.status === "running"),
      },
      {
        id: "done",
        title: "Done",
        tasks: mockTasks.filter((task) => task.status === "done"),
      },
    ],
    projectStatus,
  }
}

// Enhanced AI plan activities with more realistic content
export async function getCPMPlan(taskId: string): Promise<string[]> {
  const mockActivities: Record<string, string[]> = {
    "task-1": [
      "Analyzed OAuth 2.0 security requirements and PKCE implementation strategies",
      "Researched provider-specific configuration for Google and GitHub OAuth",
      "Created comprehensive authentication flow diagrams and security audit checklist",
      "Designed session management architecture with JWT refresh token rotation",
    ],
    "task-4": [
      "Completed entity relationship analysis and identified 12 core data models",
      "Reviewed existing data patterns and optimized for query performance",
      "Created comprehensive database migration strategy with rollback procedures",
      "Analyzed indexing requirements for high-traffic query patterns",
    ],
    "task-7": [
      "Implemented distributed rate limiting with Redis Cluster for high availability",
      "Added comprehensive rate limit headers following RFC 6585 standards",
      "Created real-time monitoring dashboard with Grafana and Prometheus integration",
      "Designed tiered rate limiting system for different user subscription levels",
    ],
    "task-8": [
      "Optimized image processing pipeline with 40% reduction in processing time",
      "Implemented intelligent compression algorithms maintaining 95% visual quality",
      "Added automatic WebP conversion with 60% file size reduction",
      "Created scalable processing queue handling 10,000+ images per hour",
    ],
    "task-9": [
      "Deployed ELK stack with 99.9% uptime and sub-second query performance",
      "Implemented intelligent log aggregation reducing storage costs by 35%",
      "Created automated alerting system with machine learning anomaly detection",
      "Added comprehensive log retention policies meeting compliance requirements",
    ],
    "task-10": [
      "Completed responsive dashboard with 15 interactive visualization components",
      "Achieved 98% Lighthouse performance score with optimized lazy loading",
      "Integrated real-time WebSocket updates for live data synchronization",
      "Added comprehensive accessibility features meeting WCAG 2.1 AA standards",
    ],
    "task-11": [
      "Created Docker development environment with 90% faster setup time",
      "Implemented hot reload system with sub-second change detection",
      "Added comprehensive development tooling with automated code quality checks",
      "Created detailed onboarding documentation reducing setup time to 15 minutes",
    ],
    "task-12": [
      "Designed navigation system with 25% improvement in user task completion",
      "Implemented responsive navigation with seamless mobile experience",
      "Added comprehensive accessibility features with full keyboard navigation",
      "Integrated analytics tracking for navigation pattern optimization",
    ],
  }

  return (
    mockActivities[taskId] || [
      "Completed comprehensive task analysis with AI-powered requirement extraction",
      "Generated detailed implementation plan with dependency mapping and risk assessment",
      "Prepared development environment and configured necessary tools and integrations",
      "Ready for development phase execution with optimized workflow and resource allocation",
    ]
  )
}

// New function to get AI automation metrics
export async function getAIMetrics(): Promise<{
  tasksAutomated: number
  checklistItemsCompleted: number
  averageTransitionTime: number
  automationAccuracy: number
}> {
  return {
    tasksAutomated: 156,
    checklistItemsCompleted: 892,
    averageTransitionTime: 2.3, // seconds
    automationAccuracy: 97.8, // percentage
  }
}

// Function to simulate realistic AI activity logs
export async function getRecentAIActivity(): Promise<AIActivity[]> {
  return [
    {
      taskId: "task-7",
      description: "Completed rate limit header implementation following RFC standards",
      timestamp: new Date(Date.now() - 300000), // 5 minutes ago
      type: "checklist",
    },
    {
      taskId: "task-8",
      description: "Optimized image compression algorithm, achieved 40% performance improvement",
      timestamp: new Date(Date.now() - 600000), // 10 minutes ago
      type: "checklist",
    },
    {
      taskId: "task-9",
      description: "Transitioned to Done - All logging infrastructure requirements completed",
      timestamp: new Date(Date.now() - 900000), // 15 minutes ago
      type: "transition",
    },
    {
      taskId: "task-4",
      description: "Analyzing database schema optimization opportunities",
      timestamp: new Date(Date.now() - 1200000), // 20 minutes ago
      type: "analysis",
    },
  ]
}
