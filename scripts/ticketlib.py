"""Normalized tickets and the per-source adapters behind scripts/intake.

One ticket shape. GitHub, GitHub Projects, Jira, Discord, and Linear all
parse into it. scripts/intake is the path into kick-off. The adapter
scripts (scripts/ticket-*) are the same functions with a source fixed.

Credentials are environment variables. orca.project.yaml stores the
variable name. This module never writes a secret and does not print one.

ponytail: status names are an alias list, not a per-project map. A name
the list does not know becomes status open, and the caller is told.
Upgrade path: keys such as jira_status_in_progress in orca.project.yaml.
GitHub Project membership is the first 100 items. Upgrade path: paginate.
Discord tickets are channel messages, not forum posts.
Jira descriptions keep the text and drop the formatting.
"""

from __future__ import annotations

import base64
import importlib.machinery
import importlib.util
import json
import re
import shutil
import subprocess
import sys
import urllib.error
import urllib.request
from pathlib import Path

SOURCES = ("github", "github-project", "jira", "discord", "linear")
STATUSES = ("open", "in_progress", "done")
FIELDS = ("source", "id", "url", "title", "body", "status", "labels")

# Lowercased tracker names -> normalized status.
STATUS_NAMES = {
    "open": "open",
    "to do": "open",
    "todo": "open",
    "backlog": "open",
    "selected for development": "open",
    "unstarted": "open",
    "in progress": "in_progress",
    "in development": "in_progress",
    "in review": "in_progress",
    "started": "in_progress",
    "doing": "in_progress",
    "done": "done",
    "closed": "done",
    "complete": "done",
    "completed": "done",
    "resolved": "done",
    "canceled": "done",
    "cancelled": "done",
}

ENV_NAME = re.compile(r"^[A-Z][A-Z0-9_]*$")
SECRET_PREFIXES = ("ghp_", "github_pat_", "gho_", "xoxb-", "xoxp-", "xoxa-", "lin_api_", "ATATT")

GITHUB_REQUIRED = (
    "GitHub is required. Code, pull requests, and CI live on GitHub, "
    "whatever the ticket source is. "
    "Run `gh auth login`, or set the token env named by github_token_env "
    "(default GH_TOKEN) to a token that can read this repo and open issues and pull requests."
)

REQUIRED_KEYS = {
    "github-project": ("github_project_owner", "github_project_number"),
    "jira": ("jira_base_url", "jira_email_env", "jira_token_env", "jira_project"),
    "discord": ("discord_token_env", "discord_channel_id"),
    "linear": ("linear_api_key_env", "linear_team"),
}

ENV_KEYS = (
    "github_token_env",
    "jira_email_env",
    "jira_token_env",
    "discord_token_env",
    "linear_api_key_env",
)


class TicketError(Exception):
    def __init__(self, message: str, code: int = 1) -> None:
        super().__init__(message)
        self.code = code


def load_script(filename: str):
    path = Path(__file__).resolve().parent / filename
    name = "bleeps_" + filename.replace("-", "_")
    loader = importlib.machinery.SourceFileLoader(name, str(path))
    spec = importlib.util.spec_from_loader(name, loader)
    if spec is None:
        raise TicketError(f"cannot load scripts/{filename}")
    module = importlib.util.module_from_spec(spec)
    loader.exec_module(module)
    return module


def project_of(root: Path) -> dict[str, str]:
    return load_script("bleeps").load_project(root)


def make_ticket(source: str, ticket_id: object, url: str, title: str, body: str, status: str, labels: list) -> dict:
    if source not in SOURCES:
        raise TicketError(f"unknown source {source}")
    if status not in STATUSES:
        raise TicketError(f"unknown status {status}")
    text_id = str(ticket_id).strip()
    if not text_id:
        raise TicketError("ticket id is empty")
    clean = [str(label) for label in labels if str(label)]
    ticket = {
        "source": source,
        "id": text_id,
        "url": url or "",
        "title": title or "",
        "body": body or "",
        "status": status,
        "labels": clean,
    }
    missing = [key for key in FIELDS if key not in ticket]
    if missing:
        raise TicketError(f"ticket missing {missing}")
    return ticket


def status_from_name(name: str) -> tuple[str, str | None]:
    """Map a tracker status label to open, in_progress, or done.

    The second value is a note when the name is not in the alias list.
    """
    key = (name or "").strip().lower()
    if not key:
        return "open", None
    found = STATUS_NAMES.get(key)
    if found:
        return found, None
    return "open", f"status name {name!r} is not in the map; using open"


def sources_of(project: dict[str, str]) -> list[str]:
    raw = project.get("ticket_sources", "github")
    chosen = [part.strip() for part in raw.split(",") if part.strip()]
    if not chosen:
        chosen = ["github"]
    unknown = [item for item in chosen if item not in SOURCES]
    if unknown:
        raise TicketError(
            f"unknown ticket source {unknown[0]}. Expected one of {', '.join(SOURCES)}."
        )
    return chosen


def outbound_sources(project: dict[str, str]) -> list[str]:
    """Sources Chip posts a finding to, after the GitHub issue exists.

    Plain GitHub issues are the launch handle, so they are not posted again.
    A GitHub Project still receives the issue. Friction issues are not copied.
    """
    return [source for source in sources_of(project) if source != "github"]


def validate_project(project: dict[str, str]) -> None:
    chosen = sources_of(project)
    for source in chosen:
        for key in REQUIRED_KEYS.get(source, ()):
            if not project.get(key):
                raise TicketError(
                    f"orca.project.yaml is missing {key} for ticket source {source}."
                )
    for key in ENV_KEYS:
        value = project.get(key)
        if not value:
            continue
        if not ENV_NAME.match(value):
            raise TicketError(
                f"orca.project.yaml: {key} must be an environment variable name, not the secret. Got {value!r}."
            )
    for key, value in project.items():
        for prefix in SECRET_PREFIXES:
            if value.startswith(prefix):
                raise TicketError(
                    f"orca.project.yaml: {key} looks like a secret ({prefix}…). Store the env var name, not the value."
                )
    repo = project.get("github_repo")
    if repo and not re.fullmatch(r"[^/\s]+/[^/\s]+", repo):
        raise TicketError(f"github_repo must look like owner/name, not {repo!r}.")
    base = project.get("jira_base_url")
    if base:
        if not base.startswith("https://") or "@" in base:
            raise TicketError("jira_base_url must be an https URL with no user or password in it.")
    number = project.get("github_project_number")
    if number and not number.isdigit():
        raise TicketError("github_project_number must be the project number, digits only.")
    channel = project.get("discord_channel_id")
    if channel and not channel.isdigit():
        raise TicketError("discord_channel_id must be the channel id, digits only.")
    guild = project.get("discord_guild_id")
    if guild and not guild.isdigit():
        raise TicketError("discord_guild_id must be digits only.")
    team = project.get("linear_team")
    if team and not re.fullmatch(r"[A-Za-z0-9_-]+", team):
        raise TicketError(f"linear_team must be the team key, not {team!r}.")


