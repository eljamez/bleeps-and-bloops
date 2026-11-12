# References

## Context pack

- [Context pack, 2026-11-11](reference/context-pack-2026-11-11/README.md) — read-only reference. Bleeps is rebuilt clean.
- [0002: Rebuild Bleeps clean](decisions/0002-rebuild-factory-clean.md)

## Kent C. Dodds / Kody

Adapted in [0005: Adopt six Kody-inspired practices](decisions/0005-adopt-kody-inspired-practices.md). Sources:

- [About Kody](https://kody.codes/about)
- [Ship a PR better than a skill](https://kody.codes/blog/ship-pr-better-than-a-skill)
- [kcd-skills](https://github.com/kentcdodds/kcd-skills)
- [kody](https://github.com/kentcdodds/kody) — `AGENTS.md`, `docs/contributing/decisions/`, `docs/contributing/architecture/primitives.yaml`, `docs/contributing/friction-log.md`, `docs/contributing/control-kody.md`

Still only notes: feature flags with a tested recovery path, and Cursor Bugbot. Reviewers here are CodeRabbit, Devin, and Claude Code.

## Orca native hooks

- Managed hooks post to a local hook server.
- Claude can block or rewrite tool calls.
- `orca.yaml` setup hooks run on worktree create.
- Community Agent Pool & Test Queue plugin.

## Pricing

As of Nov 2026:

- CodeRabbit Essentials ~$24/mo annual
- Devin Pro $20/mo

## Dated notes

- OpenAI models leave Cursor on 2026-11-12.
