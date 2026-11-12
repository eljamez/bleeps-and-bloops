# Roadmap

## Current status

Pinned for later. The draft core `orca.yaml` is still open. Ready to resume.

## Phase 1 – Foundations

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

- [ ] Auto-merge off by default.
- [ ] Enable per ticket label (tests/docs first; DB/auth stay manual).
- [ ] Enforce in `orca.yaml`.

## Phase 4 – Onboard existing projects

- [ ] Symlink the shared `orca.yaml` and the project-specific override.
- [ ] Run the setup hook once per repo to confirm deps.
