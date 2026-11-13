# 0011: Scripts first

- **Status:** accepted
- **Date:** 2026-11-13

## Context

The same steps were written out again in each prompt: make the spec folder, check `verify.md`, decide a merge, run the scout. A fresh session reinvented the commands.

## Decision

Common or repeated work is a script in this repo, under `scripts/` or the `bleeps` command. Humans and agents run that script. They do not retype the procedure.

Agents prefer a script that already exists. The second time an agent does a step by hand, they propose a script. Bloops watches for that and files the proposal. The proposal goes through the normal pipeline. Nobody rewrites a script silently.

Scripts in place for the crew: `scripts/kick-off` (Beep), `scripts/orca-verify` and `scripts/verify` (Blip and Echo), `scripts/merge-pr` (Bloops), `scripts/bleeps-scout` (Chip), `scripts/bloops-reflect` (Bloops).

## Consequences

- A new repeated step lands as a script in the same change that needs it.
- **Revisit if:** a script costs more to maintain than the hand step it replaced.
