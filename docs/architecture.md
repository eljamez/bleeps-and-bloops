# Architecture

- Bleeps is built for Orca. The factory config is the shared [`orca.yaml`](../orca.yaml). See [0007](decisions/0007-bleeps-is-built-for-orca.md) and [0001](decisions/0001-shared-factory-config.md).
- `issueCommand` is the kick-off. `scripts/intake` is how a GitHub issue, a GitHub Project item, a Jira issue, a Discord message, or a Linear issue becomes that kick-off. GitHub access is required on every project. See [0013](decisions/0013-one-ticket-many-sources.md) and [tickets](tickets.md).
- `scripts.setup` installs dependencies when a worktree is created. How to run it: [where it runs](where-it-runs.md).
- Blip owns tests. The role is [agents/blip](../agents/blip). A red suite loops in the run until green, up to `fix_rounds`. Green tests are still the merge gate. See [0009](decisions/0009-testing-is-a-gate-blip-owns-tests.md) and [0012](decisions/0012-red-suite-loops.md).
- Chip files issues and starts the pipeline. The schedule is an Orca automation. See [0008](decisions/0008-bleeps-is-proactive.md).
- The crew is Beep, Buzz, Blip, Echo, Chip, Ping, Boop, Bloops, and Zap. Bleeps runs them. Zap is off unless `zap` is `on`. See [0010](decisions/0010-bleeps-runs-the-crew-bloops-reflects.md) and [0017](decisions/0017-chore-lane.md).
- Repeated work is a script. See [0011](decisions/0011-scripts-first.md).
- Project install, test, and typecheck live in `orca.project.yaml`. Orca does not merge that file. The setup script reads it.
- Ping reviews pull requests into `develop` when `runtime` is `bots`. `review_external` defaults to `none` and installs nothing. CodeRabbit, Devin, and an architecture-fit review are not started by `orca.yaml`. Count a review only when it actually ran.
- Layered reviewers: CodeRabbit (style + obvious bugs), Devin (end-to-end), Claude Code (architecture fit).
- Orca is the harness (MIT). It runs Claude Code, Grok, and others in isolated worktrees. The factory default is Claude Code, one model per role. See [0015](decisions/0015-role-providers.md).
- Where it runs is a choice. `host` in `orca.project.yaml` is `local` (default, the computer in front of you), `cloud` (a VPS), or `home` (a machine at home). A home server is optional. GitHub Actions can run checks. It cannot run Orca. See [0014](decisions/0014-where-it-runs.md) and [where it runs](where-it-runs.md). RAM: 8GB floor, 16GB comfortable, on the machine that runs the agents.
- Controller mapping (USB game controller via Karabiner-Elements): TTS toggle, Enter, Tab, Escape. D-pad for arrows. Skip number keys.
