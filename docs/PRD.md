## `docs/PRD.md` — Strict Template (11 fixed H1 headings)

<!--
agentdoc-starter – PRD template v1.2  
MUST keep exactly 11 top-level headings (# 0–10).  
Fill in every {{...}} placeholder with specific details.  
If starting from just an idea, see "From Idea to PRD" guidance below.
-->

# 0 One-Sentence Mission
{{ ≤ 20 English words describing the product’s main objective }}

# 1 Problem Statement
- **Pain:** {{ one sentence on the core user pain point }}  
- **Impact:** {{ one sentence on why it matters }}  
- **Gap:** {{ one sentence on why current solutions fall short }}  
<!-- Using a 3-part Pain/Impact/Gap format reduces solution bias -->

# 2 Personas & Context
| Persona       | Goal                      | Frustration            |
| ------------- | ------------------------- | ---------------------- |
| {{ User Type }} | {{ What they want to achieve }} | {{ What blocks them today }} |
<!-- Define primary user roles and their context to ground the requirements. -->

# 3 End-to-End Flow
```mermaid
flowchart LR
    {{ A[Start] --> B[Step 1] --> C[Step 2] --> D[End] }}
````

<!-- Use a simple flowchart for the user journey or system flow. Formal Mermaid syntax is AI-parsable -->

# 4 Functional Requirements

<!-- List all key product features as F##, each with clear Acceptance Criteria to avoid ambiguity. -->

| ID  | Title              | Acceptance Criteria (AC)                  | Depends | ComplexityGuess |
| --- | ------------------ | ----------------------------------------- | ------- | --------------- |
| F01 | {{ Feature name }} | {{ measurable AC: what done looks like }} | –       | {{ 1-5 }}       |
| F02 | {{ Next feature }} | {{ AC: expected behavior or outcome }}    | F01     | {{ 1-5 }}       |

<!-- Each feature’s AC should be testable (e.g. “when X, the system does Y”). Depends links F-IDs. Complexity 1 (trivial) to 5 (very complex) helps task planning. -->

# 5 Visual Style Guide

## 5.1 Typography

* **Headings:** {{ Font family, weight, size }}
* **Body:** {{ Font and size for regular text }}

## 5.2 Color Palette

| Token          | Hex           | Usage                          |
| -------------- | ------------- | ------------------------------ |
| {{ Primary }}  | {{ #XXXXXX }} | {{ e.g. Buttons, Links }}      |
| {{ Secondary}} | {{ #YYYYYY }} | {{ e.g. Background, Accents }} |

## 5.3 Iconography & Motion

* **Icons:** {{ e.g. outline style, 1.5px stroke }}
* **Animations:** {{ e.g. duration ≤ 200ms, easing }}

<!-- If a UI is involved, specify the look & feel to guide front-end implementation. Otherwise, state “N/A” if purely back-end. -->

# 6 Non-Functional Reqs

* {{ Performance target (e.g. P95 latency < 500ms) }}
* {{ Security/Compliance (e.g. GDPR, OWASP top 10) }}
* {{ Scalability or Uptime needs }}

<!-- Explicit non-functional requirements prevent the AI from overlooking these important constraints. -->

# 7 Tech & Integration

| Area         | Choice                   | Rationale                     | Version (if any)     |
| ------------ | ------------------------ | ----------------------------- | -------------------- |
| Frontend     | {{ e.g. React or N/A }}  | {{ Why this tech (or none) }} | {{ n/a or version }} |
| Backend      | {{ e.g. Flask/FastAPI }} | {{ Reason for this choice }}  | {{ version }}        |
| Database     | {{ e.g. PostgreSQL }}    | {{ Why and how it’s used }}   | {{ version }}        |
| Auth         | {{ e.g. OAuth / JWT }}   | {{ How users auth }}          | {{ version }}        |
| External API | {{ e.g. Twitter API }}   | {{ Integrations needed }}     | {{ version }}        |

<!-- List major tech components so the agent doesn’t hallucinate choices. Include rationale and versions to lock down the stack. -->

# 8 Constraints & Risks

* {{ Constraint example: “OpenAI API rate limit of 3 requests/minute” }}
* {{ Constraint example: “Mobile-first design required” }}
* {{ Risk example: “Potential data bias in ML model predictions” }}

<!-- State known constraints (business, technical, or legal) and project risks. This guides the AI to respect boundaries. -->

# 9 Out-of-Scope (Post v1)

* {{ Feature or aspect explicitly not to be addressed in this release }}
* {{ e.g. “No Android app in v1” or “Analytics dashboard excluded” }}

<!-- By listing out-of-scope items, the agent will avoid spending effort on them or prematurely optimizing for them. -->

# 10 Glossary

| Term               | Definition                               |
| ------------------ | ---------------------------------------- |
| {{ Domain Term }}  | {{ Brief explanation for clarity }}      |
| {{ Abbreviation }} | {{ What it stands for in this context }} |

<!--
✅ **From Idea to PRD:** If you started with only a rough idea, you can use an AI assistant to expand it into the above sections.
For example, describe the idea (“a habit-tracking mobile app for teams”) and ask Claude or ChatGPT to help draft each section of this PRD template.
Iterate with the AI to refine details (especially Functional Requirements and Acceptance Criteria).
The structured headings ensure the model stays on track and avoids inventing unspecified features. Fill in and review all sections before running /INIT.
-->