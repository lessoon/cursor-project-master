 AI-Native Development Workflow with Cursor Agent <!-- omit in toc -->

This repository implements a comprehensive, AI-driven development workflow using Cursor’s AI agent. It is designed to facilitate **front-end, back-end, full-stack, or AI application development** by leveraging an AI assistant for planning, coding, and documentation. The system is inspired by state-of-the-art practices from Anthropic’s Claude Code, OpenAI’s product documentation standards, and research from Stanford and others on AI pair programming.

**Table of Contents**  <!-- omit in toc -->
- [Overview](#overview)
- [Project Structure](#project-structure)
- [Workflow Summary](#workflow-summary)
- [Using the AI Agent (Cursor) Effectively](#using-the-ai-agent-cursor-effectively)
- [Adaptable Project Types](#adaptable-project-types)
- [Best Practices and Guidelines](#best-practices-and-guidelines)
- [Acknowledgements](#acknowledgements)

## Overview

This project’s development process is managed through a set of **Markdown documents** and **Cursor rules** that keep the AI agent aligned with our goals. The main idea is to treat the AI as a team member that can understand project requirements, break down tasks, write code, and even update documentation as things change. We have structured the repository to support this:

- **Documentation**: Key planning docs like `PRD.md` (Product Requirements), `TECH_SPEC.md` (Technical Specs), `UX_FLOW.md`, `TEST_PLAN.md`, `DATA_MAP.md`, and `ARCHITECTURE_GUIDE.md` are included. These guide the AI and humans alike in understanding what to build.
- **Cursor Rules**: Under `.cursor/rules/`, we have custom rules that instruct the Cursor AI agent on our workflow (e.g., always do task breakdown on init, follow TDD, update docs on changes, etc.).
- **Codebase**: (This section would describe where the code lives, once generated).

By combining structured documentation and AI agent rules, we ensure development is **well-planned, iterative, and responsive** to changes. The AI agent will always have context on *what* it’s building and *how*, which dramatically improves the quality and relevance of its code generation.

## Project Structure

```

├── .cursor/
│   └── rules/
│       ├── 000-init-breakdown.mdc       # Rule for initial task planning from PRD
│       ├── 010-complexity-split.mdc     # Rule for splitting complex tasks
│       ├── 300-tdd-loop.mdc             # Rule enforcing TDD workflow
│       ├── 310-failure-recovery.mdc     # Rule for summarizing failures
│       ├── 400-techspec-binding.mdc     # Rule to align code with Tech Spec
│       └── 410-change-management.mdc    # Rule for handling requirement changes
├── docs/
│   ├── PRD.md                  # Product Requirements Document
│   ├── TECH\_SPEC.md            # Technical Specification
│   ├── UX\_FLOW\.md              # User Experience Flows
│   ├── TEST\_PLAN.md            # Test Plan
│   ├── DATA\_MAP.md             # Data models and schema
│   └── ARCHITECTURE\_GUIDE.md   # High-level architecture and guidelines
└── src/ (or frontend/, backend/ etc.)   # Source code directories (to be generated)

```

*The above structure is illustrative.* We keep all documentation in a `docs/` folder (or root) for easy access. The `.cursor/rules` directory contains our custom rules that extend Cursor’s behavior.

Each rule file is written in Markdown (MDC format) with a header and instructions. For example, `000-init-breakdown.mdc` ensures the agent will read the PRD and make a task list before coding, and `300-tdd-loop.mdc` makes it follow a test-driven approach. (See the `.cursor/rules/` files for details.)

## Workflow Summary

Our development workflow consists of two main phases:

**Phase 1: Design & Documentation (with AI assistance)**  
We begin with an idea and interact with an AI (like Claude or GPT-4) to produce all planning documents. This involves:
- Drafting the **PRD** to define the product in natural language (problem, users, features, etc.).
- Drafting the **Technical Spec** to outline how we’ll build it (architecture, data models, technical decisions).
- Laying out **UX Flows** for key user interactions.
- Defining a **Test Plan** with scenarios for each feature (this doubles as a spec for the AI to know the definition of “done” for each requirement).
- Documenting the **Data Map** (schema) and an **Architecture Guide** for broader context.

This phase is interactive: the AI asks for clarification and produces drafts, the human refines them. The outcome is a complete set of docs that serve as a contract for what will be developed.

**Phase 2: Implementation & Iteration (with Cursor Agent)**  
With the docs in place, we switch to Cursor’s agent to generate code and manage the project tasks:
- The Cursor Agent automatically reads the rules and the docs. On **INIT**, it breaks the project into tasks based on the PRD/Spec, and presents a plan.
- It then proceeds to implement tasks one by one. For each task, it typically writes a test first (following our TDD rule), runs it (via Cursor’s tools), then writes the minimal code to pass the test. This loop repeats until the task’s tests pass, then it commits the code.
- The agent uses the Tech Spec and Data Map as references while coding, ensuring that, e.g., data models and API endpoints match the design. It won’t introduce out-of-spec tech without discussion (our rules instruct it to consult/update the spec if needed).
- If the agent encounters difficulties (e.g., test failing multiple times), it will pause and provide a **summary of the issue and attempts**, possibly asking the user for guidance (thus avoiding infinite loops).
- The human user can monitor progress via the Cursor UI: reviewing code diffs, approving changes, or giving feedback in natural language. The agent is responsive to instructions thanks to the rules and will update docs or adjust the plan on the fly if needed.

**Adaptive Changes:** If at any point the user says “Actually, let’s change something” (new feature, requirement tweak, etc.), the agent will:
  - Update the PRD/Tech Spec accordingly (so the single source of truth stays current).
  - Re-plan tasks or add new tasks for the change.
  - Communicate the updates to the user (the agent might show a diff or list what changed).
  - Then implement the new requirements. This ensures continuous alignment even as the project evolves.

**End of Cycle:** Once all planned tasks are done and tests pass, we have a working product. The documentation is up-to-date, and we have a suite of tests thanks to the TDD process.

At this point, the human team can do final reviews, user acceptance testing, etc. The docs (PRD, Tech Spec, etc.) serve as both development history and onboarding material for future maintainers.

## Using the AI Agent (Cursor) Effectively

To get the most out of the Cursor AI agent with this setup:

- **Provide All Docs as Context:** In Cursor, open the key docs (or mark them as always relevant). The agent will read them when following rules. For example, keep PRD.md and TECH_SPEC.md in the context window so it can reference them when coding or planning.
- **Leverage Slash Commands (if available):** We included rules that can be invoked via slash commands (for example, we could have a `/plan` command that triggers task breakdown). Cursor supports custom commands via markdown files, so you can integrate some of these steps as one-click actions.
- **Monitor Agent’s Plan:** When the agent presents its initial task list or any plan, review it. Ensure it didn’t miss anything from the PRD. Since our rule splits tasks by complexity, the list might be hierarchical; feel free to ask the agent to clarify any task.
- **Interactive Corrections:** If the agent’s output seems off (maybe a misunderstanding in a spec), you can interject: e.g., “That’s not quite right, refer to PRD section X which says Y.” The agent, under our rules, will incorporate that feedback, possibly even updating a rule if a new guideline emerges (the rules can be updated via conversation and saved with `/Generate Cursor Rules`if needed).
- **Testing with Agent:** You can instruct the agent to run tests after each major change (though our rules often have it doing that automatically). The agent can run a dev server, run tests, etc., via Cursor’s tool interface. We included an example rule for workflow automation (like running and fetching logs) in the rules reference.
- **Use Tags in Conversation:** We set the precedent of the agent using tags like `[Summary]` or `[Design Update]` in its messages to highlight certain actions. You as the user can also use similar language: e.g., “Summarize the changes” or “Provide a design update for X.” The agent is primed to respond in that structured way.
- **Human Overrides:** The agent is not infallible. Sometimes you might notice a simpler solution than what it’s attempting. Don’t hesitate to pause the agent and suggest your idea. Because the agent is following the rules, it will respect your instruction and perhaps even create a new rule or note (“Always prefer built-in library if available” etc.) for future. Our framework is meant to be a co-pilot, not fully autonomous without oversight – your guidance makes the end result better.

## Adaptable Project Types

While this system was illustrated with a web app example, it is adaptable to various project types:
- **Front-end focused projects:** The PRD/UX Flow can emphasize UI/UX requirements. The agent (with rules) can generate React/Vue code following the flows, and use the Test Plan for UI tests.
- **Back-end or API projects:** The Tech Spec and Data Map shine here. The agent can create database schemas, API endpoints, and thoroughly test logic as per Test Plan.
- **Full-stack projects:** Our example was full-stack. The approach ensures both ends are developed in tandem, with the AI keeping track of consistency (e.g., data models are used correctly on front and back).
- **AI/ML projects:** You can include additional docs like a *Model Card* or *Data Pipeline* spec. The agent rules might be extended to handle training/evaluation loops. (E.g., one could add a rule for an ML experiment: if accuracy is low, adjust parameters and retry – similar to TDD but for model metrics).
- **Complex multi-module systems:** The principle of splitting into docs and tasks scales up. You might break the Tech Spec into multiple module specs. You can also have more fine-grained rules or use sub-directories for module-specific rules (Cursor supports nested `.cursor/rules` for specific folders.

Regardless of project type, the key is that **clear documentation + tailored rules = an AI that understands the project context**. This drastically reduces hallucinations and off-track suggestions, a phenomenon noted in agentic coding where having a well-structured context leads to better outcomes.

## Best Practices and Guidelines

Some guiding principles for using this AI-native workflow:

- **Keep Documentation Current:** The value of this system is only as good as the docs. Our rules make the agent update docs on changes, but ensure during code reviews that the docs reflect reality. Treat docs as code – version them, review changes, and require updates with code changes.
- **Small Iterations:** Encourage the agent to work in small chunks (it tends to, under TDD and planning rules). This way, errors are caught early and context remains manageable. It’s easier to correct course on a small diff than a huge one.
- **Use Version Control:** Even though the agent writes code, use Git as usual. Commit messages can be AI-generated or human. Cursor can auto-generate commit messages. Always review diffs; it’s both an opportunity to catch issues and to improve the agent’s instructions next time.
- **Security & Ethics:** If your project involves sensitive data or actions (like our example sending emails, or any AI usage), review those parts carefully. The AI will try to follow specs (which should include security requirements), but it’s on us to enforce things like not logging passwords, respecting rate limits, etc. When in doubt, add a rule or test for it.
- **Customize to Your Team:** The provided templates and rules are a starting point. Feel free to modify section headings, add more rules, or change the workflow. For instance, if you prefer Behavior-Driven Development (BDD) style, you could adjust the Test Plan format or add a rule for writing Gherkin scenarios. The system is meant to be flexible.
- **Monitor AI Model Updates:** As newer models (e.g., OpenAI’s Gemini if available) come out, they might have different strengths. Some may generate docs more coherently, others might write code more reliably. Adjust the prompting and level of detail accordingly. For example, a very advanced model might infer some documentation pieces with less prompting – but it’s still good to be explicit to avoid errors.

## Acknowledgements

This workflow incorporates ideas and learnings from various sources:
- **Anthropic Claude Team** – for publishing their *Claude Code Best Practices* which inspired our TDD and planning rules.
- **OpenAI Product Management** – particularly the AI PRD template by Miqdad Jaffer, which influenced our PRD structure and the concept of continuous updates to requirements.
- **Cursor & Windsurf IDEs** – the creators of these AI-driven IDEs whose features (like rules and Cascade) informed how we constrain and guide the agent.
- **Cline AI (open-source)** – for demonstrating an autonomous coding agent with plan/act phases, validating that such workflows can boost developer productivity significantly (reports of 2x faster coding).
- **Stanford HCI Research** – particularly studies on human-AI programming collaboration that stress the importance of keeping the human in the loop and having shared representations (our docs) for communication.
- **Community Contributors** – numerous devs on forums and Reddit who experimented with Cursor rules and shared insights (like using markdown for structured rules and the importance of splitting rules by domain).

By integrating these best practices, we aim to create a development experience where **AI and human developers work hand-in-hand**: the AI handling repetitive and structured work, and the humans providing creativity, critical thinking, and final oversight. We hope this template repository and workflow serve as a useful example of AI-native software development in 2025.