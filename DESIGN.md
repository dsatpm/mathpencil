---
name: Calculation
description: A printing adding machine on a petrol-green desk, where the tape is the interface and the total is struck in red.
colors:
  desk: "#12302C"
  desk-deep: "#0C211F"
  desk-edge: "#1C423C"
  tape: "#F2ECE0"
  tape-shade: "#E3DACB"
  docket: "#E9E2D3"
  ink: "#241F1C"
  ink-soft: "#5C544A"
  ribbon: "#C0392B"
  key-act: "#E8622A"
  key-act-deep: "#B8481C"
  body: "#2C3A37"
  body-lip: "#3B4B47"
  key: "#1D2725"
  key-face: "#F4EFE6"
  platen: "#171F1D"
typography:
  platen:
    fontFamily: "Sometype Mono, ui-monospace, SFMono-Regular, Menlo, monospace"
    fontSize: "clamp(2.6rem, 11vw, 4.5rem)"
    fontWeight: 500
    lineHeight: 1.08
    letterSpacing: "normal"
    fontFeature: "tabular-nums"
  answer:
    fontFamily: "Sometype Mono, ui-monospace, SFMono-Regular, Menlo, monospace"
    fontSize: "clamp(1.6rem, 7vw, 2.5rem)"
    fontWeight: 500
    lineHeight: 1
    fontFeature: "tabular-nums"
  printed:
    fontFamily: "Sometype Mono, ui-monospace, SFMono-Regular, Menlo, monospace"
    fontSize: "0.9rem"
    fontWeight: 400
    lineHeight: "1.35rem"
    fontFeature: "tabular-nums"
  gutter-mark:
    fontFamily: "Sometype Mono, ui-monospace, SFMono-Regular, Menlo, monospace"
    fontSize: "0.72rem"
    fontWeight: 600
    lineHeight: 1
  keycap-digit:
    fontFamily: "Sometype Mono, ui-monospace, SFMono-Regular, Menlo, monospace"
    fontSize: "1.4rem"
    fontWeight: 500
    lineHeight: 1
  act-label:
    fontFamily: "Familjen Grotesk, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1.2rem"
    fontWeight: 700
    lineHeight: 1
    letterSpacing: "0.2em"
  keycap-function:
    fontFamily: "Familjen Grotesk, ui-sans-serif, system-ui, sans-serif"
    fontSize: "0.9rem"
    fontWeight: 600
    lineHeight: 1
    letterSpacing: "0.06em"
  chiclet-label:
    fontFamily: "Familjen Grotesk, ui-sans-serif, system-ui, sans-serif"
    fontSize: "0.72rem"
    fontWeight: 600
    lineHeight: 1
    letterSpacing: "0.1em"
  nameplate:
    fontFamily: "Familjen Grotesk, ui-sans-serif, system-ui, sans-serif"
    fontSize: "0.72rem"
    fontWeight: 700
    lineHeight: 1
    letterSpacing: "0.34em"
  paper-label:
    fontFamily: "Familjen Grotesk, ui-sans-serif, system-ui, sans-serif"
    fontSize: "0.78rem"
    fontWeight: 600
    lineHeight: 1
    letterSpacing: "0.14em"
  field:
    fontFamily: "Sometype Mono, ui-monospace, SFMono-Regular, Menlo, monospace"
    fontSize: "1.05rem"
    fontWeight: 400
    lineHeight: 1.4
rounded:
  none: "0px"
  key: "4px"
  lamp: "9999px"
spacing:
  key-gap: "6px"
  pad-gap: "8px"
  strip-gap: "10px"
  face-pad: "12px"
  stack-gap: "16px"
  paper-pad: "20px"
