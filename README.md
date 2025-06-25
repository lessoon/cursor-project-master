# Cursor Project Master (CPM)

> **The only AI-native starter kit you'll ever need — from idea to product in Cursor.**

Transform your ideas into production-ready applications without writing a single line of code. Just describe what you want, and watch CPM build it.

**Cursor Project Master** (CPM) is a system of AI-readable rules and a visual Kanban board built specifically for **Cursor** users. It takes your structured documents and transforms them into fully built, tested, and deployed applications. All you need is a clear Product Requirements Document (PRD).

---

## Why CPM?

* **📝 Just your docs:** Clearly describe your idea in Markdown—CPM takes care of the rest.
* **📋 Visual Kanban:** Watch your tasks progress from `todo` to `done` in an AI-updated board.
* **🤖 Zero hassle:** Automatic code generation, testing, and deployment.
* **🚀 Instant launch:** Move swiftly from idea to deployed product, iterate effortlessly.

---

## How CPM Works

Cursor Project Master uses your structured Markdown documents to handle every phase:

* **Document-Driven:** PRD, Technical Specs, Data Maps, UX Flows, and Style Guides drive development.
* **Kanban-Powered:** Tasks are auto-generated, updated, and visualized through a live Kanban interface.
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
Based on my idea, generate the content for the following files(PRD/TECH SPEC/...). For each file, present the content inside a Markdown code block.

> **Critical Rules**
>
> 1. Do **not** invent, infer, or guess any information. If something is unknown, ask.
> 2. Before drafting **any** document you must:
>    a. Ask every clarifying question needed for 100 % accuracy.
>    b. Wait until I reply **“done”** to signal that no more information will be provided for now.
>    c. Request that I upload the blank template file you’re about to fill.
> 3. Work **one file at a time** in the order above. Do not begin the next file until I approve the current one.
> 4. When writing:
>    • Use precise, imperative language (avoid words like “robust,” “nice,” “etc.”).
>    • If a detail is truly undecided, write **“N/A – not decided yet”** instead of leaving it blank or making assumptions.
>    • Use ISO 8601 dates (`YYYY-MM-DD`).
>    • Output pure Markdown **without code-fences** so I can paste directly into the file.
> 5. After you deliver a draft, explicitly ask: **“Is this acceptable? If yes, reply ‘next’; if changes are needed, specify them.”**

> **Workflow Overview**
>
> 1. **Discovery Phase** – You ask exhaustive questions covering product idea, personas, constraints, metrics, stack, data, UX, style, compliance, etc.
> 2. I answer until satisfied, then type **“done.”**
> 3. You say: *“Please upload `PRD.md` template.”*
> 4. I upload the file.
> 5. **Drafting Phase** – You generate the completed `PRD.md` content only.
> 6. I review; if approved, I reply **“next.”**
> 7. Repeat steps 3-6 for `TECH_SPEC.md`, then `DATA_MAP.md`, `UX_FLOW.md`, and finally `STYLE_GUIDE.md`.
> 8. After the fifth file is accepted, you conclude with **“All documents completed.”**

> **Begin by asking your clarifying questions now.**
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
* Visual Kanban interface under `/kanban` for real-time tracking.
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
kanban/                        # AI-powered Kanban interface
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

| Question                        | Answer                                               |
| ------------------------------- | ---------------------------------------------------- |
| Am I stuck with one tech stack? | No. Edit `TECH_SPEC.md` and CPM adapts seamlessly.   |
| Can I manually edit the code?   | Yes! Your changes become the new baseline instantly. |
| How does CPM store "memory"?    | Clearly in local text files. Nothing hidden.         |
| What if tests fail repeatedly?  | CPM reflects, revises plans, retries intelligently.  |

---

## Contribute & License

MIT License – Fork, build, innovate!

**Contributions welcome!** PRs are encouraged—let's build together.