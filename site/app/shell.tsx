import type { ReactNode } from "react";
import system from "./system";

export const wrap = "mx-auto w-full max-w-6xl px-5 sm:px-8";

export const REPO = "https://github.com/eljamez/bleeps-and-bloops";

const blob = (path: string) => `${REPO}/blob/develop/${path}`;

export const links = {
  repo: REPO,
  docs: `${REPO}/tree/develop/docs`,
  agents: blob("AGENTS.md"),
  template: blob(".github/pull_request_template.md"),
  using: blob("docs/using-bleeps.md"),
  primitives: blob("docs/primitives.md"),
  flow: blob("docs/flow.md"),
  friction: blob("docs/friction-log.md"),
  architecture: blob("docs/architecture.md"),
  runs: blob("docs/where-it-runs.md"),
  bots: blob("docs/bots.md"),
  botsSetup: blob("docs/bots-setup.md"),
  lane: blob("docs/chore-lane-setup.md"),
  example: blob("examples/orca.project.yaml"),
  blip: blob("agents/blip/ROLE.md"),
  tickets: blob("docs/tickets.md"),
};

const nav = [
  { href: "/start/new", id: "new", label: "New project" },
  { href: "/start/existing", id: "existing", label: "Existing project" },
  { href: "/start/bots", id: "bots", label: "Bots" },
  { href: "/using-bleeps", id: "using", label: "Day to day" },
] as const;

export type PageId = (typeof nav)[number]["id"];

export function SiteShell({
  current,
  children,
}: {
  current?: PageId;
  children: ReactNode;
}) {
  return (
    <>
      <a
        href="#content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-3 focus:top-3 focus:z-20 focus:bg-amber focus:px-3 focus:py-2 focus:font-bold focus:text-ink hover:text-ink"
      >
        Skip to content
      </a>

      <header className="border-b border-line">
        <div className={`${wrap} site-bar`}>
          <a href="/" className="brand">
            <img src="/brand/mark.svg" alt="" width={704} height={264} />
            <span className="brand-name">
              bleeps <span className="amp">&amp;</span> bloops
            </span>
          </a>
          <nav className="site-nav" aria-label="Pages">
            <ul>
              {nav.map((item) => (
                <li key={item.id}>
                  <a
                    href={item.href}
                    aria-current={current === item.id ? "page" : undefined}
                  >
                    {item.label}
                  </a>
                </li>
              ))}
              <li>
                <a href={REPO}>GitHub</a>
              </li>
            </ul>
          </nav>
        </div>
      </header>

      <main id="content" tabIndex={-1}>
        {children}
      </main>

      <footer className="site-footer">
        <div className={`${wrap} stack py-12`}>
          <p>
            Bleeps runs the crew and gets the work done, on the Orca agent
            harness. Bloops merges pull requests and studies each run to
            improve the crew.
          </p>
          <p>
            <a href="/start/new">Start a new project</a>
            {" · "}
            <a href="/start/existing">Add it to an existing project</a>
            {" · "}
            <a href="/start/bots">Set up the bots</a>
            {" · "}
            <a href="/using-bleeps">Day to day</a>
          </p>
          <p>
            <a href={REPO}>github.com/eljamez/bleeps-and-bloops</a>
          </p>
        </div>
      </footer>
    </>
  );
}

export function Section({
  id,
  index,
  title,
  children,
  band = false,
}: {
  id: string;
  index: string;
  title: string;
  children: ReactNode;
  band?: boolean;
}) {
  return (
    <section id={id} className={band ? "band" : undefined}>
      <div className={`${wrap} block py-16 md:py-24`}>
        <p className="index" aria-hidden="true">
          {index}
        </p>
        <h2>{title}</h2>
        <div className="mt-8">{children}</div>
      </div>
    </section>
  );
}

export function Step({
  planned,
  title,
  children,
}: {
  planned?: boolean;
  title: string;
  children: ReactNode;
}) {
  return (
    <li>
      <p className={planned ? "later" : "flag"}>
        {planned ? "Planned" : "Do this now"}
      </p>
      <h3>{title}</h3>
      {children}
    </li>
  );
}

export function ConfigKeys() {
  return (
    <>
      <p>
        Keys in <code>orca.project.yaml</code> this line uses:
      </p>
      <ul className="tasks">
        {system.configKeys.map((key) => (
          <li key={key}>
            <code>{key}</code>
          </li>
        ))}
      </ul>
      <p>
        A key ending in <code>_env</code> is the name of an environment
        variable. The file never holds the secret.
      </p>
    </>
  );
}

