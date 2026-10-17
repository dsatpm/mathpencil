<a href="https://mathpencil.com">
  <img src="public/mathpencil.png" alt="MathPencil logo" width="300" />
</a>

Three instruments on one desk: a calculator that prints its working to a paper
tape, a scientific calculator that shows the whole expression before it answers
it, and a pre-algebra lesson with a solver that shows every step.

Server-rendered with React Router 8, styled with Tailwind 4.

## Running it

```bash
npm install
npm run dev      # http://localhost:5173
```

```bash
npm run typecheck   # react-router typegen && tsc
npm run build       # → build/client and build/server
npm run start       # serve the production build
```

## The three instruments

| Page | What it is | Arithmetic |
| --- | --- | --- |
| `/` | A printing adding machine. Every entry prints to a tape, the total is struck in ribbon red. | Immediate execution, like a physical keypad |
| `/scientific` | An engineer's calculator. The keys build a whole expression in a liquid-crystal window. | Operator precedence, brackets, powers |
| `/pre-algebra` | A course in twelve chapters, with a solver on two chalkboards. | Exact fractions, one unknown |

They disagree on purpose. `2 + 3 × 4` is 20 on the home page, because a printing
machine resolves each operator as it is pressed and the tape shows exactly that
route. It is 14 on `/scientific`, because written arithmetic binds × tighter
than +. A keypad that silently applied precedence would contradict the tape
printed above it.

Each instrument has its own palette and nothing else changes: the desk, the
paper and the type are shared. The adding machine is cream and ribbon red, the
scientific calculator is graphite with a pale crystal window, and the lesson is
cool grid paper with a chalkboard for the working.

## How it is put together

```
app/
├── root.tsx                    # document shell, fonts, AdSense loader
├── routes.ts                   # /, /scientific, /pre-algebra and its chapters, /contact, /privacy, /terms
├── app.css                     # theme tokens for all three instruments, fonts, animations
├── routes/
│   ├── home.tsx                # the adding machine on its desk, then the notes
│   ├── scientific.tsx          # the scientific calculator, then its notes
│   ├── pre-algebra.tsx         # the course hub: the twelve chapters, and nothing they hold
│   ├── pre-algebra.chapter.tsx # one module, twelve chapter pages, at /pre-algebra/<slug>
│   ├── pre-algebra.solver.tsx  # the solver on a page of its own
│   ├── contact.tsx
│   ├── privacy.tsx             # privacy policy
│   └── terms.tsx               # terms of use
├── components/
│   ├── SiteHeader.tsx          # masthead; nav links live in NAV_LINKS
│   ├── SiteFooter.tsx          # legal bar; links live in FOOTER_LINKS
│   ├── ScrollToTop.tsx         # appears after 1.5 screens; tone per page
│   ├── PaperSheet.tsx          # a sheet of paper on the desk, for prose
│   │
│   ├── AddingMachine.tsx       # assembles the machine, owns the keyboard
│   ├── Tape.tsx                # the paper; newest line at the platen
│   ├── Keypad.tsx              # the machine face
│   ├── Key.tsx                 # one moulded key
│   ├── OperationsTooltip.tsx   # the "Calculator Operations" legend
│   ├── Docket.tsx              # paste a written sum and solve it
│   ├── MachineNotes.tsx        # what it is for, how to use it, how it works, FAQ
│   │
│   ├── ScientificCalculator.tsx # assembles the instrument, owns the keyboard
│   ├── SciDisplay.tsx          # the crystal window, indicators and struck log
│   ├── SciKeypad.tsx           # the face; shift reaches the gold labels
│   ├── SciKey.tsx              # one key, with its second function printed above
│   ├── ScientificNotes.tsx     # how to work it, every key, FAQ
│   │
│   ├── OnThisPage.tsx          # the contents chalkboard; crosses off as you scroll
│   ├── ChapterNav.tsx          # the chapter board: the course, then this page's sections
│   ├── Breadcrumbs.tsx         # the trail; the same array feeds the BreadcrumbList
│   ├── ChapterPager.tsx        # previous and next, at the foot of a chapter
│   └── PreAlgebraSolver.tsx    # the two boards: solve, and evaluate
├── hooks/
│   └── useSectionSpy.ts        # which section you are in; both contents lists use it
├── data/
│   ├── pre-algebra.json        # the upstream content record, not imported anywhere
│   └── pre-algebra.ts          # CHAPTERS: the whole course as typed objects
└── lib/
    ├── calc-engine.ts          # the adding machine's state machine
    ├── parse-expression.ts     # the docket's parser
    ├── sci-engine.ts           # the scientific calculator's state machine
    ├── parse-scientific.ts     # functions, powers, constants, angle modes
    ├── linear-solver.ts        # exact fractions, one unknown, working shown
    ├── pre-algebra-style.ts    # the class strings the course pages share
    ├── site.ts                 # absolute URLs, and the shared meta() tags
    └── format.ts               # how numbers are printed

scripts/
└── sitemap.mjs                 # postbuild; writes the sitemap from what was built
```

Every parser here is written by hand. None of them call `eval` or
`new Function`: what a visitor types is untrusted input, and the ability to run
arbitrary code is far too large a capability to hand a calculator.

## Keyboard and number pad

The keyboard is a first-class way in, not a fallback. It works the moment a page
loads, without clicking into anything.

