---
name: blip-coverage
description: In the proactive scout, find missing test layers and flaky tests, then file or fix them.
---

# Coverage and flakes

Use this from the scout, or when asked to find holes in the suite.

## What the script already flags

`scripts/bleeps-scout` files `bleeps:found` issues for:

- `coverage:none` when no test command is configured
- `coverage:e2e` when a web app has no `test_e2e` and no Playwright config
- `tests:flaky` when the test command fails once and passes on the immediate retry
- `tests:fail` when it fails twice

The flake check is two runs back to back. It is not a history of the suite.

## What Blip adds

Read the finding. If the fix is a missing layer, use the onboard skill and open the pull request through the normal pipeline. If the test is flaky, reproduce it, fix the race or the order dependency, and keep the test. Do not mark it skipped.

A guardrail path still waits for James. Green tests do not override that.
