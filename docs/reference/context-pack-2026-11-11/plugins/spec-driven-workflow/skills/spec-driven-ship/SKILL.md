---
name: spec-driven-ship
description: >
  This skill should be used when the user asks to "ship issue #12", "open
  the PR", "ship this", or a verify.md exists with a "ready to ship"
  verdict and it's time to push the branch and open the pull request.
metadata:
  version: "0.1.0"
---

Open the pull request. This is the last automated stage — it never merges
anything itself.

## Steps

1. Confirm `specs/<id>/verify.md` exists and its verdict is "ready to
   ship". If it's missing or says "needs work", stop and say so — don't
   ship unverified work.

2. Push the branch: `git push -u origin <branch>`.

3. Open the PR against the target branch recorded in `CLAUDE.md`'s
   `## Spec-driven workflow` section (never assume `main`):

   ```
   gh pr create --base <target-branch> --title "<ticket-id>: <title>" --body "<generated>"
   ```

   Build the body from `spec.md` and `tasks.md`: the problem statement, the
   acceptance criteria with checkmarks from `verify.md`, and a short list
   of what changed. Link the source issue (`Closes #<issue-number>` if the
   repo convention auto-closes issues on merge, otherwise a plain link).

4. Comment on the source GitHub issue linking the new PR, so the loop
   closes on the system it started in.

5. If the change is deploy-sensitive (env vars, feature flags, migrations),
   suggest running the `engineering:deploy-checklist` skill before merge.

## Non-negotiable

Never merge the PR, and never enable auto-merge on it, regardless of CI
status or how confident the verify pass was. Report the PR URL and stop —
human review and merge is required every time.
