---
name: spec-driven-verify
description: >
  This skill should be used when the user asks to "verify issue #12",
  "check this is ready to ship", "run the verify pass", or implementation
  is done and needs an independent check before opening a PR.
metadata:
  version: "0.1.0"
---

Run an independent verification pass over completed work, before shipping.
This must not be a continuation of the same context that implemented the
code — use the `spec-reviewer` subagent for the actual review so it isn't
grading its own homework.

## Steps

1. Confirm `specs/<id>/tasks.md` has no unblocked unchecked tasks. If it
   does, tell the user `spec-driven-implement` isn't finished yet.

2. Invoke the `spec-reviewer` subagent, giving it: the ticket ID, the repo,
   the branch, and pointers to `specs/<id>/spec.md` and the diff against
   the target branch. Do not pre-summarize the diff for it — let it read
   the actual code.

3. The reviewer will:
   - Run the full test suite, linter, and typecheck (the whole thing, not
     just what changed).
   - Walk every acceptance criterion in `spec.md`, ticking `- [x]` what's
     actually met with a one-line note of how (test name, file, or manual
     step), and flagging what isn't.
   - Apply the `engineering:code-review` skill's checklist to the full
     diff: correctness, security, N+1s/injection risks, missing edge
     cases, error handling.

4. Collect its findings into `specs/<id>/verify.md`:

   ```markdown
   # Verify — <title>

   ## Acceptance criteria
   ## Test / lint / typecheck results
   ## Code review findings
   ## Verdict
   Ready to ship | Needs work — <list of gaps>
   ```

5. Report the verdict back to the user. If there are gaps, do not
   automatically loop back into `spec-driven-implement` — tell the user
   what's unmet and let them decide whether to re-run implement for the
   specific gap or address it manually. Automatic looping here defeats the
   point of an independent check.