def need_env(env: dict[str, str], name: str) -> str:
    if not name:
        raise TicketError("a credential env var name is missing from orca.project.yaml")
    value = env.get(name, "")
    if not value:
        raise TicketError(
            f"{name} is not set. Put the secret in the environment, not in orca.project.yaml."
        )
    return value


def github_token_names(project: dict[str, str]) -> list[str]:
    names = []
    if project.get("github_token_env"):
        names.append(project["github_token_env"])
    for name in ("GH_TOKEN", "GITHUB_TOKEN"):
        if name not in names:
            names.append(name)
    return names


def github_access(project: dict[str, str], env: dict[str, str], which, gh_status) -> tuple[bool, str]:
    for name in github_token_names(project):
        if env.get(name):
            return True, f"token env {name} is set"
    if which("gh") and gh_status() == 0:
        return True, "gh auth status"
    return False, GITHUB_REQUIRED


def parse_github_remote(url: str) -> str:
    text = url.strip()
    match = re.search(r"github\.com[:/]([^/\s]+)/([^/\s]+?)(?:\.git)?$", text)
    if not match:
        raise TicketError(f"origin is not a GitHub repo URL: {text}")
    return f"{match.group(1)}/{match.group(2)}"


def github_repo(project: dict[str, str], root: Path, runner) -> str:
    if project.get("github_repo"):
        return project["github_repo"]
    result = runner(["git", "remote", "get-url", "origin"], cwd=root)
    if result.returncode != 0:
        raise TicketError(
            "No github_repo in orca.project.yaml and no origin remote. GitHub is required."
        )
    return parse_github_remote(result.stdout)


def request_json(method: str, url: str, headers: dict[str, str], payload=None, transport=None):
    if transport is not None:
        return transport(method, url, headers, payload)
    data = None if payload is None else json.dumps(payload).encode()
    req = urllib.request.Request(url, data=data, headers=headers, method=method)
    try:
        with urllib.request.urlopen(req, timeout=30) as response:
            raw = response.read().decode()
    except urllib.error.HTTPError as error:
        detail = error.read().decode(errors="replace")[:300]
        raise TicketError(f"HTTP {error.code} from {url.split('?', 1)[0]}: {detail}") from None
    except urllib.error.URLError as error:
        raise TicketError(f"request failed for {url.split('?', 1)[0]}: {error.reason}") from None
    if not raw:
        return {}
    try:
        return json.loads(raw)
    except json.JSONDecodeError as error:
        raise TicketError(f"response from {url.split('?', 1)[0]} was not JSON") from error


def graphql_data(payload: dict) -> dict:
    errors = payload.get("errors") if isinstance(payload, dict) else None
    if errors:
        message = errors[0].get("message", "graphql error") if isinstance(errors[0], dict) else "graphql error"
        raise TicketError(message)
    data = payload.get("data") if isinstance(payload, dict) else None
    return data or {}


def bearer(token: str) -> dict[str, str]:
    return {
        "Authorization": f"Bearer {token}",
        "Accept": "application/json",
        "Content-Type": "application/json",
    }


def jira_headers(email: str, token: str) -> dict[str, str]:
    raw = base64.b64encode(f"{email}:{token}".encode()).decode()
    return {
        "Authorization": f"Basic {raw}",
        "Accept": "application/json",
        "Content-Type": "application/json",
    }


def discord_headers(token: str) -> dict[str, str]:
    return {"Authorization": f"Bot {token}", "Content-Type": "application/json", "Accept": "application/json"}


def read_github_token(project: dict[str, str], env: dict[str, str], runner) -> str:
    for name in github_token_names(project):
        if env.get(name):
            return env[name]
    result = runner(["gh", "auth", "token"], cwd=None)
    token = (result.stdout or "").strip()
    if result.returncode == 0 and token:
        return token
    raise TicketError(GITHUB_REQUIRED, code=2)


def adf_text(node) -> str:
    if isinstance(node, str):
        return node
    if not isinstance(node, dict):
        return ""
    chunks = []
    if node.get("type") == "text":
        chunks.append(node.get("text") or "")
    for child in node.get("content") or []:
        chunks.append(adf_text(child))
    text = "".join(chunks)
    if node.get("type") in {"doc", "paragraph", "heading", "listItem"}:
        return text + "\n"
    return text


def jira_doc(text: str) -> dict:
    return {
        "type": "doc",
        "version": 1,
        "content": [
            {"type": "paragraph", "content": [{"type": "text", "text": text}]},
        ],
    }


def label_names(raw_labels) -> list[str]:
    names = []
    for label in raw_labels or []:
        if isinstance(label, dict):
            name = label.get("name") or ""
        else:
            name = str(label)
        if name:
            names.append(name)
    return names


def parse_github_issue(raw: dict) -> dict:
    labels = label_names(raw.get("labels"))
    state = (raw.get("state") or "open").lower()
    status = "done" if state == "closed" else "open"
    if status == "open" and "bleeps:in-progress" in labels:
        status = "in_progress"
    number = raw.get("number")
    if number is None:
        raise TicketError("GitHub issue payload has no number")
    return make_ticket(
        "github",
        number,
        raw.get("html_url") or raw.get("url") or "",
        raw.get("title") or "",
        raw.get("body") or "",
        status,
        labels,
    )


def parse_github_project(raw: dict) -> dict:
    """Joined fixture or a pre-fetched view: issue plus project membership."""
    if not raw.get("on_project"):
        number = (raw.get("issue") or {}).get("number", "")
        raise TicketError(f"issue {number} is not on the configured GitHub Project")
    ticket = parse_github_issue(raw["issue"])
    status_name = raw.get("status_name") or ""
    status, note = status_from_name(status_name) if status_name else (ticket["status"], None)
    if note:
        print(note, file=sys.stderr)
    ticket["source"] = "github-project"
    ticket["status"] = status
    return ticket


def parse_project_items(payload: dict) -> tuple[str, str, list[dict], list[dict]]:
    """Return project id, status field id, options, and items from a project query."""
    data = graphql_data(payload) if "data" in payload or "errors" in payload else payload
    project = None
    for owner_key in ("user", "organization"):
        node = data.get(owner_key) or {}
        if node.get("projectV2"):
            project = node["projectV2"]
            break
    if not project and data.get("node"):
        project = data["node"]
    if not project:
        raise TicketError("GitHub Project was not found for that owner and number")
    field = project.get("field") or {}
    options = field.get("options") or []
    items = []
    for item in ((project.get("items") or {}).get("nodes") or []):
        content = item.get("content") or {}
        number = content.get("number")
        if number is None:
            continue
        value = item.get("fieldValueByName") or {}
        items.append(
            {
                "item_id": item.get("id") or "",
                "number": number,
                "status_name": value.get("name") or "",
            }
        )
    return project.get("id") or "", field.get("id") or "", options, items


def parse_jira(raw: dict, base_url: str) -> dict:
    fields = raw.get("fields") or {}
    key = raw.get("key")
    if not key:
        raise TicketError("Jira payload has no key")
    category = ((fields.get("status") or {}).get("statusCategory") or {}).get("key")
    status = {"new": "open", "indeterminate": "in_progress", "done": "done"}.get(category or "", "open")
    base = base_url.rstrip("/")
    return make_ticket(
        "jira",
        key,
        f"{base}/browse/{key}",
        fields.get("summary") or "",
        adf_text(fields.get("description")).strip(),
        status,
        label_names(fields.get("labels")),
    )


