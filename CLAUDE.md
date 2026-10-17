# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm install
npm run dev        # http://localhost:5173
npm run typecheck  # react-router typegen && tsc — the only gate besides the build
npm run build      # → build/client (prerendered HTML) and build/server
npm run start      # serve the production build
```

There is no test runner and no linter in this repo. CI (`.github/workflows/ci.yml`)
runs `npm ci`, `npm run typecheck`, `npm run build`, then asserts
`build/client/index.html` and `build/client/contact/index.html` exist. Run
`npm run typecheck` and `npm run build` before committing; a failing build on
`main` breaks production, because the server pulls and deploys `main` on a timer.

`npm run typecheck` regenerates `.react-router/types`. Route modules import their
own generated types (`import type { Route } from "./+types/home"`), so a new route
will not typecheck until typegen has run.

## Architecture

React Router 8 in framework mode, **prerendered, not server-rendered**.
`react-router.config.ts` sets `ssr: false, prerender: true` because no route uses a
`loader` or `action`. The build emits static HTML that nginx serves directly — there
is no Node process in production. Adding a `loader` or `action` to any route breaks
that assumption and the deployment model; do not add one without changing
`react-router.config.ts` and `docs/deploy.md` together.

Routes are declared explicitly in `app/routes.ts` (no file-system routing).

### The three instruments

The site is three calculators that **deliberately disagree**, plus three legal/contact
pages. Each instrument is a hand-written state machine or parser in `app/lib/`,
driven by presentational components in `app/components/`:

| Page | Engine | Semantics |
| --- | --- | --- |
| `/` | `calc-engine.ts` (reducer), `parse-expression.ts` (the paste-a-sum docket) | Immediate execution. `2 + 3 × 4` is **20** |
| `/scientific` | `sci-engine.ts` (reducer), `parse-scientific.ts` | Operator precedence. `2 + 3 × 4` is **14** |
| `/pre-algebra` | `linear-solver.ts` | Exact fractions, one unknown, every step shown |

That disagreement is a design decision, not a bug. A printing adding machine
resolves each operator as it is pressed, and the tape prints exactly that route; a
keypad that silently applied precedence would contradict the tape above it. `%`
differs the same way: on `/` it converts and reads as a percentage *of* the running
total after `+`/`-`; on `/scientific` it only divides by a hundred. Before
"fixing" an arithmetic difference between the two pages, check the README section
that documents it.

**Never use `eval` or `new Function`.** Every parser here is written by hand
because visitor input is untrusted, and arbitrary code execution is far too large a
capability to hand a calculator.

The engines are pure: `(state, action) => state`, formatting delegated to
`format.ts`. Keyboard handling lives in the assembling components
(`AddingMachine.tsx`, `ScientificCalculator.tsx`), not in the engines. Key events
read `event.code`, not `event.key`, so the number pad keeps working with Num Lock
off.

### Content as data

`/pre-algebra` renders from `app/data/pre-algebra.json` → `app/data/pre-algebra.ts`
(typed objects). Adding a topic is one entry in `TOPICS`; the contents chalkboard,
the count in the introduction, and the page's structured data all derive from the
same arrays.

Each notes component (`MachineNotes.tsx`, `ScientificNotes.tsx`) exports its FAQ
array, and the route feeds that same array into its `FAQPage` JSON-LD. Markup a
crawler reads can never drift from text a visitor reads — keep it that way when
editing FAQ copy.

### Metadata

Every route exports `meta()` with canonical, Open Graph, Twitter, and JSON-LD
entries built from `absoluteUrl()` in `app/lib/site.ts`. Crawlers fetch these with no
idea what host they came from, so all URLs are absolute. Copy `routes/home.tsx`'s
`meta()` shape for a new page.

### Styling

Tailwind 4, configured entirely in the `@theme` block of `app/app.css` — there is no
`tailwind.config.js`. Each instrument has its own token family (`--color-desk*`,
`--color-tape*`, `--color-ribbon` for the adding machine; `--color-sci-*` for the
scientific calculator; grid-paper and chalkboard tokens for the lesson). Reach for an
existing token rather than a literal hex.

Measurements are in `rem`; figures that scale with their container use `cqi` inside a
container query, never `vw` — viewport units ignore the browser's text-size setting.
Nothing caps the viewport scale, and `prefers-reduced-motion` disables the strike,
the paper advance, and the caret blink.

## Voice

You are a programming expert and an educator. Copy in this app is the voice of
support and information. Write for a reader who is capable and may simply not know
this yet.

- State facts; do not assume what the reader knows, feels, or has already tried.
- Nothing condescending, no "simply", "just", "obviously", "easy".
- No em dashes anywhere a visitor can read. Commas, colons and full stops instead.
- Explain the mechanism, not only the result. `/pre-algebra` is pitched at a junior
  high student taking the class for the first time (set in `pre-algebra.json`).

## Interface house rules

- **No side-tab accent borders.** A thick rule down one side of a card is the most
  recognisable tell of a generated interface.
- The One-Fold Rule: the instrument keeps the first viewport. Everything a visitor
  does not need in order to get an answer sits below it.
- Glyph-only keys carry labels; the tape is `role="log"`, the platen line an
  `aria-live` `<output>`. Tab reaches every key and Enter presses the focused key
  rather than totalling the machine.

## Deploying

Pull, not push. A systemd timer on the VPS runs `.scripts/poll-deploy.sh` every two
minutes; when `origin/main` has moved it runs `.scripts/deploy.sh`, which does
`git reset --hard origin/main`, `npm ci`, `npm run build`, then rsyncs
`build/client` to the webroot. **Nothing edited directly on the server survives.**
Full details, nginx config, and troubleshooting are in `docs/deploy.md`.

Consequence: merging to `main` ships within about two minutes. Releases are recorded
in `CHANGELOG.md` and tagged `vX.Y.Z`; `package.json`'s `version` tracks it.

`ads.txt` at the repo root is served at `/ads.txt` and must keep matching
`ADSENSE_CLIENT` in `app/root.tsx`.
