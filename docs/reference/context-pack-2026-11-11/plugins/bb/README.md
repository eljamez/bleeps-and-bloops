# bb (Bleeps and Bloops)

Slash-command shortcuts for solo spec-driven development (SDD). This plugin doesn't reimplement the SDD workflow — it wraps the `spec-driven-workflow` plugin with quick entry points keyed off GitHub issue numbers.

## Requirements

- `spec-driven-workflow` plugin installed (provides `spec-driven-specify`, `spec-driven-plan`, `spec-driven-tasks`, `spec-driven-loop`, `spec-driven-implement`, `spec-driven-verify`, `spec-driven-ship`)
- `gh` CLI installed and authenticated (`gh auth login`)
- Run commands from inside a git repo with a GitHub remote

## Commands

- `/bb:sdd-init` — bootstrap the current repo for spec-driven development (runs `spec-driven-setup`). Run this once per project.
- `/bb:kick-off <issue-number>` — take a GitHub issue all the way to an open PR: spec → (plan if needed) → tasks → build/review/fix loop → ship. Pauses only for guardrail items (auth, billing, payments, data deletion, migrations) or if the loop gets stuck. Never merges.

## Typical flow

```
/bb:sdd-init           # once per repo
/bb:kick-off 42        # issue #42 → spec → tasks → loop → PR
```

Inside the loop, `spec-implementer` builds, then `test-reviewer`,
`ux-reviewer` and `backend-reviewer` review in parallel. Blocking and
should-fix findings go back to the implementer until review is clean (default
max 3 rounds). If it gets stuck, no PR is opened — fix it, then say
"loop issue 42" and "ship issue 42".

Every stage can still be run by hand ("specify issue 42", "loop issue 42",
"ship issue 42", …).

## Extending

This is meant to grow into a fuller suite of `/bb:*` shortcuts as the solo SDD workflow solidifies. Add new commands under `commands/` following the same pattern: thin wrapper that gathers context (via `gh`, `git`, etc.) and hands off to the relevant `spec-driven-workflow` skill.