def parse_linear_node(node: dict) -> dict:
    if not node:
        raise TicketError("Linear issue was not found")
    identifier = node.get("identifier") or node.get("id")
    if not identifier:
        raise TicketError("Linear payload has no identifier")
    state = node.get("state") or {}
    kind = state.get("type") or ""
    status = {"started": "in_progress", "completed": "done", "canceled": "done"}.get(kind, "open")
    labels = label_names((node.get("labels") or {}).get("nodes"))
    if kind == "canceled" and "canceled" not in labels:
        labels.append("canceled")
    return make_ticket(
        "linear",
        identifier,
        node.get("url") or "",
        node.get("title") or "",
        node.get("description") or "",
        status,
        labels,
    )


def parse_discord(raw: dict, channel_id: str, guild_id: str) -> dict:
    message_id = str(raw.get("id") or "")
    if not message_id:
        raise TicketError("Discord payload has no message id")
    content = raw.get("content") or ""
    first, _, rest = content.partition("\n")
    title = (first.strip() or f"discord {message_id}")[:80]
    body = rest.strip() if rest else content
    if guild_id:
        url = f"https://discord.com/channels/{guild_id}/{channel_id}/{message_id}"
    else:
        url = f"https://discord.com/api/v10/channels/{channel_id}/messages/{message_id}"
    return make_ticket("discord", message_id, url, title, body, "open", [])


def pick_named(options: list[dict], status: str) -> dict | None:
    wanted = [name for name, mapped in STATUS_NAMES.items() if mapped == status]
    for option in options:
        if (option.get("name") or "").strip().lower() in wanted:
            return option
    return None


def pick_jira_transition(transitions: list[dict], status: str) -> dict | None:
    named = pick_named(transitions, status)
    if named:
        return named
    want = {"open": "new", "in_progress": "indeterminate", "done": "done"}[status]
    for item in transitions:
        category = ((item.get("to") or {}).get("statusCategory") or {}).get("key")
        if category == want:
            return item
    return None


def pick_linear_state(states: list[dict], status: str) -> dict | None:
    want = {"open": "unstarted", "in_progress": "started", "done": "completed"}[status]
    for state in states:
        if state.get("type") == want:
            return state
    if status == "open":
        for state in states:
            if state.get("type") == "backlog":
                return state
    return None


def pick_team(nodes: list[dict], key: str) -> dict | None:
    for node in nodes:
        if (node.get("key") or "").lower() == key.lower():
            return node
    return None


def names_of(options: list[dict]) -> str:
    return ", ".join(option.get("name") or "?" for option in options) or "(none)"


def slugify(title: str) -> str:
    slug = "".join(char.lower() if char.isalnum() else "-" for char in title)
    slug = slug.strip("-")
    while "--" in slug:
        slug = slug.replace("--", "-")
    return slug[:40] or "ticket"


def render_ticket_md(ticket: dict) -> str:
    labels = ", ".join(ticket["labels"]) or "none"
    body = ticket["body"].rstrip()
    return (
        "# Ticket\n\n"
        f"Source: {ticket['source']}\n"
        f"Source-Id: {ticket['source']}:{ticket['id']}\n"
        f"URL: {ticket['url']}\n"
        f"Status: {ticket['status']}\n"
        f"Labels: {labels}\n\n"
        f"# {ticket['title']}\n\n"
        f"{body}\n"
    )


def mirror_body(ticket: dict) -> str:
    return (
        "<!-- bleeps-intake -->\n"
        f"Source: {ticket['source']}\n"
        f"Source-Id: {ticket['source']}:{ticket['id']}\n"
        f"Source-URL: {ticket['url']}\n\n"
        f"{ticket['body'].rstrip()}\n"
    )


def source_from_text(text: str) -> tuple[str, str] | None:
    source = ""
    ticket_id = ""
    for line in text.splitlines():
        if line.startswith("Source: "):
            source = line.split(" ", 1)[1].strip()
        elif line.startswith("Source-Id: "):
            value = line.split(" ", 1)[1].strip()
            if ":" in value:
                parsed, ticket_id = value.split(":", 1)
                source = source or parsed
    if source and ticket_id:
        return source, ticket_id
    return None


def run_command(args: list[str], cwd: Path | None = None, input_text: str | None = None):
    return subprocess.run(args, cwd=cwd, input=input_text, text=True, capture_output=True)


def default_runner(args: list[str], cwd: Path | None = None, input_text: str | None = None):
    return run_command(args, cwd=cwd, input_text=input_text)


def ensure_mirror(ticket: dict, root: Path, runner) -> int:
    """Find or create the GitHub issue Orca launches from. Returns its number."""
    if ticket["source"] in {"github", "github-project"}:
        if not str(ticket["id"]).isdigit():
            raise TicketError(f"{ticket['source']} id {ticket['id']} is not a GitHub issue number")
        return int(ticket["id"])
    marker = f"Source-Id: {ticket['source']}:{ticket['id']}"
    listed = runner(
        [
            "gh",
            "issue",
            "list",
            "--state",
            "all",
            "--limit",
            "20",
            "--json",
            "number,body",
            "--search",
            f"{marker} in:body",
        ],
        cwd=root,
        input_text=None,
    )
    if listed.returncode != 0:
        raise TicketError((listed.stderr or "gh issue list failed").strip())
    try:
        rows = json.loads(listed.stdout or "[]")
    except json.JSONDecodeError as error:
        raise TicketError("gh issue list did not return JSON") from error
    for row in rows:
        if marker in (row.get("body") or ""):
            return int(row["number"])
    runner(
        [
            "gh",
            "label",
            "create",
            "bleeps:intake",
            "--color",
            "1D76DB",
            "--description",
            "Mirrored from another ticket source",
            "--force",
        ],
        cwd=root,
        input_text=None,
    )
    created = runner(
        [
            "gh",
            "issue",
            "create",
            "--title",
            f"[{ticket['source']}] {ticket['title']}"[:240],
            "--label",
            "bleeps:intake",
            "--body-file",
            "-",
        ],
        cwd=root,
        input_text=mirror_body(ticket),
    )
    if created.returncode != 0:
        raise TicketError((created.stderr or "gh issue create failed").strip())
    url = (created.stdout or "").strip()
    number = url.rstrip("/").rsplit("/", 1)[-1]
    if not number.isdigit():
        raise TicketError(f"gh issue create returned {url!r}")
    return int(number)


def github_status_plan(number: str, status: str, current: str) -> list[list[str]]:
    plan: list[list[str]] = []
    if status == "done" and current != "done":
        plan.append(["issue", "close", number, "--comment", "Status: done"])
    elif status == "open":
        if current == "done":
            plan.append(["issue", "reopen", number])
        if current == "in_progress":
            plan.append(["issue", "edit", number, "--remove-label", "bleeps:in-progress"])
        plan.append(["issue", "comment", number, "--body", "Status: open"])
    elif status == "in_progress":
        if current == "done":
            plan.append(["issue", "reopen", number])
        plan.append(
            [
                "label",
                "create",
                "bleeps:in-progress",
                "--color",
                "FBCA04",
                "--description",
                "Bleeps is working on this ticket",
                "--force",
            ]
        )
        plan.append(["issue", "edit", number, "--add-label", "bleeps:in-progress"])
        plan.append(["issue", "comment", number, "--body", "Status: in_progress"])
    return plan


