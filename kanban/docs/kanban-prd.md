# CPM Kanban Board – Product Requirements Document  
**Version 1.0 (MVP, 2025-06-23)**

---

## 0 · Purpose

A plug-and-play Kanban UI that lets **non-technical** contributors plan work,
while Cursor’s agent keeps the underlying markdown task files up-to-date.

---

## 1 · Personas

| Persona ID | Profile & Pain Points | Primary Goals            |
|------------|----------------------|--------------------------|
| **PM-Lite** | AI product manager, minimal Git skills | See progress, reorder priorities |
| **JuniorDev** | First coding job, still learning Git | Understand what to build next |
| **VibeHobbyist** | Weekend hacker, hates terminals | Jot ideas, watch AI build them |

---

## 2 · Information Architecture

### 2.1 Columns
`inbox` → `next-up` → `running` → `done` (+ `blocked`, `obsolete`)

### 2.2 Card (list view)  
| Field | Render | Source (in `.md`) |
|-------|--------|-------------------|
| **ID** | `T-123` | filename |
| **Title** | 1 line | `# <title>` |
| **Effort** | 🟢•🟢🟢 (1/2/3 pts dots) | `effort:` front-matter |
| **Checklist** | 3 / 5 | checkbox count |
| **Tags** | pill chips | `type:` + `ui_review:` |
| **Status** | column | folder path |
| **AI Pulse** | sparkle icon if agent working | runtime socket |

### 2.3 Card Detail Modal  
| Section | Data |
|---------|------|
| Title & ID | Read-only |
| Markdown body | `description:` |
| Acceptance criteria | rendered checkboxes |
| Dependencies | clickable IDs |
| “Open source file” button | deep-link to github blob |

### 2.4 “Create Task” Modal  
1. **Requirement** `<textarea>` (free text)  
2. **Effort slider** 1-3 pts (optional)  
3. **Generate via Gemini** → preview JSON → “Create”

---

## 3 · File-System Contract

| UI Action | Filesystem Effect |
|-----------|-------------------|
| Drag card to new column | `git mv project/tasks/<old>/<file>  …/<new>/` |
| Edit title/body | overwrite `.md` |
| Tick checklist | toggle `- [ ]` → `- [x]` |
| Create task | write new file under `project/tasks/inbox/` |
| Delete card | `git rm` + move to `obsolete/` |

---

## 4 · Gemini-Based Task Decomposition

### 4.1 Trigger
In “Create Task” modal when user clicks **Generate**.

### 4.2 Prompt Template (sent to Gemini Pro 1.5)
```text
System: You are a senior software project analyst.  
User: Convert the following feature request into a JSON task bundle.  
Rules:  
- Split into 1-3 atomic tasks (max 2 dev-days each).  
- Each task gets ≤5 acceptance criteria, written as past-tense bullets.  
- Infer reasonable checklist items (3-7).  
- If any UI work, add "ui_review": true.  
- Use IDs starting at TEMP-1; the host app will rename later.  
JSON schema: { "tasks":[{id,title,description,criteria[],checklist[],ui_review,bool}] }
Feature request:
<<<{{user_requirement_text}}>>>
```

### 4.3 Post-processing

Kanban renames `TEMP-n` to next free `T-n` and writes each task file with the **Task Template**.

---

## 5 · Scope (MVP)

| Epic               | Must-haves (done = merge & CI green)     |
| ------------------ | ---------------------------------------- |
| **UI Skeleton**    | columns, drag-n-drop, card modal         |
| **Data Bridge**    | read/write markdown files                |
| **AI Task Gen**    | Gemini flow above                        |
| **AI Agent Pulse** | fake in-memory loop (checklist/progress) |
| **Doc Viewer**     | render markdown resources                |
| **Tests**          | unit + Playwright happy path             |

---

## 6 · Non-Functional Targets

| Metric           | Target                         |
| ---------------- | ------------------------------ |
| Local board load | ≤ 2 s                          |
| Bundle size      | ≤ 500 KB gzip                  |
| Code coverage    | ≥ 70 %                         |
| Accessibility    | WCAG AA for drag-drop & modals |

---

## 7 · Out of Scope (v1)

* Real-time multi-user sync
* Server database
* Custom column editor
* Analytics dashboard

---

## 8 · Acceptance Checklist

* [ ] All MVP epics **Done** in Kanban and merged to `main`
* [ ] CI workflow green, coverage ≥ 70 %
* [ ] Gemini generates valid JSON > 95 % of tries
* [ ] Dragging a card correctly moves the file in Git
* [ ] UI review tasks blocked until human “approve:” comment
* [ ] Non-technical user can create, reorder, and complete a task without opening a terminal

---

*Last updated 2025-06-23*