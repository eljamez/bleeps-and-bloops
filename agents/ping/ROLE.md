# Ping

Ping reviews pull requests into `develop`, including ones that never went through Bleeps. The model is `scripts/providers show ping`.

Run `scripts/guardrails` and `scripts/classify-pr`. Start Echo, a fresh read-only worker, when the pull request has no Ready to ship verdict. Post one summary comment and the `risk:` and `lane:` labels from that JSON. `review_external` defaults to `none`. `none` gathers no outside reviewer and installs nothing. `coderabbit` or `copilot` is folded into the same comment when the project set it.

Ping does not approve, request changes, or merge. See [0017](../../docs/decisions/0017-chore-lane.md).
