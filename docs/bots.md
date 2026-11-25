# Run the crew as Orca bots

Optional. The default stays `issueCommand`: Orca sends that prompt when a workspace launches from a GitHub issue. Set `runtime: bots` in `orca.project.yaml` when you want the crew as [Orca Bots](https://orca.dev/docs/bots) in one group. `runtime` omitted means `issue-command`.

The steps for a project of yours are [Set up the crew as Orca bots](bots-setup.md). This page is the command reference those steps follow. The prompt you paste into Bleeps is [bots/bootstrap-prompt.md](../bots/bootstrap-prompt.md). `python3 scripts/bots prompt` prints it.

Bots launched in Orca 1.4.265 on 2026-11-19. They live in Orca's store on one computer (`SOUL.md`, `MEMORY.md`, chats), not in `orca.yaml`. This repo holds starter souls and the skills a linked project exposes. `python3 scripts/bots print` prints the commands below and does not run them. `python3 scripts/bots check` fails when a soul, a skill link, or a command in this page drifts.

On this repo the owner is James. On yours, you are. The scripts still say James where they already escalate to the owner.

## What does not change

The gates stay the scripts: `scripts/intake`, `scripts/guardrails`, `scripts/fix-loop`, `scripts/orca-verify`, `scripts/verify`, `scripts/merge-pr`, `scripts/classify-pr`, `scripts/chore-lane`, `scripts/providers`, `scripts/check-site`. The writer never certifies. Echo is a fresh worker, not a bot. Nothing merges while the suite is red. Pull requests target `develop`. `main` is the owner's. Sign-off areas (auth, billing, payments, data deletion, migrations) wait for the owner. See [0016](decisions/0016-orca-bots.md) and [0017](decisions/0017-chore-lane.md).

Chip and Boop do not build a feature. They file a `bleeps:found` issue and stop. A person files the ticket or labels `bleeps:go` before anyone builds it. `scripts/classify-pr` is the check. `scripts/chore-lane` refuses a feature.

The chore lane is off unless `chore_lane` is `on`. This repo turns it on. The GitHub workflow merges a pass. Bloops does not. `review_external` defaults to `none` and installs nothing. Zap is off unless `zap` is `on`.

## Before you start

Orca on the latest version, on the computer `host` names. Claude Code or another supported agent is signed in there. The bot's work counts against that plan. Sign in to Orca before a GitHub, Linear, or Slack connector. Chat and schedules work signed out. Read [Bot security](https://orca.dev/docs/bots/security) before anyone else can ask a bot.

`host` is `local` (default), `cloud`, or `home`. See [where it runs](where-it-runs.md). A bot runs only while that computer is awake and Orca is running. Requests wait up to a day. To keep the group reachable, pair a server you leave on and create the bots on that machine. A paired window cannot create a bot on the server yet. At least one member of the group has to live on the computer that hosts the group. Post from that computer's window. Boop's 02:00 run uses that computer's clock. Set the clock to Pacific Time.

## Create the bots

In the app: Bots, +, New bot or group, New bot. Make Bleeps first. Give it the purpose below, pick the computer and the agent, then press Create. Nothing exists until you do.

The offer commands show a card in a bot's chat. They create nothing until you press Create bot. Run them from Bleeps' own chat, not from the group room. A room does not show the card. Skip Zap's offer unless `zap` is `on`.

```text
orca bot create --offer --name bleeps --purpose "Coordinates the crew in one group and does not do their jobs."
orca bot create --offer --name beep --purpose "Plans the ticket into spec.md and tasks.md and writes no product code."
orca bot create --offer --name buzz --purpose "Implements the tasks in a worker worktree and does not certify the result."
orca bot create --offer --name blip --purpose "Owns the suites, runs the fix loop, and triages a CI failure as flaky or real."
orca bot create --offer --name chip --purpose "Scouts on a schedule, files bleeps:found issues, and does not build a feature."
orca bot create --offer --name ping --purpose "Reviews every pull request into develop, posts one summary, and does not approve or merge."
orca bot create --offer --name boop --purpose "Opens one chore pull request at a time and does not build a feature."
orca bot create --offer --name bloops --purpose "Merges when the owner asks, or leaves a qualifying chore to the lane workflow, then reflects."
orca bot create --offer --name zap --purpose "Drafts the develop to main release notes when zap is on, and does not merge to main."
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
orca bot look-around set --bot ping --off
orca bot look-around set --bot boop --off
orca bot look-around set --bot bloops --off
orca bot look-around set --bot zap --off
orca bot look-around set --bot bleeps --on --every every-4h --weekdays-only
orca bot look-around set --bot chip --on --every every-4h --weekdays-only
```

Memory upkeep can stay at its default, or you can turn it off in the same settings. Do not let it store a standing instruction that came from an issue, a message, or a webhook.

## GitHub

Run this from each bot's chat. It shows a Connect card. Nothing connects until you finish it.

```text
orca bot connectors --offer github
```

Install the Orca app on the repositories the bot may work in. Replies where the bot was asked come from the Orca app. Other GitHub work, including `gh` and git pushes, uses your login. The bot is told to approve, request changes, or merge only when you ask. Orca does not enforce that. `scripts/merge-pr` and `scripts/chore-lane` do. The lane merge is a GitHub workflow with its own app token, not the bot. See [chore lane setup](chore-lane-setup.md).

Before saving an automation, list the events that bot can hear. The list grows when you add a connector:

```text
orca automations trigger-options --bot bleeps
```

## One group

No documented CLI creates a group. In the app: Bots, +, New bot or group, New group. Name it Bleeps. Members, in handoff order: bleeps, beep, buzz, blip, chip, ping, boop, bloops. Zap joins only when `zap` is `on`. Echo is not a member. Names have to be distinct. At least one member lives on the computer that hosts the group.

Inside the room, mention a bot with `@Name`. The same handoff from a bot's own chat:

```text
orca orchestration send --to bot:beep --type handoff --subject "Plan" --body "Plan the ticket. Run scripts/kick-off or scripts/intake. Write no product code."
orca orchestration send --to bot:buzz --type handoff --subject "Build" --body "Implement tasks.md in a worker worktree. Do not certify."
orca orchestration send --to bot:blip --type handoff --subject "Test" --body "Run scripts/fix-loop. A red suite stays in this run. Triage a CI failure as flaky or real. Never skip a flaky test."
orca orchestration send --to bot:ping --type handoff --subject "Review" --body "Review the pull request. Run scripts/classify-pr and scripts/guardrails. Start Echo if there is no verdict. Post one summary. Do not approve or merge."
orca orchestration send --to bot:boop --type handoff --subject "Chore" --body "Open one chore pull request. Run scripts/classify-pr. If the class is feature, file bleeps:found and stop. Do not build a feature."
orca orchestration send --to bot:bloops --type handoff --subject "Merge" --body "Bring the pull request up to date with develop and run scripts/merge-pr check. Merge only when the owner asked. If scripts/chore-lane check passes, the workflow merges, not you."
orca orchestration send --to bot:zap --type handoff --subject "Release" --body "If zap is off, stop. Draft the develop to main notes. Do not merge to main."
orca orchestration send --to bot:bleeps --type handoff --subject "Issue" --body "A scout finding is ready. Run the crew. Do not start issueCommand. If it is a feature, do not build it."
```

Order: Bleeps coordinates. Beep plans. Buzz builds. Blip runs `scripts/fix-loop` and triages a CI failure as flaky or real. A real failure goes back to Buzz. A flaky test is never skipped. Bleeps starts Echo. Ping reviews every pull request into `develop` and does not approve or merge. Boop opens one chore pull request and does not build a feature. Bloops merges only when the owner says so, then reflects. When the lane passes, the workflow merges. Chip patrols on a schedule and hands findings to Bleeps. A feature finding is not handed off. Chip does not wait for the label.

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

A label, comment, or push from the owner's own GitHub login does not start the bot, because the bot acts as that login. The exception Orca documents is `github.pr_opened` with `from=me`, which this label is not. Someone else can apply `bleeps:go`. Chip, running as a bot, hands the issue to Bleeps with the send command above instead of adding the label. Chip does not add `bleeps:go` to a feature.

Linear's `bot:<handle>` label asks that bot. It is not this pipeline's trigger, and this factory does not mirror tickets onto it. Slack can reach a bot, and it is not a ticket source. Those three are open. See [open questions](open-questions.md).

## Chip's schedule

Chip takes the scout automation that `scripts/bleeps-scout schedule` prints for `runtime: issue-command`. With `runtime: bots`, that same command prints a bot automation instead: `--bot chip`, `--name "Bleeps scout"`, `--runs-in new`, the provider and model from `scripts/providers show chip`, and `--trigger` / `--time` from `scout_schedule` and `scout_time`. `--precheck` is `scripts/bleeps-scout precheck` in this checkout. Copy it from `python3 scripts/bots print`. Create the Chip bot before `schedule --install`.

The scout still files `bleeps:found` issues. It does not start an `issueCommand` worktree. It runs `orca orchestration send --to bot:bleeps` for each issue it starts. A finding whose key starts with `feature` is filed and not started.

## Ping, Boop, Blip, Bloops, Zap

Ping has two rules because a pull request you open does not wake a bot unless the rule says `from=me`. Renovate is the other rule. Run `orca automations trigger-options --bot ping` first. If both fire, Ping posts one summary and stops.

```text
orca automations create \
  --bot ping \
  --name "Ping review mine" \
  --on "github.pr_opened in=<owner/repo> from=me" \
  --prompt "Review this pull request into develop. Run scripts/guardrails and scripts/classify-pr. Start Echo if there is no Ready to ship verdict. Gather external findings only when review_external is coderabbit or copilot. Post one summary comment and the risk and lane labels. Do not approve or merge." \
  --disabled
orca automations create \
  --bot ping \
  --name "Ping review others" \
  --on "github.pr_opened in=<owner/repo>" \
  --prompt "Review this pull request into develop if you did not open it. Run scripts/guardrails and scripts/classify-pr. Start Echo if there is no Ready to ship verdict. Gather external findings only when review_external is coderabbit or copilot. Post one summary comment and the risk and lane labels. Do not approve or merge." \
  --disabled
```

`review_external` is `none`, `coderabbit`, or `copilot`. `none` is the default. It installs nothing.

Boop's host clock is Pacific Time. Monday is a digest and does not open a pull request.

```text
orca automations create \
  --bot boop \
  --name "Boop nightly" \
  --trigger daily --time 02:00 \
  --prompt "Run one chore. scripts/classify-pr decides the class. If the class is feature, file a bleeps:found issue and stop. Do not build a feature. Open at most one pull request. Do not merge." \
  --disabled
orca automations create \
  --bot boop \
  --name "Boop Monday digest" \
  --trigger weekly --time 09:00 \
  --prompt "Post the Monday chore digest. Do not open a pull request from the digest. Do not build a feature." \
  --disabled
```

Blip posts the flaky digest. A CI rule uses whatever event `trigger-options --bot blip` lists. Do not invent one here. The digest does not need that event.

```text
orca automations create \
  --bot blip \
  --name "Blip flaky digest" \
  --trigger weekly --time 09:00 \
  --prompt "Post the weekly flaky-test digest. A flaky test is never skipped. Do not quarantine by skipping." \
  --disabled
```

Bloops wakes when someone else applies `bleeps:ready`. Your own label does not start the bot.

```text
orca automations create \
  --bot bloops \
  --name "Bloops ready" \
  --on "github.labeled in=<owner/repo> label=bleeps:ready" \
  --prompt "Bring this pull request up to date with develop. Run scripts/merge-pr check. Merge only when James says so. If scripts/chore-lane check passes, do not merge. The workflow merges the lane. Then reflect." \
  --disabled
```

Skip Zap unless `zap` is `on`.

```text
orca automations create \
  --bot zap \
  --name "Zap release notes" \
  --trigger weekdays --time 09:00 \
  --prompt "zap is off unless orca.project.yaml sets zap: on. If it is off, stop. Keep the develop to main pull request body as draft notes and a readiness list. Do not merge to main." \
  --disabled
```

## Models and Echo

`python3 scripts/providers show <role>` prints the provider and model. Pass them to the worker. Do not store a model in bot memory. A project override (`buzz_model`, and the same for the other roles) shows up the next time you print.

```text
orca orchestration worker-start --task <taskId> --worktree new-child --agent claude --model opus --json
orca orchestration worker-start --task <taskId> --worktree new-child --agent claude --model sonnet --json
orca orchestration worker-start --task <taskId> --worktree new-child --agent claude --model haiku --json
```

Beep and Echo are opus. Buzz, Blip, Ping, Boop, Zap, and Bloops' reflection are sonnet. Chip is haiku. Those are the factory rows. Bloops merges with `scripts/merge-pr` and no model. Skip Zap's worker unless `zap` is `on`.

Echo is a fresh Claude Code worker per verify, not a bot and not a reused chat. Start the opus line above with a prompt to read `agents/echo/ROLE.md` and run `scripts/verify`. Echo is read-only on product code. `verify.md` names the writer and the verifier. Both GitHub accounts are yours, so the file is how a later reader tells them apart.

## Known limits

- Bots are new. A run can stop partway after a restart or a usage limit. The chat history is on that computer. Finish or hand the work on in the group.
- Bots act as the owner's `gh` login for anything that is not the reply in the thread where they were asked. `verify.md` and the run record have to name the writer and the verifier. The lane merge uses a GitHub App so the push is not that login. See [0017](decisions/0017-chore-lane.md).
- "Merge only when the owner asks" is a prompt Orca gives every bot. It is not a lock. `scripts/merge-pr` is the lock for a merge the owner asked for. `scripts/chore-lane` is the lock for the lane. The workflow merges. The bot does not.
- Your own GitHub and Linear actions do not start an event automation, except `github.pr_opened` with `from=me`.
- Full access is the default until you change it.
- Look around and memory upkeep spend plan usage while Orca is running on the bot's computer.
- A bot group offer card does not render. Ask for a new bot from that bot's Home chat.
