# Using Bleeps

Bleeps runs the crew. Bloops merges and reflects. Bleeps and Bloops is the brand. Outputs do not need a name. Bleeps is the name of the orchestrator.

This page is how you adopt Bleeps on a repository of your own.

It is Phase 1. The shared config is in the Bleeps repo. Orca is not installed for this repo yet. Where it runs is a choice. Reviewers and the ship-pr procedure are still on the [roadmap](roadmap.md).

The building blocks are the [primitives](primitives.md). The ticket order is the [flow](flow.md). Settled choices are the [decisions](decisions/README.md). Read those before you invent a second way to ship.

## Prerequisites

- A GitHub repository you administer. GitHub holds the code, the pull requests, and CI, whichever tracker the tickets live in. The ticket source can be GitHub Issues, a GitHub Project, Jira, Discord, or Linear. Each project picks its sources in `orca.project.yaml`. See [tickets](tickets.md) and [0013](decisions/0013-one-ticket-many-sources.md).
- [Orca](architecture.md), the MIT harness Bleeps is built for. See [0007](decisions/0007-bleeps-is-built-for-orca.md). `host` in `orca.project.yaml` says where it runs: `local` (the default, the computer in front of you), `cloud` (a VPS you leave on), or `home` (a machine at home). A home server is optional. The factory runs only while that machine is on and Orca is running. GitHub Actions can run the checks. It cannot run Orca. 8 GB of RAM is the floor. 16 GB is comfortable. Steps are in [where it runs](where-it-runs.md). See [0014](decisions/0014-where-it-runs.md).
- An agent Orca can launch. Claude Code is the default, one provider and model per role. See [0015](decisions/0015-role-providers.md). `router` stays off unless you set `router: jev`. It is also the planned architecture-fit reviewer.
- Reviewers, when you reach Phase 2. CodeRabbit for style and obvious bugs. Devin, optionally, for an end-to-end pass after you have calibrated its noise. None of that layer is installed.

## Set up the repository

### Branches

Use Gitflow in the sense [0003](decisions/0003-gitflow-auto-merge-to-develop.md) settled. Feature work targets `develop`. The owner merges `develop` into `main`. Agents never touch `main`.

Create `develop` if the repository does not have it. This repository already uses `develop`.

Protect `main` so only the owner can merge into it. Agents do not push to `main`, and they do not open a pull request against it.

Auto-merge into `develop` is the goal, and only when the [gates](flow.md) pass: required checks green, verify verdict "Ready to ship", layered reviews with no blocking findings, and no guardrail touched without a human sign-off. Label rules can still keep a ticket from auto-merging.

Turning auto-merge on in GitHub is Phase 3. Leave it off until the checks and the ship-pr script exist. Required checks are one gate. The verify verdict and the deployed SHA are gates of their own.

### Shared config

One shared [`orca.yaml`](../orca.yaml) is the factory config. `issueCommand` is the kick-off. `scripts.setup` installs dependencies when Orca creates a worktree. Orca does not merge a second yaml. Your repository symlinks `orca.yaml` and commits `orca.project.yaml` for install, test, typecheck, `host`, and `runtime`. `runtime` defaults to `issue-command`. `bots` is optional and runs the crew as Orca bots in one group. Copy [examples/orca.project.yaml](../examples/orca.project.yaml). See [0001](decisions/0001-shared-factory-config.md), [0007](decisions/0007-bleeps-is-built-for-orca.md), [0016](decisions/0016-orca-bots.md), and [where it runs](where-it-runs.md).

The 2026-11-11 Claude plugins stay reference. `/bb:kick-off` is now `issueCommand`. `/bb:sdd-init` is the setup hook. The spec, task, and verify stages are steps in that prompt. The pack's ship step never merged; merge policy is [0003](decisions/0003-gitflow-auto-merge-to-develop.md), and `scripts/ship-pr` is still a stub. The full map is in [0007](decisions/0007-bleeps-is-built-for-orca.md).

Blip owns tests. Read [agents/blip/ROLE.md](../agents/blip/ROLE.md). Put `test`, or `test_unit`, `test_integration`, and `test_e2e`, in `orca.project.yaml`. A missing test command fails `bleeps test`. A red suite runs `scripts/fix-loop` in the same run. `fix_rounds` defaults to 2. Nothing merges while the suite is red. See [0009](decisions/0009-testing-is-a-gate-blip-owns-tests.md) and [0012](decisions/0012-red-suite-loops.md).

The scout is on by default. Set `proactive: off` to keep it from filing issues. The schedule, scans, and cap are in the same file. `host` defaults to `local`. On a laptop, a scout that was due while the computer slept starts once if you wake it inside Orca's grace window (12 hours unless you change it), and is skipped after that. Tickets filed while it was off stay open. They are not a queue the computer drains later. See [0008](decisions/0008-bleeps-is-proactive.md) and [where it runs](where-it-runs.md).

