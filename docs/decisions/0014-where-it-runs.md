# 0014: Where it runs is a choice

- **Status:** accepted
- **Date:** 2026-11-18

## Context

The setup docs assumed a home server: an always-on machine, reached by SSH, with Orca installed on it. That is one way to run [Orca](https://orca.dev/docs/ways-to-run). It is not the usual one. Orca's own map is a local desktop, an SSH host, a remote Orca server (`orca serve` or the desktop app on a machine you leave on), and an experimental per-workspace environment recipe. Many people who adopt this will only have the computer in front of them.

The factory stays Orca. [0007](0007-bleeps-is-built-for-orca.md) is unchanged. `orca.yaml` has no schedule key. Chip is an Orca automation, and that automation is stored on an Orca process. The process has to be running for the schedule to fire and for a worktree to start. GitHub Actions can run the project's checks. It cannot send `issueCommand` or own the automation. Orca does not sell a hosted runner that replaces the machine.

## Decision

Where the factory runs is a choice, recorded as `host` in `orca.project.yaml`. The values are `local` (the default), `cloud`, and `home`. The same `orca.yaml` and the same scripts run in all three. A home server is the `home` value. It is optional.

`local` is the computer in front of you. The factory runs only while that computer is on and Orca is running. Orca's create path stores one catch-up (`run_once_within_grace`) and a grace of 720 minutes. `scripts/bleeps-scout schedule` does not pass `--missed-run-grace-minutes`, so that default applies. Wake the computer inside the window, leave it awake, and Orca starts that one run. It does not replay each missed day. Past the window the occurrence is `skipped_missed`, and the next run is the next scheduled time. A wake that goes straight back to sleep does not start the run. Tickets are GitHub issues. They stay open while the computer is off. They are not a queue on the machine. The next scout does not drain tickets you filed yourself.

`cloud` is a VPS you control. `home` is a machine at home. Leave it on, install Orca there, and register Chip there. Reach it on a private network. Do not publish the port.

A value outside those three is an error. GitHub Actions is not a host. An `environmentRecipes` entry boots a disposable environment for one worktree, and only when an Orca process is already running. It does not replace `host`. This factory sets no recipe. `host` is not an Orca host id, and the schedule command does not pass `--host`.

## Consequences

- Setup for a new project and an existing project starts from `local` unless the project file says otherwise.
- [0008](0008-bleeps-is-proactive.md) still schedules Chip with `orca automations create`. The machine that registers it is the one `host` names.
- **Revisit if:** Orca can own `issueCommand` and the scout schedule with no machine you run.
