import type { ReactNode } from "react";

export const dynamic = "force-static";

const wrap = "mx-auto w-full max-w-6xl px-5 sm:px-8";

const DOCS = "https://github.com/eljamez/bleeps-and-bloops/tree/develop/docs";
const ROADMAP =
  "https://github.com/eljamez/bleeps-and-bloops/blob/develop/docs/roadmap.md";
const MERGE =
  "https://github.com/eljamez/bleeps-and-bloops/blob/develop/docs/decisions/0003-gitflow-auto-merge-to-develop.md";

const plate = [
  ["Brand", "Bleeps and Bloops"],
  ["System", "Bleeps"],
  ["Results", "Bloops"],
  ["Owner", "James Hall"],
  ["Steers", "A human"],
  ["Lands on", "develop"],
  ["Main", "James only"],
  ["Status", "Phase 1, not running"],
] as const;

type Station = {
  kind: "step" | "gate";
  title: string;
  body: ReactNode;
  hold?: ReactNode;
};

const stations: Station[] = [
  {
    kind: "step",
    title: "1. Issue, then kick-off",
    body: (
      <>
        A person files a GitHub issue. The kick-off command takes the issue
        number, and Bleeps starts.
      </>
    ),
  },
  {
    kind: "step",
    title: "2. Spec",
    body: (
      <>
        Bleeps writes <code>spec.md</code> in{" "}
        <code>specs/&lt;issue&gt;-&lt;slug&gt;/</code>. It writes{" "}
        <code>design.md</code> only when the approach is the risky part.
      </>
    ),
  },
  {
    kind: "step",
    title: "3. Tasks",
    body: (
      <>
        Bleeps writes <code>tasks.md</code>, a checklist of the work.
      </>
    ),
  },
  {
    kind: "step",
    title: "4. Build, test, fix",
    body: (
      <>
        Bleeps builds, tests, and fixes in an isolated Orca worktree, with a
        round limit. The plan does not pick the number of rounds yet. If a
        change touches a guardrail, Bleeps stops and waits for a human.
      </>
    ),
  },
  {
    kind: "step",
    title: "5. Independent verify",
    body: (
      <>
        A separate reviewer reads the work and writes <code>verify.md</code>.
        The reviewer is read-only: no editing, and no shared context with the
        implementer. It is a second look, not the same run grading its own
        homework.
      </>
    ),
  },
  {
    kind: "gate",
    title: "Gate: Ready to ship?",
    body: (
      <>
        The verdict in <code>verify.md</code> has to be “Ready to ship”. That
        is the only verdict that continues.
      </>
    ),
    hold: <>Anything else stops the line. No pull request.</>,
  },
  {
    kind: "step",
    title: "6. Pull request",
    body: (
      <>
        Bleeps opens a pull request against <code>develop</code> and comments
        on the issue.
      </>
    ),
  },
  {
    kind: "step",
    title: "7. Layered review",
    body: (
      <>
        Three reviewers are planned. CodeRabbit takes style and obvious bugs.
        Devin, optionally, takes an end-to-end pass after its noise is
        calibrated. Claude Code checks architecture fit. Grok Bot watches the
        pull-request queue, failing CI, and review nudges. None of this layer
        is installed yet. CodeRabbit and Devin are Phase 2.
      </>
    ),
  },
  {
    kind: "gate",
    title: "Gate: All clear?",
    body: (
      <>
        A bloop lands on <code>develop</code> only when every gate passes:
        required checks are green, the verify verdict is “Ready to ship”,
        layered reviews passed with no blocking findings, and no guardrail was
        touched without a human sign-off. Label rules can still keep a ticket
        from auto-merging.
      </>
    ),
    hold: <>If a gate fails, the work stays on the branch. It does not land.</>,
  },
  {
    kind: "step",
    title: "8. Auto-merge to develop",
    body: (
      <>
        When every gate passes, the pull request merges into{" "}
        <code>develop</code>. That is the factory’s idea of shipped.
      </>
    ),
  },
  {
    kind: "step",
    title: "9. James promotes to main",
    body: (
      <>
        James merges <code>develop</code> into <code>main</code>. Bleeps never
        touches <code>main</code>.
      </>
    ),
  },
];

