---
name: blip-triage
description: Triage a CI failure as flaky or real. A flaky test is never skipped.
---

# Triage

When a check fails on `develop` or on a pull request, label the failure flaky or real.

A real failure goes back to Buzz. Use the fix loop. Do not merge while the suite is red.

A flaky test stays in the suite. Say so in the weekly digest. Never skip it, and do not add `it.skip`, `test.skip`, `test.fixme`, or a pytest skip to make CI green. A quarantine draft from Boop keeps the test running. A broken test is not quarantined.
