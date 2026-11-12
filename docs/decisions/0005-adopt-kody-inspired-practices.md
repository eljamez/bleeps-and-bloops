# 0005: Adopt six Kody-inspired practices

- **Status:** accepted
- **Date:** 2026-11-12

## Context

Bleeps already had a ticket-to-merge pipeline and three settled choices. It did not have the habits that stop the next agent from re-proposing them, or from treating a long skill as the procedure.

Kent C. Dodds keeps those habits thin in Kody and in [kcd-skills](https://github.com/kentcdodds/kcd-skills). We read them as reference. We do not copy his packages, Discord posts, or Cloudflare setup.

Sources:

- [About Kody](https://kody.codes/about)
- [Ship a PR better than a skill](https://kody.codes/blog/ship-pr-better-than-a-skill)
- [kcd-skills](https://github.com/kentcdodds/kcd-skills)
- [kody](https://github.com/kentcdodds/kody): `AGENTS.md`, `docs/contributing/decisions/`, `docs/contributing/architecture/primitives.yaml`, `docs/contributing/friction-log.md`, `docs/contributing/control-kody.md`

## Decision

Adopt these six practices.

1. **Veto list.** Decisions are durable no's and choices, each with a revisit-if. Not one record per PR. See [the decisions list](README.md).
2. **Thin router.** Root [AGENTS.md](../../AGENTS.md) is a few lines and links. Detail lives in the linked doc.
3. **Primitives and a PR recap.** Every PR classifies the change as composes, extends, or adds, so James reviews the system. See [primitives](../primitives.md).
4. **Ship-pr split.** About 150 words of judgment in a skill. A script does the procedure: CI, review sorting, decision memory, merge, health. See [ship-pr](../ship-pr.md).
5. **Friction log.** Leftover papercuts become GitHub issues labeled `friction`. A daily sweep hands them to an agent. See [friction log](../friction-log.md).
6. **Control CLI.** Agents prove green with `bleeps`: tests, typecheck, preview, deployed SHA. See [control CLI](../control-cli.md).

## Consequences

- New agent instructions stay short and point at these pages.
- The ship-pr script and the `bleeps` CLI are designs until a later phase builds them.
- **Revisit if:** a practice costs more than it saves on real bloops.
