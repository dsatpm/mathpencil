<a href="https://mathpencil.com">
  <img src="public/mathpencil.png" alt="MathPencil logo" width="300" />
</a>

A calculator that prints its working to a paper tape, the way a desktop adding
machine does.

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

## How the machine is put together

```
app/
├── root.tsx                    # document shell, fonts, AdSense loader
├── routes.ts                   # / and /contact
├── app.css                     # theme tokens, fonts, the two animations
├── routes/
│   ├── home.tsx                # the machine on its desk, then the notes
│   ├── contact.tsx
│   ├── privacy.tsx             # privacy policy
│   └── terms.tsx               # terms of use
├── components/
│   ├── SiteHeader.tsx          # masthead; nav links live in NAV_LINKS
│   ├── SiteFooter.tsx          # legal bar; links live in FOOTER_LINKS
│   ├── PaperSheet.tsx          # a sheet of paper on the desk, for prose
│   ├── MachineNotes.tsx        # what it is for, how to use it, how it works, FAQ
│   ├── AddingMachine.tsx       # assembles the machine, owns the keyboard
│   ├── Tape.tsx                # the paper; newest line at the platen
│   ├── Keypad.tsx              # the machine face
│   ├── Key.tsx                 # one moulded key
│   ├── OperationsTooltip.tsx   # the "Calculator Operations" legend
│   └── Docket.tsx              # paste a written sum and solve it
└── lib/
    ├── calc-engine.ts          # the keypad's state machine
    ├── parse-expression.ts     # the docket's parser
    └── format.ts               # how numbers are printed
```

Two different kinds of arithmetic, on purpose. The keypad runs
**immediate-execution** semantics, like a physical adding machine: `2 + 3 × 4`
resolves left to right to 20. The docket honours **operator precedence and
brackets**, because written arithmetic does. A keypad that silently applied
precedence would contradict the tape printed above it.

## Keyboard and number pad

The keyboard is a first-class way in, not a fallback — it works the moment the
page loads, without clicking into anything.

| Keys | Does |
| --- | --- |
| `0`–`9`, `.` `,` | Key a number |
| `+` `-` `*` `x` `/` | Operators |
| `Enter` `=` | Total |
| `Backspace` | Rub out the last digit |
| `Delete`, `Clear` | Clear entry |
| `Escape` | All clear |
| `%` | Percent |
| `Tab` + `Enter` | Press the focused key |

The numeric keypad is read from `event.code`, not `event.key`, so it keeps
working with Num Lock off — where a keypad otherwise reports `End`, `PageDown`
and the like.

## Accessibility

- **Browser zoom and text-size settings.** Every measurement is in `rem`, and
  the two figures that need to grow with their container use `cqi` inside a
  container query rather than `vw`. A viewport unit ignores the browser's text
  size; these do not. Paper, keys and figures scale together.
- **Pinch-zoom** is left alone. Nothing caps the viewport scale, and
  `touch-action: manipulation` on buttons only kills the double-tap delay.
- **Keyboard-only.** Tab reaches every key; Enter presses the focused one
  rather than totalling the machine.
- **Screen readers.** The tape is a `role="log"`, the platen line an
  `aria-live` `<output>`, and every glyph-only key carries a label.
- `prefers-reduced-motion` turns off the strike and the paper advance.

## Percentages

`%` converts, it does not guess. Keying `25 × 20 %` prints `20%` on the tape
and leaves `0.2` at the platen; `=` then totals `5`. After `+` or `-` it reads
as a percentage *of* the running total, which is what the key does on a
physical machine: `200 + 10 %` is ten percent of two hundred.

## The written pages

Everything below the machine on the home page — what it is for, how to work it,
what the awkward keys do, how the two engines differ, and the FAQ — lives in
`MachineNotes.tsx`. It sits below the fold on purpose: the One-Fold Rule is
about what is needed to get an answer, and none of it is. The FAQ array is
exported and fed straight into the page's `FAQPage` structured data, so the
markup a crawler reads can never drift from the text a visitor reads.

`/privacy` and `/terms` are plain prerendered pages on the same paper. Both
carry an `EFFECTIVE` constant at the top; change the text, change the date.

## Ads

The AdSense loader sits in the document head in `app/root.tsx`, keyed by
`ADSENSE_CLIENT`. No `<ins class="adsbygoogle">` slots are placed — auto ads
inject themselves if they are switched on in the AdSense dashboard.

Two things are configured in the AdSense dashboard rather than in this repo,
and the privacy policy assumes both are on:

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