| Keys | Adding machine | Scientific |
| --- | --- | --- |
| `0`–`9`, `.` `,` | Key a number | Write a number |
| `+` `-` `*` `/` | Operators | Operators |
| `x` | Multiply | A letter, for spelling `exp` |
| `^` | | To the power of |
| `(` `)` | | Brackets; any left open close themselves |
| Letters | | Spell a function: `sin(45)` |
| `!` `%` | `%` only | Factorial, and divide by a hundred |
| `Enter` `=` | Total | Total |
| `Backspace` | Rub out the last digit | Rub out the last key press, whole |
| `Delete`, `Clear` | Clear entry | Clear the expression |
| `Escape` | All clear | All clear |
| `Tab` + `Enter` | Press the focused key | Press the focused key |

The numeric keypad is read from `event.code`, not `event.key`, so it keeps
working with Num Lock off, where a keypad otherwise reports `End`, `PageDown`
and the like.

## Accessibility

- **Browser zoom and text-size settings.** Every measurement is in `rem`, and
  the figures that need to grow with their container use `cqi` inside a
  container query rather than `vw`. A viewport unit ignores the browser's text
  size; these do not. Paper, keys and figures scale together.
- **Pinch-zoom** is left alone. Nothing caps the viewport scale, and
  `touch-action: manipulation` on buttons only kills the double-tap delay.
- **Keyboard-only.** Tab reaches every key; Enter presses the focused one rather
  than totalling the machine. Scroll to top moves focus to the `h1`, so a
  keyboard visitor's place travels with the page.
- **Screen readers.** The tape is a `role="log"`, the platen line an `aria-live`
  `<output>`, the struck log on `/scientific` is another `role="log"`, and every
  glyph-only key carries a label.
- **Focus rings take the ink of what they are over**: impact black on paper,
  gold on the instrument, biro blue on grid paper, chalk on a board.
- `prefers-reduced-motion` turns off the strike, the paper advance and the caret
  blink, and draws the chalk stroke without travelling.

## Percentages, which differ by instrument

On the adding machine, `%` converts rather than guesses. Keying `25 × 20 %`
prints `20%` on the tape and leaves `0.2` at the platen; `=` then totals `5`.
After `+` or `-` it reads as a percentage *of* the running total, which is what
the key does on a physical machine: `200 + 10 %` is ten percent of two hundred.

On `/scientific`, `%` divides by a hundred and does nothing else, so `200 + 10%`
is `200.1`. Both behaviours are documented on their own pages, because the
difference is the kind of thing that otherwise gets filed as a bug.

## The written pages

Everything below the machine on the home page lives in `MachineNotes.tsx`, and
the same for `ScientificNotes.tsx`. Both sit below the fold on purpose: the
One-Fold Rule is about what is needed to get an answer, and none of it is. Each
FAQ array is exported and fed straight into that page's `FAQPage` structured
data, so the markup a crawler reads can never drift from the text a visitor
reads.

`/pre-algebra` is a course in twelve chapters. The hub lists them; each chapter
is its own page at `/pre-algebra/<slug>`, and the lessons inside a chapter are
sections of that page rather than pages of their own. The solver has a page at
`/pre-algebra/solver` and is mounted again inside the chapter on equations.

The whole course is `app/data/pre-algebra.ts`, in one `CHAPTERS` array, written
for a junior high student taking the class for the first time. Adding a chapter
is one object: the hub grid, the chapter board, previous and next, the list of
pages the build prerenders, the sitemap and the structured data all follow from
it. Topics, formulas, vocabulary and worked examples each belong to exactly one
chapter, and the hub does not restate any of them.

`/privacy` and `/terms` are plain prerendered pages on the same paper. Both
carry an `EFFECTIVE` constant at the top; change the text, change the date.

## House style

- **No em dashes** anywhere a visitor can read. Commas, colons and full stops
  instead.
- **No side-tab accent borders.** A thick rule down one side of a card is the
  most recognisable tell of a generated interface.
- Releases are recorded in [`CHANGELOG.md`](CHANGELOG.md) and tagged `vX.Y.Z`.

## Ads

The AdSense loader sits in the document head in `app/root.tsx`, keyed by
`ADSENSE_CLIENT`. No `<ins class="adsbygoogle">` slots are placed; auto ads
inject themselves if they are switched on in the AdSense dashboard.

Two things are configured in the AdSense dashboard rather than in this repo, and
the privacy policy assumes both are on:

- **A consent message for the EEA, the UK and Switzerland.** AdSense →
  Privacy & messaging → GDPR. Google requires a certified CMP for traffic from
  those regions, and `/privacy` states that visitors there are asked for
  consent. No code change is needed; it ships with the ad tag.
- **A US states message**, if you want the CCPA opt-out surfaced in-page.

`ads.txt` at the repo root is served at `/ads.txt` and must keep matching the
publisher ID in `ADSENSE_CLIENT`.

## Deploying

The built-in server is production-ready. Deploy the output of `npm run build`:

```
├── package.json
├── package-lock.json
├── build/
│   ├── client/    # static assets
│   └── server/    # server-side code
```

Or build the image:

```bash
docker build -t mathpencil .
docker run -p 3000:3000 mathpencil
```

---

Built by <a href="https://htpdevs.tech">
  <picture>
    <!-- The transparent mark is white type, so it only survives on a dark
         ground; light themes get the version with its own background. -->
    <source media="(prefers-color-scheme: dark)" srcset="public/htpdevs.png" />
    <img src="docs/htpdevs.jpg" alt="HTPdevs" width="140" />
  </picture>
</a>
