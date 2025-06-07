# Cursor Project Master

A framework for building software with AI agents. It provides the structure and workflow for an AI to manage a project from idea to implementation, minimizing human intervention.

-   **Structured Autonomy:** Guides an AI agent through a robust, file-based system, turning abstract goals into concrete tasks and code.
-   **Persistent Memory:** The `/project` directory acts as the agent's external brain, ensuring project state and history are maintained across sessions.
-   **Efficiency by Design:** Optimizes for minimal token usage and cognitive load, allowing the agent to focus on implementation, not just administration.
-   **Human-in-the-Loop, On-Demand:** You provide the strategic vision; the agent handles the tactical execution. You intervene when you want, not because you have to.

---

## The Workflow

This system divides the development process into two distinct phases, ensuring a clean separation between strategic planning and automated execution.

#### **Phase 1: Conception (Human-led, AI-assisted)**

This is where you, the project visionary, define the "what" and "why". Your goal is to populate the `/docs` directory with high-quality specifications. Use the provided templates as your guide.

**How to Generate High-Quality Docs with an LLM (ChatGPT, Claude, Gemini):**

To get the best results, use a multi-turn conversation. Start with a high-level prompt, then refine.

**Step 1: The Initial Prompt**

Copy and paste the following into your LLM of choice. Fill in the `[bracketed]` sections.

> **Prompt:**
>
> Act as a senior product manager and a principal engineer. I have an idea for a project: `[Briefly describe your project idea, e.g., "a minimalist markdown note-taking web app for writers"]`.
>
> My target audience is `[Describe your target users, e.g., "professional writers and bloggers who value simplicity"]`.
>
> The core problem I'm solving is `[Describe the pain point, e.g., "existing note apps are bloated with features and distracting"]`.
>
> Using the templates provided below, please generate a complete set of initial project documents: PRD, Tech Spec, and a Style Guide. Ask me clarifying questions if any part of my request is ambiguous, especially regarding non-functional requirements (performance, security, scalability).
>
> **[Paste the full content of `docs/PRD.md`, `docs/TECH_SPEC.md`, and `docs/STYLE_GUIDE.md` templates here]**

**Step 2: The Conversation**

The LLM will likely ask you questions. This is the most valuable part of the process. Answer them clearly. This conversation refines the project's vision.

*   *Example LLM Question:* "For the note-taking app, what level of security is needed? Should notes be end-to-end encrypted?"
*   *Your Answer:* "Good question. For v1, standard encryption at rest is sufficient. E2EE is out of scope for now."

**Step 3: Finalize and Save**

Once you are satisfied with the generated content, copy it into the respective files within the `/docs` directory. Your project's "constitution" is now written.

#### **Phase 2: Execution (AI-led, Human-supervised)**

This is where the Cursor Agent takes over. It will read your specifications and manage the entire implementation process.

**How to Run the Agent:**

1.  **Clone this Repository:** Start with a fresh clone of this project master.
2.  **Populate `/docs`:** Complete Phase 1 to fill the `/docs` directory with your project's specifications.
3.  **Initiate the Agent in Cursor:** Open the project in Cursor and start a conversation with the agent.
    > **Prompt:** "Initialize this project. Read the specifications in `/docs` and generate the project plan."
4.  **Observe and Guide:** The agent will now execute its `000-project-engine` rule.
    *   It will validate your docs and may ask final clarifying questions.
    *   It will generate the code scaffolding and the entire task system in `/project`.
    *   It will then begin executing tasks one by one, updating its status in the `/project` directory.
5.  **Monitor Progress:** You can observe the project's real-time status by looking at the `project/project_status.md` file and the movement of task files between `todo`, `in_progress`, and `done` directories.
6.  **Manage Change:** If you need to change a requirement, simply tell the agent. It will trigger its `400-change-manager` rule, update the docs, re-plan, and seamlessly continue its work.

---

## Project Structure Explained

```bash
├── .cursor/
│   └── rules/             # The agent's core logic and workflow instructions.
├── docs/
│   ├── _templates/        # High-quality templates for project specification.
│   └── ...                # Other documents (PRD, TECH_SPEC, etc.)
├── project/
│   ├── _templates/        # Templates for atomic epics and tasks.
│   ├── project_status.md  # The main dashboard and agent's entry point.
│   ├── epics/             # High-level feature folders.
│   └── tasks/             # The partitioned, file-based task database.
│       ├── todo/
│       ├── in_progress/
│       ├── done/
│       └── ...
└── src/                   # The source code, generated by the agent.
```

---

## Future Roadmap

This framework is designed to be extensible. Our vision is to continuously enhance the synergy between human developers and AI agents.

-   **[Vision] Visual Kanban Board Interface**
    The current file-based task system (`/project/tasks/`) is the perfect backend for a visual Kanban board. A future enhancement could be a Cursor extension or a simple web app that reads this directory and renders a fully interactive UI, similar to modern project management tools. Dragging a card would execute a `mv` command in the background, providing a seamless visual interface to the agent's brain.

-   **[Vision] Multi-Agent Collaboration**
    The atomic, file-based nature of the task system naturally supports parallelism. We envision a future where multiple specialized agents (e.g., a "Frontend Specialist Agent," a "Security Analyst Agent") can work on different tasks concurrently without conflict, dramatically accelerating development speed.

-   **[Community] Your Ideas Here**
    This is an open framework. We encourage contributions, new ideas for rules, and better templates. Fork it, experiment with it, and help us define the future of software development.