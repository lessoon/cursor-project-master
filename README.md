# **Cursor Project Master**

**Sit back and watch AI build your project.** This boilerplate empowers indie hackers, non-coders, and Cursor enthusiasts to automate 99% of coding tasks. No heavy setup or external services needed – just your vision, and Cursor’s AI agent does the rest.

---

## **Why CPM (Cursor Project Master)?**

* **99% Agent-Driven:** Minimal human intervention – the AI agent autonomously handles planning, coding, and testing.

* **Zero Coding Required:** Focus on your ideas. The AI translates a well-structured PRD into working code and docs.

* **Self-Maintaining Docs:** Design diagrams, knowledge base, and progress logs update automatically as the project evolves.

* **Context-Aware Workflow:** Each session, the agent reloads the project context (PRD, tasks, progress) to stay on track despite context length limits.

* **Auto-Upgrades:** External dependencies are monitored; the agent creates upgrade tasks for breaking changes.

* **Future-Ready:** Optimized for next-gen models (Claude 4, Gemini 2.5, etc.) with large context windows – ready to push their limits in coding tasks.

---

## **Quick Start**

### **1\. Prepare Your Project**

**Clone this Repository:**

 git clone https://github.com/heyzgj/cursor-project-master.git my-project  
cd my-project

*   
* **Install Dependencies:** (if any specific environment or `requirements.txt` is provided by CPM, install them here).

### **2\. Define Your PRD**

* Open `docs/PRD.md` and fill in the Product Requirements Document. Follow the template structure (11 sections). **Replace all `{{ }}` placeholders** with your project’s details. The more specific, the better.

* *Tip:* If you only have a rough idea, use an AI assistant (Claude, ChatGPT) to help expand it. See the comments in the PRD template for guidance on the “From Idea to PRD” process.

### **3\. Launch the AI Builder**

* Open the project in Cursor IDE.

* Start the agent by typing the `/INIT` command in Cursor’s chat interface.

* **Sit back**: The agent will read your PRD, break it into tasks, and begin implementing the project.

What to expect after `/INIT`:

* The AI analyzes the PRD and generates initial documentation (`DESIGN.md`, `AgentFacts.md`) and a task backlog in `tasks/backlog/phase-0.md`.

* It commits an `init project` with these scaffold files.

* Then the agent starts picking tasks from the backlog to code, test, and iterate.

### **4\. Track Progress & Iterate**

Cursor’s agent works iteratively:

* Monitor `docs/Progress.md` for daily updates. The agent logs completed tasks, test results, and any blockers there.

* You can run `/STATUS` in Cursor at any time for a summary of remaining tasks, recent failures, and test coverage.

* If you have new ideas or requirements, add them to the PRD (or use `/ADD_REQUIREMENT` in chat for minor features). The agent will decompose and integrate them on the fly.

### **5\. Review & Adjust (if needed)**

* **Review Code & Commits:** The agent will commit code for each task. Feel free to browse the code it writes.

* **Provide Feedback:** If something doesn’t meet your expectations, you can:

  * Edit the PRD to clarify the requirement or acceptance criteria.

  * Or directly tell the agent in Cursor chat to adjust a specific part (the agent will attempt to comply in a new task).

---

## **How It Works (Under the Hood)**

**Cursor Project Master orchestrates the AI agent through a series of rules and structured prompts to ensure a coherent workflow:**

1. **Initialization Phase:** When you run `/INIT`, the agent resets its memory and **reads all context** from `docs/` and `tasks/`. It uses the rules in `.cursor/rules/project-init.mdc` to parse the PRD and generate a project plan. This includes:

   * Breaking the PRD into a backlog of tasks (stored under `tasks/backlog/phase-0.md`)【9†L52-L60】.

   * Creating design docs (like `DESIGN.md` with architecture diagrams, `AgentFacts.md` with tech stack info).

   * Setting up a `tasks_master.yaml` to track overall progress.

   * **Project Type Detection:** During init, the agent infers the project’s nature (front-end, back-end, etc.) from your PRD and adapts its approach (see `docs/ProjectTypeProfiles.md` for what it does differently).

