# 0001: Shared factory config

- **Status:** accepted
- **Date:** 2026-11-12

## Context

The factory uses one Claude Code setup, not a setup per project. That shared setup carries the slash command, review rules, and merge policy. Projects still need their own overrides, in a second smaller file.

## Decision

One shared Claude Code setup / `orca.yaml` for the whole factory, with small per-project override files.

## Consequences

- The slash command, review rules, and merge policy live in the shared `orca.yaml`.
- Project-specific overrides stay in the smaller per-project file.
