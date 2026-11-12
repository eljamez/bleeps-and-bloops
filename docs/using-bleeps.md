# Using Bleeps

Bleeps is the system that turns a ticket into a merged pull request. A shipped pull request or feature is a bloop. Bleeps and Bloops is the brand. Kent C. Dodds names his system Kody. Bleeps is that kind of name: one word for the thing that does the work.

This page is how you adopt Bleeps on a repository of your own.

It is Phase 1. The agreements and the designs are written. The shared config, the kick-off command, the reviewers, the ship-pr script, and the `bleeps` CLI are planned. You can shape the repo to match the line. The commands that would run a ticket are still on the [roadmap](roadmap.md).

The building blocks are the [primitives](primitives.md). The ticket order is the [flow](flow.md). Settled choices are the [decisions](decisions/README.md). Read those before you invent a second way to ship.

## Prerequisites

- A GitHub repository you administer. GitHub Issues are the ticket source. Linear and Discord come later, and they still have to produce the same `ticket.md`. See [0002](decisions/0002-rebuild-factory-clean.md).
- [Orca](architecture.md), the MIT harness, or a setup that can do the same job: run Claude Code in an isolated worktree per ticket. The plan is a home server you reach by SSH. 8 GB of RAM is the floor. 16 GB is comfortable. Orca is not installed for Bleeps yet.
- Claude Code. Orca runs it for the work. Claude Code is also the planned architecture-fit reviewer.
- Reviewers, when you reach Phase 2. CodeRabbit for style and obvious bugs. Devin, optionally, for an end-to-end pass after you have calibrated its noise. None of that layer is installed.

## Set up the repository

### Branches

Use Gitflow in the sense [0003](decisions/0003-gitflow-auto-merge-to-develop.md) settled. Feature work targets `develop`. The owner merges `develop` into `main`. Agents never touch `main`.

Create `develop` if the repository does not have it. This repository already uses `develop`.

Protect `main` so only the owner can merge into it. Agents do not push to `main`, and they do not open a pull request against it.

Auto-merge into `develop` is the goal, and only when the [gates](flow.md) pass: required checks green, verify verdict "Ready to ship", layered reviews with no blocking findings, and no guardrail touched without a human sign-off. Label rules can still keep a ticket from auto-merging.

Turning auto-merge on in GitHub is Phase 3. Leave it off until the checks and the ship-pr script exist. Required checks are one gate. The verify verdict and the deployed SHA are gates of their own.

### Shared config

One shared `orca.yaml` holds the slash command, the review rules, the hooks, and the merge policy. Your repository gets a smaller override for what is only yours: how you test, a health URL, and anything else a small file can express. You symlink the shared file and the override. See [0001](decisions/0001-shared-factory-config.md).

The shared file is not written yet. The symlink step is Phase 4. Until it exists, there is nothing to point at.

### AGENTS.md

Put a short router at the root. A few lines and links. Name Bleeps, say a bloop is a shipped pull request or feature, and point at the pages an agent should open: the flow, the architecture, the decisions, the primitives, ship-pr, the friction log, and the control CLI. Detail lives in the linked page.

This repository's [AGENTS.md](../AGENTS.md) is the pattern. You can link these docs, or keep a copy in the project when you need one. The shared behavior comes from `orca.yaml`, once that file exists.

### Pull request template

Use a template with a recap, so a review can see how the change sits in the system. Copy [.github/pull_request_template.md](../.github/pull_request_template.md).

The recap classifies the change:

| Class | Meaning |
| --- | --- |
| `composes` | Wires existing primitives. No contract change. |
| `extends` | Changes a primitive's behavior or contract. |
| `adds` | Introduces a primitive. Update [primitives.yaml](primitives.yaml) in that PR. |

Roll up to the highest class: `adds`, then `extends`, then `composes`. The risk tier is separate. `high` means the diff touches a guardrail and waits for the owner.

### Friction log

Papercuts are GitHub issues labeled `friction`. They are not files in the tree. The format, the `friction-skipped` label, and the rule for what is worth filing are in the [friction log](friction-log.md).

Every ship files what it left over. Search open `friction` issues before opening a duplicate. The daily sweep, which hands that list to one agent, starts after the review layer. It is planned. It does not merge to `main`.

