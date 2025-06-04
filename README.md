# Cursor Project Master

**Sit back and watch AI build your project.**

A streamlined boilerplate empowering indie hackers, vibe coders, and Cursor enthusiasts to effortlessly automate 99% of coding tasks. No heavy lifting—just your vision and Cursor doing the rest.

---

## Why CPM

* **99% Agent-Driven**: Minimal human intervention; AI autonomously handles tasks.
* **Zero Coding Required**: Focus purely on creativity; AI translates your PRD into actionable tasks.
* **Self-Maintaining Docs**: Automatically updated design diagrams, knowledge bases, and task logs.
* **Context-Aware Agents**: Fresh context reloads ensure accuracy every session.
* **Auto-Upgrades**: Proactive management of external dependencies and breaking changes.
* **Future-Ready**: Optimized for next-gen agent coding like Claude 4 Opus, overcoming inherent context limits and memory challenges of current AI models.

Unlock the true power of Cursor and Claude to scale your projects effortlessly.

---

## Quick Start

### New Project

1. **Clone the Repository:**

   ```bash
   git clone https://github.com/heyzgj/cursor-project-master my-project
   cd my-project
   ```

2. **Customize Your PRD:**

   Replace placeholders in `docs/PRD.md`. Optionally adjust `.cursor/rules/project-init.mdc` and `.cursor/rules/project-core.mdc`.

3. **Start Building:**

   Open the project in Cursor and type:

   ```
   /INIT
   ```

Cursor handles the rest:

* Parses your PRD
* Generates tasks, documentation, and testing frameworks

### Existing Project Migration

1. **Update Your PRD:** Align your current PRD with the provided 11-heading template in `docs/PRD.md`.

2. **Activate Migration:**

   Edit `.cursor/rules/project-init.mdc`:

   ```yaml
   existing_repo: true
   ```

3. **Migrate:**

   Open the project in Cursor and type:

   ```
   /MIGRATE
   ```

Cursor will:

* Analyze and map existing code
* Synchronize PRD with task backlog
* Automatically mark completed tasks

---

## Everyday Usage

| Command            | Scenario             | Outcome                                       |
| ------------------ | -------------------- | --------------------------------------------- |
| `/STATUS`          | Daily review         | Summarizes tasks, blockers, coverage.         |
| `/ADD_REQUIREMENT` | Introducing features | Auto-generates detailed subtasks.             |
| `/OVERVIEW`        | Tracking milestones  | Displays visual progress diagrams (Mermaid).  |
| *(No action)*      | CI test failures     | Auto-creates fix tasks with context provided. |

---

## Project Structure

| Path                       | Purpose                                                 |
| -------------------------- | ------------------------------------------------------- |
| `docs/PRD.md`              | Definitive Product Requirements Document.               |
| `docs/DESIGN.md`           | Auto-generated Mermaid diagrams and modules.            |
| `docs/AgentFacts.md`       | Project stack, integrations, embeddings (auto-updated). |
| `docs/Progress.md`         | Concise, daily auto-generated progress log.             |
| `tasks/tasks_master.yaml`  | Central task management (Cursor-managed).               |
| `tasks/backlog/phase-N.md` | AI-managed atomic tasks backlog.                        |
| `.cursor/rules/*.mdc`      | AI behavioral rules and workflows.                      |

---

## Built by Indie Hackers, for Indie Hackers

Created specifically for indie hackers, vibe coders, and anyone enthusiastic about effortless, AI-powered development. Focus on your ideas; let Cursor handle the rest.

---

## Support & Contribution

Feel free to raise an issue or contribute with a PR—we’d love your insights and suggestions!

---

## License

MIT Licensed.