components:
  key-digit:
    backgroundColor: "{colors.key}"
    textColor: "{colors.key-face}"
    typography: "{typography.keycap-digit}"
    rounded: "{rounded.key}"
    height: "2.9rem"
  key-function:
    backgroundColor: "{colors.key}"
    textColor: "{colors.key-face}"
    typography: "{typography.keycap-function}"
    rounded: "{rounded.key}"
    height: "2.9rem"
  key-act:
    backgroundColor: "{colors.key-act}"
    textColor: "#FFFFFF"
    rounded: "{rounded.key}"
    height: "2.9rem"
  key-chiclet:
    backgroundColor: "{colors.body-lip}"
    textColor: "{colors.key-face}"
    typography: "{typography.chiclet-label}"
    rounded: "{rounded.key}"
    height: "2.75rem"
  key-bar:
    backgroundColor: "{colors.key-act}"
    textColor: "#FFFFFF"
    typography: "{typography.act-label}"
    rounded: "{rounded.key}"
    height: "2.9rem"
  key-bar-disabled:
    backgroundColor: "{colors.key-act}"
    textColor: "#FFFFFF"
    rounded: "{rounded.key}"
  tape:
    backgroundColor: "{colors.tape}"
    textColor: "{colors.ink}"
    rounded: "{rounded.none}"
    padding: "8px 20px"
  docket:
    backgroundColor: "{colors.docket}"
    textColor: "{colors.ink}"
    rounded: "{rounded.none}"
    padding: "14px 24px"
  machine-face:
    backgroundColor: "{colors.body}"
    rounded: "{rounded.none}"
    padding: "10px 16px 12px"
  nameplate:
    backgroundColor: "{colors.body-lip}"
    textColor: "{colors.tape}"
    typography: "{typography.nameplate}"
    rounded: "{rounded.none}"
    padding: "6px 16px"
  field-paste:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    typography: "{typography.field}"
    rounded: "{rounded.none}"
    padding: "0 0 8px"
  button-solve:
    backgroundColor: "{colors.key-act}"
    textColor: "#FFFFFF"
    typography: "{typography.act-label}"
    rounded: "{rounded.key}"
    padding: "0 20px"
---

# Design System: Calculation

## Overview

**Creative North Star: "The Adding-Machine Tape"**

This is a desk, not a page. A dark petrol-green surface owns the whole ground edge to edge and never carries a single character of content; on it sits one machine, in a column no wider than 544px, with a cream paper tape feeding out of its platen. The tape is the interface: every entry physically prints onto it and the total is struck at the bottom in red ribbon ink under a double rule. The category default this world refuses is the floating rounded-key calculator card on a neutral page, where the result is a text field that silently replaces itself and leaves no record of how you got there.

The material logic is strict and it is the whole system. Paper is the only light object on screen, so the eye lands on it before anything else. Things printed on paper are set in Sometype Mono with tabular figures, because that is what a machine prints. Things that are part of the machine — key caps, the nameplate, the TOTAL bar, the docket's label — are set in Familjen Grotesk, because that is what is moulded or silkscreened onto a housing. Nothing crosses that line. Keys are dark moulded rubber with square shoulders, a hard riser under them and 2–4px of travel when they go down; there are no gradients, no glass, no glow, no rounded-card chrome anywhere on the surface.

Density is high and deliberate: the entire surface — tape, struck total, keypad and paste field — lands inside a 900px-tall window with nothing needed below the fold, and inside 855px at 390×844. The struck total is the single most prominent thing on the screen at up to 72px, sized by a three-step ramp so that a long answer shrinks rather than clips. Restraint is total everywhere else: exactly five inks, exactly two motion durations, one radius value, and one accent that only ever means "this control acts".

**Key Characteristics:**
- Five inks with fixed meanings; no decorative colour exists in the system.
- Paper is the only light surface; the desk carries no content.
- Mono on paper, grotesk on the machine — the split is absolute.
- Square shoulders throughout; 4px is the largest radius in the build.
- Depth is moulded, not floated: a hard riser plus a short travel, never a card lifting off a page.
- Two motion durations total: 90ms strike, 220ms paper advance.
- The answer is never replaced silently; it is struck, and the working stays above it.

