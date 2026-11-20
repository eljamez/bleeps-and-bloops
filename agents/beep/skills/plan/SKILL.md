---
name: beep-plan
description: Plan a ticket into spec.md, optional design.md, and tasks.md. No product code.
---

# Plan

1. Run `scripts/providers show beep` and use those flags if this session is a fresh launch. Then, if the issue body has a `Source-Id` line, run `scripts/intake fetch <source> <id> --slug <slug> --issue <issue>`. Otherwise run `scripts/kick-off <issue> <slug>`. Add `--design` only when the approach is risky.
2. `ticket.md` is the normalized ticket. Fill it from the issue when intake did not.
3. Write `spec.md` with status draft, then approved when it is the spec to build.
4. Write `tasks.md` as a checklist that includes test tasks for Blip.
5. Stop. Buzz implements. Echo certifies.
