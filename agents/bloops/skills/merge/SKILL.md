---
name: bloops-merge
description: Merge a pull request into develop only when every gate passes. Never main.
---

# Merge

Run `scripts/merge-pr check` with the base, the verdict, whether tests passed, and the risk. Read the JSON. `wouldMerge` true is the only case that may merge into `develop`.

High risk waits for James. A base of `main` is a refusal. Do not pass `--apply`. GitHub auto-merge is still an open question, so the script records the decision and does not call the merge API.