def github_link_plan(number: str, url: str) -> list[list[str]]:
    if not url.startswith("https://"):
        raise TicketError("pull request URL must start with https://")
    return [["issue", "comment", number, "--body", f"Pull request: {url}"]]


def scripted_fixture(path: str) -> "Scripted":
    raw = json.loads(Path(path).read_text())
    if isinstance(raw, list):
        return Scripted(raw)
    if isinstance(raw, dict) and isinstance(raw.get("responses"), list):
        return Scripted(raw["responses"])
    return Scripted([raw])


class Scripted:
    """Fixture transport. Each call pops the next response. Records the call."""

    def __init__(self, responses: list) -> None:
        self.responses = list(responses)
        self.calls: list[dict] = []

    def __call__(self, method, url, headers, payload):
        self.calls.append({"method": method, "url": url, "headers": headers, "payload": payload})
        if not self.responses:
            raise TicketError(f"no scripted response for {method} {url}")
        item = self.responses.pop(0)
        if isinstance(item, Exception):
            raise item
        return item


def _repo_headers(token: str) -> dict[str, str]:
    headers = bearer(token)
    headers["Accept"] = "application/vnd.github+json"
    headers["X-GitHub-Api-Version"] = "2022-11-28"
    return headers


def fetch_github(project, number, env, transport, runner, root: Path) -> dict:
    repo = github_repo(project, root, runner)
    if transport is None and not any(env.get(name) for name in github_token_names(project)):
        result = runner(
            ["gh", "issue", "view", str(number), "--json", "number,title,body,state,url,labels"],
            cwd=root,
            input_text=None,
        )
        if result.returncode != 0:
            raise TicketError((result.stderr or "gh issue view failed").strip())
        return parse_github_issue(json.loads(result.stdout))
    token = "fixture" if transport is not None and not any(env.get(name) for name in github_token_names(project)) else read_github_token(project, env, runner)
    raw = request_json(
        "GET",
        f"https://api.github.com/repos/{repo}/issues/{number}",
        _repo_headers(token) if token != "fixture" else {},
        transport=transport,
    )
    return parse_github_issue(raw)


def _project_query(kind: str, owner: str, number: str) -> dict:
    # One owner kind per request. Querying user and organization together makes
    # GitHub fail the whole call when the login is only one of those.
    if kind not in {"user", "organization"}:
        raise TicketError(f"unknown project owner kind {kind}")
    return {
        "query": f"""
        query($login: String!, $number: Int!) {{
          {kind}(login: $login) {{
            projectV2(number: $number) {{
              id
              field(name: "Status") {{
                ... on ProjectV2SingleSelectField {{ id options {{ id name }} }}
              }}
              items(first: 100) {{
                nodes {{
                  id
                  content {{ ... on Issue {{ number }} }}
                  fieldValueByName(name: "Status") {{
                    ... on ProjectV2ItemFieldSingleSelectValue {{ name }}
                  }}
                }}
              }}
            }}
          }}
        }}
        """,
        "variables": {"login": owner, "number": int(number)},
    }


def load_project_payload(owner: str, number: str, headers: dict, transport):
    last = "GitHub Project was not found"
    for kind in ("user", "organization"):
        try:
            payload = request_json(
                "POST",
                "https://api.github.com/graphql",
                headers,
                _project_query(kind, owner, number),
                transport=transport,
            )
            data = graphql_data(payload)
            if (data.get(kind) or {}).get("projectV2"):
                return payload
        except TicketError as error:
            last = str(error)
    raise TicketError(str(last))


def fetch_github_project(project, number, env, transport, runner, root: Path) -> dict:
    if transport is not None:
        first = transport("GET", "fixture://github-project", {}, None)
        if isinstance(first, dict) and "issue" in first:
            return parse_github_project(first)
        # A scripted live-shaped flow starts with the issue, then the project query.
        issue = parse_github_issue(first)
        payload = load_project_payload(
            project["github_project_owner"], project["github_project_number"], {}, transport
        )
    else:
        issue = fetch_github(project, number, env, None, runner, root)
        token = read_github_token(project, env, runner)
        payload = load_project_payload(
            project["github_project_owner"],
            project["github_project_number"],
            _repo_headers(token),
            None,
        )
    _project_id, _field_id, _options, items = parse_project_items(payload)
    match = next((item for item in items if str(item["number"]) == str(number)), None)
    if match is None:
        raise TicketError(
            f"issue {number} is not on GitHub Project "
            f"{project['github_project_owner']}/{project['github_project_number']} "
            "(scanned the first 100 items)"
        )
    status, note = status_from_name(match["status_name"]) if match["status_name"] else (issue["status"], None)
    if note:
        print(note, file=sys.stderr)
    issue["source"] = "github-project"
    issue["status"] = status
    return issue


def fetch_jira(project, ticket_id, env, transport) -> dict:
    base = project["jira_base_url"].rstrip("/")
    email = need_env(env, project["jira_email_env"]) if transport is None else env.get(project["jira_email_env"], "fixture")
    token = need_env(env, project["jira_token_env"]) if transport is None else env.get(project["jira_token_env"], "fixture")
    raw = request_json(
        "GET",
        f"{base}/rest/api/3/issue/{ticket_id}",
        jira_headers(email, token),
        transport=transport,
    )
    return parse_jira(raw, base)


def _linear_issue_query(ticket_id: str, team: str) -> dict:
    if re.fullmatch(r"[A-Za-z0-9]+-\d+", ticket_id):
        key, number = ticket_id.rsplit("-", 1)
        return {
            "query": """
            query($key: String!, $number: Float!) {
              issues(filter: { team: { key: { eq: $key } }, number: { eq: $number } }, first: 1) {
                nodes { id identifier title description url state { name type } labels { nodes { name } } }
              }
            }
            """,
            "variables": {"key": key, "number": float(number)},
        }
    return {
        "query": """
        query($id: String!) {
          issue(id: $id) { id identifier title description url state { name type } labels { nodes { name } } }
        }
        """,
        "variables": {"id": ticket_id, "team": team},
    }


def linear_node_from(payload: dict) -> dict:
    data = graphql_data(payload)
    if data.get("issue"):
        return data["issue"]
    nodes = ((data.get("issues") or {}).get("nodes")) or []
    if not nodes:
        raise TicketError("Linear issue was not found")
    return nodes[0]


def fetch_linear(project, ticket_id, env, transport) -> dict:
    token = need_env(env, project["linear_api_key_env"]) if transport is None else env.get(project["linear_api_key_env"], "fixture")
    payload = request_json(
        "POST",
        "https://api.linear.app/graphql",
        bearer(token),
        _linear_issue_query(ticket_id, project.get("linear_team", "")),
        transport=transport,
    )
    if isinstance(payload, dict) and payload.get("identifier") and "data" not in payload:
        return parse_linear_node(payload)
    return parse_linear_node(linear_node_from(payload))


