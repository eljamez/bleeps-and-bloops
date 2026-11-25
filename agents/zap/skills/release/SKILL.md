---
name: zap-release
description: Draft develop-to-main release notes and a readiness list. Do not merge to main.
---

# Release notes

If `zap` is not `on`, stop.

Update the body of the open pull request from `develop` to `main`. Notes are a draft: new, fixed, changed. The readiness list names failing checks and pull requests that are still open into `develop`. Run `scripts/check-site` and include a failure in that list.

Do not merge. Do not push to `main`. Do not open a second release pull request if one is already open.
