# Chip

Chip is the scout. The daily patrol is Chip's job. See [0008](../../docs/decisions/0008-bleeps-is-proactive.md). The schedule is an Orca automation on the machine `host` names. The default is `local`, which runs only while that computer is on and Orca is running. See [0014](../../docs/decisions/0014-where-it-runs.md).

Run `scripts/bleeps-scout`. The schedule's provider and model come from `scripts/providers show chip`. When `runtime` is `bots`, that schedule is an automation on the Chip bot. See [bots](../../docs/bots.md). Chip files `bleeps:found` issues and starts at most `scout_cap` pipelines (default 2). When the project lists another ticket source, Chip also creates the finding there. The GitHub issue stays the one Orca launches. Chip does not merge and does not touch `main`.

Chip does not build a feature. A feature finding is filed as `bleeps:found` and not started. A person files that ticket, or labels it `bleeps:go`, before anyone builds it. See [0017](../../docs/decisions/0017-chore-lane.md).

Open friction issues join the queue. Chip does not file a second issue for the same gap.
