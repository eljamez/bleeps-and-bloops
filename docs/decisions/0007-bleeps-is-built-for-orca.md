# 0007: Bleeps is built for Orca

- **Status:** accepted
- **Date:** 2026-11-13

## Context

The 2026-11-11 pack is Claude Code plugins calling `gh`. The plan was an Orca harness, and it was open whether those plugins or Orca's own config should own the pipeline. A layer that could also run under Claude Code alone would make the harness interchangeable. That is the opposite of this system.

## Decision

Bleeps is custom-built for Orca. That is a core opinion. The factory config is Orca's `orca.yaml` and the scripts that file runs. There is no harness-agnostic layer. The Claude plugins are not installed and are not the runtime.

The pack stays reference at [docs/reference/context-pack-2026-11-11](../reference/context-pack-2026-11-11/README.md). Its ideas land on Orca like this:

| Pack idea | Where Bleeps puts it |
| --- | --- |
| `/bb:kick-off` | `issueCommand`. Orca sends that prompt when a workspace launches from a linked issue. It substitutes `{{issue}}` and `{{artifact_url}}`. |
| `/bb:sdd-init` | `scripts.setup`, which runs after Orca creates a worktree and installs dependencies. It does not write a `CLAUDE.md` workflow section. |
| specify, plan, tasks, implement | Steps in the `issueCommand` prompt. Orca has no skill or plugin keys. |
| `spec-driven-verify` and `spec-reviewer` | The same prompt requires a fresh read-only pass that writes `verify.md`. Orca has no second-agent key, so the reviewer agent is not ported. |
| `spec-driven-ship`, which never merged | The prompt opens the pull request. Merge policy is [0003](0003-gitflow-auto-merge-to-develop.md). The procedure is `scripts/ship-pr`, which is still a stub. |
| Guardrails | The prompt, plus `scripts/guardrails` (a path-name heuristic). A Claude tool-call hook is not part of the factory. |
| Habit skills | Named in the prompt. They are not installed as Claude skills. |
| `engineering` plugin | Not used. |

Orca's parser (`stablyai/orca` `src/shared/orca-yaml.ts` at `aa736b6650fd13a0256a7ba0b3b1c7741fb933ee`) accepts `scripts.setup`, `scripts.archive`, `setupAgentStartupPolicy`, `issueCommand`, `defaultTabs`, `environmentRecipes`, and `worktree.sharedDirectories`. It has no verification key, no merge key, and no conditional hook. Conditional hooks are tracked in [stablyai/orca#6917](https://github.com/stablyai/orca/issues/6917). `scripts/orca-verify` runs the tests. A required GitHub check is what can block the pull request.

This narrows [0001](0001-shared-factory-config.md). The shared setup is Orca's `orca.yaml`, with a smaller per-project file. Orca does not merge two yaml files. `orca.project.yaml` is read by the setup script. Orca's own local override is `.orca/issue-command`, and it replaces `issueCommand` for that checkout.

## Consequences

- New factory behavior goes in `orca.yaml` or in a script that file runs.
- The agent inside the worktree can still be Claude Code, Grok, or another agent Orca launches. This decision is about the factory config.
- **Revisit if:** a step we need cannot be expressed in Orca, and a Claude Code hook is the only mechanism that works (for example, blocking a tool call). Conditional hooks landing in Orca is not, by itself, a reason to reopen this.
