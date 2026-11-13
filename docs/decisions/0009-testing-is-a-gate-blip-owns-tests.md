# 0009: Testing is a gate; Blip owns tests

- **Status:** accepted
- **Date:** 2026-11-13

## Context

The pipeline told an agent to run tests, and a missing test command exited 0. Nothing owned the suite. Unit, integration, and end-to-end were whoever remembered them.

## Decision

Tests passing is a hard gate for auto-merge. A missing test command is a failure, not a skip. `scripts/orca-verify` and `bleeps test` exit non-zero in that case.

Blip owns the suites. Blip is the testing agent, named for the little blip before the bloop in the mark. The role is [agents/blip/ROLE.md](../../agents/blip/ROLE.md). The skills are `onboard`, `pipeline`, and `coverage` beside that file.

Orca's `orca.yaml` has no agent-role key. Adding one would be dropped by the parser. There is also no per-project default agent yet ([stablyai/orca#22932](https://github.com/stablyai/orca/issues/22932)). `issueCommand` names Blip, and the parent agent delegates test work to a fresh session that has read the role. Orca installs repo skills from `skills/<name>/SKILL.md`. Blip's skills stay in its own directory, and the prompt points at them, so they are not a second install path.

On onboarding, Blip detects the stack and scaffolds what is missing. Defaults are Vitest or Jest for unit, the project's API layer for integration, and Playwright for end-to-end on web apps. During a ticket, `tasks.md` includes the tests, Blip writes them for the change, and `verify.md` records unit, integration, and end-to-end as green. End-to-end is not applicable only when the project is not a web app. In proactive mode, Blip's coverage skill takes the scout's gap and flake findings and fixes them through the same pipeline.

Guardrail areas still wait for James. Green tests do not override that.

## Consequences

- The verify reviewer stays read-only and does not share Blip's session.
- This repo's current suite is `python3 scripts/check-orca`. The site does not yet have Playwright.
- **Revisit if:** Orca grows a real per-project agent key, or a project cannot express its suite as the test commands in `orca.project.yaml`.
