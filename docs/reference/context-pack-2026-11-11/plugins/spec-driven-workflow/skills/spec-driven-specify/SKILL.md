---
name: spec-driven-specify
description: >
  This skill should be used when the user asks to "specify issue #12",
  "write a spec for this ticket", "turn this GitHub issue into a spec",
  points at a GitHub issue URL or number and wants a spec written, or says
  "start the spec-driven workflow for this issue".
metadata:
  version: "0.1.0"
---

Turn a GitHub issue into `specs/<issue-number>-<slug>/spec.md` — the first
stage of the spec-driven pipeline. Requires `spec-driven-setup` to have run
already in this repo (check `CLAUDE.md` for a `## Spec-driven workflow`
section; if missing, tell the user to run that skill first).

## Steps

1. Resolve the ticket. Accept a full GitHub issue URL or a bare number.
   Fetch it: `gh issue view <number> --json title,body,labels,comments,url,number`.

2. Derive a short kebab-case slug from the title. Create
   `specs/<issue-number>-<slug>/` if it doesn't exist.

3. Write `specs/<issue-number>-<slug>/ticket.md`: the raw title, body,
   labels, comments, and the issue URL — verbatim, this is the record of
   what was asked for.

4. Explore the codebase enough to ground the spec — read the files/modules
   the ticket references or that are obviously relevant. Don't write any
   application code in this step.

5. Write `specs/<issue-number>-<slug>/spec.md` with this structure:

   ```markdown
   ---
   status: draft
   ---
   # <title>

   ## Problem statement
   ## Goals
   ## Non-goals
   ## User stories
   - As a ___, I want to ___, so that ___.
   ## Requirements
   | # | Requirement | Acceptance criteria | Priority |
   |---|---|---|---|
   ## Non-functional requirements
   ## Status log
   - <date> — drafted from #<issue-number>
   ```

   Every requirement row must be testable and have explicit acceptance
   criteria — a requirement without acceptance criteria isn't done, it's
   still an idea. Priority is must / should / could.

6. Stop here. Do not automatically continue to `spec-driven-plan`. Tell the
   user the spec is ready for review, and that for anything non-trivial
   they should read it and flip `status: draft` to `status: approved` in
   the frontmatter before implementation starts. Small, well-understood
   fixes (typos, small bugs) can proceed without the approval gate if the
   user says so explicitly — don't assume that on their behalf.
