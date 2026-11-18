---
name: blip-pipeline
description: During a ticket, put tests in tasks.md, write them for the change, and require green unit, integration, and e2e in verify.md.
---

# Tests in the pipeline

Use this while a ticket is in the build loop.

## tasks.md

Every behavior change has a test task. A change with no test task is unfinished.

## Write the tests

Extend the suite that covers the change. Unit for logic, integration for the API or data boundary, end-to-end for a web flow the user can click. Match the project's existing style.

Run `scripts/fix-loop` from the factory (the directory of the real `orca.yaml`). It runs `scripts/orca-verify`: `test_unit`, `test_integration`, and `test_e2e` when those keys are set, otherwise the single `test` command, then typecheck. A missing test command exits non-zero. That is a red suite, not a skip.

Exit 0 means green. Continue, and let Echo write the verdict. Exit 3 means red, with a fix round left. Do not stop the run. If the test is wrong, fix the test and run `scripts/fix-loop` again. If the product is wrong, hand the failure to Buzz and run `scripts/fix-loop` again after Buzz's fix. Do not edit product code. Do not delete a test to make it pass. You do not certify the fix.

Exit 2 means `fix_rounds` is spent. The default is 2, from `orca.project.yaml`. Escalate to James with the summary the script printed. Do not open a pull request and do not merge. Nothing merges while the suite is red.

## verify.md

The verify reviewer is a different session. Blip does not write the verdict. The reviewer records:

- Unit: green, or the command and the failure
- Integration: green, or the command and the failure
- End-to-end: green, or not applicable when this is not a web app

Ready to ship requires those lines to be green, or end-to-end not applicable. A skipped suite is not green. If Echo's run of the suite is red, the orchestrator returns to this loop. Echo does not fix the code.
