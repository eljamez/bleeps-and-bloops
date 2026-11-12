# 0002: Rebuild the factory clean

- **Status:** accepted
- **Date:** 2026-11-12

## Context

The owner already had a Software Factory context pack: Claude Code plugins `bb` and `spec-driven-workflow`, plus four standalone skills. That pack is a snapshot of an earlier workflow, not the factory to ship.

## Decision

Keep the prior pack as read-only reference at [docs/reference/context-pack-2026-11-11](../reference/context-pack-2026-11-11/README.md). Rebuild the factory clean.

## Consequences

These design ideas carry forward:

- A per-ticket `specs/<issue>-<slug>/` folder: `ticket.md`, `spec.md` with draft/approved status, optional `design.md`, `tasks.md`, and `verify.md` whose verdict gates shipping.
- An independent read-only reviewer that never shares the implementer's context.
- A human-approval guardrail list: auth, billing, payments, data deletion, migrations.
- GitHub Issues as the first ticket source. Linear and Discord come later, via an ingestion step that produces the same `ticket.md`.
- The four habit skills: explore-first, delegate-cheap-work, verify-before-ship, decompose-hotspot.

Write these known pack gaps fresh: the missing `spec-driven-loop` skill, and the `spec-implementer` and test/ux/backend reviewer agents.

The core `orca.yaml` and the ticket slash command are also built fresh, using the pack as reference. See [Phase 1](../roadmap.md).
