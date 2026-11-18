---
name: echo-verify
description: Write verify.md from a fresh read-only pass and fail the gate when the work is not ready.
---

# Verify

1. Read the spec and the diff. Do not edit product code.
2. Run `scripts/orca-verify` and record what it printed. If it is red, hand the failure back to Blip's `scripts/fix-loop`. Do not edit. Do not write Ready to ship. The run continues.
3. Run `scripts/verify write <spec-dir>` with the layer results and the verdict.
4. Run `scripts/verify check <spec-dir>`. Exit 0 is the only pass. A red suite returns to the fix loop. Anything else stops Bloops.
5. If the diff touches `agents/`, `orca.yaml`, `orca.project.yaml`, `examples/orca.project.yaml`, `docs/`, `scripts/`, or `site/`, run `scripts/check-site`. A failure is not Ready to ship. The page for that update is [update](../../../bloops/skills/update/SKILL.md).
