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

A Grok Bot routine, or a scheduled job if the bot is the wrong place, runs once a day. This starts after the review layer is in place. See [roadmap](roadmap.md).

Eligible issues are open, labeled `friction`, and not labeled `friction-skipped`.

The sweep hands that list to one agent. The agent fixes what it can in a normal PR into `develop`, and uses [ship-pr](ship-pr.md) once that script exists. When an issue needs James, the agent comments and adds `friction-skipped` instead of guessing.

The sweep does not open a second issue for the same gap, and it does not merge to `main`.
