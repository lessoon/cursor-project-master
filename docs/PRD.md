## `docs/PRD.md` — Strict Template (11 fixed H1 headings)

<!--
agentdoc-starter – PRD template v1.1  
MUST keep exactly 11 #-level headings (0-10).  
Replace every {{…}} placeholder.  
-->

# 0 One-Sentence Mission
{{ ≤ 20 English words describing the product }}

# 1 Problem Statement
- **Pain :** {{ one short sentence }}  
- **Impact :** {{ one short sentence }}  
- **Gap :** {{ one short sentence }}  
<!-- 3-part problem pattern reduces solution bias ﻿:contentReference[oaicite:1]{index=1} -->

# 2 Personas & Context
| Persona       | Goal                 | Frustration      |
| ------------- | -------------------- | ---------------- |
| {{ Founder }} | {{ Grow brand on X }} | {{ Manual posting }} |

# 3 End-to-End Flow

flowchart LR
  A[OAuth] --> B[Upload Brief] --> C[Voice Gen] --> D[Approve] --> E[Auto-Mode]

<!-- Formal Mermaid syntax is AI-parsable ﻿:contentReference[oaicite:2]{index=2} -->

# 4 Functional Requirements

| ID  | Title           | Acceptance Criteria                    | Depends | ComplexityGuess |
| --- | --------------- | -------------------------------------- | ------- | --------------- |
| F01 | Tweet Generator | Returns ≥ 3 variants given brand brief | –       | 3               |
| F02 | Queue Scheduler | Schedules tweets via CLI               | F01     | 2               |

# 5 Visual Style Guide

## 5.1 Typography

* Heading : Inter Semibold 24 px

## 5.2 Color Palette

| Token         | Hex     | Use |
| ------------- | ------- | --- |
| brand-primary | #FF385C | CTA |

## 5.3 Icon & Motion

* Icons 1.5 px stroke; motion ≤ 200 ms

# 6 Non-Functional Reqs

* P95 Latency < 500 ms
* GDPR compliant

# 7 Tech & Integration

| Area      | Choice    | Rationale        | Version |
| --------- | --------- | ---------------- | ------- |
| Vector DB | pgvector  | cosine search    | 0.7     |
| Auth      | Clerk SDK | session token v2 | ≥ 4.10  |

# 8 Constraints & Risks

* OpenAI 3 RPM limit
* X API v2 rate caps

# 9 Out-of-Scope (v1)

* Instagram posting

# 10 Glossary

| Term      | Definition                |
| --------- | ------------------------- |
| Auto-Mode | Hands-off scheduling loop |
