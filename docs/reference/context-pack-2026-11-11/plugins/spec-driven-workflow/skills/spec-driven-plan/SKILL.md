---
name: spec-driven-plan
description: >
  This skill should be used when the user asks to "plan issue #12", "design
  this spec", "write the technical plan for spec X", or a spec.md already
  exists and the user wants the technical approach worked out before
  breaking it into tasks.
metadata:
  version: "0.1.0"
---

Turn an approved spec into `specs/<id>/design.md` — the (optional) second
stage of the pipeline. Skip this skill entirely for small, contained
changes; go straight from spec to `spec-driven-tasks`.

## Steps

1. Locate `specs/<id>/spec.md`. If it doesn't exist, tell the user to run
   `spec-driven-specify` first.

2. Check the spec's `status`. If it's still `draft`, ask for explicit
   confirmation before proceeding — don't silently treat an unreviewed
   spec as approved, unless the user has already said this is a trivial,
   full-auto ticket.

3. Judge whether this stage is needed at all. Use it when the *approach* is
   the risky part: a new architecture or technology choice, a non-trivial
   service/API/data design, changes spanning multiple modules. Skip it for
   small, well-understood changes and say so — go straight to
   `spec-driven-tasks` instead.

4. If writing it, produce `specs/<id>/design.md`:

   ```markdown
   # Design — <title>

   ## Technical approach
   ## Files / modules touched
   ## Data or schema changes
   ## API contract changes
   ## Sequencing
   ## Risks / open questions
   ```

5. For a real architecture or technology decision, tell the user this is a
   good candidate for the `engineering:architecture` skill (produces an
   ADR) or `engineering:system-design` skill (API/service/data design), and
   link the resulting doc from `design.md` once they've run it.

6. Stop here. Report that design is ready and the next step is
   `spec-driven-tasks`.
