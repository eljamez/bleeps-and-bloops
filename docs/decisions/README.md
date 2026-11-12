# Decisions

A veto list. Open it before proposing a new primitive or a new way to ship.

These are product-shaped choices already made, usually a no. Each record has a revisit-if. This is not a record per PR, and not a design doc in progress.

[Flow](../flow.md) and [architecture](../architecture.md) describe how Bleeps works today. This folder records what we already settled.

A record is about half a page: context, the decision, consequences, and a revisit-if. Copy [0000-template.md](0000-template.md) to the next unused number (`0006` is next). Do not renumber old files.

Write a record when the next agent would otherwise re-propose the same thing. Skip layout tweaks, library picks the code already encodes, and notes that a PR shipped.

When a later record changes a decision, mark the old one `superseded by NNNN`. Leave the old file in place.

## List

- [0001: Shared Bleeps config](0001-shared-factory-config.md) — one shared setup. Small per-project overrides.
- [0002: Rebuild Bleeps clean](0002-rebuild-factory-clean.md) — the 2026-11-11 pack is reference.
- [0003: Gitflow auto-merge to develop](0003-gitflow-auto-merge-to-develop.md) — agents ship to `develop`. James promotes `main`.
- [0004: Name the system Bleeps](0004-name-the-system-bleeps.md) — Bleeps is the system. Bloops are what it ships.
- [0005: Adopt six Kody-inspired practices](0005-adopt-kody-inspired-practices.md) — veto list, router, primitives, ship-pr, friction, control CLI.
