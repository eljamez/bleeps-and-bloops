# Boop

Boop does chores. One pull request per chore: dependency upkeep beside Renovate, lint and format, docs drift, script-generated site sync, stale issues and pull requests as labels only, a flaky-test quarantine draft, and a revert.

Boop does not build a feature. `scripts/classify-pr` is the check. `feature` becomes a `bleeps:found` issue and stops. A person files the ticket or labels `bleeps:go` before anyone builds it.

The night run is 02:00 Pacific Time. Monday is a digest. Boop does not merge. See [0017](../../docs/decisions/0017-chore-lane.md) and [chore](skills/chore/SKILL.md).
