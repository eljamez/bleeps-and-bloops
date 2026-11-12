# Open questions

- Draft the core `orca.yaml`.
- Watch the Orca conditional hooks issue.
- Whether there is a grooming or prioritization step before kick-off. See [flow](flow.md).

## Resolved

- **Merge policy.** Resolved in [0003: Gitflow auto-merge to develop](decisions/0003-gitflow-auto-merge-to-develop.md). Feature PRs from agents target `develop` and may auto-merge once verified safe. Only James merges `develop` into `main`. Agents never touch `main`. Label rules can still restrict which tickets auto-merge.

## Unresolved conflicts

Conflicts between the [2026-11-11 context pack](reference/context-pack-2026-11-11/README.md) and the current plan ([0002](decisions/0002-rebuild-factory-clean.md)):

- **Runtime.** The pack is Claude Code plugins calling `gh` directly. The current plan is an Orca harness with `orca.yaml` hooks owning setup, verify, and merge.
- **Engineering plugin.** Whether the separate `engineering` plugin is needed (code-review, architecture, system-design, deploy-checklist skills).
- **Newer workflow.** Whether a newer `spec-driven-workflow` exists on the owner's machine.