## The day-to-day loop

These are the steps in [flow](flow.md). The commands are planned, so this is the shape of the work.

1. A GitHub issue is filed. A person runs the kick-off slash command with the issue number. That command is planned. Whether someone grooms or prioritizes the issue before kick-off is still open.
2. The agent writes `spec.md` in `specs/<issue>-<slug>/`, along with `ticket.md`. `spec.md` carries status draft or approved. `design.md` is written only if the approach is risky.
3. The agent writes `tasks.md`, a checklist.
4. The agent builds, tests, and fixes in an isolated Orca worktree, with a round limit. The number of rounds is not chosen yet. When the change touches a guardrail, the loop pauses for a human.
5. A separate read-only reviewer writes `verify.md`. It does not share the implementer's context, and it does not edit. Only "Ready to ship" continues. Any other verdict stops the line before a pull request.
6. The agent opens a pull request against `develop` and comments on the issue. The description includes the recap.
7. Layered review runs: CodeRabbit, optionally Devin, and Claude Code for architecture fit. Grok Bot watches the queue, failing CI, and review nudges. That layer is Phase 2, and the bot is planned.
8. The pull request auto-merges into `develop` when every gate passes. The ship-pr skill judges risk, what to fix, and when to stop. The script, once it exists, walks CI, reviews, memory, merge, and health. Low and medium risk may merge. High risk waits. See [Ship a PR](ship-pr.md).
9. The owner promotes `develop` to `main`. Here, that owner is James. On your project, it is you. Agents never touch `main`.

After a real merge, ship-pr asks `bleeps health` for the deployed SHA. The CLI is planned. A green check is not deployed proof. See [Control CLI](control-cli.md).

## Guardrails

Five areas need a human before they change, and before they merge:

- Auth
- Billing
- Payments
- Data deletion
- Migrations

The build loop pauses. Auto-merge stays shut when one of them was touched and the owner has not signed off. Here, that owner is James. On your project, it is you.

The list is short on purpose. Everything else can move once the gates pass. These five wait. The list is decided. The check that enforces it is planned.

Risk tier `high` means the diff touches one of these. High waits for the owner.

## Where this stands

In place:

- The [AGENTS.md](../AGENTS.md) router.
- The [decisions](decisions/README.md), with a revisit-if on each.
- The [primitives](primitives.md) catalog and the [pull request template](../.github/pull_request_template.md).
- Designs for [ship-pr](ship-pr.md), the [friction sweep](friction-log.md), and the [`bleeps` CLI](control-cli.md). The pages are written. The commands are still to build.

Still open in Phase 1: install Orca, get Claude Code running in one worktree, write the shared `orca.yaml`, add the kick-off command, write the thin ship-pr skill, and add `bleeps test` and `bleeps typecheck`.

After that: CodeRabbit and optional Devin, the friction sweep, auto-merge onto `develop`, `bleeps preview` and `bleeps health`, and the symlink of the shared config onto each project.

## Quick start

Do these on the repository. They need no Bleeps command.

- [ ] Read the [flow](flow.md), the [primitives](primitives.md), and the [decisions](decisions/README.md).
- [ ] Create `develop` if you do not have it. Point agent pull requests at it.
- [ ] Protect `main` so only the owner can merge. Leave auto-merge off until Phase 3.
- [ ] Add a short `AGENTS.md` router.
- [ ] Add the pull request template, including the recap and the risk tier.
- [ ] Create a `friction` label, and use the issue format in the [friction log](friction-log.md) when a papercut is worth keeping.
- [ ] Treat auth, billing, payments, data deletion, and migrations as human sign-off.

These wait on the roadmap. The commands are not in the repo yet.

- [ ] Install Orca and Claude Code, and confirm one worktree on a throwaway repo.
- [ ] Symlink the shared `orca.yaml` and a smaller project override.
- [ ] Install CodeRabbit. Add Devin only after its noise is calibrated.
- [ ] Enable auto-merge on `develop` with the required checks.
- [ ] Run kick-off on a real issue, then ship-pr, then `bleeps health` after the merge.
- [ ] Promote `develop` to `main` yourself.
