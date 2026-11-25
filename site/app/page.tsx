import system, { fill, sourceList } from "./system";
import { BotsNote, REPO, Section, SiteShell, wrap } from "./shell";

export const dynamic = "force-static";

const plate = [
  ["Doer", "Bleeps"],
  ["Merges", "Bloops"],
  ["Harness", "Orca"],
  ["Lands on", "develop"],
  ["Main", "You promote it"],
] as const;

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
              {sourceList()}. You or Chip.
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
          repo. You choose where Orca runs. The default is the computer in
          front of you.           <code>scripts/merge-pr</code> checks the gates and does
          not merge. A chore lane is off unless you opt in. The setup is in
          the repository.
        </p>
      </header>

      <Section id="line" index="01" title="From a ticket to develop">
        <p>
          This is the line, from a ticket to a merge on <code>develop</code>.
          GitHub holds the code, the pull request, and CI. The{" "}
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
          {system.pipeline.map((station) => (
            <li key={station.title} className={station.kind}>
              <h3>{station.title}</h3>
              <p>{fill(station.body)}</p>
              {station.hold ? (
                <p className="hold">
                  <strong>Holds.</strong> {fill(station.hold)}
                </p>
              ) : null}
            </li>
          ))}
        </ol>
      </Section>

      <Section id="bots" index="02" title="Optional: run the crew as Orca bots">
        <BotsNote />
      </Section>

      <Section id="patrol" index="03" title="It also goes looking">
        <div className="stack">
          <p>
            Chip patrols the project on a schedule: failing tests, CI breaks,
            lint and type errors, dependency advisories, and friction-log
            items. Chip files a GitHub issue and posts the finding to each
            other source the project configured. Open friction issues are not
            copied. The same crew takes the GitHub issue through the line,
            with the same sign-off on guardrails.
          </p>
          <p>
            A project turns the patrol on or off in{" "}
            <code>orca.project.yaml</code>.{" "}
            <a href="/using-bleeps#crew">Meet the crew</a>, including how the
            switch works.
          </p>
        </div>
      </Section>

      <Section id="guardrails" index="04" title="Bleeps stops and asks" band>
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
