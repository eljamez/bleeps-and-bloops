# Decisions

A veto list. Open it before proposing a new primitive or a new way to ship.

These are product-shaped choices already made, usually a no. Each record has a revisit-if. This is not a record per PR, and not a design doc in progress.

[Flow](../flow.md) and [architecture](../architecture.md) describe how Bleeps works today. This folder records what we already settled.

A record is about half a page: context, the decision, consequences, and a revisit-if. Copy [0000-template.md](0000-template.md) to the next unused number (`0018` is next). Do not renumber old files.

Write a record when the next agent would otherwise re-propose the same thing. Skip layout tweaks, library picks the code already encodes, and notes that a PR shipped.

When a later record changes a decision, mark the old one `superseded by NNNN`. Leave the old file in place.

## List

- [0001: Shared Bleeps config](0001-shared-factory-config.md) — one shared setup. Small per-project overrides. Narrowed by 0007.
- [0002: Rebuild Bleeps clean](0002-rebuild-factory-clean.md) — the 2026-11-11 pack is reference.
- [0003: Gitflow auto-merge to develop](0003-gitflow-auto-merge-to-develop.md) — agents ship to `develop`. James promotes `main`.
- [0004: Name the system Bleeps](0004-name-the-system-bleeps.md) — superseded by 0010. Bloops is not a name for outputs.
- [0005: Adopt six Kody-inspired practices](0005-adopt-kody-inspired-practices.md) — veto list, router, primitives, ship-pr, friction, control CLI.
- [0006: A waveform creature, not a robot](0006-waveform-creature-not-a-robot.md) — the mark is a bleep, then a bloop with eyes.
- [0007: Bleeps is built for Orca](0007-bleeps-is-built-for-orca.md) — the factory config is `orca.yaml`. The Claude plugins stay reference.
- [0008: Bleeps is proactive](0008-bleeps-is-proactive.md) — a scheduled scout files `bleeps:found` issues and runs the pipeline.
- [0009: Testing is a gate; Blip owns tests](0009-testing-is-a-gate-blip-owns-tests.md) — green tests are required to auto-merge. Blip owns the suites. Narrowed by 0012.
- [0010: Bleeps runs the crew; Bloops reflects](0010-bleeps-runs-the-crew-bloops-reflects.md) — Bleeps orchestrates. Bloops merges and reflects. The writer does not certify.
- [0011: Scripts first](0011-scripts-first.md) — repeated work is a script. Bloops proposes the next one.
- [0012: A red suite loops](0012-red-suite-loops.md) — a red suite goes back to Buzz or Blip in the same run. `fix_rounds` defaults to 2, then the run escalates to James. Nothing merges while red.
- [0013: One ticket, many sources](0013-one-ticket-many-sources.md) — GitHub, GitHub Projects, Jira, Discord, and Linear share one intake path. GitHub access stays required.
- [0014: Where it runs is a choice](0014-where-it-runs.md) — `host` is `local` (default), `cloud`, or `home`. A home server is optional. GitHub Actions is not a host.
- [0015: A provider and model per role](0015-role-providers.md) — Claude Code is the default. Jev is opt-in and cannot go below a role's floor.
- [0016: Orca bots are an optional runtime](0016-orca-bots.md) — `runtime` is `issue-command` (default) or `bots`. The gates stay the scripts. Echo stays a fresh worker.
- [0017: The chore lane, and no unticketed features](0017-chore-lane.md) — `chore_lane` is off unless a project opts in. The workflow merges a pass. Chip and Boop do not build a feature.
