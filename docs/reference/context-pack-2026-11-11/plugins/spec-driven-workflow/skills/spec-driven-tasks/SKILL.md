---
name: spec-driven-tasks
description: >
  This skill should be used when the user asks to "break this into tasks",
  "create the task list for issue #12", "turn this spec into tasks", once a
  spec.md (and optionally design.md) exists and is ready to be implemented.
metadata:
  version: "0.1.0"
---

Turn a spec (and design, if one exists) into `specs/<id>/tasks.md` — the
scaffold the implement loop executes against.

## Steps

1. Read `specs/<id>/spec.md`, and `specs/<id>/design.md` if present. If
   neither exists, tell the user to run `spec-driven-specify` first.

2. Write `specs/<id>/tasks.md` as a flat, ordered checklist:

   ```markdown
   # Tasks — <title>

   - [ ] <atomic task description> (Req #<n>)
   - [ ] <atomic task description> (Req #<n>)
   ```

3. Each task must be:
   - Atomic — one focused change, not a bundle of unrelated edits.
   - Independently testable — there's a clear way to check it worked.
   - Traceable — tagged with the requirement ID(s) from `spec.md` it
     satisfies. A task that doesn't map to a requirement shouldn't exist;
     either the spec is missing something or the task is scope creep.

4. Order tasks so earlier ones unblock later ones (schema/data changes
   before the endpoints that use them, before the UI that calls them).

5. Report the task count and ask if the user wants to start
   `spec-driven-implement` now, or review the list first.
