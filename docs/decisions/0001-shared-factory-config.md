# 0001: Shared Bleeps config

- **Status:** accepted
- **Narrowed by:** [0007](0007-bleeps-is-built-for-orca.md) — the shared setup is Orca's `orca.yaml`, not a Claude Code plugin setup. The smaller override file stays.
- **Date:** 2026-11-12

## Context

Bleeps uses one Claude Code setup, shared across projects. That setup carries the slash command, review rules, and merge policy. Projects still need their own overrides, in a second smaller file.

## Decision

One shared Claude Code setup / `orca.yaml` for Bleeps, with small per-project override files.

## Consequences

- The slash command, review rules, and merge policy live in the shared `orca.yaml`.
- Project-specific overrides stay in the smaller per-project file.
- [0007](0007-bleeps-is-built-for-orca.md) narrows the first bullet. The shared file is Orca's `orca.yaml`, and the front door is `issueCommand`.
- **Revisit if:** a project needs a setup a small override file cannot express.
