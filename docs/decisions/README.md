# Decisions

A veto list. Open it before proposing a new primitive or a new way to ship.

These are product-shaped choices already made, usually a no. Each record has a revisit-if. This is not a record per PR, and not a design doc in progress.

[Flow](../flow.md) and [architecture](../architecture.md) describe how Bleeps works today. This folder records what we already settled.

A record is about half a page: context, the decision, consequences, and a revisit-if. Copy [0000-template.md](0000-template.md) to the next unused number (`0012` is next). Do not renumber old files.

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
- [0009: Testing is a gate; Blip owns tests](0009-testing-is-a-gate-blip-owns-tests.md) — green tests are required to auto-merge. Blip owns the suites.
- [0010: Bleeps runs the crew; Bloops reflects](0010-bleeps-runs-the-crew-bloops-reflects.md) — Bleeps orchestrates. Bloops merges and reflects. The writer does not certify.
- [0011: Scripts first](0011-scripts-first.md) — repeated work is a script. Bloops proposes the next one.
