# 0008: Bleeps is proactive

- **Status:** accepted
- **Date:** 2026-11-13

## Context

Bleeps waited for a person to file a GitHub issue. The friction log also described a separate daily sweep. Failures, debt, and papercuts sat until someone noticed.

## Decision

Bleeps goes looking. A scout runs on a schedule, files a GitHub issue labelled `bleeps:found` for each new finding, and starts the normal pipeline for it: spec, tasks, build, verify, pull request to `develop`, layered review, auto-merge when the gates pass.

Orca does not store that schedule in `orca.yaml`. The parser has no schedule key. The schedule is an Orca automation, created with `orca automations create`. `scripts/bleeps-scout schedule` prints the command. `scripts/bleeps-scout precheck` is the automation precheck: exit 0 when proactive mode is on, exit 1 when it is off.

The scout looks for failing tests, a test that fails once and passes on the immediate retry, CI failures, typecheck failures, npm audit advisories, TODO/FIXME debt as one issue, open `friction` issues, coverage gaps, and error-tracking output when `error_tracking` is set. Friction issues are not filed again. They join the same queue. That replaces the separate daily friction sweep.

`orca.project.yaml` turns this on or off (`proactive`, default `on`), lists scans, sets `scout_schedule` (default `daily`) and `scout_time` (default `09:00`), and sets `scout_cap` (default 2, allowed 0–20). The cap counts open issues labelled `bleeps:started`. Findings whose body key is already on an open `bleeps:found` issue are not filed again.

Guardrail areas still wait for James and do not auto-merge. The same rule applies to issues the scout filed.

## Consequences

- The home server registers the automation once, from the primary Orca workspace (`--workspace active`). The provider is `scout_provider`. It is unset until James picks the agent.
- **Revisit if:** the scout files more noise than it fixes, or Orca automations cannot run on the home server.
