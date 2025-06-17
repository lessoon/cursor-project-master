# Cursor Project Master (CPM)

> **From concept to launch, with just your PRD.**

Forget about writing code and dealing with boilerplate.

**Cursor Project Master** takes your structured documents and magically transforms them into fully built, tested, and deployed applications. All you need is a clear Product Requirements Document (PRD).

---

## Why CPM?

* **📝 Just your docs:** Clearly describe your idea in Markdown—CPM takes care of the rest.
* **🤖 Zero hassle:** Automatic code generation, testing, and deployment.
* **🚀 Instant launch:** Move swiftly from idea to deployed product, iterate effortlessly.

---

## How CPM Works

Cursor Project Master uses your structured Markdown documents to handle every phase:

* **Document-Driven:** PRD, Technical Specs, Data Maps, UX Flows, and Style Guides drive development.
* **Transparent:** Every step, decision, and task is openly tracked and editable.
* **Smart & Adaptable:** Built-in self-improvement, prompt refinement, and automatic error recovery.

---

## ⚡ Quick Start

### 1. Clone the Repo

```bash
git clone https://github.com/heyzgj/cursor-project-master my-app
cd my-app
```

### 2. Write Your Docs

Fill in the templates located in `docs/_templates/`:

* `PRD.md` – Product vision & requirements
* `TECH_SPEC.md` – Technical stack & deployment preferences
* `DATA_MAP.md` – Define your data clearly
* `UX_FLOW.md` – User interactions step-by-step
* `STYLE_GUIDE.md` – Visual and UI elements

**Tip:** Use ChatGPT or Gemini as assistants for clarity:

```markdown
Act as a world-class product manager and a principal software architect. Your task is to help me create the initial documentation blueprint for a new software project. You must be rigorous, structured, and ask clarifying questions if my idea is ambiguous.

## CONTEXT
You will be generating the content for a set of specific Markdown templates that an autonomous AI agent will use to build the entire application. The agent requires extreme clarity and structure. It cannot make assumptions.

## MY IDEA
[Your IDEA]

## YOUR TASK
Based on my idea, generate the content for the following files(PRD/TECH SPECH/...). For each file, present the content inside a Markdown code block.
```

Place completed docs in `/docs`.

### 3. Let CPM Do Its Magic

Open your project in **Cursor**, activate **Agent → Auto-run**, and type:

```bash
init
```

### 4. Configure Deployment (One-time)

```bash
npx vercel login
npx vercel link
npx vercel env pull
```

*(Or follow setup steps for your chosen host.)*

### 5. Watch Progress

* Tasks auto-update through stages (`todo`, `in_progress`, `done`).
* Track live updates in `project/project_status.md`.
* Auto-deploy preview on every commit; production deployment by merging into `main`.

---

## Adding Features (Under 1 Minute!)

**Edit your PRD:**

```markdown
## New Feature: Image Upload
Allow users to upload images (JPEG/PNG ≤ 5MB). Store on Supabase Storage.
```

Then just inform CPM:

```
Add the "Image Upload" feature from PRD.md.
```

CPM takes care of updating, implementing, testing, and deploying automatically.

---

## Project Structure

```
.cursor/rules/                 # CPM guidelines
docs/                          # Product & technical specs
project/
  _templates/                  # Task & epic templates
  tasks/                       # Kanban-style management
  TROUBLESHOOTING_LOG.md       # Agent reflections
  project_status.md            # Real-time updates
scripts/                       # Utilities for reporting
.github/workflows/             # CI/CD automation
src/                           # Auto-generated code
```

---

## FAQ

| Question                        | Answer                                                    |
| ------------------------------- | --------------------------------------------------------- |
| Am I stuck with one tech stack? | No. Edit `TECH_SPEC.md` and CPM adapts seamlessly.        |
| Can I manually edit the code?   | Yes! Your changes become the new baseline instantly.      |
| How does CPM store "memory"?    | Clearly in local text files. Nothing hidden.              |
| What if tests fail repeatedly?  | CPM reflects, revises plans, retries intelligently.       |
| How does CPM evolve prompts?    | Automatically or via GitHub Actions—improving constantly. |

---

## Contribute & License

MIT License – Fork, build, innovate!

**Contributions welcome!** PRs are encouraged—let's build together.