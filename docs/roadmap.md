# Roadmap

## Current status

Pinned for later. The draft core `orca.yaml` is still open. Ready to resume.

## Phase 1 – Foundations

The core `orca.yaml` and the ticket slash command are built fresh, using the [2026-11-11 context pack](reference/context-pack-2026-11-11/README.md) as reference. See [0002: Rebuild the factory clean](decisions/0002-rebuild-factory-clean.md).

- [ ] Install Orca on the home server.
- [ ] SSH in.
- [ ] Get Claude Code running in one worktree on a throwaway repo.
- [ ] Write the core `orca.yaml` (setup hook for deps, verification hook for tests + typecheck that blocks the PR on failure, ship-PR skill).
- [ ] Add the ticket slash command as the front door.

## Phase 2 – Review layer

- [ ] Install CodeRabbit Essentials.
- [ ] Optionally add Devin Pro after calibrating noise.
- [ ] Map controller buttons while living in terminal sessions.

## Phase 3 – Merge policy

Gitflow, per [0003: Gitflow auto-merge to develop](decisions/0003-gitflow-auto-merge-to-develop.md) and [flow](flow.md). Feature PRs target `develop` and may auto-merge when verified safe. Only James merges `develop` into `main`. Agents never touch `main`. Label rules can still restrict which tickets auto-merge.

- [ ] Create the `develop` branch.
- [ ] Branch protection on `main`, restricted to the owner.
- [ ] Auto-merge enabled on `develop`, with required checks.

## Phase 4 – Onboard existing projects

- [ ] Symlink the shared `orca.yaml` and the project-specific override.
- [ ] Run the setup hook once per repo to confirm deps.
