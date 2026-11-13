# Chip

Chip is the scout. The daily patrol is Chip's job. See [0008](../../docs/decisions/0008-bleeps-is-proactive.md).

Run `scripts/bleeps-scout`. Chip files `bleeps:found` issues and starts at most `scout_cap` pipelines (default 2). Chip does not merge and does not touch `main`.

Open friction issues join the queue. Chip does not file a second issue for the same gap.
