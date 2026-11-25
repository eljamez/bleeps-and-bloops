# 0017: The chore lane, and no unticketed features

- **Status:** accepted
- **Date:** 2026-11-25

## Context

[0003](0003-gitflow-auto-merge-to-develop.md) lets a verified pull request land on `develop`. The bots act as the owner's GitHub login, so a prompt that says "merge only when asked" is not a lock. This repo is a product other people run. A lane that merges chores has to be opt-in, and a feature has to start from a person.

## Decision

`chore_lane` defaults to `off`. `on` enables phase 1: Renovate patch bumps and lockfile refreshes (release at least 3 days old, no 0.x packages), and docs-only drift in `docs/**/*.md` and `README.md`, never `docs/decisions/`. `lint-format` and `site-sync` exist and stay off until `chore_lane_classes` names them. This repo sets `chore_lane: on` with the phase 1 classes.

`scripts/classify-pr` returns a lane class, `none`, or `feature`. `scripts/chore-lane check` is the gate: green `check` and `e2e` on a branch up to date with `develop`, Ready to ship (or, for a dependency pull request, green CI and the release age), `scripts/guardrails`, the class allowlist, factory paths never, 10 files and 200 lines with lockfiles excluded, risk low, author Boop or Renovate, and not a feature. The repo variable `BLEEPS_AUTOMERGE` is off unless it is `on`. `bleeps:hold` stops one pull request. Caps are 3 merges a day, one at a time, weekdays 08:00–18:00 Pacific. `main` is out of scope.

The merge is a GitHub Actions workflow using a GitHub App token. Bloops does not press merge on the lane. `scripts/merge-pr --apply` stays refused. If `develop` goes red after a lane merge, the workflow sets `BLEEPS_AUTOMERGE` off or fails closed, opens a revert pull request, and mentions the repository owner. It stays off until the owner sets it back to `on`.

Chip and Boop may file a `bleeps:found` issue for a feature. They do not start building it. A feature starts when a person files the ticket or labels `bleeps:go`.

Ping's outside reviewer is `review_external`: `none` (the default), `coderabbit`, or `copilot`. `none` installs nothing. Zap is off unless `zap: on`, and Zap does not merge to `main`. Dependencies use Renovate. Dependabot version updates are not added.

## Consequences

- A project that leaves `chore_lane` unset gets no lane merges.
- The setup that GitHub will not store in the repo is [chore-lane-setup](../chore-lane-setup.md).
- **Revisit if:** the repository moves to an organization and a merge queue is available, or a lane class merges a change the gates should have stopped.
