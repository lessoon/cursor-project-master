# Cursor Project Master (CPM)

**Turn PRD into fully deployed apps.**

No coding. Just structured documents and an autonomous AI that builds, tests, and deploys your app.

---

## What is CPM?

Cursor Project Master transforms a simple product description into a complete, production-ready web application. Describe your idea once, clearly, in Markdown. CPM handles everything else:

- **Document-driven:** A single Markdown-based Product Requirement Document (PRD) and Technical Specification guide the entire development cycle.
- **Transparent workflow:** Tasks, plans, and decisions are neatly tracked in simple text files—completely visible and editable.
- **Self-improving agent:** Built-in self-reflection, prompt evolution, and error recovery make your project smarter with every step.

CPM is your shortest path from idea to deployment, with minimal friction and maximum clarity.

---

## Quick Start (from zero to deployed)

### Step 1: Clone the Repository
```bash
git clone https://github.com/your-name/cursor-project-master my-app
cd my-app
```

### Step 2: Write Your Docs

Fill in the provided templates located at `docs/_templates/`. Clearly define your product:

* `PRD.md`: Product vision, features, acceptance criteria
* `TECH_SPEC.md`: Technical overview, frameworks, APIs, deployment preferences
* `DATA_MAP.md`: Your data structure clearly described
* `UX_FLOW.md`: User journeys and interactions
* `STYLE_GUIDE.md`: UI elements and visual styling rules

**Tip**: Use ChatGPT or Gemini to assist:

```
Act as a world-class product manager and a principal software architect. Your task is to help me create the initial documentation blueprint for a new software project. You must be rigorous, structured, and ask clarifying questions if my idea is ambiguous.

## CONTEXT
You will be generating the content for a set of specific Markdown templates that an autonomous AI agent will use to build the entire application. The agent requires extreme clarity and structure. It cannot make assumptions.

## MY IDEA
[Your IDEA]

## YOUR TASK
Based on my idea, generate the content for the following files(PRD/TECH SPECH/...). For each file, present the content inside a Markdown code block.
```

Save these completed documents in the `/docs` directory.

### Step 3: Let the Agent Work

Open your repo in **Cursor**, switch to **Agent → Auto-run**, and type:

```
init
```

### Step 4: Set Deployment Secrets (one-time)

```bash
npx vercel login
npx vercel link
npx vercel env pull
```

*(For other hosts like Render or Fly.io, follow their environment setup.)*

### Step 5: Watch Progress

* Tasks automatically move through stages (`todo`, `in_progress`, `done`).
* Real-time status updates appear in `project/project_status.md`.
* Every validated commit auto-deploys a preview. Merging into `main` deploys production instantly.

---

## Adding New Features (One-Minute Tutorial)

### Step 1: Edit Your PRD

In `docs/PRD.md`, add your feature clearly:

```markdown
## New Feature — Image Upload
Users can attach images (JPEG/PNG ≤ 5MB). Store them on Supabase Storage; preview within editor.
```

### Step 2: Inform the Agent

In the Cursor chat window, simply say:

```
Add the "Image Upload" feature from PRD.md.
```

The agent automatically updates specs, plans tasks, writes code, runs tests, and deploys.

---

## Directory Structure

```
.cursor/rules/              Agent’s operating guidelines
docs/                       Product and tech specs, clearly structured
project/
  _templates/               Task & epic templates
  tasks/                    Kanban-style task management (todo/in_progress/done)
  TROUBLESHOOTING_LOG.md    Agent’s reflections and improvements
  project_status.md         Real-time progress overview
scripts/                    Reporting and prompt evolution utilities
.github/workflows/          CI/CD and event-driven evolution automation
src/                        Auto-generated project code
```

---

## FAQs

| Question                                       | Answer                                                                                                                                            |
| ---------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Am I locked into a specific stack?**         | No. Simply edit your stack preference in `TECH_SPEC.md` (Next.js, SvelteKit, FastAPI, etc.). CPM adapts automatically.                            |
| **Can I manually intervene?**                  | Absolutely. Your edits become the new ground truth. CPM respects your changes and continues smoothly.                                             |
| **Where does CPM store "memory"?**             | Everything stays in clear, local files (`AGENT.md`, `TROUBLESHOOTING_LOG.md`, `DECISION_LOG.md`). No hidden memory unless explicitly enabled.     |
| **What happens when tests keep failing?**      | CPM reflects, revises plans after 3 failures, and attempts a competitive patch after 5. Edit or remove tasks freely.                              |
| **How is prompt evolution triggered?**         | Automatically when troubleshooting logs change significantly, or manually via the GitHub Actions workflow. CPM suggests improvements through PRs. |
| **How should I respond if CPM has questions?** | Reply in plain English. CPM updates specs, adjusts plans, and resumes immediately.                                                                |

---

## License & Contributing

MIT License — Fork, build, innovate freely. Contributions via PRs are welcome and encouraged.