# Bleeps and Bloops

This repository is the home of Bleeps, the system behind [bleepsandbloops.com](https://bleepsandbloops.com). Bleeps turns a ticket into a merged pull request. What it ships is a bloop.

The public site lives in [`site/`](site/). It is a Next.js app. On Vercel, set the project **Root Directory** to `site/`.

```bash
cd site
npm install
npm run dev
```

`npm run build` runs in `site/` as well.

It is being rebuilt from scratch. The previous website code lives on the `legacy` branch.

The plan is in [docs](docs/README.md). Agents start at [AGENTS.md](AGENTS.md). The building blocks are the [primitives](docs/primitives.md). To adopt Bleeps on a repository of your own, read [Using Bleeps](docs/using-bleeps.md).
