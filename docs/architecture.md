# Architecture

- Bleeps is built for Orca. The factory config is the shared [`orca.yaml`](../orca.yaml). See [0007](decisions/0007-bleeps-is-built-for-orca.md) and [0001](decisions/0001-shared-factory-config.md).
- `issueCommand` is the kick-off. `scripts.setup` installs dependencies when a worktree is created. How to run it: [home server](home-server.md).
- Blip owns tests. The role is [agents/blip](../agents/blip). Green tests are a gate. See [0009](decisions/0009-testing-is-a-gate-blip-owns-tests.md).
- A scout files issues and starts the pipeline. The schedule is an Orca automation. See [0008](decisions/0008-bleeps-is-proactive.md).
- Project install, test, and typecheck live in `orca.project.yaml`. Orca does not merge that file. The setup script reads it.
- Grok Bot on the side for long-running watches (PR queue, failing CI, review nudges).
- Layered reviewers: CodeRabbit (style + obvious bugs), Devin (end-to-end), Claude Code (architecture fit).
- Orca is the harness (MIT). It runs Claude Code, Grok, and others in isolated worktrees.
- Home server (older computer, SSH from a Mac). RAM: 8GB floor, 16GB comfortable.
- Controller mapping (USB game controller via Karabiner-Elements): TTS toggle, Enter, Tab, Escape. D-pad for arrows. Skip number keys.
