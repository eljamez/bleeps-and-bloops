---
name: spec-driven-implement
description: >
  This skill should be used when the user asks to "implement issue #12",
  "run the task loop", "build this spec", "start coding this ticket", or a
  tasks.md already exists and it's time to actually write the code.
metadata:
  version: "0.1.0"
---

Run the bounded, self-correcting implementation loop over
`specs/<id>/tasks.md`. This is the core agentic loop of the pipeline — read
it carefully and don't shortcut the guardrails, even under time pressure.

## Before starting

Read the `## Spec-driven workflow` section of `CLAUDE.md` for this repo's
branch naming, test/lint/typecheck commands, target branch, max
self-correction attempts (default 5 if unset), and guardrail list. If that
section doesn't exist, tell the user to run `spec-driven-setup` first.

## Steps

1. Create or check out the feature branch, once, per `CLAUDE.md`'s naming
   convention (default `spec/<ticket-id>-<short-desc>`).

2. For each unchecked task in `specs/<id>/tasks.md`, in order:

   a. **Guardrail check first.** If the task touches anything on the
      guardrail list (auth, billing, payments, data deletion, migrations,
      or anything else `CLAUDE.md` flags), stop and ask the human for
      explicit go-ahead before implementing *that task* — even if earlier
      tasks ran unattended. Resume the loop once approved.

   b. Implement the task.

   c. Run the test/lint/typecheck commands, scoped to the change where
      possible.

   d. On failure: read the actual error, fix it, re-run. Repeat up to the
      max-attempts limit from `CLAUDE.md` (default 5).

   e. If it's still failing after the limit: mark the task
      `- [ ] <description> (Req #n) — BLOCKED: <one-line reason>` in
      `tasks.md`, leave it unchecked, and move on to the next task that
      doesn't depend on it. If every remaining task depends on the blocked
      one, stop the loop and report.

   f. On success: check the task off (`- [x]`), commit with a message
      formatted `<ticket-id>: <task summary>`.

3. When every task is checked off or the only ones remaining are blocked,
   stop. Report: tasks completed, tasks blocked (with reasons), and that
   it's ready for `spec-driven-verify`.

## Non-negotiable

Never skip the guardrail check in step 2a to save time, regardless of how
confident the implementation seems or whether the user asked for a fully
autonomous run. This is the one place a human always gets a say before code
touches something sensitive.