def fetch_discord(project, ticket_id, env, transport) -> dict:
    token = need_env(env, project["discord_token_env"]) if transport is None else env.get(project["discord_token_env"], "fixture")
    channel = project["discord_channel_id"]
    raw = request_json(
        "GET",
        f"https://discord.com/api/v10/channels/{channel}/messages/{ticket_id}",
        discord_headers(token),
        transport=transport,
    )
    return parse_discord(raw, channel, project.get("discord_guild_id", ""))


FETCHERS = {
    "github": fetch_github,
    "github-project": fetch_github_project,
    "jira": fetch_jira,
    "discord": fetch_discord,
    "linear": fetch_linear,
}


def fetch(source: str, project: dict, ticket_id: str, env: dict, transport, runner, root: Path) -> dict:
    require_source_config(source, project)
    if source not in FETCHERS:
        raise TicketError(f"unknown ticket source {source}")
    if source == "github":
        return fetch_github(project, ticket_id, env, transport, runner, root)
    if source == "github-project":
        return fetch_github_project(project, ticket_id, env, transport, runner, root)
    if source == "jira":
        return fetch_jira(project, ticket_id, env, transport)
    if source == "discord":
        return fetch_discord(project, ticket_id, env, transport)
    return fetch_linear(project, ticket_id, env, transport)


def _apply_gh(plan: list[list[str]], root: Path, runner, dry_run: bool) -> dict:
    if dry_run:
        return {"action": "github", "commands": plan}
    for args in plan:
        result = runner(["gh", *args], cwd=root, input_text=None)
        if result.returncode != 0:
            raise TicketError((result.stderr or f"gh {' '.join(args)} failed").strip())
    return {"action": "github", "commands": plan}


def set_status(source: str, project: dict, ticket_id: str, status: str, env, transport, runner, root: Path, dry_run: bool) -> dict:
    require_source_config(source, project)
    if status not in STATUSES:
        raise TicketError(f"status must be one of {', '.join(STATUSES)}")
    if source == "github":
        current = fetch_github(project, ticket_id, env, transport, runner, root)
        plan = github_status_plan(str(ticket_id), status, current["status"])
        result = _apply_gh(plan, root, runner, dry_run)
        result["status"] = status
        return result
    if source == "github-project":
        return _project_status(project, ticket_id, status, env, transport, runner, root, dry_run)
    if source == "jira":
        return _jira_status(project, ticket_id, status, env, transport, dry_run)
    if source == "linear":
        return _linear_status(project, ticket_id, status, env, transport, dry_run)
    if source == "discord":
        return _discord_post(
            project,
            ticket_id,
            f"Status: {status}",
            env,
            transport,
            dry_run,
            kind="status",
        )
    raise TicketError(f"unknown ticket source {source}")


def link_pr(source: str, project: dict, ticket_id: str, url: str, env, transport, runner, root: Path, dry_run: bool) -> dict:
    require_source_config(source, project)
    if not url.startswith("https://"):
        raise TicketError("pull request URL must start with https://")
    if source in {"github", "github-project"}:
        # The project item has no comment field. The link goes on the GitHub issue.
        plan = github_link_plan(str(ticket_id), url)
        result = _apply_gh(plan, root, runner, dry_run)
        result["url"] = url
        return result
    if source == "jira":
        base = project["jira_base_url"].rstrip("/")
        email = need_env(env, project["jira_email_env"]) if transport is None else "fixture"
        token = need_env(env, project["jira_token_env"]) if transport is None else "fixture"
        payload = {"body": jira_doc(f"Pull request: {url}")}
        if not dry_run:
            request_json(
                "POST",
                f"{base}/rest/api/3/issue/{ticket_id}/comment",
                jira_headers(email, token),
                payload,
                transport=transport,
            )
        return {"action": "comment", "source": "jira", "id": ticket_id, "url": url}
    if source == "linear":
        return _linear_link(project, ticket_id, url, env, transport, dry_run)
    if source == "discord":
        return _discord_post(project, ticket_id, f"Pull request: {url}", env, transport, dry_run, kind="link-pr")
    raise TicketError(f"unknown ticket source {source}")


def _jira_status(project, ticket_id, status, env, transport, dry_run: bool) -> dict:
    base = project["jira_base_url"].rstrip("/")
    email = need_env(env, project["jira_email_env"]) if transport is None else "fixture"
    token = need_env(env, project["jira_token_env"]) if transport is None else "fixture"
    headers = jira_headers(email, token)
    raw = request_json(
        "GET",
        f"{base}/rest/api/3/issue/{ticket_id}/transitions",
        headers,
        transport=transport,
    )
    transitions = raw.get("transitions") or []
    picked = pick_jira_transition(transitions, status)
    if not picked:
        raise TicketError(
            f"Jira has no transition for {status}. The API returned: {names_of(transitions)}.",
            code=3,
        )
    if not dry_run:
        request_json(
            "POST",
            f"{base}/rest/api/3/issue/{ticket_id}/transitions",
            headers,
            {"transition": {"id": picked["id"]}},
            transport=transport,
        )
    return {"action": "transition", "source": "jira", "id": ticket_id, "status": status, "transition": picked["id"]}


def _linear_status(project, ticket_id, status, env, transport, dry_run: bool) -> dict:
    token = need_env(env, project["linear_api_key_env"]) if transport is None else "fixture"
    headers = bearer(token)
    found = request_json(
        "POST",
        "https://api.linear.app/graphql",
        headers,
        _linear_issue_query(ticket_id, project.get("linear_team", "")),
        transport=transport,
    )
    node = linear_node_from(found)
    states_payload = request_json(
        "POST",
        "https://api.linear.app/graphql",
        headers,
        {
            "query": """
            query($key: String!) {
              teams(filter: { key: { eq: $key } }) {
                nodes { states { nodes { id name type } } }
              }
            }
            """,
            "variables": {"key": project["linear_team"]},
        },
        transport=transport,
    )
    teams = ((graphql_data(states_payload).get("teams") or {}).get("nodes")) or []
    states = ((teams[0].get("states") or {}).get("nodes") if teams else []) or []
    picked = pick_linear_state(states, status)
    if not picked:
        raise TicketError(
            f"Linear has no state for {status}. The API returned: {names_of(states)}.",
            code=3,
        )
    if not dry_run:
        request_json(
            "POST",
            "https://api.linear.app/graphql",
            headers,
            {
                "query": """
                mutation($id: String!, $stateId: String!) {
                  issueUpdate(id: $id, input: { stateId: $stateId }) { success }
                }
                """,
                "variables": {"id": node["id"], "stateId": picked["id"]},
            },
            transport=transport,
        )
    return {"action": "state", "source": "linear", "id": ticket_id, "status": status, "state": picked["id"]}


