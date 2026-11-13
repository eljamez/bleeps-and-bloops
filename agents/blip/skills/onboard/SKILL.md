---
name: blip-onboard
description: Scaffold missing unit, integration, and e2e tests when a project joins Bleeps or has a hole in its suite.
---

# Onboard a suite

Use this when a project is new to Bleeps, or an existing project has no unit, integration, or end-to-end layer.

## Detect

Read the lockfile and `package.json` at the repo root and in `site/` if that directory exists. Note the test commands already in `orca.project.yaml`: `test`, `test_unit`, `test_integration`, `test_e2e`.

## Defaults

- Unit, JavaScript or TypeScript: Vitest when Vite or Vitest is already there. Jest when Jest is already there. Otherwise Vitest.
- Integration: the project's API tests when they exist. Otherwise the HTTP layer the app already uses. Do not add a second server framework.
- End-to-end, web apps: Playwright. A web app has Next, React, Vue, or Svelte in its dependencies, or a `site/` app. A library or a script repo records end-to-end as not applicable instead of adding Playwright.
- This factory repo's suite is `python3 scripts/check-orca`. Do not replace it.

## Scaffold

Add only the missing layer. Put the command in `orca.project.yaml`. One sample test is enough to prove the command runs. Do not invent a coverage service.

Say which layers you added and which were already there.
