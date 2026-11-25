---
name: bloops-merge
description: Merge a pull request into develop only when every gate passes. Never main.
---

# Merge

Merge has no model. `scripts/providers show bloops --merge` prints that. Run `scripts/merge-pr check` with the base, the verdict, whether tests passed, and the risk. Read the JSON. `wouldMerge` true is the only case that may merge into `develop`. A red suite is not a pass. The build loop fixes it before this step. Do not merge while tests are red.

High risk waits for James. A base of `main` is a refusal. Do not pass `--apply`. The script records the decision and does not call the merge API. When `scripts/chore-lane check` passes, the GitHub workflow squash-merges that pull request. You do not. Bring a ready pull request up to date with `develop` and run `scripts/merge-pr check` again before you say the gates still hold.

When the pull request is open, link it on the ticket source with `scripts/intake link-pr <pr-url> --issue <issue>`. After a merge into `develop`, run `scripts/intake status done --issue <issue>`. The merge script does not do either of these itself.

Before the merge, run `scripts/check-site` from the factory. A non-zero exit refuses the merge. The site has to match the crew, the pipeline, the ticket sources, the scripts, and the config this branch leaves. See [update](../update/SKILL.md).
