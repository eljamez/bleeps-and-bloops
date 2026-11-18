# Tickets

One ticket shape. One intake path. GitHub stays the place code, pull requests, and CI live, and the issue Orca launches from. A project chooses any of these sources in `orca.project.yaml`:

| Source | What a ticket is | Status write-back | Pull request |
| --- | --- | --- | --- |
| `github` | A GitHub issue | Label `bleeps:in-progress`, or close | Comment |
| `github-project` | An issue on a GitHub Project | The project's Status field | Comment on the issue |
| `jira` | A Jira issue | A workflow transition | Comment |
| `linear` | A Linear issue (`ENG-12` or a UUID) | A workflow state | Attachment |
| `discord` | A message in one channel | A reply. Discord has no status field | A reply |

`github` is always allowed. The others run only when `ticket_sources` lists them. Omitting the key means `github`.

The normalized ticket is `source`, `id`, `url`, `title`, `body`, `status` (`open`, `in_progress`, `done`), and `labels`. `scripts/intake fetch` writes that as `ticket.json` and `ticket.md` inside the spec folder.

## Config

Keys live in `orca.project.yaml`. Orca does not read that file. A key ending in `_env` is the name of an environment variable. The secret stays in the environment.

```text
ticket_sources: github, jira
github_token_env: GH_TOKEN
github_repo: owner/name
github_project_owner: owner
github_project_number: 1
jira_base_url: https://example.atlassian.net
jira_email_env: JIRA_EMAIL
jira_token_env: JIRA_API_TOKEN
jira_project: PROJ
discord_token_env: DISCORD_BOT_TOKEN
discord_channel_id: "123"
discord_guild_id: "456"
linear_api_key_env: LINEAR_API_KEY
linear_team: ENG
```

`github_repo` can be omitted when `origin` is the GitHub repository. `discord_guild_id` can be omitted; the stored URL is then the API URL, not a channel link. `github_token_env` can be omitted when `gh auth login` or `GH_TOKEN` already works.

`scripts/check-ticket-sources` checks the file, then GitHub, then each configured source. It exits 2 when GitHub access is missing. `--config-only` checks the file and does not call the network. That is what `scripts/check-orca` runs. The live check needs the real credentials, on the machine that will do the work.

## Commands

```text
python3 scripts/check-ticket-sources
python3 scripts/intake fetch jira PROJ-12 --slug latch
python3 scripts/intake fetch github 12 --slug latch
python3 scripts/intake status in_progress --issue 12
python3 scripts/intake link-pr https://github.com/owner/name/pull/4 --issue 12
python3 scripts/ticket-jira fetch PROJ-12
```

`scripts/intake` is the path the crew uses. The `scripts/ticket-*` scripts are the same adapters, one source each. `fetch` without `--issue` mirrors a non-GitHub ticket to a GitHub issue labelled `bleeps:intake` and then runs `scripts/kick-off`. `--dry-run` prints the ticket and does not write. `--fixture path` parses a saved response instead of calling the API.

Beep's step in `issueCommand`: if the issue body has a `Source-Id` line, fetch that source with `--issue` set to the GitHub issue. Otherwise run `scripts/kick-off` as before.

## Chip

Chip files `bleeps:found` on GitHub. That issue is what Orca starts. When `ticket_sources` lists anything besides `github`, Chip also creates the finding there: a Jira task, a Linear issue, a Discord message, or an item on the GitHub Project. The body names the GitHub issue number. A source that fails is skipped and the GitHub issue stays. Open `friction` issues join the GitHub queue and are not copied.

A dry run prints `would post finding to <source>` and does not call the API.

## What the aliases cover

Jira and GitHub Project status names that match are: to do, todo, backlog, open, in progress, in development, in review, done, closed, complete, completed. Jira also falls back to the status category (`new`, `indeterminate`, `done`). Linear uses the state type: `unstarted` or `backlog`, `started`, `completed`. A canceled Linear issue is `done` and labelled `canceled`.

A name that is not in that list becomes `open`, and the command says so. A status write with no matching transition exits 3 and prints the names the API returned. There is no per-project rename table yet.

## What is not verified live

`scripts/check-tickets` parses fixture responses and never calls GitHub, Jira, Discord, or Linear. These still need a real credential on the home server:

- `gh auth login` (or `GH_TOKEN`) can read the repo and open issues.
- `scripts/check-ticket-sources` against that repo, with each source you turn on.
- A fetch, a status change, and a pull request link on one real ticket per source.
- A GitHub Project whose Status field uses other option names than Todo, In Progress, and Done.
- Jira workflows whose transition names are not in the alias list.
- Discord, if tickets are forum posts or threads rather than channel messages. This adapter reads one channel's messages.
- Orca launching a workspace from a mirrored `bleeps:intake` issue.
- Chip posting a finding to a live non-GitHub source.

Draft GitHub Project items that are not issues are not fetched. Project membership looks at the first 100 items.
