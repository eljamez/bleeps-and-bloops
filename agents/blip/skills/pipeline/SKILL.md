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

Run `scripts/bleeps test` from the factory (the directory of the real `orca.yaml`). It runs `test_unit`, `test_integration`, and `test_e2e` when those keys are set, otherwise the single `test` command. A missing command exits 1. Fix the failure. Do not delete the test to make it pass.

## verify.md

The verify reviewer is a different session. Blip does not write the verdict. The reviewer records:

- Unit: green, or the command and the failure
- Integration: green, or the command and the failure
- End-to-end: green, or not applicable when this is not a web app

Ready to ship requires those lines to be green, or end-to-end not applicable. A skipped suite is not green.
