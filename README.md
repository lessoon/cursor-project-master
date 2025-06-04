# Cursor Project Master 🚀

**Automate Your Development Workflow with AI**

This repository provides a zero-configuration boilerplate designed to streamline your development workflow by leveraging the power of **Cursor** and **Claude** AI. It allows you to define your project requirements in a detailed Product Requirements Document (PRD) and, with a single rule file, enable AI agents to automate a significant portion of your development tasks. This approach aims to achieve up to 99% automation in your workflow, allowing you to focus on high-level strategic decisions while the agents handle the execution.

---

## ✨ Features & Benefits

*   **AI-Powered Automation:** Leverage Cursor and Claude AI to automate up to 99% of your development tasks.
*   **Zero-Configuration Boilerplate:** Get started quickly with a pre-configured project structure and AI integration.
*   **Detailed PRD-Driven Development:** Define your project requirements in a structured PRD, serving as the single source of truth.
*   **Automated Documentation & Task Management:** AI agents automatically generate design documents, agent knowledge bases, progress logs, and manage tasks.
*   **Intelligent Task Decomposition:** Complex requirements are broken down into atomic subtasks, ensuring efficient progress.
*   **Always Up-to-Date Context:** Agents re-read documentation and task files for the latest information at the start of each session.
*   **Proactive External Upgrade Guard:** Automatic detection and task creation for external package upgrades, ensuring project stability.
*   **Clear Human Intervention Signals:** Built-in signals in `Progress.md` guide you on when and where human review is necessary.

---

## 1. Quick Start: Setting Up Your Automated Project

To get started with the Cursor Project Master, follow these simple steps:

1.  **Clone the Repository:**
    ```bash
    git clone https://github.com/heyzgj/cursor-project-master my-new-project
    cd my-new-project
    ```
2.  **Initialize Your Project:**
    Before proceeding, you should review `docs/PRD.md` and replace the `{{...}}` placeholders with your project-specific details. You may also tweak the rules in `.cursor/rules/project.mdc` if necessary, though it's designed to be used as-is for most cases.
    ```bash
    git add .
    git commit -m "feat: initial PRD & rules"
    ```
3.  **Launch in Cursor:**
    Open the cloned `my-new-project` directory in Cursor. Once loaded, initiate the project setup by typing the following command in the chat interface:
    ```bash
    /INIT
    ```
    Upon executing `/INIT`, Cursor will automatically:
    *   Parse your **docs/PRD.md**, ensuring it adheres to the strict 11-heading (0-10) Atlassian template.
    *   Auto-generate essential project documentation: `docs/DESIGN.md`, `docs/AgentFacts.md`, and `docs/Progress.md`.
    *   Set up the task management system within the `tasks/` directory, including `tasks/tasks_master.yaml` and `tasks/backlog/phase-0.md`.
    *   Prepare for automated testing.
    *   Begin the process of breaking down your requirements into atomic tasks and ticking them off as work progresses.

---

## 2. Daily Workflow: Commands and Automation

The system is designed to automate many daily development tasks. Here are the key commands and their effects:

| Command                                   | When to Use                                      | Effect                                                                                                    |
| :---------------------------------------- | :----------------------------------------------- | :-------------------------------------------------------------------------------------------------------- |
| `/STATUS`                                 | Anytime, for an overview                         | Displays current project totals, lists blocked tasks, and provides code coverage information.             |
| `/ADD_REQUIREMENT` `<markdown table row>` | When adding a new feature or requirement         | Appends a new row to Section 4 (Functional Requirements) of `docs/PRD.md` and automatically decomposes it into subtasks. |
| `/OVERVIEW`                               | At milestones or for high-level project visibility | Generates a Mermaid Directed Acyclic Graph (DAG) of tasks and a heatmap of overall project progress.      |
| *No command needed*                       | When CI build fails                              | The agent automatically detects CI failures, appends a summary to `Progress.md`, and spawns a fix task to address the issue. |

---

## 3. Core Files: Understanding the Project Structure

This project follows a well-defined file structure to organize documentation, tasks, and configuration:

| Path                      | Purpose                                                                                                                                                                                                                                                                                                                                                             |
| :------------------------ | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `docs/PRD.md`             | **Product Requirements Document:** The single source of truth for your project. It strictly adheres to an 11-heading template (0-10) to ensure comprehensive and parsable requirements.                                                                                                                                                                                    |
| `docs/DESIGN.md`          | **Design Document (Auto-generated):** Contains a Mermaid context diagram illustrating the system architecture and a table detailing modules, their owners, and directories. This file is automatically generated and updated by the agents.                                                                                                                                  |
| `docs/AgentFacts.md`      | **Agent Knowledge Base (Auto-generated):** Stores critical information for the AI agents, including the project's runtime stack, details about external documentation services, and the embedding scheme used for knowledge retrieval.                                                                                                                                   |
| `docs/Progress.md`        | **Daily Progress Log (Auto-generated):** A concise, daily log limited to 10 bullet points (max 80 characters per line, with emojis). This file provides a high-level overview of daily advancements and agent activities.                                                                                                                                                |
| `tasks/tasks_master.yaml` | **Task Management Master (Auto-generated):** Manages task counters, lists active and blocked tasks, tracks development phases (e.g., `phase-0`), records rotations, and logs retired tasks.                                                                                                                                                                               |
| `tasks/backlog/phase-N.md`| **Task Backlog (Auto-generated):** Contains atomic tasks, with each phase file limited to 300 rows. Tasks are organized in a 6-column format: `ID`, `✔` (completion status), `Title`, `Depends` (dependencies), `Files` (associated files), and `Notes`.                                                                                                                      |
| `.cursor/rules/project.mdc`| **Workflow & Guardrails:** This critical file defines the workflow rules and guardrails for the AI agents. While it's central to the automation, you will rarely need to edit it directly as it's designed for stable operation.                                                                                                                                         |

---

## 4. How It Works: Underlying Principles

The automation relies on several key principles and mechanisms:

*   **Complexity to Subtasks Mapping:** A core principle is to break down complex requirements into manageable, atomic subtasks. This is achieved through a predefined mapping (e.g., a complexity guess of 1 maps to 1 subtask, 2 to 3, 3 to 5, etc.), ensuring that each subtask can be completed within approximately 30 minutes. This adheres to the Claude-Task-Master pattern.
*   **Memory Bank Ethos:** Agents are designed to re-read all relevant documentation (`docs/`) and task files (`tasks/`) at the beginning of each session. This "memory bank" approach ensures the agents always have the most up-to-date context and reduces the risk of relying on stale information.
*   **External Upgrade Guard:** Before the first use of any external package, the system automatically searches for its latest major breaking changes (e.g., `search("<PKG> changelog latest major breaking")`). If a newer version with breaking changes is detected, an "Upgrade <PKG>" task is automatically spawned to manage the necessary updates, mirroring the robustness of Dependabot's approach.

---

## 5. When to Step In: Human Intervention Signals

While the system aims for high automation, there are specific signals that indicate when human intervention is required:

| Signal in `Progress.md`          | Action Required                                                                                                                                                                |
| :------------------------------- | :----------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `Need human review`              | This signal indicates that the agent's confidence level is below 0.3 or it has encountered the same error three times. You should clarify ambiguous specifications or provide further guidance. |
| Repeated failed tests            | If tests repeatedly fail, it suggests an edge case or a flaw in the acceptance criteria. Inspect the test failures, refine the acceptance criteria, or provide additional context.     |
| Rule file near 5,500 characters  | The `.cursor/rules/project.mdc` file has a size limit (approximately 6KB in Cursor). If it approaches 5,500 characters, you should run `git mv` to archive the oldest section, and the agent will handle inserting a stub. |

---

## 6. License

This project is open-sourced under the MIT License. Feel free to use, modify, and distribute it as per the license terms.

---

## 🤝 Contributing

We welcome contributions to the Cursor Project Master! If you have suggestions for improvements, new features, or bug fixes, please feel free to:

1.  Fork the repository.
2.  Create a new branch (`git checkout -b feature/your-feature-name`).
3.  Make your changes and ensure tests pass.
4.  Commit your changes (`git commit -m 'feat: Add new feature'`).
5.  Push to the branch (`git push origin feature/your-feature-name`).
6.  Open a Pull Request.

---

## 📞 Support

If you encounter any issues or have questions, please open an issue on the GitHub repository. We'll do our best to assist you.
