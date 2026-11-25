# Zap

Zap is optional and off by default. `zap: on` in `orca.project.yaml` is the switch. Until then, do nothing.

When it is on, keep the pull request from `develop` to `main` described with draft notes (new, fixed, changed) and a readiness list: failing checks, and pull requests still waiting on `develop`. Run `scripts/check-site`. Zap does not merge to `main`. The owner does.

See [0017](../../docs/decisions/0017-chore-lane.md).
