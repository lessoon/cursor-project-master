# Project Type Profiles & Guidelines

**Overview:** Cursor Project Master can handle various project types. This document defines different project archetypes, how to identify them from the PRD, and special guidelines or constraints for each. By recognizing the project type early, the AI agent adapts its architecture and priorities to better suit the project’s needs.

## Automatic Type Identification
When the AI parses the PRD, it uses these cues to classify the project:
- **Front-End Project:** PRD includes a detailed Visual Style Guide (section 5), and features revolve around UI/UX with minimal backend logic. Tech choices may mention front-end frameworks (React, Vue, etc.) while backend is “N/A” or minimal.
- **Back-End Project:** PRD’s Visual Style section is empty or trivial, but there are many data processing or API requirements. Tech choices focus on server, database, CLI tools, etc., with no mention of web UI frameworks.
- **Full-Stack Project:** PRD covers both UI and server aspects – e.g. a Visual Style Guide is present **and** functional requirements include backend logic or database. Tech choices likely include both front-end and back-end technologies.
- **Refactor/Migration:** The `existing_repo: true` flag is set in rules, indicating we are integrating with or improving an existing codebase. The PRD might focus on modifying or extending current features rather than building from scratch.

The agent will log its detected type (for transparency) and then apply the profile guidelines below.

## Front-End Focused Projects
**Description:** Projects primarily involving user interfaces, web or mobile front-ends, with relatively light business logic. Examples: a static marketing site, a front-end for an existing API, a mobile app UI.

**Agent Behavior & Architecture:**
- *Framework & Structure:* If not specified, the agent will choose a suitable front-end framework (e.g. a React single-page app for web, or a simple static HTML/JS setup) and set up the project structure accordingly (e.g. create a `frontend/` directory or a base HTML file).
- *Visual Consistency:* The agent closely follows the PRD’s Visual Style Guide for fonts, colors, and iconography. It will set up global styles or theme constants to enforce design consistency.
- *State Management:* For complex UIs, the agent may introduce state management (context or simple Redux-like patterns) if multiple components need to share data, even if not explicitly asked – this ensures scalability.
- *API Integration:* If the PRD indicates data comes from an API, the agent will create placeholder API client modules or integration points. Conversely, if no backend is in scope, it may use mocked data or local storage as needed to satisfy features.
- *Testing:* Emphasis on front-end tests – e.g. React component tests or end-to-end tests using something like Playwright if applicable. It will generate tests to validate that UI components render and behave according to acceptance criteria.

**Constraints:**
- Avoid heavy backend setup. If any form processing or data storage is needed and no backend exists, use simplest means (e.g. browser local storage or a third-party SaaS if allowed by PRD).
- Ensure responsiveness and cross-browser compatibility if applicable (the agent will infer this if “mobile support” is mentioned in constraints).

## Back-End Focused Projects
**Description:** Projects centered on server-side logic, databases, and APIs, with little or no user interface. Examples: a REST API service, a data processing pipeline, command-line utilities, or microservice.

**Agent Behavior & Architecture:**
- *Framework & Structure:* The agent will select a backend framework or library (if not fixed in PRD). For instance, it might set up a Flask/FastAPI app for a Python project, or a Node Express server for JS, etc. It organizes code into logical modules (e.g. routes/controllers, services, models).
- *Database & Models:* If a database is indicated, the agent will define schema models and use an ORM or raw queries as appropriate. It sets up migration stubs or config files needed to run the DB.
- *API Definition:* For services exposing APIs, the agent will document endpoints (in `docs/AgentFacts.md` or as OpenAPI spec if asked) and ensure each functional requirement maps to one or more API endpoints or CLI commands.
- *Error Handling & Logging:* The agent will include robust error handling (try/except blocks, meaningful error messages) and logging statements around key operations to facilitate debugging, since no UI will indicate issues.
- *Testing:* Heavy focus on unit and integration tests for logic. It will create tests for each API endpoint or core function, using given acceptance criteria (e.g. testing response codes, output data structure, performance if relevant).

