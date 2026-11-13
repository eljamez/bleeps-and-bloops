# Roadmap

## Current status

The shared [`orca.yaml`](../orca.yaml) is in the repo. Orca is not installed on the home server yet. Ready to resume there. See [0007](decisions/0007-bleeps-is-built-for-orca.md) and [home server](home-server.md).

`scripts/bleeps` runs `test` and `typecheck`. `scripts/ship-pr` is a stub and does not merge.

## Phase 1 – Foundations

The core `orca.yaml` and the ticket front door are built for Orca, using the [2026-11-11 context pack](reference/context-pack-2026-11-11/README.md) as reference. See [0002](decisions/0002-rebuild-factory-clean.md) and [0007](decisions/0007-bleeps-is-built-for-orca.md).

- [ ] Install Orca on the home server.
- [ ] SSH in.
- [ ] Get one agent running in an Orca worktree on a throwaway repo.
- [x] Write the core `orca.yaml`. Setup installs deps. Orca has no verification key. `scripts/orca-verify` runs tests and typecheck. A required GitHub check is what can block the pull request.
- [x] The ticket front door is `issueCommand` in that file.
- [x] Root [AGENTS.md](../AGENTS.md) router.
- [x] Decisions as a veto list, with revisit-if lines. See [decisions](decisions/README.md).
- [x] [Primitives](primitives.md) catalog and the [PR template](../.github/pull_request_template.md).
- [ ] Ship-pr procedure. The judgment is in [ship-pr](ship-pr.md). `scripts/ship-pr` refuses to merge.
- [x] `bleeps test` and `bleeps typecheck`, the same commands `scripts/orca-verify` runs. See [control CLI](control-cli.md).

## Phase 2 – Review layer

- [ ] Install CodeRabbit Essentials.
- [ ] Optionally add Devin Pro after calibrating noise.
- [ ] Map controller buttons while living in terminal sessions.

## After the review layer – Friction sweep

- [ ] `friction` and `friction-skipped` labels, and the issue format in [friction log](friction-log.md).
- [x] The daily sweep is the scout in [0008](decisions/0008-bleeps-is-proactive.md). Register it on the home server with `bleeps scout schedule --install`.
- [ ] `friction` and `friction-skipped` labels still need to exist in each project's GitHub repo before the first sweep. The scout creates `bleeps:found` and `bleeps:started` when `gh` can.

## Phase 3 – Merge policy

Gitflow, per [0003: Gitflow auto-merge to develop](decisions/0003-gitflow-auto-merge-to-develop.md) and [flow](flow.md). Feature PRs target `develop` and may auto-merge when verified safe. Only James merges `develop` into `main`. Agents never touch `main`. Label rules can still restrict which tickets auto-merge.

- [ ] Create the `develop` branch.
- [ ] Branch protection on `main`, restricted to the owner.
- [ ] Auto-merge enabled on `develop`, with required checks.
- [ ] Ship-pr script: tick, sort reviews, decision memory, dry-run merge to `develop`, health SHA. Design in [ship-pr](ship-pr.md).
- [ ] `bleeps preview` and `bleeps health --sha`. Design in [control CLI](control-cli.md).

## Phase 4 – Onboard existing projects

- [ ] Symlink the shared `orca.yaml` and commit `orca.project.yaml`. See [home server](home-server.md).
- [ ] Run the setup hook once per repo to confirm deps.
