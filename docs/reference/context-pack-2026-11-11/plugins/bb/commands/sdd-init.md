---
description: Bootstrap this project for spec-driven development
allowed-tools: Skill, Bash(git:*)
---

Set up the current project for the spec-driven development (SDD) flow.

1. Confirm the current directory is a git repository. If not, stop and tell the user to run this inside a project repo (or `git init` first).
2. Invoke the `spec-driven-workflow:spec-driven-setup` skill to install the spec-driven pipeline into this repository (spec/plan/tasks/implement/verify/ship structure and conventions).
3. If the `spec-driven-workflow` plugin isn't installed, stop and tell the user to install it first — this command only triggers its setup skill, it doesn't reimplement it.
4. Once setup completes, tell the user the project is ready and remind them they can now run `/bb:kick-off <issue-number>` to take a GitHub issue all the way to a PR.
