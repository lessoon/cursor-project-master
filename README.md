# project-starter 🚀

A zero-configuration boilerplate that lets **Cursor + Claude** run 99 % of your workflow.  
You write a detailed PRD, drop in one rule file, and the agents do the rest.

---

## 1 Quick Start

```bash
git clone https://github.com/heyzgj/cursor-project-master my-new-project
cd my-new-project
# replace PRD placeholders, tweak rules if you must
git add .
git commit -m "feat: initial PRD & rules"
````

Open Cursor → start chat in repo → type:

```bash
/INIT
````

Cursor will:

1. Parse **docs/PRD.md** (11 headings).
2. Auto-generate DESIGN.md, AgentFacts.md, Progress.md, tasks/, tests.
3. Begin coding & ticking tasks.

---

## 2 Daily Workflow

| Command                                   | When        | Effect                                   |
| ----------------------------------------- | ----------- | ---------------------------------------- |
| `/STATUS`                                 | Anytime     | Shows totals, blockers, coverage         |
| `/ADD_REQUIREMENT` `<markdown table row>` | New feature | Appends to PRD §4, auto-decomposes tasks |
| `/OVERVIEW`                               | Milestone   | Mermaid DAG + heatmap / progress         |
| *No command*                              | CI fails    | Agent spawns fix task automatically      |

---

## 3 File Map

| Path                      | Purpose                                        |
| ------------------------- | ---------------------------------------------- |
| docs/PRD.md               | **Single source of truth** (11 fixed headings) |
| docs/DESIGN.md            | Context diagram + modules table *(auto)*       |
| docs/AgentFacts.md        | Runtime & external docs *(auto)*               |
| docs/Progress.md          | Daily 10-line log *(auto)*                     |
| tasks/tasks\_master.yaml  | Counters & phase list *(auto)*                 |
| tasks/backlog/phase-N.md  | ≤ 300 atomic tasks per phase *(auto)*          |
| .cursor/rules/project.mdc | Workflow & guardrails (you rarely edit)        |

---

## 4 Behind the Scenes

* **Complexity → Subtasks** mapping (1→1, 2→3, 3→5…) borrowed from Claude-Task-Master → ensures every task ≤ 30 min. (\[github.com]\[4])
* **Memory Bank ethos**: agents must reread docs + tasks on every session. (\[cline.bot]\[3])
* **External Upgrade Guard** relies on live changelog search rather than pinned URLs, mirroring Dependabot’s approach. (\[github.blog]\[6])

---

## 5 When to Step In

| Signal in `Progress.md`    | Action                                        |
| -------------------------- | --------------------------------------------- |
| `Need human review`        | Clarify ambiguous spec                        |
| Repeated failed tests      | Inspect edge case, refine Acceptance Criteria |
| Rule file near 5 500 chars | Run `git mv` to Archive; agent handles stub   |

---

## 6 License

MIT.
