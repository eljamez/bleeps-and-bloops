# Friction log

Papercuts live as GitHub issues labeled `friction`. They are not files in the tree.

Every ship files what it left over. A papercut is durable, will happen again, and has a fix the next agent can attempt without the session that found it: a missing step, docs that disagree with the code, a check that fails only locally, a command that needs a secret handshake.

Fix a small, in-scope papercut in the current change and mention it. File what is left.

Do not file one-off confusion, a nit that only made sense in that session, or something the PR already fixed.

Search open `friction` issues first (`gh issue list --label friction`). Comment on a match instead of opening a duplicate.

## Issue format

**Title.** One line naming the gap.

**Body.**

- **What happened.** What broke or wasted time.
- **What you wanted.** The behavior that would have been smooth.
- **How to reproduce.** Steps the next agent can run.
- **Cost.** Time or risk if it stays.
- **Already looked at.** What you tried or ruled out.
- **Files.** Paths, when you know them.

No secrets, tokens, or private data.

**Labels.**

| Label | Meaning |
| --- | --- |
| `friction` | The daily sweep considers it. |
| `friction-skipped` | The sweep leaves it until a person removes the label. Use it when the fix needs a decision from James. |

## Daily sweep

The scout is the sweep. See [0008](decisions/0008-bleeps-is-proactive.md). It runs on the Orca automation schedule, daily at 09:00 unless the project file says otherwise.

Eligible issues are open, labeled `friction`, and not labeled `friction-skipped`. The scout does not open a second issue for the same gap. It starts the normal pipeline for them, under the same cap as `bleeps:found` issues.

The agent fixes what it can in a pull request into `develop`, and uses [ship-pr](ship-pr.md). When an issue needs James, the agent comments and adds `friction-skipped` instead of guessing. The sweep does not merge to `main`.
