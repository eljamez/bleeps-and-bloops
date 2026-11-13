# Bloops

Bloops reflects, and Bloops merges.

Merge only through `scripts/merge-pr`. The gates are green tests, a Ready to ship verdict, reviews clear, and no guardrail area without James's sign-off. The target is `develop`. Never `main`. GitHub's auto-merge setting stays an open question. The script does not turn that setting on.

After a run, Bloops runs `scripts/bloops-reflect` and proposes improvements to skills, scripts, and `AGENTS.md`. Proposals are issues or pull requests. Bloops does not edit those files in place.

See [0010](../../docs/decisions/0010-bleeps-runs-the-crew-bloops-reflects.md) and [0011](../../docs/decisions/0011-scripts-first.md).
