# spec-driven-workflow

Point Claude at a GitHub issue and it runs the full spec-driven pipeline
inside your repo — spec, design, tasks, a bounded self-correcting
implementation loop, an independent verify pass, and a PR that's ready for
human review. GitHub-only in this version (v0.1.0); Linear and Discord
ticket ingestion are future work.

Companion reference: the "Agentic Spec-Driven Workflow" notes in the Life
OS vault (`3-Resources/Agentic Spec-Driven Workflow/`) — this plugin is the
executable version of that pipeline.

## Components

| Component | What it does |
|---|---|
| `spec-driven-setup` | One-time per-repo setup: confirms `gh` auth, creates `specs/`, writes the `## Spec-driven workflow` section of `CLAUDE.md` (target branch, branch naming, test/lint/typecheck commands, max attempts, guardrails). |
| `spec-driven-specify` | GitHub issue → `specs/<id>/spec.md` (problem, goals, non-goals, user stories, requirements + acceptance criteria). |
| `spec-driven-plan` | `spec.md` → `specs/<id>/design.md` (technical approach). Optional — skip for small changes. |
| `spec-driven-tasks` | `spec.md`/`design.md` → `specs/<id>/tasks.md`, an atomic, ordered, requirement-tagged checklist. |
| `spec-driven-implement` | Runs the bounded task loop: implement → test → self-correct (up to N attempts) → commit, task by task. Pauses for human approval on anything touching auth/billing/data-deletion/migrations. |
| `spec-driven-verify` | Independent review pass via the `spec-reviewer` agent — full test suite, acceptance criteria check, code-review checklist. Never continues the implementer's own context. |
| `spec-driven-ship` | Pushes the branch, opens the PR (built from spec + verify results), comments back on the source issue. **Never merges.** |
| `spec-reviewer` (agent) | Read-only reviewer used by `spec-driven-verify`. No `Write`/`Edit` access — it reports, it doesn't fix. |

## Setup

Requires the GitHub CLI (`gh`), authenticated (`gh auth login`), in every
repo this is used in. No environment variables or MCP servers required —
v1 talks to GitHub entirely through `gh`.

## Usage

In the target repo (e.g. rarecard.chat):

1. Run `spec-driven-setup` once. Answer a few quick questions (target
   branch, test/lint/typecheck commands) if they can't be inferred.
2. Point at a real issue: "specify issue #42" → `spec-driven-specify` runs.
3. Review `specs/42-.../spec.md`, flip `status: draft` to `approved`.
4. "Plan issue #42" (optional, skip for small changes) →
   `spec-driven-plan`.
5. "Break issue #42 into tasks" → `spec-driven-tasks`.
6. "Implement issue #42" → `spec-driven-implement` runs the loop.
7. "Verify issue #42" → `spec-driven-verify` runs the independent check.
8. "Ship issue #42" → `spec-driven-ship` opens the PR. You merge it.

Each stage can also be asked for directly by name — the pipeline doesn't
have to run start-to-finish in one sitting; it's meant to be interruptible
and reviewable between stages, especially the approval gate after step 3.

## Validating the install on a new repo

After running `spec-driven-setup` on a repo for the first time, run one
real, trivial issue through steps 2–8 above as a smoke test before trusting
it on anything bigger. Confirm: the spec looks reasonable, the branch and
commits follow the repo's conventions, tests actually ran (not just
appeared to), `verify.md` reflects genuine checks, and the PR opens against
the correct target branch with the right issue linked.

## Customization

Nothing in this plugin needs `~~` placeholders — GitHub is hardcoded as the
ticket source and PR target for v1. Extending it to Linear or Discord means
adding an ingestion step ahead of `spec-driven-specify` that still produces
a `specs/<id>/ticket.md` in the same shape; the rest of the pipeline
doesn't need to change.