Set `ticket_sources` in the same file. `github` is the default. Add `github-project`, `jira`, `discord`, or `linear` for the trackers this project uses. Credential keys are env var names. Run `python3 scripts/check-ticket-sources` on the machine that will do the work. It fails when GitHub access is missing. See [tickets](tickets.md).

### AGENTS.md

Put a short router at the root. A few lines and links. Name Bleeps as the orchestrator and Bloops as the agent who merges and reflects. Point at the crew, the flow, the decisions, the primitives, and the scripts. Detail lives in the linked page. Scripts first: [0011](decisions/0011-scripts-first.md).

This repository's [AGENTS.md](../AGENTS.md) is the pattern. You can link these docs, or keep a copy in the project when you need one. The shared behavior comes from `orca.yaml`.

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

These are the steps in [flow](flow.md). Kick-off is `issueCommand`. The ship-pr procedure is still a stub.

1. A ticket is filed in a source this project connected. `scripts/intake fetch` writes the normalized ticket and, when the source is not GitHub, mirrors it to a GitHub issue. A person launches an Orca workspace from that issue. Orca sends `issueCommand`, with `{{issue}}` and `{{artifact_url}}` filled in. Whether someone grooms or prioritizes the issue before that is still open.
2. The agent writes `spec.md` in `specs/<issue>-<slug>/`, along with `ticket.md`. `spec.md` carries status draft or approved. `design.md` is written only if the approach is risky.
3. The agent writes `tasks.md`, a checklist.
4. The agent builds in an isolated Orca worktree. Blip runs `scripts/fix-loop`. A red suite goes back in the same run: Buzz fixes the code, or Blip fixes the test when the test is wrong. Blip reruns until green. `fix_rounds` defaults to 2. The next red escalates to the owner with a summary and does not merge. When the change touches a guardrail, the loop pauses for a human.
5. A separate read-only reviewer writes `verify.md`. It does not share the implementer's context, and it does not edit. Only "Ready to ship" continues, and only when the suite is green. A red suite returns to step 4. Any other verdict stops the line before a pull request.
6. The agent opens a pull request against `develop` and comments on the issue. The description includes the recap.
7. Layered review is not started by `orca.yaml`. CodeRabbit, Devin, and an architecture-fit pass count only when they actually ran. Nothing in this factory watches the queue.
8. The pull request auto-merges into `develop` when every gate passes. The ship-pr text judges risk, what to fix, and when to stop. `scripts/ship-pr` will walk CI, reviews, memory, merge, and health. Today it refuses to merge. Low and medium risk may merge once that procedure exists. High risk waits. See [Ship a PR](ship-pr.md).
9. The owner promotes `develop` to `main`. Here, that owner is James. On your project, it is you. Agents never touch `main`.

After a real merge, ship-pr asks `bleeps health` for the deployed SHA. `scripts/bleeps` runs `test` and `typecheck` now. `health` still refuses. A green check is not deployed proof. See [Control CLI](control-cli.md).

## Guardrails

Five areas need a human before they change, and before they merge:

- Auth
- Billing
- Payments
- Data deletion
- Migrations

The build loop pauses. Auto-merge stays shut when one of them was touched and the owner has not signed off. Here, that owner is James. On your project, it is you.

The list is short on purpose. Everything else can move once the gates pass. These five wait. The list is decided. `scripts/guardrails` reports matching paths and exits 2. It does not block a merge. `scripts/ship-pr` is still a stub.

Risk tier `high` means the diff touches one of these. High waits for the owner.

## Where this stands

In place:

- The [AGENTS.md](../AGENTS.md) router.
- The [decisions](decisions/README.md), with a revisit-if on each.
- The [primitives](primitives.md) catalog and the [pull request template](../.github/pull_request_template.md).
- Designs for [ship-pr](ship-pr.md), the [friction sweep](friction-log.md), and the [`bleeps` CLI](control-cli.md). `scripts/bleeps` runs `test` and `typecheck`. `scripts/ship-pr` refuses to merge.

Still open in Phase 1: install Orca on the machine `host` names, run one worktree, and build the ship-pr procedure. The shared `orca.yaml` and `issueCommand` are in the repo. The default machine is the computer in front of you.

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

These wait on the roadmap.

- [ ] Install Orca, log in an agent, and confirm one worktree on a throwaway repo. See [where it runs](where-it-runs.md). Set `host` if the machine is not the computer in front of you.
- [ ] Symlink the shared `orca.yaml` and commit `orca.project.yaml`.
- [ ] Install CodeRabbit. Add Devin only after its noise is calibrated.
- [ ] Enable auto-merge on `develop` with the required checks.
- [ ] Run kick-off on a real issue, then ship-pr, then `bleeps health` after the merge.
- [ ] Promote `develop` to `main` yourself.
