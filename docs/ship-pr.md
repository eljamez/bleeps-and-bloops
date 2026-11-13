# Ship a PR

The judgment is the text below. [`scripts/ship-pr`](../scripts/ship-pr) is a stub: `tick` prints the step and does not merge, including with `--dry-run`. The procedure on this page is what that command will do.

Shipping splits in two. The skill is judgment, about 150 words. A script does the procedure the same way on every call. A long prose skill gets a fresh interpretation each session. See [0005](decisions/0005-adopt-kody-inspired-practices.md).

Adapted from [Ship a PR better than a skill](https://kody.codes/blog/ship-pr-better-than-a-skill) and the `ship-pr` skill in [kcd-skills](https://github.com/kentcdodds/kcd-skills). Here the merge target is `develop`, the bots are CodeRabbit, Devin, and Claude Code, and high risk waits for James.

## Skill

```text
Shepherd this PR with the ship-pr script. Pick the risk yourself: low, medium, or high.

High means the diff touches a guardrail: auth, billing, payments, data deletion, or migrations. High waits for James. Do not merge it.

Low and medium may merge into develop only when the script says every gate passed. Use dry-run when you want the status without a merge.

Call tick with the PR URL and the risk. Read the current step only. Act on that step: fix a real failure, answer a finding, or record a decision with a reason. Tick again until it reports done or parked.

You judge whether a finding is worth a fix and when to stop. The script reads CI, sorts CodeRabbit, Devin, and Claude Code, remembers decisions, and merges. You do not do those by hand.

Before you finish, file leftover papercuts on the friction log.
```

## Script

One command:

```text
ship-pr tick --pr <url> --risk low|medium|high [--dry-run] [--decide <finding-id> --reason <text>]
```

`tick` returns JSON: `phase`, `done`, `remaining`, and detail only for the current step. The agent acts, then calls `tick` again.

```json
{
  "phase": "reviews",
  "exit": { "done": false },
  "done": [{ "id": "ci", "status": "done", "summary": "checks green on abc1234" }],
  "remaining": ["reviews", "merge", "health"],
  "step": { "id": "reviews", "mustAddress": [] }
}
```

`--dry-run` reads status and reports the merge it would make. It does not merge, comment, label, or store a decision.

Steps, in order. Each tick reports the first step that is not done.

1. **CI.** Read checks, statuses, and workflow runs on the head commit. Ignore a run the script has already recorded. A cancelled run with a newer run on the same commit is ignored. A cancelled run that is still the latest blocks merge until it is replaced. It is not a test failure.
2. **Reviews.** Sort CodeRabbit, Devin, and Claude Code comments into must-address, already-addressed, and invalid. Stable finding ids come from the comment URL plus a hash of the body, so a later tick sorts the same comment the same way. A comment from a person blocks until the agent answers it. The script never resolves a person's thread and never @-mentions anyone.
3. **Decisions.** `--decide` plus `--reason` records that a finding is noise. The reason is required. The script stores decisions in one PR comment marked `<!-- bleeps-ship-pr-decisions -->`. Later ticks hide that finding for seven days. `--dry-run` does not write the comment.
4. **Merge.** Allowed only when risk is low or medium, required checks are green, the tests passed, the verify verdict is "Ready to ship", no blocking review remains, and no guardrail area was touched without James's sign-off. A missing or skipped test suite is not a pass. See [0009](decisions/0009-testing-is-a-gate-blip-owns-tests.md). Merge into `develop`, pinned to the current head SHA. Refuse if the head moved. High risk returns `waiting-for-james` and does not merge. The script refuses to touch `main`. `--dry-run` returns `{ "wouldMerge": true, "into": "develop", "sha": "..." }` and stops.
5. **Health.** After a real merge, GET the project's health URL. Pass when the served commit SHA equals the merge commit or is a descendant (`git merge-base --is-ancestor`). A later deploy of `develop` still counts. "The workflow passed" is not proof. No health URL yet: status `skipped` with that reason, not `done`. Skipped until [control CLI](control-cli.md) `health` exists. `--dry-run` does not wait on a deploy.
6. **Friction.** The last step tells the agent to file leftover papercuts. The script does not invent issues. See [friction log](friction-log.md).

Gates match [0003](decisions/0003-gitflow-auto-merge-to-develop.md) and [flow](flow.md).

## Out of scope

No Discord summary. No dependency on Kody. James still promotes `develop` to `main`.
