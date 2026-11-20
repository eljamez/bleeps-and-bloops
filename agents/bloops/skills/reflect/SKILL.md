---
name: bloops-reflect
description: Gather how a run went and propose improvements. Do not edit skills in place.
---

# Reflect

Run `scripts/providers show bloops` for the reflection model, then `scripts/bloops-reflect`. Read the counts: cycle time, review rounds, test failures, friction entries, reverts, and Chip's findings.

When a step was done by hand twice, propose a script. File the proposal as an issue or a pull request through Beep. Do not rewrite `agents/`, `scripts/`, or `AGENTS.md` in this session.

`scripts/bloops-reflect` also runs `scripts/check-site`. A failure means the public site drifted from the system. Do not close the reflection while it fails. File the site fix, or include it in a pull request. Follow [update](../update/SKILL.md). This script does not edit the site.