2. **Automated Development Loop:** The continuous rules in `.cursor/rules/project-core.mdc` guide the agent through an iterative cycle:

   * The agent picks the next task from the backlog, plans the solution, writes code for it, and writes **tests first** as per the TDD approach.

   * It runs the relevant tests (and any new tests it generated) to verify the implementation. Cursor’s integrated test runner provides immediate feedback.

   * If tests pass, the agent commits the code for that task (you’ll see sequential commits like “Implement F02 feature X” etc.).

   * If tests fail, the agent enters a fix cycle: it diagnoses the failure, potentially writes a new test to expose the bug (especially if it missed a case), then fixes the code. This loop can run up to 3 attempts autonomously【21†L62-L70】.

   * On success, it proceeds to the next task. On repeated failure, it logs a summary and defers to human (see **Troubleshooting** below).

3. **Context Management:** Because language models have limited memory per session, CPM uses **persistent docs as memory**:

   * Every new Cursor session, the agent reads the PRD, design docs, and the tasks list. This ensures even if the AI’s internal memory is cleared, it **reloads the project state** from files. It’s how CPM achieves continuity over long projects without requiring a vector database or external memory.

   * The `docs/Progress.md` log and `tasks_master.yaml` are updated as the single source of truth for what’s done and what’s left, so the agent can always synchronize with reality.

4. **Cursor Integration:** Cursor’s platform provides the sandbox for this agent to operate. The `.cursor/rules` files are essentially system instructions that Cursor feeds to the AI before each response. CPM heavily leverages this:

   * The rules give the agent a “game plan” and constraints (for example, *always write tests first*, *don’t leave TODOs*, *stop if requirements are unclear*, etc.).

   * Cursor’s native commands like `/STATUS`, `/OVERVIEW`, etc., are extended by CPM. For instance, `/OVERVIEW` will visualize progress via the Mermaid diagrams the agent maintains in `docs/DESIGN.md`. And if tests fail during a commit, Cursor triggers our rules to auto-create a fix task and handle it.

   * This tight coupling means **CPM augments Cursor’s built-in AI capabilities** rather than replacing them – it’s a layer of project-specific intelligence on top of Cursor’s AI agent.

5. **Project Completion:** As tasks approach completion (all features marked done in `tasks_master.yaml`):

   * The agent will report 100% completion on `/STATUS`.

   * You should review the code, run full tests, and do any manual QA needed. The agent aims for the PRD’s acceptance criteria, but your confirmation is the final step.

   * If anything is missing or not up to par, update the PRD or add a new requirement and let the agent handle it, or fix it manually and mark the task done.

---

## **Usage Tips for Non-Developers**

CPM is designed so that *anyone* can turn ideas into code. Here are some tips if you’re not from a coding background:

* **Be Specific in the PRD:** The AI is only as good as the instructions you give. Clearly describe features and criteria (e.g. “User should be able to upload an image up to 5MB” is better than “support image uploads”).

* **Leverage the Templates:** Use the provided PRD template structure – it prevents omissions. Don’t worry if you’re unsure about sections like Tech Choices – you can fill what you know (even “Undecided, let AI suggest”) and the agent will make educated choices, which you can later refine.

* **Let the AI Work:** Once you hit `/INIT`, the agent will take time to generate code. It might create dozens of small commits. You can watch it, but avoid interrupting unless it’s obviously off-track or asks you a question.

* **Review Outputs:** You’ll find the final code in the repository. Also check `docs/` for things like the design diagram and `docs/Progress.md` for a narrative of what the AI did. These can be insightful to understand your new app.

If the agent seems stuck or produces an unexpected result, don’t panic – just head to the **Troubleshooting** section below.

