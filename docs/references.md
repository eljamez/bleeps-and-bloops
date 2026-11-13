# References

## Context pack

- [Context pack, 2026-11-11](reference/context-pack-2026-11-11/README.md) — read-only reference. Bleeps is rebuilt clean.
- [0002: Rebuild Bleeps clean](decisions/0002-rebuild-factory-clean.md)
- [0007: Bleeps is built for Orca](decisions/0007-bleeps-is-built-for-orca.md) — which pack ideas map onto `issueCommand`, `scripts.setup`, and the factory scripts.

## Kent C. Dodds / Kody

Adapted in [0005: Adopt six Kody-inspired practices](decisions/0005-adopt-kody-inspired-practices.md). Sources:

- [About Kody](https://kody.codes/about)
- [Ship a PR better than a skill](https://kody.codes/blog/ship-pr-better-than-a-skill)
- [kcd-skills](https://github.com/kentcdodds/kcd-skills)
- [kody](https://github.com/kentcdodds/kody) — `AGENTS.md`, `docs/contributing/decisions/`, `docs/contributing/architecture/primitives.yaml`, `docs/contributing/friction-log.md`, `docs/contributing/control-kody.md`

Still only notes: feature flags with a tested recovery path, and Cursor Bugbot. Reviewers here are CodeRabbit, Devin, and Claude Code.

## Orca

Bleeps is built for Orca. See [0007](decisions/0007-bleeps-is-built-for-orca.md) and [home server](home-server.md).

The parser in `stablyai/orca` `src/shared/orca-yaml.ts` (commit `aa736b6650fd13a0256a7ba0b3b1c7741fb933ee`) keeps `scripts.setup`, `scripts.archive`, `setupAgentStartupPolicy`, `issueCommand`, `defaultTabs`, `environmentRecipes`, and `worktree.sharedDirectories`. The factory file uses setup, the startup policy, `issueCommand`, and shared directories.

- Setup runs after worktree create. The CLI runs it with `--run-hooks`.
- `issueCommand` is the kick-off prompt. `{{issue}}` and `{{artifact_url}}` are the placeholders. `.orca/issue-command` overrides it locally.
- Orca-managed agent status hooks post to a local hook server. Those are Orca's own UI hooks, not the factory pipeline.
- Conditional hooks are open: [stablyai/orca#6917](https://github.com/stablyai/orca/issues/6917).

## Pricing

As of Nov 2026:

- CodeRabbit Essentials ~$24/mo annual
- Devin Pro $20/mo

## Dated notes

- OpenAI models leave Cursor on 2026-11-12.
