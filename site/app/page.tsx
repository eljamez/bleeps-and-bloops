import { REPO, Section, SiteShell, wrap } from "./shell";

export const dynamic = "force-static";

const plate = [
  ["Doer", "Bleeps"],
  ["Merges", "Bloops"],
  ["Harness", "Orca"],
  ["Lands on", "develop"],
  ["Main", "You promote it"],
] as const;

const stations: {
  kind: "step" | "gate";
  title: string;
  body: string;
  hold?: string;
}[] = [
  {
    kind: "step",
    title: "1. A GitHub issue",
    body: "You file an issue, or Chip files one. That issue is the ticket.",
  },
  {
    kind: "step",
    title: "2. Spec and tasks",
    body: "Beep writes spec.md in specs/<issue>-<slug>/, and design.md only when the approach is the risky part. tasks.md is the checklist, and it includes the tests.",
  },
  {
    kind: "step",
    title: "3. Build in an Orca worktree",
    body: "Buzz builds, tests, and fixes in an isolated worktree, with a round limit. Blip writes the tests. A guardrail change waits for you.",
  },
  {
    kind: "step",
    title: "4. Independent verify",
    body: "Echo reads the work and writes verify.md. Echo is read-only, does not share the builder's context, and does not edit.",
  },
  {
    kind: "gate",
    title: "Gate: Ready to ship?",
    body: "The verdict has to be “Ready to ship”. That is the verdict that opens a pull request.",
    hold: "Any other verdict stops the line before a pull request.",
  },
  {
    kind: "step",
    title: "5. Pull request and review",
    body: "The pull request targets develop. CodeRabbit, optionally Devin, and Claude Code review it. Grok Bot watches the queue, failing CI, and review nudges.",
  },
  {
    kind: "gate",
    title: "Gate: All clear?",
    body: "Tests and the other required checks are green, verify says Ready to ship, reviews have no blocking findings, and a guardrail change has your sign-off.",
    hold: "A failed gate leaves the work on the branch.",
  },
  {
    kind: "step",
    title: "6. Merge to develop",
    body: "When the gates pass, Bloops reports the merge through scripts/merge-pr, then studies the run. The script does not turn on GitHub auto-merge. That setting is still an open question.",
  },
  {
    kind: "step",
    title: "7. You promote main",
    body: "You merge develop into main. Bleeps never touches main.",
  },
];

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
    <SiteShell>
      <header className={`${wrap} hero pt-10 pb-14 md:pt-16 md:pb-20`}>
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1.45fr)_minmax(16rem,0.8fr)] lg:items-start lg:gap-14">
          <div>
            <h1>
              Bleeps <span className="and">and Bloops</span>
            </h1>
            <p className="tagline">
              Bleeps runs the crew.
              <span className="out">Bloops merges, then learns.</span>
            </p>
            <p className="lede">
              Bleeps is the doer, built for the Orca agent harness. Bleeps runs
              the crew and gets the work done. Bloops is the agent that merges
              pull requests through a script and studies each run so every
              agent&apos;s skills improve. You use it on your own projects. You
              file the issue and steer, and you promote <code>develop</code> to{" "}
              <code>main</code>.
            </p>
            <figure className="waves">
              <div>
                <SquareWave />
                <p>
                  <strong>Bleeps</strong>, runs the crew
                </p>
              </div>
              <div>
                <RoundWave />
                <p>
                  <strong>Bloops</strong>, merges and improves
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

        <h2 className="ways-title">Two ways in</h2>
        <ul className="paths">
          <li>
            <a className="path-card" href="/start/new">
              <span className="index">New</span>
              <strong>Start a new project</strong>
              <span>
                Create the repository, the branches, and the files the line
                expects.
              </span>
              <span className="go">Start</span>
            </a>
          </li>
          <li>
            <a className="path-card" href="/start/existing">
              <span className="index">Existing</span>
              <strong>Add Bleeps to an existing project</strong>
              <span>
                Keep the repository you have. Add develop, the router, and the
                gates.
              </span>
              <span className="go">Start</span>
            </a>
          </li>
        </ul>
        <p className="mt-6">
          <a href={REPO}>Bleeps and Bloops on GitHub</a>
        </p>

        <ol className="beats" aria-label="From a ticket to a merge">
          <li>
            <span className="beat-kicker">In</span>
            <strong className="beat-name">A ticket</strong>
            <span className="beat-note">
              A GitHub issue, from you or from Chip.
            </span>
          </li>
          <li>
            <span className="beat-kicker">Crew</span>
            <strong className="beat-name">Bleeps</strong>
            <span className="beat-note">Runs the crew. You steer.</span>
          </li>
          <li>
            <span className="beat-kicker">Merge</span>
            <strong className="beat-name">Bloops</strong>
            <span className="beat-note">
              Merges to develop, then studies the run.
            </span>
          </li>
        </ol>

        <p className="status">
          <strong>Phase 1.</strong> The shared <code>orca.yaml</code> is in the
          repo. The home server is not running the factory yet.{" "}
          <code>scripts/merge-pr</code> checks the gates and does not turn on
          GitHub auto-merge. That setting is still an open question.
        </p>
      </header>

      <Section id="line" index="01" title="From an issue to develop">
        <p>
          This is the line, from a GitHub issue to a merge on{" "}
          <code>develop</code>. The{" "}
          <a href="/using-bleeps">day-to-day page</a> walks each step.
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
        <ol className="flow" aria-label="Issue to merge">
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
      </Section>

      <Section id="patrol" index="02" title="It also goes looking">
        <div className="stack">
          <p>
            Chip patrols the project on a schedule: failing tests, CI breaks,
            lint and type errors, dependency advisories, and friction-log
            items. Chip files an issue and the same crew takes it through the
            line, with the same sign-off on guardrails.
          </p>
          <p>
            A project turns the patrol on or off in{" "}
            <code>orca.project.yaml</code>.{" "}
            <a href="/using-bleeps#crew">Meet the crew</a>, including how the
            switch works.
          </p>
        </div>
      </Section>

      <Section id="guardrails" index="03" title="Bleeps stops and asks" band>
        <p>
          Five areas wait for you before they change, and again before they
          merge. Everything else can move once the gates pass.
        </p>
        <ul className="guards">
          <li>Auth</li>
          <li>Billing</li>
          <li>Payments</li>
          <li>Data deletion</li>
          <li>Migrations</li>
        </ul>
        <p className="mt-8">
          <a href="/using-bleeps#guardrails">How sign-off works</a>
        </p>
      </Section>
    </SiteShell>
  );
}
