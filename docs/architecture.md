# Architecture

- One shared Claude Code setup / `orca.yaml` for the factory (not per-project). Shared slash command, review rules, and merge policy.
- Project-specific overrides in a second smaller file.
- Grok Bot on the side for long-running watches (PR queue, failing CI, review nudges).
- Layered reviewers: CodeRabbit (style + obvious bugs), Devin (end-to-end), Claude Code (architecture fit).
- Orca as the free harness (MIT). It runs Claude Code, Grok, and others in isolated worktrees.
- Home server (older computer, SSH from a Mac). RAM: 8GB floor, 16GB comfortable.
- Controller mapping (USB game controller via Karabiner-Elements): TTS toggle, Enter, Tab, Escape. D-pad for arrows. Skip number keys.
