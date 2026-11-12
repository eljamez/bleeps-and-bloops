---
name: spec-driven-setup
description: >
  This skill should be used when the user asks to "set up spec-driven workflow",
  "add spec-driven development to this repo", "install the spec pipeline here",
  "bootstrap this project for spec-driven development", or wants to run the
  spec-driven-workflow plugin's setup for the first time in a repository.
metadata:
  version: "0.1.0"
---

Bootstrap a repository for the spec-driven pipeline (specify → plan → tasks →
implement → verify → ship). This is a one-time, per-repo setup step. Run it
once, at the root of the target repository.

## Steps

1. Check whether `specs/` and a `CLAUDE.md` already exist. If `CLAUDE.md`
   already has a `## Spec-driven workflow` section, tell the user it's
   already configured and ask if they want to reconfigure it rather than
   silently overwriting.

2. Gather what's needed to configure this repo. Infer what you can before
   asking:
   - Target branch for PRs (check `gh repo view --json defaultBranchRef` as
     a starting guess, but confirm — many repos ship to `staging` before
     `main`).
   - Branch naming convention. Default: `spec/<ticket-id>-<short-desc>`.
   - Test command, lint command, typecheck command (read `package.json`
     scripts, a `Makefile`, or equivalent to infer these before asking).
   - Ticket source. v1 of this plugin only supports GitHub Issues — confirm
     `gh` is the ticket source, or note that Linear/Discord ingestion isn't
     wired up yet.
   - Max self-correction attempts per task before a task is marked blocked.
     Default: 5.

3. Confirm `gh` is authenticated: run `gh auth status`. If it's not, tell
   the user to run `gh auth login` before using any other skill in this
   plugin — nothing else works without it.

4. Create `specs/` at the repo root if it doesn't exist, with a short
   `specs/README.md` explaining the layout: one subfolder per ticket,
   `<issue-number>-<slug>/`, containing `ticket.md`, `spec.md`, optionally
   `design.md`, `tasks.md`, and `verify.md`.

5. Create or append to `CLAUDE.md` a `## Spec-driven workflow` section
   using this shape, filled in with what was gathered/confirmed above:

   ```markdown
   ## Spec-driven workflow

   New work follows specs/<ticket-id>-<slug>/: ticket.md -> spec.md ->
   design.md (if needed) -> tasks.md -> implementation -> PR, via the
   spec-driven-workflow plugin's skills.

   - Ticket source: GitHub Issues (gh CLI)
   - Target branch for PRs: <branch>
   - Branch naming: spec/<ticket-id>-<short-desc>
   - Test command: <command>
   - Lint command: <command>
   - Typecheck command: <command>
   - Max self-correction attempts per task: 5
   - Guardrails — always pause for explicit human go-ahead before
     implementing anything touching: auth, billing, payments, data
     deletion, or database migrations.
   - PRs are never auto-merged by this pipeline. Human review and merge is
     always required.
   ```

6. Report back a short summary of what was configured and what the next
   step is (`spec-driven-specify` on a real issue).

Do not proceed to write a spec or touch application code in this skill —
its only job is repo configuration.
