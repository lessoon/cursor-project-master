# Project Status & Agent Dashboard

*Last Updated: {{YYYY-MM-DD HH:MM Z}} by CursorAgent*

---

## 🎯 Current Focus

- **Active Task ID:** T001
- **File:** `@/project/tasks/T001.md`
- **Objective:** Create the database migration for the 'users' table.

---

## 📈 High-Level View

### Epics Status

| ID | Title | Status | Progress |
|----|-------|--------|----------|
| E01 | User Authentication | In Progress | ▓▓░░░░░░░░ 20% |
| E02 | Payment Flow | To Do | ░░░░░░░░░░ 0% |

### Upcoming Tasks (Next 3)

*This is the agent's immediate work queue, filtered for tasks that are not blocked.*

1.  **T002:** Implement Signup API (`Depends on: T001`)
2.  **T003:** Implement Login API (`Depends on: T001`)
3.  **T005:** Unit Tests for Auth Service

### ⚠️ Blocked & High-Risk Tasks

- **Blocked:** `T004` (Waiting for `T002`, `T003`)
- **High-Risk:** `T015` (Refactor payment gateway integration)

---

## 🤖 Agent's Task Query Language (TQL)

*My instructions for interacting with the task system using the command line to ensure token efficiency.*

- **Get Task Details:** `cat ./project/tasks/TASK_ID.md`
- **Find Tasks (by status):** `grep -l "status: In Progress" ./project/tasks/*.md`
- **Find Tasks (by epic):** `grep -l "epic: EPIC_ID" ./project/tasks/*.md`
- **Update Task Status:** `sed -i 's/status: To Do/status: In Progress/' ./project/tasks/TASK_ID.md`