---
name: echo-verify
description: Write verify.md from a fresh read-only pass and fail the gate when the work is not ready.
---

# Verify

1. Read the spec and the diff. Do not edit product code.
2. Run `scripts/orca-verify` and record what it printed.
3. Run `scripts/verify write <spec-dir>` with the layer results and the verdict.
4. Run `scripts/verify check <spec-dir>`. Exit 0 is the only pass. Anything else stops Bloops.
