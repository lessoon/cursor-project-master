# AI-Native Development Workflow: The "Project Engine" Edition

This repository implements an advanced, file-based, AI-driven development workflow. It moves beyond simple chat-based interactions to a robust, stateful system where the AI Agent operates like a true engineering partner, using a structured project directory as its brain and memory.

## Core Philosophy

1.  **Docs as Specs, Project as State:** The `/docs` directory contains the immutable specifications. The `/project` directory is the living, breathing state of the project, managed by the AI.
2.  **Agent as an Engineer, Not a Scribe:** The AI doesn't just write code. It plans, validates requirements, manages its own tasks, and updates project status, all through structured file interactions.
3.  **Maximum Efficiency:** By using a central dashboard (`project_status.md`) and on-demand context loading, the agent minimizes token usage and cognitive overhead, focusing its power on implementation.

## How It Works: The Workflow

1.  **Phase 1: Human-led Conception (`/docs`)**
    - The human team fills out the high-quality templates in the `/docs` directory (PRD, Tech Spec, etc.). This is the strategic input.

2.  **Phase 2: AI-led Planning (`/project`)**
    - You run the **Project Engine** (rule `000-project-engine.mdc`).
    - The agent validates your docs, asks clarifying questions, generates the code scaffolding, and decomposes all requirements into a file-based task system in `/project`.
    - It creates the `project_status.md` dashboard and is ready to work.

3.  **Phase 3: AI-driven Execution (The Loop)**
    - The agent starts its work loop. For each task:
        1. Reads `project_status.md` to know what to do.
        2. Reads the specific task file (e.g., `tasks/T001.md`) for instructions.
        3. Loads ONLY the necessary context files.
        4. Implements the code and runs tests.
        5. Updates the task file and the dashboard using efficient command-line tools.
    - This loop continues until all tasks are complete.

4.  **Handling Change (The Interrupt)**
    - When a human requests a change, the **Change Manager** (rule `400-change-manager.mdc`) is triggered.
    - It pauses the agent, updates the source `/docs`, and then calls the Project Engine to re-plan and update the `/project` state. The agent then seamlessly resumes work on the new plan.

## Getting Started

1.  **Fill out the `/docs` templates.** Be as detailed as possible, especially in the NFRs section.
2.  **In Cursor, initiate the agent with a prompt like:** "Initialize the project based on the documents in `/docs`." This will trigger the `000-project-engine` rule.
3.  **Answer the agent's clarifying questions.** This is a critical step to ensure high-quality planning.
4.  **Watch it work.** Monitor the `project_status.md` file to see real-time progress. Intervene only when necessary (e.g., to request a change).

This system represents a paradigm shift in human-AI collaboration for software development. It provides the structure, reliability, and scalability needed to tackle complex, real-world projects with an AI-first approach.