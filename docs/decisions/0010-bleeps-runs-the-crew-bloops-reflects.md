# 0010: Bleeps runs the crew; Bloops reflects

- **Status:** accepted
- **Date:** 2026-11-13
- **Supersedes:** [0004](0004-name-the-system-bleeps.md) on what Bloops means

## Context

0004 named Bleeps the system and Bloops the things it ships. The work is now a crew. Calling every result a bloop left no name for the agent that looks back at the crew and merges.

## Decision

Bleeps is the doer. Bleeps runs the crew and gets the work done. Bloops is the self-reflective agent. Bloops merges pull requests and proposes improvements. Outputs do not need a name. Bleeps and Bloops stays the brand.

The crew, each with a directory under `agents/`:

| Agent | Job |
| --- | --- |
| Beep | Kick-off and planning. `spec.md`, `design.md` only when the approach is risky, `tasks.md`. No product code. |
| Buzz | Implements in the worktree. Does not certify that work. |
| Blip | QA lead. Owns the suites. See [0009](0009-testing-is-a-gate-blip-owns-tests.md). |
| Echo | Independent verifier. Fresh context. Read-only on product code. Writes `verify.md` and can fail the gate. |
| Chip | The scout. Daily patrol, `bleeps:found` issues, cap 2. See [0008](0008-bleeps-is-proactive.md). |
| Bloops | Merge, then reflection. |

The agent that writes code never certifies it. Buzz does not write the verdict. Echo does not edit the product.

Bloops merges with a thin skill and `scripts/merge-pr`. The gates are unchanged: green tests, reviews clear, no guardrail area without James's sign-off, `develop` only, never `main`. Whether GitHub's auto-merge setting is turned on stays an open question. `scripts/ship-pr` calls the same script.

Bloops also records how a run went (cycle time, review rounds, test failures, friction-log entries, reverts, Chip's findings) and proposes changes to skills, scripts, and `AGENTS.md`. Proposals are issues or pull requests in the normal pipeline. Bloops does not edit those files in place.

The mark in [0006](0006-waveform-creature-not-a-robot.md) stays. The round bump is still the creature. The word Bloops is the agent, not a name for that drawing or for a shipped change.

## Consequences

- Living docs say Bleeps for the orchestrator and Bloops for the reflective agent.
- **Revisit if:** James wants a separate name for shipped work again, or the crew list itself changes.
