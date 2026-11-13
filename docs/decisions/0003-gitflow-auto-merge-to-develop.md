# 0003: Gitflow auto-merge to develop

- **Status:** accepted
- **Note:** [0010](0010-bleeps-runs-the-crew-bloops-reflects.md) retires the word bloop for a merged pull request. The merge rules below stand. GitHub's auto-merge setting is still an open question.
- **Date:** 2026-11-12

## Context

The 2026-11-11 context pack never merges a pull request. The earlier plan allowed label-gated auto-merge (tests/docs first; DB/auth stay manual). Those two merge policies conflicted.

## Decision

Use Gitflow. Feature PRs from agents target `develop` and may auto-merge once everything is verified safe:

- All required checks are green.
- The independent verify verdict is "Ready to ship".
- Layered reviews passed with no blocking findings.
- No guardrail area was touched without human sign-off: auth, billing, payments, data deletion, migrations.

Only the owner (James) merges `develop` into `main`. Agents never touch `main`.

## Consequences

- This resolves the merge-policy conflict with the old pack, which never merged.
- It refines the earlier label-gated auto-merge idea. Label rules can still restrict which tickets auto-merge.
- Promotion from `develop` to `main` stays a human step, done by James. A PR that merges to `develop` is a bloop.
- **Revisit if:** auto-merge to `develop` lands a bloop the gates should have stopped, or James wants agents to promote `main`.
