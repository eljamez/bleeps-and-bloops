---
name: chip-patrol
description: Run the daily scout patrol. File bleeps:found issues and start the pipeline up to the cap.
---

# Patrol

Run `scripts/providers show chip`, then `scripts/bleeps-scout`. Use `--dry-run` when you only want the findings.

Do not scan a second way beside the script. Do not raise the cap to clear a queue. Guardrail findings still wait for James. A dry run that lists another ticket source prints `would post finding to <source>` and does not call that API.

The schedule lives on the machine `host` names. A skipped run is not a backlog. The next run scans the repo as it is then. When `runtime` is `bots`, the schedule is an automation on the Chip bot and the script hands each started issue to Bleeps instead of an `issueCommand` worktree.

A feature is a `bleeps:found` issue and nothing more. Chip does not build a feature. Do not hand that issue to Bleeps and do not add `bleeps:go`. A person has to file the ticket or label it before anyone builds it. `scripts/classify-pr` is the check when the change has paths: `feature` means file the issue and stop.
