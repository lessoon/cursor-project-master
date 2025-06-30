# Task Template for CPM Kanban System

## File Naming Convention
- **Filename:** `T-<ID>.md` (e.g., `T-1.md`, `T-42.md`)
- **Location:** Based on status:
  - `project/tasks/backlog/` → **Inbox** column (new/unassigned tasks)
  - `project/tasks/todo/` → **Next Up** column (ready to start)
  - `project/tasks/in_progress/` → **Running** column (actively worked on)
  - `project/tasks/done/` → **Done** column (completed tasks)

## Required Format

```markdown
# <TaskTitle>

**Epic:** <EpicName>  
**Type:** feature | bug | test | research | design  
**Effort:** 1 | 2 | 3 points  
**Status:** inbox | next-up | running | done  

## Description
<Brief description of what needs to be accomplished>

## Acceptance Criteria
- [ ] <Specific, testable requirement>
- [ ] <Another requirement>
- [ ] <Final requirement>

## Dependencies
- <TaskID> (<Optional description>)

## Checklist
- [ ] <Actionable step 1>
- [ ] <Actionable step 2>
- [ ] <Actionable step 3>
- [ ] <Final step>

## Notes
<Optional implementation notes, context, or considerations>
```

## Field Specifications

### **Epic** (Required)
- Format: `E-<ID> - <EpicName>` or descriptive name
- Example: `E-1 - UI Skeleton Implementation`

### **Type** (Required)
- `feature`: New functionality
- `bug`: Fix broken behavior  
- `test`: Add/improve testing
- `research`: Investigation or spike
- `design`: UI/UX design work

### **Effort** (Required)
- `1`: Small task (1-4 hours)
- `2`: Medium task (1-2 days)  
- `3`: Large task (2-3 days)

### **Status** (Auto-managed by file location)
- Determined by directory, not frontmatter
- File moves between directories change status

### **Acceptance Criteria** (Required)
- Must be testable and specific
- Written as checkboxes `- [ ]`
- Defines "done" for the task

### **Dependencies** (Optional)
- List other task IDs this depends on
- Format: `- T-<ID> (<description>)`

### **Checklist** (Required for UI tasks)
- Actionable implementation steps
- Interactive in Kanban UI
- Progress calculated from completion ratio

## Example Task

```markdown
# ImplementUserAuthentication

**Epic:** E-2 - User Management System  
**Type:** feature  
**Effort:** 3 points  
**Status:** next-up  

## Description
Implement secure user authentication with JWT tokens, including login, logout, and session management.

## Acceptance Criteria
- [ ] Users can log in with email/password
- [ ] JWT tokens are issued on successful login
- [ ] Protected routes require valid authentication
- [ ] Users can log out and invalidate tokens
- [ ] Session expires after 24 hours

## Dependencies
- T-15 (Database schema for users)
- T-16 (Password hashing utility)

## Checklist
- [ ] Set up JWT library and configuration
- [ ] Create login API endpoint
- [ ] Implement password validation
- [ ] Add JWT token generation
- [ ] Create logout endpoint
- [ ] Add authentication middleware
- [ ] Protect existing routes
- [ ] Add session expiration handling
- [ ] Write unit tests for auth flow
- [ ] Test with frontend integration

## Notes
Use bcrypt for password hashing. Consider refresh token strategy for production.
JWT secret should be in environment variables.
```

## AI Agent Guidelines

When creating tasks:
1. **Always include all required fields**
2. **Make acceptance criteria specific and testable**
3. **Break large tasks into smaller ones (max effort: 3)**
4. **Use consistent Epic naming**
5. **Add detailed checklists for complex tasks**
6. **Reference dependencies by task ID**
7. **Place files in correct directory for desired status**

## Status Flow
```
backlog/ (Inbox) → todo/ (Next Up) → in_progress/ (Running) → done/ (Done)
```

Tasks move through directories as they progress through the workflow.