const phases: {
  title: string;
  current?: boolean;
  intro: ReactNode;
  items: string[];
}[] = [
  {
    title: "Phase 1. Foundations",
    current: true,
    intro: "None of this is done yet.",
    items: [
      "Install Orca on the home server.",
      "SSH in.",
      "Get Claude Code running in one worktree on a throwaway repo.",
      "Write the core orca.yaml (setup hook for deps, verification hook for tests and typecheck that blocks the pull request on failure, ship-PR skill).",
      "Add the ticket slash command as the front door.",
    ],
  },
  {
    title: "Phase 2. Review layer",
    intro: "Not started.",
    items: [
      "Install CodeRabbit Essentials.",
      "Optionally add Devin Pro after calibrating noise.",
      "Map controller buttons while living in terminal sessions.",
    ],
  },
  {
    title: "Phase 3. Merge policy",
    intro: (
      <>
        Not started.{" "}
        <a href={MERGE}>The merge decision</a> already chose the policy. These
        GitHub settings are still open in the plan.
      </>
    ),
    items: [
      "Create the develop branch.",
      "Branch protection on main, restricted to the owner.",
      "Auto-merge enabled on develop, with required checks.",
    ],
  },
  {
    title: "Phase 4. Onboard existing projects",
    intro: "Not started.",
    items: [
      "Symlink the shared orca.yaml and the project-specific override.",
      "Run the setup hook once per repo to confirm dependencies.",
    ],
  },
];

