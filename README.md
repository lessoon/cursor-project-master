# Cursor Project Master 🚀

**Automate Your Development Workflow with AI**

This boilerplate leverages **Cursor** and **Claude** AI to streamline your development. Define requirements in a PRD, and AI agents automate most tasks, aiming for up to 99% automation. This frees you to focus on high-level strategy.

---

## ✨ Features

*   **AI Automation:** Up to 99% task automation.
*   **Zero-Config:** Quick setup with a pre-configured structure.
*   **PRD-Driven:** Single source of truth for requirements.
*   **Automated Docs & Tasks:** AI generates design docs, knowledge bases, progress logs, and manages tasks.
*   **Smart Decomposition:** Complex requirements broken into atomic subtasks.
*   **Up-to-date Context:** Agents re-read relevant files each session.
*   **Proactive Upgrades:** Automatic detection and task creation for external package updates.
*   **Clear Signals:** `Progress.md` guides human intervention.

---

## 1. Quick Start

To get started:

1.  **Clone:**
    ```bash
    git clone https://github.com/heyzgj/cursor-project-master my-new-project
    cd my-new-project
    ```
2.  **Initialize:**
    Review `docs/PRD.md` (replace `{{...}}`) and optionally tweak `.cursor/rules/project.mdc`.
    ```bash
    git add .
    git commit -m "feat: initial PRD & rules"
    ```
3.  **Launch in Cursor:**
    Open `my-new-project` in Cursor and type `/INIT` in chat.
    
    Cursor will:
    *   Parse `docs/PRD.md` (11-heading template).
    *   Auto-generate `docs/DESIGN.md`, `docs/AgentFacts.md`, `docs/Progress.md`.
    *   Set up `tasks/` (including `tasks/tasks_master.yaml`, `tasks/backlog/phase-0.md`).
    *   Prepare automated testing.
    *   Begin task decomposition and execution.

---

## 2. Daily Workflow

Key commands:

| Command                   | Use Case             | Effect                                        |
| :------------------------ | :------------------- | :-------------------------------------------- |
| `/STATUS`                 | Overview             | Shows totals, blocked tasks, code coverage.   |
| `/ADD_REQUIREMENT`        | New feature          | Appends to PRD §4, auto-decomposes tasks.     |
| `/OVERVIEW`               | Milestones, visibility | Generates Mermaid DAG + progress heatmap.     |
| *No command needed*       | CI fails             | Agent spawns fix task, appends summary to `Progress.md`. |

---

## 3. Core Files

Project file structure:

| Path                      | Purpose                                                                               |
| :------------------------ | :------------------------------------------------------------------------------------ |
| `docs/PRD.md`             | **Product Requirements Document:** Single source of truth (11-heading template).      |
| `docs/DESIGN.md`          | **Design Document (Auto-generated):** Mermaid context diagram and module table.       |
| `docs/AgentFacts.md`      | **Agent Knowledge Base (Auto-generated):** Runtime stack, external docs, embedding.   |
| `docs/Progress.md`        | **Daily Progress Log (Auto-generated):** Concise daily log (≤ 10 bullets, ≤ 80 chars).|
| `tasks/tasks_master.yaml` | **Task Management Master (Auto-generated):** Manages counters, tasks, phases.         |
| `tasks/backlog/phase-N.md`| **Task Backlog (Auto-generated):** Atomic tasks (≤ 300 rows/phase) in 6-column format.|
| `.cursor/rules/project.mdc`| **Workflow & Guardrails:** Defines AI agent rules.                                   |

---

## 4. How It Works

Underlying principles:

*   **Complexity to Subtasks:** Maps requirements to atomic subtasks (~30-min completion, Claude-Task-Master).
*   **Memory Bank:** Agents re-read `docs/` and `tasks/` each session.
*   **External Upgrade Guard:** Automates task creation for breaking changes (like Dependabot).

---

## 5. When to Step In

Signals for human intervention from `Progress.md`:

| Signal                    | Action                                                          |
| :------------------------ | :-------------------------------------------------------------- |
| `Need human review`       | Agent confidence < 0.3 or same error ×3. Clarify, guide.        |
| Repeated failed tests     | Inspect edge cases, refine acceptance criteria.                 |
| Rule file near 5,500 chars| Run `git mv` to archive oldest section; agent handles stub.     |

---

## 6. License

This project is open-sourced under the [MIT License](LICENSE).

---

## 🤝 Contributing

Contributions are welcome:

1.  Fork the repository.
2.  Create a new branch (`git checkout -b feature/your-feature-name`).
3.  Make changes and ensure tests pass.
4.  Commit changes (`git commit -m 'feat: Add new feature'`).
5.  Push to branch (`git push origin feature/your-feature-name`).
6.  Open a Pull Request.

---

## Support

For issues or questions, open an issue on the [GitHub repository](https://github.com/heyzgj/cursor-project-master/issues). I'll do my best to assist you.
