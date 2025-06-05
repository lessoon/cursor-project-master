# Troubleshooting Guide: When and How to Escalate to O3 (ChatGPT)

Even the best AI agents can get stuck. This guide helps you leverage a second-opinion AI (nicknamed "**O3**" here, e.g. OpenAI’s GPT-4 or ChatGPT) to resolve issues that Cursor’s agent cannot fix on its own.

## When to Use This Guide
- The Cursor agent has attempted a fix multiple times and keeps failing the same task or test.
- You see a task created called **`Need human review`** or **`DEBUG_ESCALATE_X`** in the backlog.
- The `docs/Progress.md` contains a **Problem Summary** entry describing an issue the agent couldn’t solve.

In these cases, it’s time to get an external perspective from another AI or developer.

## Step 1: Gather the Context
Locate the **Problem Summary** written by the agent (usually in `docs/Progress.md` under today’s date). It should include:
- A brief description of what the agent was trying to do (e.g. “Implement feature F05 – user login”).
- The error or issue that kept occurring (e.g. stack trace or test that failed).
- The approaches or fixes the agent already tried, if noted.

Copy this summary text. If there is no summary, you can manually compile the key info:
- What you expected to happen vs. what went wrong.
- The exact error message or failing test output.
- Any code snippets that seem relevant (function that might be bugged, etc.).

## Step 2: Choose an External Helper
You can use any advanced AI chat or even a human colleague. We refer to “O3” as a placeholder for something like **OpenAI GPT-4 (ChatGPT Plus)** or **Claude** – basically an AI that is good at problem-solving with context. Open your chosen tool (for example, go to chat.openai.com for ChatGPT).

## Step 3: Provide the Prompt
When asking for help, give enough context but keep it concise. Below is a template you can use – paste the Problem Summary into it and adjust as needed:

```markdown
**Context:** I have an AI coding agent (Cursor Project Master) building a project for me. It got stuck on a task.

**What the agent was trying to do:** {{describe the feature/task briefly}}

**The problem:** It encountered this error or issue repeatedly:
````

{{paste the error message or failing test output here}}

```

**What the agent attempted already:** {{list any fixes the agent tried, from the summary, or say "It tried multiple fixes but none worked."}}

**My question:** How can this issue be resolved? What might be the root cause and a correct solution?
```

> 💡 *Example:*
> **Context:** I’m using an AI to build a web app. It’s stuck on implementing a login feature.
> **What it was trying to do:** Create a user login with JWT auth.
> **The problem:** Tests keep failing with “TypeError: cannot read property 'token' of undefined”.
> **What it attempted:** It added a fix to initialize the token, but that didn’t resolve it – the error persists.
> **My question:** What likely causes this error and how to fix it?

This prompt clearly lays out the scenario. The external AI will now analyze and (hopefully) explain the issue or suggest a fix.

## Step 4: Analyze the Advice

The helper AI might point out a mistake (e.g., “the `token` property is undefined because the login function never returns the token”). It may provide a code snippet or steps to fix.

Read the explanation carefully:

* Does it address the error in question?
* Is the solution something that fits into your project’s context?
* If anything is unclear, you can ask a follow-up in that chat for clarification.

## Step 5: Apply the Solution Back in Cursor

With a clear solution in mind, return to Cursor:

* You can implement the changes manually in the code (if you’re comfortable with the suggestion).
* Or you can guide the agent: e.g., tell the agent in Cursor chat the insight: “It looks like the issue is X. Please adjust the Y module to fix this by doing Z.” The agent will then attempt that fix in a new task.

Make sure to update or remove the `Need human review` task:

* If you fixed it manually, mark that task as done (and perhaps add a note in `Progress.md` about how it was resolved).
* If the agent fixed it after your instruction, it will mark it done automatically.

Now let the agent continue with the remaining tasks.

## Step 6: Preventing Future Stalls

Moving forward, consider if this issue could have been caught earlier:

* Was there an ambiguity in the PRD that led to the bug? If yes, clarify it for future (the PRD can be updated even after the fact).
* Does this suggest a new test case? If so, add a test to ensure this scenario is covered, so the agent (or any developer) won’t break it in future changes.

Remember, needing external help is normal for tough problems. Each time, you and the AI are learning more about the project’s pitfalls. The goal is a robust final product.

---

**By following this escalation process**, you combine Cursor’s automation with the wisdom of ChatGPT/“O3” when needed – achieving the best of both. This ensures that even when the autonomous agent hits its limits, the project can still move forward with a little nudge from another intelligent assistant or a human developer.