# Run the crew as Orca bots

Optional. The default stays `issueCommand`: Orca sends that prompt when a workspace launches from a GitHub issue. Set `runtime: bots` in `orca.project.yaml` when you want the crew as [Orca Bots](https://orca.dev/docs/bots) in one group. `runtime` omitted means `issue-command`.

Bots launched in Orca 1.4.265 on 2026-11-19. They live in Orca's store on one computer (`SOUL.md`, `MEMORY.md`, chats), not in `orca.yaml`. This repo holds starter souls and the skills a linked project exposes. `python3 scripts/bots print` prints the commands below and does not run them. `python3 scripts/bots check` fails when a soul, a skill link, or a command in this page drifts.

On this repo the owner is James. On yours, you are. The scripts still say James where they already escalate to the owner.

## What does not change

The gates stay the scripts: `scripts/intake`, `scripts/guardrails`, `scripts/fix-loop`, `scripts/orca-verify`, `scripts/verify`, `scripts/merge-pr`, `scripts/providers`, `scripts/check-site`. The writer never certifies. Echo is a fresh worker, not a bot. Nothing merges while the suite is red. Pull requests target `develop`. `main` is the owner's. Sign-off areas (auth, billing, payments, data deletion, migrations) wait for the owner. See [0016](decisions/0016-orca-bots.md).

## Before you start

Orca on the latest version, on the computer `host` names. Claude Code or another supported agent is signed in there. The bot's work counts against that plan. Sign in to Orca before a GitHub, Linear, or Slack connector. Chat and schedules work signed out. Read [Bot security](https://orca.dev/docs/bots/security) before anyone else can ask a bot.

`host` is `local` (default), `cloud`, or `home`. See [where it runs](where-it-runs.md). A bot runs only while that computer is awake and Orca is running. Requests wait up to a day. To keep the group reachable, pair a server you leave on and create the bots on that machine. A paired window cannot create a bot on the server yet. At least one member of the group has to live on the computer that hosts the group. Post from that computer's window.

## Create the bots

In the app: Bots, +, New bot or group, New bot. Make Bleeps first. Give it the purpose below, pick the computer and the agent, then press Create. Nothing exists until you do.

The offer commands show a card in a bot's chat. They create nothing until you press Create bot. Run them from Bleeps' own chat, not from the group room. A room does not show the card.

```text
orca bot create --offer --name bleeps --purpose "Coordinates the crew in one group and does not do their jobs."
orca bot create --offer --name beep --purpose "Plans the ticket into spec.md and tasks.md and writes no product code."
orca bot create --offer --name buzz --purpose "Implements the tasks in a worker worktree and does not certify the result."
orca bot create --offer --name blip --purpose "Owns the suites and runs the fix loop while the suite is red."
orca bot create --offer --name chip --purpose "Scouts on a schedule, files bleeps:found issues, and does not merge."
orca bot create --offer --name bloops --purpose "Merges through scripts/merge-pr only when the owner asks, then proposes improvements as pull requests."
```

`--purpose` becomes the first line of that bot's `SOUL.md`. After Create, paste `bots/<name>/SOUL.md` from this repo over the bot's `SOUL.md`. That file is plain Markdown in the bot's folder. Reflection does not write bot memory. Improvements to skills go out as pull requests.

## Link the repository

In each bot's settings, link this repository so its chats load the project's skills. There is no documented CLI flag for that link. `orca repo list` shows the projects Orca already knows.

Orca reads `.agents/skills`, and if that folder has any skill it does not also read `.claude/skills`. A skill folder may be a symlink. `SKILL.md` itself must be a real file with `name` and `description` in the frontmatter. A `SKILL.md` that is a symlink is ignored. This repo links each `agents/<role>/skills/<name>` directory into `.agents/skills/<name>`. `scripts/bots check` fails when a skill is missing, extra, or pointed at the wrong place.

## Permissions

Orca's default for a new bot is Full access. Do not leave it. There is no CLI flag for the mode. In the bot's settings:

- Ask for approval on every bot that reads issues, mail, or messages. That is the whole crew.
- Accept edits on a worker session. The worker is the only place that writes the repository.
- Some agents have no approval modes and always run in Full access. Pick Claude Code or Codex when you need a prompt.

Whoever asked the bot can approve. Add people under Who can ask only if you would trust them at your keyboard. Their requests use your access.

## Look around

Look around is read-only and spends the agent's plan. Orca schedules it every 4 hours from 8 AM to 8 PM on weekdays unless you change it. Leave it on for Bleeps and Chip. Turn it off for the others. Run each line from that bot's chat:

```text
orca bot look-around set --bot beep --off
orca bot look-around set --bot buzz --off
orca bot look-around set --bot blip --off
orca bot look-around set --bot bloops --off
orca bot look-around set --bot bleeps --on --every every-4h --weekdays-only
orca bot look-around set --bot chip --on --every every-4h --weekdays-only
```

Memory upkeep can stay at its default, or you can turn it off in the same settings. Do not let it store a standing instruction that came from an issue, a message, or a webhook.

## GitHub

Run this from each bot's chat. It shows a Connect card. Nothing connects until you finish it.

```text
orca bot connectors --offer github
```

Install the Orca app on the repositories the bot may work in. Replies where the bot was asked come from the Orca app. Other GitHub work, including `gh` and git pushes, uses your login. The bot is told to approve, request changes, or merge only when you ask. Orca does not enforce that. `scripts/merge-pr` does.

Before saving an automation, list the events that bot can hear. The list grows when you add a connector:

```text
orca automations trigger-options --bot bleeps
```

## One group

No documented CLI creates a group. In the app: Bots, +, New bot or group, New group. Name it Bleeps. Members, in handoff order: bleeps, beep, buzz, blip, chip, bloops. Echo is not a member. Names have to be distinct. At least one member lives on the computer that hosts the group.

Inside the room, mention a bot with `@Name`. The same handoff from a bot's own chat:

```text
orca orchestration send --to bot:beep --type handoff --subject "Plan" --body "Plan the ticket. Run scripts/kick-off or scripts/intake. Write no product code."
orca orchestration send --to bot:buzz --type handoff --subject "Build" --body "Implement tasks.md in a worker worktree. Do not certify."
orca orchestration send --to bot:blip --type handoff --subject "Test" --body "Run scripts/fix-loop. A red suite stays in this run."
orca orchestration send --to bot:bloops --type handoff --subject "Merge" --body "Merge only through scripts/merge-pr, and only because the owner asked."
orca orchestration send --to bot:bleeps --type handoff --subject "Issue" --body "A scout finding is ready. Run the crew. Do not start issueCommand."
```

Order: Bleeps coordinates. Beep plans. Buzz builds. Blip runs `scripts/fix-loop`. Bleeps starts Echo. Bloops merges only when the owner says so, then reflects. Chip patrols on a schedule and hands findings to Bleeps. Chip does not wait for the label.

## The start label

`bleeps:go` on a GitHub issue is the trigger. Replace `<owner/repo>`. Save it disabled, then enable it in Orca once `trigger-options` lists `github.labeled`.

```text
orca automations create \
  --bot bleeps \
  --name "Bleeps go" \
  --on "github.labeled in=<owner/repo> label=bleeps:go" \
  --prompt "A GitHub issue was labelled bleeps:go. Run the crew on that issue. Do not start a second crew from issueCommand." \
  --disabled
```

A label, comment, or push from the owner's own GitHub login does not start the bot, because the bot acts as that login. The exception Orca documents is `github.pr_opened` with `from=me`, which this label is not. Someone else can apply `bleeps:go`. Chip, running as a bot, hands the issue to Bleeps with the send command above instead of adding the label.

Linear's `bot:<handle>` label asks that bot. It is not this pipeline's trigger, and this factory does not mirror tickets onto it. Slack can reach a bot, and it is not a ticket source. Those three are open. See [open questions](open-questions.md).

## Chip's schedule

Chip takes the scout automation that `scripts/bleeps-scout schedule` prints for `runtime: issue-command`. With `runtime: bots`, that same command prints a bot automation instead: `--bot chip`, `--name "Bleeps scout"`, `--runs-in new`, the provider and model from `scripts/providers show chip`, and `--trigger` / `--time` from `scout_schedule` and `scout_time`. `--precheck` is `scripts/bleeps-scout precheck` in this checkout. Copy it from `python3 scripts/bots print`. Create the Chip bot before `schedule --install`.

The scout still files `bleeps:found` issues. It does not start an `issueCommand` worktree. It runs `orca orchestration send --to bot:bleeps` for each issue it starts.

## Models and Echo

`python3 scripts/providers show <role>` prints the provider and model. Pass them to the worker. Do not store a model in bot memory. A project override (`buzz_model`, and the same for the other roles) shows up the next time you print.

```text
orca orchestration worker-start --task <taskId> --worktree new-child --agent claude --model opus --json
orca orchestration worker-start --task <taskId> --worktree new-child --agent claude --model sonnet --json
orca orchestration worker-start --task <taskId> --worktree new-child --agent claude --model haiku --json
```

Beep and Echo are opus. Buzz, Blip, and Bloops' reflection are sonnet. Chip is haiku. Those are the factory rows. Bloops merges with `scripts/merge-pr` and no model.

Echo is a fresh Claude Code worker per verify, not a bot and not a reused chat. Start the opus line above with a prompt to read `agents/echo/ROLE.md` and run `scripts/verify`. Echo is read-only on product code. `verify.md` names the writer and the verifier. Both GitHub accounts are yours, so the file is how a later reader tells them apart.

## Known limits

- Bots are new. A run can stop partway after a restart or a usage limit. The chat history is on that computer. Finish or hand the work on in the group.
- Bots act as the owner's `gh` login for anything that is not the reply in the thread where they were asked. `verify.md` and the run record have to name the writer and the verifier.
- "Merge only when the owner asks" is a prompt Orca gives every bot. It is not a lock. `scripts/merge-pr` is the lock. Bloops' soul says the same, and only James's ask (on your project, yours) is a reason to run it.
- Your own GitHub and Linear actions do not start an event automation, except `github.pr_opened` with `from=me`.
- Full access is the default until you change it.
- Look around and memory upkeep spend plan usage while Orca is running on the bot's computer.
- A bot group offer card does not render. Ask for a new bot from that bot's Home chat.
