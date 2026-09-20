# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Anyone doing a quick one-off calculation. They arrived from a search ("calculator", "percentage calculator") or opened a bookmarked tab, they have one number to work out, and they leave as soon as they have it. They are not logged in, have no history with the product, and will not learn a mental model first. Many arrive on a phone.

## Product Purpose

Give a visitor an arithmetic answer with the least possible friction. Success is: the visitor understands what the page is within one second of it painting, gets their answer without a wrong turn, and never has to hunt for where the result appeared.

## Positioning

Two entry paths into one calculator, on one screen, with no mode switch: a tappable keypad for math you work out step by step, and a paste field for a whole expression you already have written down (copied from an email, a spreadsheet cell, a message). Most web calculators offer only the keypad, which forces the visitor to re-key an expression they already have in their clipboard.

## Operating Context

- Single page, no account, no persistence requirement, no network round trip for a calculation.
- Reached cold from search; often one of several tabs the visitor is comparing.
- Used with a mouse, a thumb, and a keyboard — number-row and numpad typing must work without the visitor clicking into anything first.
- The clipboard is a real input device here: the paste field exists because expressions arrive pre-written.

## Capabilities and Constraints

**Keypad (primary):** the four operations (+ − × ÷), digits, decimal point, equals, clear/all-clear, sign flip, percent, square root, and memory keys (M+, M−, MR, MC). One compact pad — no second scientific layer, no trig, no logs, no parentheses on the pad.

**Result display (primary):** the running entry and the answer are always visible in a fixed, prominent place above the keypad. The visitor never scrolls or hunts to find the answer.

**Paste field (secondary, below the keypad):** accepts a written arithmetic expression — digits, decimals, `+ - * / × ÷`, and parentheses — with correct operator precedence. A button evaluates it and shows the answer immediately next to or beneath the field. Invalid input gets a plain-language explanation, not a thrown error, and never a silent blank.

**Deliberately out of scope:** scientific functions, unit conversion, natural-language phrasing ("15% of 240") in the paste field, multi-line batch evaluation, saved history across sessions, accounts.

**Technical constraints:** existing codebase is React Router 8 (SSR on) + Tailwind CSS 4 + TypeScript on Vite. Evaluation must be a real parser written for this app — no `eval`, no `new Function`, no arbitrary code execution on pasted input. Floating-point display must not leak artifacts (`0.1 + 0.2` shows `0.3`).

## Evidence on Hand

None. No brand, no logo, no customers, no testimonials, no usage numbers, no press. Nothing of that kind may be fabricated on the page.

## Product Principles

1. **The answer is the page.** Everything else is an input method serving it. If the answer is ever hard to find, the product has failed regardless of how the rest looks.
2. **Recognizable before it is interesting.** A visitor who has used any calculator must be able to use this one without reading. Novelty never costs recognizability.
3. **Two ways in, one calculator.** Keypad and paste field are peers serving the same job, not a feature and an add-on. Neither requires a mode switch.
4. **No dead ends.** Bad input, division by zero, and overflow all produce something a non-technical visitor can act on.
5. **Nothing invented.** No fake credibility, no fabricated stats, no claims the product cannot back.

## Accessibility & Inclusion

Keyboard operation is a primary path, not a fallback: digits, operators, Enter (equals), Escape (clear), and Backspace must work on page load without a prior click. The result must be announced to assistive technology when it changes. Keypad targets must stay comfortably thumb-sized on a phone.