function Section({
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

function SquareWave() {
  return (
    <svg className="wave-bleep" viewBox="0 0 152 48" aria-hidden="true">
      <path
        d="M2 34 H18 V12 H40 V34 H62 V12 H84 V34 H106 V12 H128 V34 H150"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinejoin="miter"
        strokeLinecap="square"
      />
    </svg>
  );
}

function RoundWave() {
  return (
    <svg className="wave-bloop" viewBox="0 0 152 48" aria-hidden="true">
      <path
        d="M2 36 C 28 36, 36 10, 76 10 C 116 10, 124 36, 150 36"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

export default function HomePage() {
  return (
    <>
      <a
        href="#content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-3 focus:top-3 focus:z-20 focus:bg-amber focus:px-3 focus:py-2 focus:font-bold focus:text-ink hover:text-ink"
      >
        Skip to content
      </a>

      <header className="border-b border-line">
        <div className={wrap}>
          <nav className="site-nav" aria-label="On this page">
            <ul>
              <li>
                <a href="#factory">Factory</a>
              </li>
              <li>
                <a href="#line">Line</a>
              </li>
              <li>
                <a href="#guardrails">Guardrails</a>
              </li>
              <li>
                <a href="#habits">Habits</a>
              </li>
              <li>
                <a href="#setup">Setup</a>
              </li>
              <li>
                <a href="#roadmap">Roadmap</a>
              </li>
            </ul>
          </nav>
        </div>
      </header>

      <main id="content" tabIndex={-1}>
        <header className={`${wrap} hero pt-10 pb-14 md:pt-16 md:pb-20`}>
          <div className="grid gap-10 lg:grid-cols-[minmax(0,1.45fr)_minmax(16rem,0.8fr)] lg:items-start lg:gap-14">
            <div>
              <h1>
                Bleeps
                <span className="and">and Bloops</span>
              </h1>
              <p className="tagline">
                Bleeps does the work.
                <span className="out">Bloops are what come out.</span>
              </p>
              <p className="lede">
                James Hall’s ticket-to-merge factory for web and mobile apps. A
                person files the issue and steers. Only James promotes{" "}
                <code>develop</code> to <code>main</code>.
              </p>
              <figure className="waves">
                <div>
                  <SquareWave />
                  <p>
                    <strong>Bleeps</strong>, the system
                  </p>
                </div>
                <div>
                  <RoundWave />
                  <p>
                    <strong>A bloop</strong>, the result
                  </p>
                </div>
              </figure>
            </div>

            <div className="plate lg:mt-6">
              <p className="plate-kicker">In short</p>
              <dl>
                {plate.map(([term, detail]) => (
                  <div key={term}>
                    <dt>{term}</dt>
                    <dd>{detail}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>

          <ol className="beats" aria-label="From a ticket to a bloop">
            <li>
              <span className="beat-kicker">In</span>
              <strong className="beat-name">A ticket</strong>
              <span className="beat-note">A GitHub issue.</span>
            </li>
            <li>
              <span className="beat-kicker">System</span>
              <strong className="beat-name">Bleeps</strong>
              <span className="beat-note">
                Does the work. A human steers.
              </span>
            </li>
            <li>
              <span className="beat-kicker">Out</span>
              <strong className="beat-name">A bloop</strong>
              <span className="beat-note">
                A shipped pull request, a feature, an output.
              </span>
            </li>
          </ol>

          <p className="status">
            <strong>Being built now.</strong> The factory plan is pinned at
            Phase 1, ready to resume. The shared <code>orca.yaml</code> is
            still a draft. This page is the public front door, and it is new.
          </p>
        </header>

        <Section id="factory" index="01" title="The factory">
          <div className="grid gap-10 lg:grid-cols-[minmax(0,1.35fr)_minmax(16rem,0.75fr)] lg:gap-16">
            <div className="stack">
              <p>
                Bleeps and Bloops is the brand. The system is called Bleeps,
                short for Bleeps and Bloops, the way Kent C. Dodds’ assistant
                is called Kody. Bleeps does the work. A bloop is a result it
                produces: a shipped pull request, a feature, an output.
              </p>
              <p>
                On this line, shipped means the pull request merged to{" "}
                <code>develop</code>. Moving <code>develop</code> to{" "}
                <code>main</code> is James, afterward. Bleeps never touches{" "}
                <code>main</code>.
              </p>
              <p>
                One shared <code>orca.yaml</code> holds the slash command, the
                review rules, and the merge policy. Each project adds a smaller
                override. Orca, the MIT-licensed harness, is what runs Claude
                Code, Grok, and the others, each in its own worktree.
              </p>
              <p>
                <a href={DOCS}>Read the factory plan on GitHub</a>.
              </p>
            </div>
            <aside className="note">
              <h3>Rebuilt clean</h3>
              <div className="stack">
                <p>
                  A snapshot from 2026-11-11 is reference only. The factory is
                  being rebuilt clean from it. The old front door was{" "}
                  <code>/bb:kick-off</code> on an issue number. The new command
                  is that same job, written fresh.
                </p>
                <p>
                  Pieces the snapshot was missing, including the build loop and
                  the extra reviewers, get written fresh too. The core{" "}
                  <code>orca.yaml</code> is still a draft.
                </p>
              </div>
            </aside>
          </div>
        </Section>

        <Section id="line" index="02" title="How a bloop gets made">
          <p>
            Nothing here is running yet. This is the line the plan describes.
          </p>
          <p className="legend mt-5">
            <span className="key">
              <span className="swatch" aria-hidden="true" /> Step
            </span>
            <span className="key">
              <span className="swatch diamond" aria-hidden="true" /> Gate
            </span>
            <span className="key">
              <span className="swatch dashed" aria-hidden="true" /> Holds
            </span>
          </p>
          <ol className="flow" aria-label="Ticket to merge">
            {stations.map((station) => (
              <li key={station.title} className={station.kind}>
                <h3>{station.title}</h3>
                <p>{station.body}</p>
                {station.hold ? (
                  <p className="hold">
                    <strong>Holds.</strong> {station.hold}
                  </p>
                ) : null}
              </li>
            ))}
          </ol>
          <p className="mt-8">
            Still open: whether someone grooms or prioritizes an issue before
            kick-off.
          </p>
        </Section>

        <Section
          id="guardrails"
          index="03"
          title="Bleeps stops and asks"
          band
        >
          <div className="stack">
            <p>
              These five are already decided. Bleeps pauses for a human before
              it changes any of them. Automatic merge also stays shut if one
              was touched and nobody signed off.
            </p>
          </div>
          <ul className="guards">
            <li>Auth</li>
            <li>Billing</li>
            <li>Payments</li>
            <li>Data deletion</li>
            <li>Migrations</li>
          </ul>
          <p className="mt-8">
            The list is short on purpose. Everything else can move once the
            gates pass. These five wait.
          </p>
        </Section>

        <Section id="habits" index="04" title="Habits Bleeps keeps">
          <p>
            Four working habits carry forward from the earlier workflow into
            the rebuild. They are part of the plan. They are not a claim that
            a live run follows them today.
          </p>
          <dl className="habits mt-8">
            <div className="habit">
              <dt>explore-first</dt>
              <dd>
                If understanding the code would take three or more searches,
                Bleeps asks an Explore subagent for a short synthesis and keeps
                the raw dumps out of the main context. One lookup it already
                expects can stay put.
              </dd>
            </div>
            <div className="habit">
              <dt>delegate-cheap-work</dt>
              <dd>
                If success fits in one sentence (a rename, a docstring,
                boilerplate), Bleeps hands it to a cheaper model and skims the
                diff. Judgment stays on the main thread.
              </dd>
            </div>
            <div className="habit">
              <dt>verify-before-ship</dt>
              <dd>
                For a UI change, Bleeps looks at it in a browser at about 390px
                and 1280px and reads the console. Done means both widths look
                right and the console is clean. If there is no browser, Bleeps
                says the change is unverified.
              </dd>
            </div>
            <div className="habit">
              <dt>decompose-hotspot</dt>
              <dd>
                Before editing a file that keeps attracting changes, Bleeps
                proposes a split into three to five focused files and waits.
                Once the split is approved, it lands in its own commit.
              </dd>
            </div>
          </dl>
        </Section>

        <Section id="setup" index="05" title="Where Bleeps runs">
          <p>
            CodeRabbit, Devin, and Claude Code are the reviewers on the line,
            in step 7. CodeRabbit and Devin are Phase 2 and are not installed.
            The desk, the harness, and the watcher are below. None of them are
            switched on yet.
          </p>

          <div className="shop-block">
            <h3>Orca on a home server</h3>
            <div className="stack">
              <p>
                Orca is the harness. It is MIT-licensed and free. It runs
                Claude Code, Grok, and others in isolated worktrees, so one
                ticket does not trample another. The shared{" "}
                <code>orca.yaml</code> is the factory config. A second, smaller
                file overrides it per project.
              </p>
              <p>
                The machine is an older computer. James reaches it by SSH from
                a Mac. 8&nbsp;GB of RAM is the floor. 16&nbsp;GB is comfortable.
                Installing Orca there is the first unchecked item in Phase 1.
              </p>
            </div>
          </div>

          <div className="shop-block">
            <h3>Grok Bot, the watcher</h3>
            <div className="stack">
              <p>
                Grok Bot sits beside Bleeps. Its job, once the line is running,
                is the pull-request queue, failing CI, and review nudges. It
                does not merge, and it does not touch <code>main</code>.
              </p>
              <p>It is not a live bot yet.</p>
            </div>
          </div>

          <div className="shop-block">
            <h3>A game controller for the terminal</h3>
            <div className="stack">
              <p>
                The planned desk is a USB game controller, remapped with
                Karabiner-Elements, so a terminal session can be driven without
                living on the number row. Mapping the buttons is Phase 2, done
                while actually living in those sessions. Nothing is mapped yet.
              </p>
            </div>
            <div className="table-wrap">
              <table>
                <caption>
                  Planned actions. Which physical button does which job is not
                  decided. Mapping them is Phase 2.
                </caption>
                <thead>
                  <tr>
                    <th scope="col">Action</th>
                    <th scope="col">Mapping</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <th scope="row">Text-to-speech toggle</th>
                    <td>Controller button</td>
                  </tr>
                  <tr>
                    <th scope="row">Enter</th>
                    <td>Controller button</td>
                  </tr>
                  <tr>
                    <th scope="row">Tab</th>
                    <td>Controller button</td>
                  </tr>
                  <tr>
                    <th scope="row">Escape</th>
                    <td>Controller button</td>
                  </tr>
                  <tr>
                    <th scope="row">Arrow keys</th>
                    <td>D-pad</td>
                  </tr>
                  <tr>
                    <th scope="row">Number keys</th>
                    <td>Left unmapped</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </Section>

        <Section id="roadmap" index="06" title="Roadmap">
          <blockquote className="roadmap-quote">
            <p>
              Pinned for later. The draft core <code>orca.yaml</code> is still
              open. Ready to resume.
            </p>
          </blockquote>
          <p className="mt-4">
            That is the current note on the{" "}
            <a href={ROADMAP}>roadmap on GitHub</a>. The current phase is Phase
            1,
            Foundations.
          </p>
          {phases.map((phase) => (
            <article
              key={phase.title}
              className={phase.current ? "phase current" : "phase"}
            >
              {phase.current ? (
                <p className="flag">Current phase</p>
              ) : (
                <p className="later">Later</p>
              )}
              <h3>{phase.title}</h3>
              <p className="mt-3">{phase.intro}</p>
              <ul className="tasks">
                {phase.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </article>
          ))}
        </Section>
      </main>

      <footer className="site-footer">
        <div className={`${wrap} stack py-12`}>
          <p>
            Bleeps and Bloops is James Hall’s factory. Bleeps does the work.
            Bloops are what come out.
          </p>
          <p>
            Being built now. This page does not invent customers, uptime, or a
            finished product.
          </p>
          <p>
            <a href={DOCS}>Read the factory plan on GitHub</a>
          </p>
        </div>
      </footer>
    </>
  );
}
