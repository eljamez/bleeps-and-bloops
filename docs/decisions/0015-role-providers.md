# 0015: A provider and model per role

- **Status:** accepted
- **Date:** 2026-11-18

## Context

Which agent Orca launches was open, and `scout_provider` was unset, so Chip's schedule refused to install. The crew does not need one model. Beep and Echo judge the plan and the result. Buzz and Blip do the volume of the change. Chip patrols. Bloops merges with a script.

A router that the factory required, or that could pick a weaker model for a sign-off area, would reopen that question on every run.

## Decision

Each role has a provider, a model, and a tier in the `providers` table in `orca.yaml`. Orca's parser drops that key. `scripts/providers` reads it. `orca.project.yaml` overrides one field (`beep_model`, and the same for the other roles). `scout_provider` still overrides Chip's provider.

Claude Code (`claude`) is the default provider. The models are the aliases Orca already passes through: `opus`, `sonnet`, `haiku`.

| Role | Tier | Model | Routing |
| --- | --- | --- | --- |
| Beep | frontier | opus | Fixed. |
| Echo | frontier | opus | Fixed. |
| Buzz | balanced | sonnet | Jev may raise it. |
| Blip | balanced | sonnet | Jev may raise it after a fix round has failed. |
| Chip | fast | haiku | Jev may raise it. This is the scout provider. |
| Bloops | balanced | sonnet | Reflection only. Merge is `scripts/merge-pr`, which has no model. |

`router` defaults to `off`. The factory runs with no proxy. `router: jev` opts in.

The proxy is a local [jev-router](https://github.com/dirien/jev-router) at `jev_url` (default `http://127.0.0.1:4000`). It speaks Claude Code and Codex and uses the same tier names. OpenRouter's `typesafe/jev-router` is not the launch path: it answers as whichever model it picked, including models Claude Code cannot run, and a cost tier is not a floor.

The proxy can pin a tier. It cannot express a minimum. `scripts/providers` is the floor. A recommendation below the role's tier is discarded. A health check that names no tier leaves Buzz and Chip on their floor. The same silence after a failed fix round raises Blip to frontier, because that role is allowed to move and the proxy did not choose. Sign-off areas (auth, billing, payments, data deletion, migrations) use the frontier model and do not ask the proxy. A failed call, a bad answer, or `--offline` keeps the configured model. The only ladder that can move is Claude's. Another provider keeps the model you set.

The key stays in the environment variable named by `jev_key_env`. The file stores the name.

Chip's `orca automations create` line always includes `--provider` and `--model`. Install no longer refuses for a missing provider.

## Consequences

- One Orca session is still one agent. The table is what a launch uses: Chip's automation, and `scripts/providers show <role>` when a role starts a fresh session. The flags are `orca worktree create --agent` and `--model`, and for the automation `--provider` plus `--extra-agent-args`.
- The automation stores the model resolved at install. A later answer does not rewrite it. Print the schedule again and edit the automation when you want a new pin.
- Stock jev-router's `/healthz` names no tier. Until a proxy returns `tier` (or an `x-jev-tier` header) on that check, Buzz and Chip stay on their floor while Jev is on. Guardrails and a stalled Blip still move to frontier.
- **Revisit if:** Orca can pin a model per role on the worktree `issueCommand` already started, or the proxy grows a side-effect-free recommendation that itself honors a floor.