def _linear_link(project, ticket_id, url, env, transport, dry_run: bool) -> dict:
    token = need_env(env, project["linear_api_key_env"]) if transport is None else "fixture"
    headers = bearer(token)
    found = request_json(
        "POST",
        "https://api.linear.app/graphql",
        headers,
        _linear_issue_query(ticket_id, project.get("linear_team", "")),
        transport=transport,
    )
    node = linear_node_from(found)
    payload = {
        "query": """
        mutation($issueId: String!, $url: String!) {
          attachmentCreate(input: { issueId: $issueId, url: $url, title: "Pull request" }) { success }
        }
        """,
        "variables": {"issueId": node["id"], "url": url},
    }
    if not dry_run:
        request_json("POST", "https://api.linear.app/graphql", headers, payload, transport=transport)
    return {"action": "attachment", "source": "linear", "id": ticket_id, "url": url}


def _discord_post(project, ticket_id, content, env, transport, dry_run: bool, kind: str) -> dict:
    """Discord has no issue status. Status and the PR link are replies."""
    token = need_env(env, project["discord_token_env"]) if transport is None else "fixture"
    channel = project["discord_channel_id"]
    payload = {
        "content": content[:2000],
        "message_reference": {"message_id": str(ticket_id)},
    }
    if not dry_run:
        request_json(
            "POST",
            f"https://discord.com/api/v10/channels/{channel}/messages",
            discord_headers(token),
            payload,
            transport=transport,
        )
    return {"action": kind, "source": "discord", "id": str(ticket_id), "content": content, "note": "reply, no status field"}


def _project_status(project, ticket_id, status, env, transport, runner, root, dry_run: bool) -> dict:
    token = read_github_token(project, env, runner) if transport is None else "fixture"
    headers = _repo_headers(token) if token != "fixture" else {}
    payload = load_project_payload(
        project["github_project_owner"], project["github_project_number"], headers, transport
    )
    project_id, field_id, options, items = parse_project_items(payload)
    match = next((item for item in items if str(item["number"]) == str(ticket_id)), None)
    if match is None:
        raise TicketError(f"issue {ticket_id} is not on the configured GitHub Project", code=3)
    picked = pick_named(options, status)
    if not picked:
        raise TicketError(
            f"GitHub Project has no Status option for {status}. The API returned: {names_of(options)}.",
            code=3,
        )
    mutation = {
        "query": """
        mutation($projectId: ID!, $itemId: ID!, $fieldId: ID!, $optionId: String!) {
          updateProjectV2ItemFieldValue(input: {
            projectId: $projectId, itemId: $itemId, fieldId: $fieldId,
            value: { singleSelectOptionId: $optionId }
          }) { projectV2Item { id } }
        }
        """,
        "variables": {
            "projectId": project_id,
            "itemId": match["item_id"],
            "fieldId": field_id,
            "optionId": picked["id"],
        },
    }
    if not dry_run:
        request_json("POST", "https://api.github.com/graphql", headers, mutation, transport=transport)
    return {"action": "project-status", "source": "github-project", "id": str(ticket_id), "status": status, "option": picked["id"]}


def create_finding(source: str, project: dict, title: str, body: str, github_number: int, env, transport, runner, root: Path) -> dict:
    require_source_config(source, project)
    text = body.rstrip() + f"\n\nGitHub issue: #{github_number}\n"
    if source == "linear":
        return _linear_create(project, title, text, env, transport)
    if source == "jira":
        return _jira_create(project, title, text, env, transport)
    if source == "discord":
        return _discord_create(project, title, text, env, transport)
    if source == "github-project":
        return _project_add(project, github_number, env, transport, runner, root)
    raise TicketError(f"{source} is not an outbound ticket source")


def _linear_create(project, title, body, env, transport) -> dict:
    token = need_env(env, project["linear_api_key_env"]) if transport is None else "fixture"
    headers = bearer(token)
    teams = request_json(
        "POST",
        "https://api.linear.app/graphql",
        headers,
        {
            "query": "query($key: String!) { teams(filter: { key: { eq: $key } }) { nodes { id key } } }",
            "variables": {"key": project["linear_team"]},
        },
        transport=transport,
    )
    nodes = ((graphql_data(teams).get("teams") or {}).get("nodes")) or []
    team = pick_team(nodes, project["linear_team"])
    if not team:
        raise TicketError(f"Linear team {project['linear_team']} was not found")
    created = request_json(
        "POST",
        "https://api.linear.app/graphql",
        headers,
        {
            "query": """
            mutation($title: String!, $description: String!, $teamId: String!) {
              issueCreate(input: { title: $title, description: $description, teamId: $teamId }) {
                issue { id identifier title url }
              }
            }
            """,
            "variables": {"title": title, "description": body, "teamId": team["id"]},
        },
        transport=transport,
    )
    issue = (graphql_data(created).get("issueCreate") or {}).get("issue") or {}
    return make_ticket("linear", issue.get("identifier") or "", issue.get("url") or "", title, body, "open", ["bleeps:found"])


def _jira_create(project, title, body, env, transport) -> dict:
    base = project["jira_base_url"].rstrip("/")
    email = need_env(env, project["jira_email_env"]) if transport is None else "fixture"
    token = need_env(env, project["jira_token_env"]) if transport is None else "fixture"
    raw = request_json(
        "POST",
        f"{base}/rest/api/3/issue",
        jira_headers(email, token),
        {
            "fields": {
                "project": {"key": project["jira_project"]},
                "summary": title[:255],
                "description": jira_doc(body),
                "issuetype": {"name": "Task"},
                "labels": ["bleeps-found"],
            }
        },
        transport=transport,
    )
    key = raw.get("key") or ""
    return make_ticket("jira", key, f"{base}/browse/{key}", title, body, "open", ["bleeps-found"])


def _discord_create(project, title, body, env, transport) -> dict:
    token = need_env(env, project["discord_token_env"]) if transport is None else "fixture"
    channel = project["discord_channel_id"]
    content = f"{title}\n\n{body}"[:2000]
    raw = request_json(
        "POST",
        f"https://discord.com/api/v10/channels/{channel}/messages",
        discord_headers(token),
        {"content": content},
        transport=transport,
    )
    return parse_discord(raw, channel, project.get("discord_guild_id", ""))


def _project_add(project, github_number, env, transport, runner, root: Path) -> dict:
    token = read_github_token(project, env, runner) if transport is None else "fixture"
    headers = _repo_headers(token) if token != "fixture" else {}
    repo = github_repo(project, root, runner)
    issue = request_json(
        "GET",
        f"https://api.github.com/repos/{repo}/issues/{github_number}",
        headers,
        transport=transport,
    )
    node_id = issue.get("node_id")
    if not node_id:
        raise TicketError("GitHub issue payload has no node_id")
    looked = load_project_payload(
        project["github_project_owner"], project["github_project_number"], headers, transport
    )
    project_id, _field, _options, _items = parse_project_items(looked)
    added = request_json(
        "POST",
        "https://api.github.com/graphql",
        headers,
        {
            "query": """
            mutation($projectId: ID!, $contentId: ID!) {
              addProjectV2ItemById(input: { projectId: $projectId, contentId: $contentId }) {
                item { id }
              }
            }
            """,
            "variables": {"projectId": project_id, "contentId": node_id},
        },
        transport=transport,
    )
    item = (graphql_data(added).get("addProjectV2ItemById") or {}).get("item") or {}
    return make_ticket("github-project", github_number, issue.get("html_url") or "", issue.get("title") or "", "", "open", ["bleeps:found"]) | {
        "item_id": item.get("id") or ""
    }


