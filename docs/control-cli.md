# Control CLI

The command is [`scripts/bleeps`](../scripts/bleeps). `install`, `doctor`, `test`, and `typecheck` run. `preview` and `health` refuse until Phase 3. `health` with no URL prints `no health URL`.

Agents use one CLI to prove a change, and they keep that CLI working. A green check is not evidence. The evidence is a command another agent can re-run.

`scripts/orca-verify` calls `test` and `typecheck`. The setup hook calls `install`. A new check goes into `bleeps` in the same PR. Feature work does not get its own curl script.

Projects symlink `scripts/bleeps` the same way they symlink the shared `orca.yaml`. See [0001](decisions/0001-shared-factory-config.md) and [home server](home-server.md).

## Commands

```text
bleeps doctor
bleeps test
bleeps typecheck
bleeps preview
bleeps health --sha <commit> [--wait]
```

- **doctor.** Node is present, installed deps match the lockfile, and the health URL answers when one is configured. On failure, print the command that fixes it.
- **test.** Run the project tests. Non-zero on failure. No test command is a failure. When `test_unit`, `test_integration`, or `test_e2e` is set, those run. Otherwise the single `test` command runs.
- **typecheck.** Run the project typecheck. The same command `scripts/orca-verify` runs, so local and CI stay the same check.
- **preview.** Start the worktree preview and print the URL. One preview per worktree.
- **health.** GET the deployed health URL. Pass when `commitSha` equals `--sha`, or uniquely starts with it (7+ hex characters), or is a descendant (`git merge-base --is-ancestor`). A later `develop` deploy still counts. `--wait` polls until that is true or 30 minutes pass. Do not write a sleep loop beside this command.

`health` with no URL configured fails with "no health URL". That is not a pass.

Ship-pr's post-merge proof calls `health`. See [ship-pr](ship-pr.md).

## Where it lands

`scripts/orca-verify` runs `test` and `typecheck`. Phase 3 uses `preview` and `health --sha` after merge. See [roadmap](roadmap.md).
