import type { ReactNode } from "react";

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
  home: blob("docs/home-server.md"),
  example: blob("examples/orca.project.yaml"),
  blip: blob("agents/blip/ROLE.md"),
};

const nav = [
  { href: "/start/new", id: "new", label: "New project" },
  { href: "/start/existing", id: "existing", label: "Existing project" },
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

export function BlipNote() {
  return (
    <p>
      Blip is the QA lead. Blip sets up and maintains the unit, integration,
      and end-to-end tests. On a web app, end-to-end defaults to Playwright.
      Put <code>test</code>, or <code>test_unit</code>,{" "}
      <code>test_integration</code>, and <code>test_e2e</code>, in{" "}
      <code>orca.project.yaml</code>. Green tests are a hard gate before
      auto-merge. A missing test command fails <code>bleeps test</code>. The{" "}
      <a href={links.blip}>role is in the repo</a>.
    </p>
  );
}
