# 0016: Orca bots are an optional runtime

- **Status:** accepted
- **Date:** 2026-11-25

## Context

Orca Bots shipped in 1.4.265 on 2026-11-19. A bot is a standing agent in Orca's store, with a soul, a memory, connectors, and automations. It is not a key in `orca.yaml`. The factory today starts from `issueCommand` when a workspace launches from a GitHub issue. James wants the whole crew able to run as bots in one group, without making that the only way.

## Decision

`runtime` in `orca.project.yaml` is `issue-command` (the default) or `bots`. Omitting the key means `issue-command`. Bots are an optional runtime. They do not replace the prompt, the scripts, or the gates.

The group is one Orca group: Bleeps coordinates, Beep plans, Buzz builds, Blip leads QA, Chip scouts and takes the scheduled scout automation, and Bloops merges and reflects. [0017](0017-chore-lane.md) adds Ping, Boop, and an optional Zap. Echo stays a fresh Claude Code worker started per verify, not a bot, so the verifier does not share the writer's chat.

The gate scripts stay the real gates: `scripts/intake`, `scripts/guardrails`, `scripts/fix-loop`, `scripts/orca-verify`, `scripts/verify`, `scripts/merge-pr`, `scripts/providers`, `scripts/check-site`. The writer never certifies. Nothing merges while the suite is red. Pull requests target `develop` only. `main` is James's. Sign-off areas need James. Bloops merges only through `scripts/merge-pr`, and only when James says so. Reflection changes go out as pull requests to repo skills, never into bot memory.

Orca's "merge only when the owner asks" is a prompt, not a lock. The script is the lock. A bot acts as the owner's `gh` login, so `verify.md` names the writer and the verifier.

## Consequences

- `issueCommand` still runs a project that leaves `runtime` unset.
- Setup for the group is `python3 scripts/bots print`. It does not create the bots. See [bots](../bots.md).
- **Revisit if:** Orca enforces the merge prompt, or a bot can run with no machine you keep awake.
