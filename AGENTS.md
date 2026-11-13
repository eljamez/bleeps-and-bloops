# Bleeps

Bleeps runs the crew and gets the work done. Bloops is the agent that merges and reflects. Bleeps and Bloops is the brand. Outputs do not need a name.

Scripts first. Repeated work is a script under `scripts/` or `bleeps`. Prefer the script. The second time a step is done by hand, propose a script. See [0011](docs/decisions/0011-scripts-first.md).

The agent that writes code does not certify it.

Open the page that owns the task:

- [Flow](docs/flow.md)
- [Architecture](docs/architecture.md)
- [Decisions](docs/decisions/README.md) — veto list; read it before proposing a new primitive
- [Orca config](orca.yaml) — factory config, built for Orca. See [0007](docs/decisions/0007-bleeps-is-built-for-orca.md)
- [Crew](docs/decisions/0010-bleeps-runs-the-crew-bloops-reflects.md) — Beep, Buzz, Blip, Echo, Chip, Bloops
- [Beep](agents/beep/ROLE.md) — plans. No product code.
- [Buzz](agents/buzz/ROLE.md) — implements. Does not certify.
- [Blip](agents/blip/ROLE.md) — tests. Green tests are a gate.
- [Echo](agents/echo/ROLE.md) — verifies. Read-only on product code.
- [Chip](agents/chip/ROLE.md) — scout.
- [Bloops](agents/bloops/ROLE.md) — merges and reflects.
- [Home server](docs/home-server.md)
- [Primitives](docs/primitives.md)
- [Using Bleeps](docs/using-bleeps.md)
- [Friction log](docs/friction-log.md)
- [Ship a PR](docs/ship-pr.md)
- [Control CLI](docs/control-cli.md)