---

## **Troubleshooting & FAQ**

**Q: The agent wrote code that doesn’t meet my expectations. What can I do?**  
 **A:** First, clarify the requirement. Open `docs/PRD.md` and refine the acceptance criteria or add details for that feature. For example, specify output formats, edge cases, or performance needs that were missing. Then run `/INIT` again to let the agent incorporate the changes (it will update or add tasks as needed). Alternately, you can directly tell the agent in Cursor chat to adjust a specific part (the agent will create a task to adjust the code). Clear feedback is key; the AI will correct course if it understands the gap between what it did and what you want.

**Q: The agent keeps rewriting the same code or cycling on the same task. How do I avoid this?**  
 **A:** This usually means the agent lost track of progress or is uncertain if it completed a task. Make sure that when you’re satisfied with a change, you mark the task as done (the agent does this automatically when tests pass). Avoid manually editing code without updating the PRD or tasks – the agent might “rediscover” the change and think it still needs to do it. If a loop happens:

* Check `tasks/tasks_master.yaml` and the relevant `tasks/backlog/phase-X.md` to see if a task wasn’t marked done or got recreated.

* Use `/STATUS` to see if something is blocked.

* If the agent is truly stuck on a bug and redoing changes, it might trigger the fail-safe (see next question).

**Q: The agent has failed multiple times on the same issue and created a “Need human review” task. What now?**  
 **A:** This means the AI recognizes it’s not making progress on a particular problem. Don’t worry – this is an expected hand-off point. Here's what to do:

1. Open `docs/Progress.md` and find the **Problem Summary** the agent wrote about the issue. It should contain the error it kept encountering and notes on what it tried.

2. Open `docs/TroubleshootingWithO3.md`. Follow the instructions there to use an external AI (like ChatGPT or another expert) to diagnose the problem. Essentially, you’ll copy the summary and ask “How can this be fixed?” in an outside chat.

3. Take the insights from the external AI – they might explain the bug or suggest a solution. Now you can either implement that fix yourself (if you’re comfortable editing the code directly) or feed the suggestion back to our agent (e.g., “It looks like the issue is X. Please try doing Y instead.”).

4. Remove or mark as done the `Need human review` task once the issue is resolved, then let the agent continue with `/CONTINUE` or next tasks.

**Q: How can I prevent the agent from making certain changes or using certain tech?**  
 **A:** Make sure to specify constraints in the PRD. For example, if you don’t want any external API calls or you must use a specific library, mention that under **Constraints** or **Tech Choices**. The agent respects the PRD as law. If you see it doing something undesired (like choosing a different framework), stop it and clarify the PRD, then re-run. You can also edit `.cursor/rules/common.mdc` or others to add project-specific “do’s and don’ts”.

**Q: The agent’s output looks correct. How do I run or deploy it now?**  
 **A:** Great\! Since CPM projects are standard codebases, you can treat them like any project. Check the `README.md` in the generated code (the agent might have added usage instructions there if you had a deployment requirement in the PRD). If it’s a web app, run the development server command the agent set up (for example, `flask run` or `npm start`, depending on tech stack). If it’s a library/CLI, follow the usage notes. Essentially, the AI writes the code – running it is typically the same as if a human wrote it. If any environment variables or configs are needed, the agent should have documented them in `docs/AgentFacts.md` or comments.

**Q: How do I add new features after initial development?**  
 **A:** You can iteratively use CPM for continuous development:

* Update `docs/PRD.md` by adding new items to the Functional Requirements table (section 4\) or adjusting other sections.

* In Cursor, run the `/ADD_REQUIREMENT` command or simply start a new session (the agent will see the PRD changes on init and decompose new tasks).

* The agent will generate new tasks for your added requirements and start implementing them, just like the first time.

* This incremental approach ensures the project grows while always adhering to an updated single source of truth (the PRD).
