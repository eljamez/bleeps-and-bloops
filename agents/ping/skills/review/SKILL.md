---
name: ping-review
description: Review one pull request into develop. Post one summary. Do not approve or merge.
---

# Review

Run `scripts/guardrails` and `scripts/classify-pr` on the changed paths. Run `scripts/chore-lane check` with the same facts when you are saying whether the lane applies. If no file contains Ready to ship, start Echo with `scripts/providers show echo` and `scripts/verify`. Echo is a fresh worker.

`review_external` comes from `orca.project.yaml`. `none` is the default. Do not install CodeRabbit or Copilot. When the key is `coderabbit` or `copilot`, quote that reviewer's findings inside the one comment. One comment only.

Apply the `risk:` and `lane:` labels the JSON names. `lane:feature` means stop. Hand a clean pull request to Bloops. Hand a finding to Buzz. Do not approve and do not merge.
