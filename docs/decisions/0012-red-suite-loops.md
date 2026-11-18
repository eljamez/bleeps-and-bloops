# 0012: A red suite loops; it does not stop the run

- **Status:** accepted
- **Date:** 2026-11-18
- **Narrows:** [0009](0009-testing-is-a-gate-blip-owns-tests.md) — green tests still gate the merge. A red suite no longer ends the run.

## Context

0009 made a green suite a hard gate for auto-merge. The kick-off prompt treated a red suite as a stop, so the run died before anyone fixed it. The round limit's number was also unchosen: the same prompt asked James before a third pass on the same finding, and did not say what a pass was.

## Decision

A red suite goes back to the same run. Buzz fixes product code. Blip fixes the test when the test itself is wrong. Blip runs `scripts/fix-loop` again. The loop ends when the suite is green, and the run continues to Echo, the pull request, and the merge gates.

Nothing merges while the suite is red. Echo, in a fresh session, is still the only verdict. The agent that writes the fix does not certify it. Buzz does not edit a test to make it pass. Blip does not edit product code to make it pass.

`fix_rounds` in `orca.project.yaml` is the cap. It defaults to 2, which is the old "ask before a third pass": two send-backs, and the next red escalates. The script prints a summary for James and exits 2. That run does not open a pull request and does not merge. Exit 3 means red with a round left, and the run continues. Exit 0 means green. The value must be an integer from 0 to 20.

`scripts/fix-loop` runs `scripts/orca-verify` (the suite and typecheck) and keeps the count in `.bleeps/fix-loop.json`, which is not committed. A green run deletes it. If Echo's own verify is red, the orchestrator goes back to this loop. Any other not-ready verdict still stops before a pull request. Guardrails still stop immediately.

## Consequences

- The open round-limit question is settled for this loop. A project that wants a different cap sets `fix_rounds`.
- A loop that cannot converge escalates with a summary. It does not exit quietly and it does not merge.
- **Revisit if:** a project needs a separate cap for findings that are not a red suite, or Orca grows a hook that can run this loop without the prompt.
