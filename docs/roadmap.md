# Roadmap

## Current status

Pinned for later. The draft core `orca.yaml` is still open. Ready to resume.

Practice docs are written: the Bleeps name, the veto list, the primitives catalog, and the designs for ship-pr, the friction sweep, and the `bleeps` CLI. The script and the CLI are not built.

## Phase 1 – Foundations

The core `orca.yaml` and the ticket slash command are built fresh, using the [2026-11-11 context pack](reference/context-pack-2026-11-11/README.md) as reference. See [0002: Rebuild Bleeps clean](decisions/0002-rebuild-factory-clean.md).

- [ ] Install Orca on the home server.
- [ ] SSH in.
- [ ] Get Claude Code running in one worktree on a throwaway repo.
- [ ] Write the core `orca.yaml` (setup hook for deps, verification hook for tests + typecheck that blocks the PR on failure).
- [ ] Add the ticket slash command as the front door.
- [x] Root [AGENTS.md](../AGENTS.md) router.
- [x] Decisions as a veto list, with revisit-if lines. See [decisions](decisions/README.md).
- [x] [Primitives](primitives.md) catalog and the [PR template](../.github/pull_request_template.md).
- [ ] Thin ship-pr skill, judgment only. Design in [ship-pr](ship-pr.md).
- [ ] `bleeps test` and `bleeps typecheck`, the same commands as the verification hook. Design in [control CLI](control-cli.md).

## Phase 2 – Review layer

- [ ] Install CodeRabbit Essentials.
- [ ] Optionally add Devin Pro after calibrating noise.
- [ ] Map controller buttons while living in terminal sessions.

## After the review layer – Friction sweep

- [ ] `friction` and `friction-skipped` labels, and the issue format in [friction log](friction-log.md).
- [ ] Daily sweep (Grok Bot routine, or a job) that hands open `friction` issues to an agent.

## Phase 3 – Merge policy

Gitflow, per [0003: Gitflow auto-merge to develop](decisions/0003-gitflow-auto-merge-to-develop.md) and [flow](flow.md). Feature PRs target `develop` and may auto-merge when verified safe. Only James merges `develop` into `main`. Agents never touch `main`. Label rules can still restrict which tickets auto-merge.

- [ ] Create the `develop` branch.
- [ ] Branch protection on `main`, restricted to the owner.
- [ ] Auto-merge enabled on `develop`, with required checks.
- [ ] Ship-pr script: tick, sort reviews, decision memory, dry-run merge to `develop`, health SHA. Design in [ship-pr](ship-pr.md).
- [ ] `bleeps preview` and `bleeps health --sha`. Design in [control CLI](control-cli.md).

## Phase 4 – Onboard existing projects

- [ ] Symlink the shared `orca.yaml` and the project-specific override.
- [ ] Run the setup hook once per repo to confirm deps.
