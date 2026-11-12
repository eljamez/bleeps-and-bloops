---
description: Take a GitHub issue all the way to an open PR — spec, tasks, build/review/fix loop, ship
allowed-tools: Bash, Read, Write, Edit, Glob, Grep, Skill, Agent, Task
argument-hint: [issue-number]
---

Run the full spec-driven pipeline for GitHub issue #$1 in the current
repository, from issue to open pull request. Run each stage in order and keep
going unless a stop condition below is hit. This command only orchestrates the
`spec-driven-workflow` plugin's skills — if that plugin isn't installed, stop
and tell the user to install it first.

## Stages

1. **Check setup.** Confirm this is a git repo with a GitHub remote, `gh` is
   authenticated, and `CLAUDE.md` has a `## Spec-driven workflow` section. If
   anything is missing, stop and say exactly what (e.g. "run `gh auth login`",
   or "run `/bb:sdd-init` first").

2. **Fetch the issue.** `gh issue view $1 --json number,title,body,url,labels,state`.
   If `$1` is missing, not a number, or the issue doesn't exist, stop — never
   guess an issue number. If it's closed, ask whether to proceed.

3. **Confirm.** Print one line: `#<number> — <title>`.

4. **Spec.** Run `spec-driven-workflow:spec-driven-specify` for the issue,
   passing the fetched title/body/url and noting it's called from
   `/bb:kick-off` (so the spec is auto-approved and the skill returns instead
   of stopping).

5. **Plan (only if needed).** Run `spec-driven-workflow:spec-driven-plan` only
   if the approach is the risky part (new architecture, API/data design,
   multi-module change). Otherwise skip it and say so in one line.

6. **Tasks.** Run `spec-driven-workflow:spec-driven-tasks`, noting it's called
   from `/bb:kick-off`.

7. **Build → review → fix loop.** Run `spec-driven-workflow:spec-driven-loop`.
   It builds with the `spec-implementer` agent, reviews in parallel with
   `test-reviewer`, `ux-reviewer` and `backend-reviewer`, and loops the
   blocking/should-fix list back to the implementer until review is clean,
   the same finding repeats, or the round limit is hit. It ends with
   `specs/<id>/verify.md`.

8. **Ship.** Only if `verify.md` says "Ready to ship", run
   `spec-driven-workflow:spec-driven-ship` to push the branch, open the PR
   and comment on the issue.

## Stop and ask the user when

- A task touches the guardrail list (auth, billing, payments, data deletion,
  migrations, or anything `CLAUDE.md` flags). Ask for go-ahead, then resume the
  loop where it paused.
- The loop ends with "Needs work". Report what's stuck and don't open a PR.
  The user can fix it and re-run "loop issue $1", then "ship issue $1".
- Any setup check in stage 1 or 2 fails.

## Progress

Post one short line as each stage starts (`spec…`, `tasks: 7`, `round 1:
build`, `round 1: review — 2 blocking, 1 should-fix`, …). Finish with the PR
URL, rounds run, and any nits left open. Never merge the PR.
