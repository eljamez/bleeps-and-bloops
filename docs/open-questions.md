# Open questions

- Draft the core `orca.yaml`.
- Watch the Orca conditional hooks issue.

Unresolved conflicts between the [2026-11-11 context pack](reference/context-pack-2026-11-11/README.md) and the current plan ([0002](decisions/0002-rebuild-factory-clean.md)):

- **Merge policy.** The pack says the pipeline never merges. The current plan allows label-gated auto-merge (tests/docs first; DB/auth stay manual).
- **Runtime.** The pack is Claude Code plugins calling `gh` directly. The current plan is an Orca harness with `orca.yaml` hooks owning setup, verify, and merge.
- **Engineering plugin.** Whether the separate `engineering` plugin is needed (code-review, architecture, system-design, deploy-checklist skills).
- **Newer workflow.** Whether a newer `spec-driven-workflow` exists on the owner's machine.