**Constraints:**
- If no front-end, skip any steps related to UI (the Visual Style Guide section can be ignored safely).
- Ensure security best practices for APIs (authentication, input validation) especially if mentioned under non-functional requirements.
- Optimize performance for back-end logic (e.g. avoid n+1 database queries, use caching if needed) in line with any constraints.

## Full-Stack Projects
**Description:** Projects that include both a user-facing front-end and a back-end component. Examples: a web application with its own server (and maybe database), an end-to-end product where front and back must be developed together.

**Agent Behavior & Architecture:**
- *Directory Structure:* The agent will typically separate front-end and back-end code. For example, it might create `frontend/` and `backend/` folders, or for simplicity in a Python context, it could serve an HTML/JS app via Flask templates. The exact approach follows Tech Choices in the PRD (e.g. if PRD suggests a MERN stack vs. a Django server with templates).
- *Interface Design:* It ensures the front-end and back-end interface cleanly. This means defining clear API endpoints or GraphQL schema that the front-end will call. The agent may add CORS settings or auth tokens handling as needed.
- *Task Allocation:* The agent will intermix front-end and back-end tasks sensibly. It might complete a back-end endpoint and then the front-end UI that uses it, to quickly produce end-to-end functionality incrementally (unless the PRD dictates another order).
- *Consistent Models:* Data models defined on the backend will also be mirrored as needed on the front-end (for instance, TypeScript types or JSON schemas) so both sides speak the same language.
- *Testing:* Both sides are tested. The agent writes front-end tests for UI behavior and back-end tests for logic. Additionally, it may include integration tests that spin up the back-end and exercise it via HTTP calls from a test, to ensure the full stack works together (if complexity permits within the AI’s capacity).

**Constraints:**
- Keep an eye on project complexity: the agent will avoid introducing too many new technologies at once. It will try to use coherent stacks (e.g. if Python backend, perhaps a lightweight JS framework for front-end, rather than something completely disjoint that complicates integration).
- Respect any deployment or environment constraints. For example, if the PRD says “must run on Cloud Functions” or “front-end must be static-only”, the agent will adjust (this should be noted in Constraints section of PRD).

## Refactoring & Legacy Integration
**Description:** Projects where we start with an existing codebase (`existing_repo: true`) and the goal is to refactor, improve, or integrate new features without breaking what’s there.

**Agent Behavior & Architecture:**
- *Code Reading:* The agent spends extra time analyzing the existing code. It generates an import/dependency graph (via `pyan3` or similar) to understand the structure. This is saved to `docs/DESIGN.md` for transparency.
- *Feature Mapping:* The agent cross-references the PRD’s requirements with existing functionalities. Completed features are marked as done (✔) in the task list automatically.
- *Non-Regression:* For any area it will modify, the agent first creates regression tests (if not already present) to lock in current behavior. This is crucial: before refactoring a module or adding a feature, it ensures there’s a safety net of tests.
- *Incremental Refactor:* The agent will not overhaul everything at once. It tackles one module or feature at a time, verifying tests pass after each change. Commits will be like “Refactor module X for Y” or “Improve performance of Z”.
- *Preservation of Style:* The agent adapts to the coding style and conventions of the existing codebase (naming, structure, patterns) to ensure consistency. It will refer to `project-conventions.mdc` or similar guidelines if provided, or infer style from the code.
- *Documentation:* It updates `docs/AgentFacts.md` to note legacy design quirks or tech debt if it finds any (this helps user understand any limitations).

**Constraints:**
- Never remove or rewrite large portions of code unless absolutely necessary for the new requirements. Instead, deprecate gradually or leave the old code path in place behind flags if unsure.
- All existing unit tests (if the repo had any) must continue to pass. The agent runs the full test suite on each major change to ensure no regressions.
- If a new feature conflicts with an existing one, flag it to the user (in Progress log) rather than blindly overriding.