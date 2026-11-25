---
name: boop-chore
description: Open one chore pull request. File a feature as bleeps:found and do not build it.
---

# Chore

Run `scripts/classify-pr` on the paths you would change.

- `feature`: file a `bleeps:found` issue and stop. Boop does not build a feature. Do not hand it to Bleeps. Do not add `bleeps:go`.
- `deps-patch`, `docs-drift`, `lint-format`, or `site-sync`: open one pull request. The lane merges it only when `scripts/chore-lane check` passes. Phase 2 classes are classified and stay disabled until `chore_lane_classes` names them.
- A quarantine draft: pass `--intent quarantine`. It may touch tests only. It must not skip a test. It is not a lane class. Open it as a draft.
- A revert of a lane merge: open the revert pull request. Do not merge it.
- Stale issues and pull requests: add a label. Do not close them.

Do not edit `.github`, `scripts`, `orca*.yaml`, `bots`, `agents`, or `.agents`. Do not merge.