export function HostNote() {
  return (
    <>
      <p>
        <code>host</code> is where Orca runs. It defaults to {system.defaults.host},
        the computer in front of you. The factory runs there only while that
        computer is on and Orca is running. If it was asleep at Chip&apos;s
        time, Orca starts one catch-up after you wake it and leave it awake,
        and only while the missed-run grace window is still open. A longer
        outage skips that occurrence. The next run is the next scheduled time.
        Tickets filed while it was off stay open on GitHub. They wait. The
        next scout does not drain tickets you filed yourself.
      </p>
      <p>
        <code>host: cloud</code> is a VPS you leave on. <code>host: home</code>{" "}
        is a machine at home. Same scripts, same <code>orca.yaml</code>. Reach
        an always-on machine on a private network such as Tailscale. Do not
        open its ports. GitHub Actions can run the checks. It cannot run Orca,
        so it is not a value of <code>host</code>. <code>runtime</code> defaults
        to {system.defaults.runtime}, which keeps today&apos;s issue prompt.
        Set <code>runtime: bots</code> only when you want the crew as Orca
        bots in one group. The steps are in the{" "}
        <a href={links.runs}>where it runs</a> notes. 8&nbsp;GB of RAM is the
        floor. 16&nbsp;GB is comfortable. Register Chip on that machine with{" "}
        <code>python3 scripts/bleeps-scout schedule</code>, then{" "}
        <code>--install</code>. Chip&apos;s agent defaults to{" "}
        {system.defaults.scout_provider}. Set <code>scout_provider</code> only
        to pick a different one.
      </p>
    </>
  );
}

export function BotsNote() {
  return (
    <div className="stack">
      <p>
        <code>runtime</code> defaults to {system.defaults.runtime}. Leave it
        there and Orca starts the crew from <code>issueCommand</code> when a
        workspace launches from a GitHub issue.
      </p>
      <p>
        Set <code>runtime: bots</code> when you want the crew as Orca bots in
        one group. Bleeps coordinates. Beep plans. Buzz builds. Blip runs the
        suites. Chip scouts. Ping reviews. Boop opens chores. Bloops merges.
        Echo stays a fresh worker for each verify, so the verifier does not
        share the writer&apos;s chat. Zap joins only when <code>zap</code> is
        on.         <code>python3 scripts/bots print</code> shows the create,
        automation, and handoff commands. It does not run them. Create Bleeps,
        then paste one prompt. The steps are{" "}
        <a href="/start/bots">Set up the bots</a>. The command list is{" "}
        <a href={links.bots}>how to run the crew as bots</a>.
      </p>
      <p>
        The gates do not move. Intake, guardrails, the fix loop, verify, and
        merge stay the scripts. Nothing merges while tests are red. Pull
        requests target <code>develop</code>. You promote <code>main</code>.
        A sign-off area waits for you. Bloops merges only through{" "}
        <code>scripts/merge-pr</code>, and only when you say so.{" "}
        <code>chore_lane</code> defaults to {system.defaults.chore_lane}. Set
        it to on and a workflow merges a chore{" "}
        <code>scripts/chore-lane</code> accepts. The classes that start
        enabled are {system.defaults.chore_lane_classes}. Boop does not build
        a feature, and neither does Chip. <code>review_external</code> defaults
        to {system.defaults.review_external}, which installs nothing.{" "}
        <code>zap</code> defaults to {system.defaults.zap}. The checklist is
        the <a href={links.lane}>chore lane setup</a>.
      </p>
      <p>
        Bots run on the machine <code>host</code> names, and only while that
        computer is awake and Orca is running. Pair a server you leave on
        when you want them reachable. Link the repository in each bot&apos;s
        settings. Leave Look around on for Bleeps and Chip, and turn it off
        for the others. A new bot starts in Full access. Switch a bot that
        reads issues or messages to Ask for approval, and a worker session
        to Accept edits.
      </p>
      <p>
        The start label is <code>bleeps:go</code>. A bot can stop partway
        after a restart or a usage limit. GitHub work uses your <code>gh</code>{" "}
        login, so <code>verify.md</code> names the writer and the verifier.
        Orca tells a bot to merge only when you ask. That line is a prompt.
        The script is what blocks the merge.
      </p>
    </div>
  );
}

export function BlipNote() {
  return (
    <p>
      Blip is the QA lead. Blip sets up and maintains the unit, integration,
      and end-to-end tests. On a web app, end-to-end defaults to Playwright.
      Put <code>test</code>, or <code>test_unit</code>,{" "}
      <code>test_integration</code>, and <code>test_e2e</code>, in{" "}
      <code>orca.project.yaml</code>. Green tests are a hard gate before
      auto-merge. A red suite does not stop the run. It goes back to be
      fixed, up to <code>fix_rounds</code> (default {system.fixRounds}), and
      then the run asks you. A missing test command fails{" "}
      <code>bleeps test</code>. The <a href={links.blip}>role is in the repo</a>.
    </p>
  );
}