def post_finding(project, title: str, body: str, github_number: int, env=None, transport=None, runner=None, root: Path | None = None) -> list[str]:
    """Create the finding on each outbound source. A source that fails is skipped.

    The GitHub issue is already filed. A down tracker must not drop it.
    """
    env = env if env is not None else dict(os_environ())
    runner = runner or default_runner
    root = root or Path.cwd()
    notes = []
    for source in outbound_sources(project):
        try:
            created = create_finding(source, project, title, body, github_number, env, transport, runner, root)
            notes.append(f"posted {source} {created.get('id', '')}".rstrip())
        except TicketError as error:
            notes.append(f"skipped {source}: {error}")
    return notes


def os_environ() -> dict[str, str]:
    import os

    return dict(os.environ)


def real_which(name: str):
    return shutil.which(name)


def real_gh_status() -> int:
    if shutil.which("gh") is None:
        return 1
    return subprocess.run(["gh", "auth", "status"], capture_output=True).returncode


def require_source_config(source: str, project: dict) -> None:
    for key in REQUIRED_KEYS.get(source, ()):
        if not project.get(key):
            raise TicketError(f"orca.project.yaml is missing {key} for ticket source {source}.")


def check_source(source: str, project: dict, env: dict, transport, runner, root: Path) -> str:
    """Hit a cheap authenticated endpoint. Returns a short ok line."""
    require_source_config(source, project)
    if source == "github":
        ok, detail = github_access(project, env, real_which if runner is default_runner else (lambda _name: True), real_gh_status if runner is default_runner else (lambda: 0))
        # The injected path is check_project, which does not call check_source("github").
        if not ok:
            raise TicketError(detail, code=2)
        github_repo(project, root, runner)
        return detail
    if source == "github-project":
        token = read_github_token(project, env, runner) if transport is None else "fixture"
        payload = load_project_payload(
            project["github_project_owner"],
            project["github_project_number"],
            _repo_headers(token) if token != "fixture" else {},
            transport,
        )
        project_id, _field, _options, _items = parse_project_items(payload)
        if not project_id:
            raise TicketError("GitHub Project query returned no id")
        return f"project {project['github_project_owner']}/{project['github_project_number']}"
    if source == "jira":
        base = project["jira_base_url"].rstrip("/")
        email = need_env(env, project["jira_email_env"]) if transport is None else "fixture"
        token = need_env(env, project["jira_token_env"]) if transport is None else "fixture"
        request_json("GET", f"{base}/rest/api/3/myself", jira_headers(email, token), transport=transport)
        return f"jira {base} project {project['jira_project']}"
    if source == "discord":
        token = need_env(env, project["discord_token_env"]) if transport is None else "fixture"
        request_json(
            "GET",
            "https://discord.com/api/v10/users/@me",
            discord_headers(token),
            transport=transport,
        )
        return f"discord channel {project['discord_channel_id']}"
    if source == "linear":
        token = need_env(env, project["linear_api_key_env"]) if transport is None else "fixture"
        payload = request_json(
            "POST",
            "https://api.linear.app/graphql",
            bearer(token),
            {"query": "query { viewer { id } }"},
            transport=transport,
        )
        viewer = graphql_data(payload).get("viewer") or {}
        if not viewer.get("id"):
            raise TicketError("Linear viewer query returned no id")
        return f"linear team {project['linear_team']}"
    raise TicketError(f"unknown ticket source {source}")


def check_project(root: Path, live: bool, env=None, which=None, gh_status=None, runner=None, transport=None) -> list[str]:
    project = project_of(root)
    validate_project(project)
    env = env if env is not None else os_environ()
    runner = runner or default_runner
    which = which or real_which
    gh_status = gh_status or real_gh_status
    # Resolving the repo is local (config or git remote). It does not call the API.
    github_repo(project, root, runner)
    lines = [f"sources: {', '.join(sources_of(project))}"]
    if not live:
        lines.append("github: not checked (--config-only)")
        for source in sources_of(project):
            if source != "github":
                lines.append(f"{source}: not checked (--config-only)")
        return lines
    ok, detail = github_access(project, env, which, gh_status)
    if not ok:
        raise TicketError(detail, code=2)
    lines.append(f"github: {detail}")
    for source in sources_of(project):
        if source == "github":
            continue
        try:
            lines.append(f"{source}: {check_source(source, project, env, transport, runner, root)}")
        except TicketError as error:
            raise TicketError(f"{source}: {error}", code=error.code) from None
    return lines


def ticket_file_for_issue(root: Path, number: str) -> Path | None:
    specs = root / "specs"
    if not specs.is_dir():
        return None
    matches = sorted(specs.glob(f"{number}-*/ticket.json"))
    return matches[0] if matches else None


def resolve_ref(root: Path, project: dict, args: list[str]) -> tuple[str, str]:
    """Return source, id from `--issue N` or `<source> <id>`."""
    if "--issue" in args:
        index = args.index("--issue")
        if index + 1 >= len(args):
            raise TicketError("usage: --issue <github-issue-number>", code=2)
        number = args[index + 1]
        if not number.isdigit():
            raise TicketError("--issue needs the GitHub issue number", code=2)
        path = ticket_file_for_issue(root, number)
        if path is None:
            # A plain GitHub issue has no ticket.json. The mirror files do.
            return "github", number
        saved = json.loads(path.read_text())
        return saved["source"], saved["id"]
    positional = [arg for arg in args if not arg.startswith("--")]
    if len(positional) < 2:
        raise TicketError("usage: intake status <status> (--issue N | <source> <id>)", code=2)
    return positional[0], positional[1]


def write_spec(root: Path, number: int, slug: str, ticket: dict) -> Path:
    kickoff = Path(__file__).resolve().parent / "kick-off"
    folder_arg = str(number)
    result = subprocess.run(
        [sys.executable, str(kickoff), folder_arg, slug, "--ticket", "-"],
        cwd=root,
        input=json.dumps(ticket),
        text=True,
        capture_output=True,
    )
    if result.returncode != 0:
        raise TicketError((result.stderr or result.stdout or "kick-off failed").strip())
    folder = root / "specs" / f"{number}-{slug}"
    (folder / "ticket.json").write_text(json.dumps(ticket, indent=2) + "\n")
    (folder / "ticket.md").write_text(render_ticket_md(ticket))
    print(result.stdout.strip())
    return folder


def _pop_flag(args: list[str], flag: str) -> tuple[list[str], str | None]:
    if flag not in args:
        return args, None
    index = args.index(flag)
    if index + 1 >= len(args):
        raise TicketError(f"usage: {flag} <value>", code=2)
    value = args[index + 1]
    return args[:index] + args[index + 2 :], value