## Colors

Five inks, each meaning exactly one thing, plus the machine's own dark body tones — no hue in the build exists outside that legend.

### Primary
- **Olivetti Orange** (#E8622A): the only accent in the system, and it means one thing — a control that acts. It is on the operator column, the TOTAL bar, SOLVE, the "Back to the machine" key in the error boundary, the memory-held lamp, the text selection highlight and the focus ring. It never carries text, never fills a panel, and never appears on paper.
- **Olivetti Orange Deep** (#B8481C): the riser beneath every orange key. Never used as a surface colour in its own right.

### Secondary
- **Ribbon Red** (#C0392B): the second half of a two-colour ribbon. Totals, negative values, error messages, the double rule above a total, the sign gutter's `T` mark, and the caret in the paste field. A total that has scrolled up into the tape history stays red exactly as it was struck. Nothing that is neither a total, a negative, nor an error may be red.

### Tertiary
- **Impact Black** (#241F1C): what you typed. Entries and operands printed on the tape, the paste field's own text and its underline on focus.
- **Faded Impact** (#5C544A): the second-pass ink — gutter operator marks, the normalised echo of a solved expression, the paste-field label and placeholder, the "send to the machine" link at rest. Measures 4.5:1 on the paper; it is the floor for readable text on a light surface and may not be lightened.

### Neutral
- **Petrol Desk** (#12302C): the ground, full bleed, with a single faint radial lift centred at 50% 38% at 5.5% white. It carries no content, ever.
- **Petrol Deep** (#0C211F): the html/body backdrop behind the desk and the riser colour under every dark key.
- **Petrol Edge** (#1C423C): the scrollbar thumb — the only place it appears.
- **Newsprint Cream** (#F2ECE0): the tape, and the error-boundary sheet. The only light object on screen.
- **Newsprint Shade** (#E3DACB): the single hairline separating the live entry from the printed history when no total has been struck.
- **Second Sheet** (#E9E2D3): the docket, a half-step warmer and darker than the tape so the two sheets read as two pieces of paper rather than one panel.
- **Machine Body** (#2C3A37) / **Machine Lip** (#3B4B47): the keypad face and the nameplate band. The lip is also the chiclet key colour, which is what makes the memory strip read as flush with the housing rather than moulded out of it.
- **Key Rubber** (#1D2725) / **Key Face** (#F4EFE6): the moulded key and the ink silkscreened onto it.
- **Platen** (#171F1D): the roller bar the paper emerges from, knurled with a 5px repeating 9%-white rule.

### Named Rules
**The Five-Ink Legend.** Desk, paper, impact black, ribbon red, Olivetti orange. Each means one thing and only that thing. A sixth hue may not be introduced for any purpose, including status, emphasis, illustration or charting.

**The Ribbon Rule.** Red is totals, negatives and errors. If a value is red, it is one of those three. Never use it for emphasis, for hover, or for a heading.

**The Orange Acts Rule.** Olivetti orange marks a control that performs an action, never a control that merely holds state and never a surface. Memory keys are grey chiclets precisely because they park a number rather than act on the sum.

**The Paper-Only Rule.** Content lives on paper. The desk is ground; if a string of text ends up directly on the petrol green, it is in the wrong place.

## Typography

**Printed Font:** Sometype Mono (with ui-monospace, SFMono-Regular, Menlo)
**Machine Font:** Familjen Grotesk (with ui-sans-serif, system-ui)

Both are self-hosted variable woff2 (400–700) in `public/fonts`, both preloaded in `root.tsx`, both `font-display: swap`, neither subset with `unicode-range`. `font-variant-numeric: tabular-nums` is set on `body` and repeated on every numeric output: a column of figures must never shift width as it fills.

**Character:** The mono is a warm, slightly mechanical typewriter face that makes a number look struck rather than rendered; the grotesk is compact and slightly condensed, the way lettering on a machine housing has to be. The pairing works because the two never appear in the same role — the mono is always something the machine printed, the grotesk is always something moulded into the machine.

### Hierarchy
- **Platen** (Sometype Mono 500, `clamp(2.6rem, 11vw, 4.5rem)`, 1.08): the live value and the struck total. The single most prominent element on the page. Its size steps down by content length — up to 9 characters at full size, up to 13 at `clamp(2rem, 8.5vw, 3.4rem)`, longer at `clamp(1.5rem, 6vw, 2.4rem)` — because half an answer is worse than a smaller one.
- **Answer** (Sometype Mono 500, `clamp(1.6rem, 7vw, 2.5rem)`, 1): the docket's solved value, deliberately a rank below the machine's own total.
- **Printed** (Sometype Mono 400, 0.9rem / 1.35rem line, 0.95rem ≥640px): tape history lines. The 1.35rem leading is load-bearing — it is the unit the paper advances by.
- **Gutter mark** (Sometype Mono 600, 0.72rem, right-aligned in a fixed 28px column): the operator, `T`, `%`, `√`, `M+`, `M−`, `MR` or `!` an adding machine prints beside each line.
- **Key cap, digit** (Sometype Mono 500, 1.4rem) and **operator** (Sometype Mono 600, 1.45rem): figures and operator symbols belong to the printing face even on a key, because they are the same characters the tape prints.
- **Act label** (Familjen Grotesk 700, 1.2rem, 0.2em tracking, uppercase): TOTAL and SOLVE. See the Large-Text Floor rule.
- **Key cap, function** (Familjen Grotesk 600, 0.9rem, 0.06em, uppercase): AC, C.
- **Chiclet label** (Familjen Grotesk 600, 0.72rem, 0.1em, uppercase): the memory strip.
- **Nameplate** (Familjen Grotesk 700, 0.72rem, 0.34em, uppercase): the `CALCULATOR` band between platen and keypad — the page's only h1, set as an engraved plate rather than a headline.
- **Paper label** (Familjen Grotesk 600, 0.78rem, 0.14em, uppercase, faded impact): "PASTE A SUM" and "SEND TO THE MACHINE". The one place the grotesk is allowed onto paper, and only as a field label or control, never as running text.

### Named Rules
**The Two-Face Rule.** Anything printed by the machine is Sometype Mono with tabular figures. Anything that is part of the machine is Familjen Grotesk. A new element picks its face by asking which of the two it physically is.

**The Large-Text Floor.** White on Olivetti orange measures 3.38:1, which clears WCAG AA only as large text. Both act labels therefore ship at 19.2px/700 (1.2rem bold), which qualifies. Any future white-on-orange label must stay at or above 19.2px/700, or the colour pairing must change. This is not a stylistic preference; shrinking those labels breaks contrast compliance.

**The Tabular Rule.** Every figure on screen uses tabular numerals. A number that changes width while it updates reads as a text field, not a printout.

## Layout

One centred column, full-bleed ground. `main` is a `min-h-dvh` flex centre on the petrol desk with 16px horizontal padding (16px vertical, 24px ≥640px). The machine is a single stack capped at `max-w-[34rem]` (544px); the docket is a separate sheet of the same width sitting 16px below it, so the two read as two objects on one desk rather than one panel with sections.

Vertically the machine is: tape (with its tear edge) inset to 86% of the machine's width on a strip of body colour, because the paper comes up out of a housing wider than itself; the 16px knurled platen bar; the nameplate band; then the keypad. Inside the keypad, a 5-column memory strip at 6px gaps, then the 4-column key grid at 8px gaps with the operator column at the right, then the TOTAL bar spanning the full width.

The tape scrolls in `column-reverse` so new lines print at the bottom and push older lines up and off the top — the direction paper travels through a real machine. Its history window is capped at 144px (192px ≥640px) with a 128px minimum, so the tape never collapses when empty and never grows enough to push the total off the fold. The platen line below it never scrolls; it is pinned and always visible.

**Spacing rhythm:** 6 / 8 / 10 / 12 / 16 / 20px. Nothing in the build uses a gap outside that set.

**Responsive:** one breakpoint, 640px, and it only ever adjusts padding, one type step, and the tape window height. There is no layout reflow — the column is the layout at every width. Chiclet keys are 44px tall below 640px and 36px above, which is the thumb-target floor holding on phones and relaxing on a mouse. The shipped surface fits 900px at 1440×900 and 855px at 390×844, with no horizontal scroll at either.

### Named Rules
**The One-Fold Rule.** The whole instrument — tape, struck total, every key, and the paste field — fits the first viewport. Nothing required to get an answer may be placed below the fold. If a new element does not fit, it does not ship; the tape window shrinks last, not the keypad.

**The Measured Tape.** The tape occupies 249px of a 688px machine (37%), with the total centred at y=234. This proportion was measured against the fold, not estimated: a larger tape plus the full keypad and docket totals ~993px and does not fit a 900px window. The fold was chosen over the ratio deliberately. Do not "restore" a taller tape.

## Elevation & Depth

Depth in this system is moulded, never floated. There are no ambient card shadows, no glass, no gradients, no borders used as fake bevels. Every key carries a hard, zero-blur riser directly beneath it in the colour of the surface it sits on — the key's own sidewall — paired with travel that removes the riser by exactly its own height when the key goes down, so pressing a key genuinely lowers it into the face rather than tinting it. A soft cast shadow rides alongside the riser on every non-chiclet key; that is what makes the caps read as moulded rubber rather than flat plates. Chiclets get a 2px riser and no cast shadow at all, which is why the memory strip reads as flush with the housing.

Two objects in the build cast a true shadow onto the desk, and only those two: the machine and the docket. Both are large diffuse shadows with a strong negative spread, so the object appears to be lying on a surface rather than hovering above it.

### Shadow Vocabulary
- **Key riser, dark** (`box-shadow: 0 3px 0 0 #0C211F, 0 5px 10px -2px rgba(0,0,0,0.55)`): every digit and function key. Pressed state drops to `0 0 0 0` with `translateY(3px)`.
- **Key riser, act** (`box-shadow: 0 3px 0 0 #B8481C, 0 5px 10px -2px rgba(0,0,0,0.5)`): operator keys and SOLVE (SOLVE carries the riser only).
- **Key riser, bar** (`box-shadow: 0 4px 0 0 #B8481C, 0 7px 14px -3px rgba(0,0,0,0.5)`): the TOTAL bar, one step deeper because it is the biggest key on the machine. Travel is 4px.
- **Chiclet riser** (`box-shadow: 0 2px 0 0 #0C211F`): the memory strip. No cast shadow. Travel is 2px.
- **Machine on desk** (`box-shadow: 0 18px 44px -12px rgba(0,0,0,0.7)`): the whole instrument.
- **Docket on desk** (`box-shadow: 0 6px 18px -4px rgba(0,0,0,0.55)`): the second sheet, lighter because paper is thinner than a machine.
- **Memory lamp** (`box-shadow: 0 0 6px 0 #E8622A`): a 6px dot, the only emissive element in the build.

### Named Rules
**The Riser-and-Travel Rule.** A key's offset shadow is its sidewall, and the travel distance equals the riser height exactly (3px/3px, 4px/4px, 2px/2px). A key that shifts without shedding its riser, or sheds a riser it never had, is broken. This offset is only ever legitimate underneath something that physically depresses; it may not be used to lift a panel, sheet or card.

**The Soft-Mould Exception.** The world's original contract said "no soft drop shadow". Every non-chiclet key nonetheless ships `0 5px 10px -2px rgba(0,0,0,0.55)` alongside its riser, kept deliberately: it is what makes a cap read as moulded rubber rather than a flat plate. The exception is scoped to key caps and the two desk shadows. Nothing else in the system gets a soft shadow.

**The Lying-Flat Rule.** Objects on the desk cast down and wide with negative spread. Nothing floats; no element is allowed a shadow that implies it is hovering.

## Shapes

Square-shouldered throughout. Exactly one radius exists in the build — 4px, on key caps, SOLVE and the error-boundary link — and it is small enough to read as a moulded corner rather than a rounded widget. Every sheet, band, bar and housing is a hard 0px rectangle: the tape, the docket, the platen, the nameplate band, the keypad face, even the scrollbar thumb. The one circle in the system is the 6px memory lamp.

Borders are printer's rules, not containers. The build has no box outlines at all. What it does have: a 4px double rule above a struck total and a 3px double rule above a total that has scrolled into the history, both in ribbon red; a 1px hairline in newsprint shade under the live entry when no total has been struck; a 2px bottom rule in 45%-impact under the paste field, going solid impact on focus. Nothing is boxed; things are ruled off, the way a printout is.

The signature silhouette is the tear edge: a 7px serrated SVG strip in tape cream across the top of the paper, 40 teeth at a 2.5% pitch and 60% depth, stretched with `preserveAspectRatio: none`. It is what makes the cream rectangle read as a torn roll rather than a card.

### Named Rules
**The Square-Shoulder Rule.** 4px is the ceiling and it belongs to keys. Any sheet, panel or bar is 0px. A pill, a circle-cropped control or a `rounded-xl` surface does not exist in this world.

**The Ruled-Not-Boxed Rule.** Separation is a printed rule under or above content, never an outline around it. Red double rules mean a total; a thin cream rule means a line in progress.

## Components

### Keys
Five variants of one moulded object, all 4px radius, all with a 90ms linear `transform`/`box-shadow` transition, all `brightness(1.1)` on hover, none of them bouncing.

- **Digit** — key rubber (#1D2725) with key face (#F4EFE6), Sometype Mono 500/1.4rem, 46.4px tall, 3px riser + travel.
- **Function** (AC, C, √, ±, %) — the same cap, label in Familjen Grotesk 600/0.9rem uppercase at 85% opacity so it sits a rank below a digit. Mathematical symbols inside it (√ ± %) switch to mono at 1.15rem, because those are printed characters.
- **Act** (the operator column) — Olivetti orange with white, Sometype Mono 600/1.45rem, riser in orange deep. When the machine is holding an operator, the key gains a 1px inset orange ring rather than changing colour, so "held" reads without breaking the ink legend.
- **Chiclet** (MC, MR, M−, M+, backspace) — machine lip (#3B4B47), 0.72rem/0.1em uppercase, 2px riser, no cast shadow, 44px tall on phones and 36px above 640px. Flush with the housing on purpose.
- **Bar** (TOTAL) — full-width orange, Familjen Grotesk 700/1.2rem at 0.2em, carrying both the `=` a cold visitor scans for (in mono, untracked) and the word the machine would use. 4px riser and 4px travel: the deepest key on the face.

**Disabled:** 35% opacity plus a 2px strikethrough — a key that has been crossed off, not one that has faded out.

**Focus:** a 2px Olivetti orange outline at 2px offset, from the global `:focus-visible`. Inside any `.on-paper` region the outline switches to impact black, so it reads against cream.

### Tape (signature component)
The paper. A serrated tear edge, then a cream sheet with a reversed-column scroll region above a pinned platen line. Entries print at the bottom and push upward. Each line is a right-aligned value with its printer's mark in a fixed 28px right gutter. The mark is the record of what the machine did: the pending operator, `T` for a total, `%`, `√`, `M+`, `M−`, `MR`, `!` for an error — which is what lets the printed lines reconcile with the struck total instead of being decoration. A line prints black unless it is a total, an error, or begins with `-`, in which case it is ribbon red, and it stays red permanently once it scrolls up into the history. The platen line is `aria-live="polite"` and re-keys on every total so it restrikes.

### Docket (signature component)
A second, smaller sheet on the desk in the warmer paper tone, for a sum that arrived already written. One grotesk label, one ruled mono input with an operator-rich placeholder, and an orange SOLVE key at its right end sized to the field. The answer prints under a 4px red double rule with its own `T` mark, one rank smaller than the machine's platen, with the normalised expression echoed beside it in faded impact. A reserved 40px result slot keeps the sheet from jumping when an answer appears. A bad expression prints a plain-language sentence in ribbon red, with `aria-invalid` on the field — never a thrown error and never a silent blank.

### Field
No box, no fill: a transparent input on a 2px bottom rule in 45% impact, mono at 1.05rem (1.15rem ≥640px), placeholder in faded impact. On focus the rule goes solid impact and the browser outline is suppressed in favour of it. The caret is ribbon red. The field stops keydown propagation so the machine's global keyboard handler does not eat what is typed into it.

### Nameplate
A thin band of machine lip between platen and keypad carrying the product's only h1 as engraved lettering — 0.72rem/700 at 0.34em tracking in 75%-opacity tape cream. Its right end holds the memory-held indicator: a 6px glowing orange dot with a 0.66rem/0.2em label, the only status light in the build.

### Error boundary
Styled in the same world, not the framework default: petrol desk, one cream sheet capped at 544px, the message in ribbon red mono at 2.5rem, body copy in grotesk impact black, and an orange key with a riser reading "Back to the machine". A dev stack trace prints in faded-impact mono under an impact hairline.

### Motion
Exactly two durations exist in the build, and no third may be added.
- **Strike** — 90ms linear. A new line arrives at full opacity with a 1px vertical jolt and a momentary `brightness(0.82)` ink-bleed that settles. Also the duration of every key depress. Never a fade.
- **Advance** — 220ms `cubic-bezier(0.16, 0.84, 0.44, 1)`. The paper moves up one line-height (1.35em) with easing, because paper has inertia. The only eased motion on the page.
- `prefers-reduced-motion: reduce` disables both animations; the state change still lands instantly.

## Do's and Don'ts

### Do:
- **Do** keep every new element inside the five-ink legend: desk, paper, impact black (#241F1C), ribbon red (#C0392B), Olivetti orange (#E8622A).
- **Do** pick a typeface by physics — Sometype Mono if the machine printed it, Familjen Grotesk if it is part of the machine.
- **Do** set every figure in tabular numerals.
- **Do** give any new pressable key a hard riser and travel of exactly equal height, with a 90ms linear transition.
- **Do** keep white-on-orange labels at 19.2px/700 or larger; that size is what makes the 3.38:1 pairing WCAG-compliant as large text.
- **Do** separate content with printed rules — red double for a total, cream hairline for a line in progress.
- **Do** keep the whole instrument inside the first viewport; shrink the tape window before touching the keypad.
- **Do** keep thumb targets at 44px below 640px.
- **Do** preserve the red of a total after it scrolls into the history; the record must match what was struck.

### Don't:
- **Don't** introduce a sixth hue for status, emphasis, illustration or charting.
- **Don't** put content on the desk. The petrol green is ground; text and controls belong on paper or on the machine.
- **Don't** use ribbon red for anything that is not a total, a negative, or an error.
- **Don't** use Olivetti orange on a control that only holds state, or as a panel fill.
- **Don't** exceed a 4px radius, and don't give any sheet, bar or housing a radius at all.
- **Don't** add a third motion duration, an ease on a strike, or a bounce on a key.
- **Don't** let a soft shadow lift a panel, sheet or card — the soft shadow in this system belongs to moulded key caps and to the two objects lying on the desk.
- **Don't** replace the answer silently. A total is struck under a rule and the working stays visible above it.
- **Don't** fade a printed line in or out; printing snaps.
- **Don't** lighten faded impact (#5C544A) past 4.5:1 on paper.
