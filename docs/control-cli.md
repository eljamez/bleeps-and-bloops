# Control CLI

Design only. The `bleeps` command is not implemented.

Agents use one CLI to prove a change, and they keep that CLI working. A green check is not evidence. The evidence is a command another agent can re-run.

`bleeps` wraps the same checks the Orca verification hook will run, plus preview and the deployed SHA. A new check goes into `bleeps` in the same PR. Feature work does not get its own curl script.

The command will live in this repo. Projects symlink it the same way they symlink the shared `orca.yaml`. See [0001](decisions/0001-shared-factory-config.md).

## Commands

```text
bleeps doctor
bleeps test
bleeps typecheck
bleeps preview
bleeps health --sha <commit> [--wait]
```

- **doctor.** Node is present, installed deps match the lockfile, and the health URL answers when one is configured. On failure, print the command that fixes it.
- **test.** Run the project tests. Non-zero on failure.
- **typecheck.** Run the project typecheck. The same command the verification hook uses, so local and CI stay the same check.
- **preview.** Start the worktree preview and print the URL. One preview per worktree.
- **health.** GET the deployed health URL. Pass when `commitSha` equals `--sha`, or uniquely starts with it (7+ hex characters), or is a descendant (`git merge-base --is-ancestor`). A later `develop` deploy still counts. `--wait` polls until that is true or 30 minutes pass. Do not write a sleep loop beside this command.

`health` with no URL configured fails with "no health URL". That is not a pass.

Ship-pr's post-merge proof calls `health`. See [ship-pr](ship-pr.md).

## Where it lands

Phase 1 uses `test` and `typecheck` as the verification hook. Phase 3 uses `preview` and `health --sha` after merge. See [roadmap](roadmap.md).
