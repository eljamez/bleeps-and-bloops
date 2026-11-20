---
name: buzz-implement
description: Implement tasks.md in the worktree. Do not certify the result.
---

# Implement

Run `scripts/providers show buzz` before a fresh launch. Add `--guardrail` when the diff touches auth, billing, payments, data deletion, or migrations. Work the checklist in `tasks.md`. Stay inside the spec. You may run `scripts/bleeps test` while you work. When Blip sends a red suite back, fix the product code and hand it to Blip. Do not edit a test to make it pass, and do not delete one.

Do not write `verify.md`. Do not merge. Do not certify the work. When the tasks are done, hand the branch to Blip, then to Echo.