def intake_fetch(argv: list[str], root: Path, env, transport, runner) -> int:
    args, fixture = _pop_flag(argv, "--fixture")
    args, slug = _pop_flag(args, "--slug")
    args, issue = _pop_flag(args, "--issue")
    dry_run = "--dry-run" in args
    positional = [arg for arg in args if arg != "--dry-run"]
    if len(positional) != 2:
        raise TicketError("usage: intake fetch <source> <id> [--slug SLUG] [--issue N] [--fixture FILE] [--dry-run]", code=2)
    source, ticket_id = positional
    project = project_of(root)
    validate_project(project)
    allowed = set(sources_of(project)) | {"github"}
    if source not in allowed:
        raise TicketError(f"{source} is not in ticket_sources ({', '.join(sources_of(project))}). GitHub is always allowed.")
    if fixture:
        transport = scripted_fixture(fixture)
    ticket = fetch(source, project, ticket_id, env, transport, runner, root)
    if dry_run:
        print(json.dumps(ticket, indent=2))
        if source not in {"github", "github-project"}:
            print(f"would mirror {source}:{ticket['id']} to a GitHub issue")
        return 0
    if issue:
        number = int(issue)
    else:
        number = ensure_mirror(ticket, root, runner)
    slug = slug or slugify(ticket["title"])
    folder = write_spec(root, number, slug, ticket)
    print(json.dumps({"github_issue": number, "spec": str(folder.relative_to(root)), "ticket": ticket}, indent=2))
    return 0


def intake_status(argv: list[str], root: Path, env, transport, runner) -> int:
    args, fixture = _pop_flag(argv, "--fixture")
    dry_run = "--dry-run" in args
    args = [arg for arg in args if arg != "--dry-run"]
    if not args or args[0] not in STATUSES:
        raise TicketError(f"usage: intake status <{'|'.join(STATUSES)}> (--issue N | <source> <id>)", code=2)
    status = args[0]
    source, ticket_id = resolve_ref(root, project_of(root), args[1:])
    project = project_of(root)
    if fixture:
        transport = scripted_fixture(fixture)
    result = set_status(source, project, ticket_id, status, env, transport, runner, root, dry_run)
    print(json.dumps(result, indent=2))
    return 0


def intake_link(argv: list[str], root: Path, env, transport, runner) -> int:
    args, fixture = _pop_flag(argv, "--fixture")
    dry_run = "--dry-run" in args
    args = [arg for arg in args if arg != "--dry-run"]
    positional = [arg for arg in args if not arg.startswith("--") and arg not in _flag_values(args)]
    # URL is the first positional. Source and id follow, unless --issue.
    if "--issue" in args:
        if not positional:
            raise TicketError("usage: intake link-pr <https-url> --issue N", code=2)
        url = positional[0]
        source, ticket_id = resolve_ref(root, project_of(root), args)
    else:
        if len(positional) < 3:
            raise TicketError("usage: intake link-pr <https-url> (<source> <id> | --issue N)", code=2)
        url, source, ticket_id = positional[0], positional[1], positional[2]
    project = project_of(root)
    if fixture:
        transport = scripted_fixture(fixture)
    result = link_pr(source, project, ticket_id, url, env, transport, runner, root, dry_run)
    print(json.dumps(result, indent=2))
    return 0


def _flag_values(args: list[str]) -> set[str]:
    values = set()
    for flag in ("--issue", "--fixture", "--slug"):
        if flag in args:
            index = args.index(flag)
            if index + 1 < len(args):
                values.add(args[index + 1])
    return values


INTAKE_USAGE = """usage: intake fetch <source> <id> [--slug SLUG] [--issue N] [--fixture FILE] [--dry-run]
       intake status <open|in_progress|done> (--issue N | <source> <id>) [--fixture FILE] [--dry-run]
       intake link-pr <https-url> (--issue N | <source> <id>) [--fixture FILE] [--dry-run]
       intake check [--config-only]

Sources: github, github-project, jira, discord, linear.
GitHub is required for every project. ticket_sources in orca.project.yaml
lists the ones this project connects. Credential keys are env var names.
"""


def intake_main(argv: list[str], root: Path | None = None, env=None, transport=None, runner=None) -> int:
    root = root or Path.cwd()
    env = env if env is not None else os_environ()
    runner = runner or default_runner
    if not argv or argv[0] in {"-h", "--help"}:
        print(INTAKE_USAGE.strip())
        return 0 if argv and argv[0] in {"-h", "--help"} else 2
    try:
        command, rest = argv[0], argv[1:]
        if command == "fetch":
            return intake_fetch(rest, root, env, transport, runner)
        if command == "status":
            return intake_status(rest, root, env, transport, runner)
        if command == "link-pr":
            return intake_link(rest, root, env, transport, runner)
        if command == "check":
            return check_main(rest, root=root, env=env, runner=runner, transport=transport)
        raise TicketError(INTAKE_USAGE.strip(), code=2)
    except TicketError as error:
        print(error, file=sys.stderr)
        return error.code


def check_main(argv: list[str], root: Path | None = None, env=None, which=None, gh_status=None, runner=None, transport=None) -> int:
    root = root or Path.cwd()
    live = "--config-only" not in argv
    if any(arg not in {"--config-only", "-h", "--help"} for arg in argv):
        print("usage: check-ticket-sources [--config-only]", file=sys.stderr)
        return 2
    if argv and argv[0] in {"-h", "--help"}:
        print("usage: check-ticket-sources [--config-only]\nLive mode checks GitHub auth and each configured source. --config-only checks the file.")
        return 0
    try:
        lines = check_project(root, live=live, env=env, which=which, gh_status=gh_status, runner=runner, transport=transport)
    except TicketError as error:
        print(error, file=sys.stderr)
        return error.code
    print("\n".join(lines))
    print("ok")
    return 0


def adapter_main(source: str, argv: list[str]) -> int:
    """CLI for one source. fetch, status, link-pr, create, and check."""
    if not argv or argv[0] in {"-h", "--help"}:
        print(
            f"usage: ticket-{source} fetch <id> [--fixture FILE]\n"
            f"       ticket-{source} status <id> <open|in_progress|done> [--fixture FILE] [--dry-run]\n"
            f"       ticket-{source} link-pr <id> <https-url> [--dry-run]\n"
            f"       ticket-{source} check"
        )
        return 0 if argv and argv[0] in {"-h", "--help"} else 2
    command = argv[0]
    if command == "fetch":
        return intake_main(["fetch", source, *argv[1:]])
    if command == "status":
        if len(argv) < 3:
            print(f"usage: ticket-{source} status <id> <status>", file=sys.stderr)
            return 2
        return intake_main(["status", argv[2], source, argv[1], *argv[3:]])
    if command == "link-pr":
        if len(argv) < 3:
            print(f"usage: ticket-{source} link-pr <id> <url>", file=sys.stderr)
            return 2
        return intake_main(["link-pr", argv[2], source, argv[1], *argv[3:]])
    if command == "check":
        root = Path.cwd()
        try:
            project = project_of(root)
            validate_project(project)
            detail = check_source(source, project, os_environ(), None, default_runner, root)
        except TicketError as error:
            print(f"{source}: {error}", file=sys.stderr)
            return error.code
        print(f"{source}: {detail}")
        return 0
    print(f"unknown command {command}", file=sys.stderr)
    return 2
