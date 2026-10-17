# Changelog

What changed in MathPencil, newest first. Dates are the day the work landed on
`main`. Versions follow [semantic versioning](https://semver.org): the first
number is a rewrite, the second is a new thing you can use, the third is a fix.

## 1.3.0 (22 September 2026)

The pre-algebra lesson becomes a course. One long page is now twelve chapters,
each at its own address, with four subjects the lesson never covered.

### Added

- **Twelve chapter pages under `/pre-algebra/`.** Introducing pre-algebra,
  integers and negative numbers, order of operations, number theory, factors and
  multiples, fractions decimals and percents, ratios and proportions,
  expressions variables and equations, inequalities and one-step equations,
  exponents and square roots, probability and statistics, and geometry and
  measurement. Each one opens with what the chapter is for, then the facts, then
  the examples worked line by line.
- **Four subjects that were missing.** Integers and negative numbers, order of
  operations, inequalities and one-step equations, and probability and
  statistics. Between them they cover why subtracting a negative number adds,
  why `2 + 3 × 4` is 14 in written arithmetic, when an inequality sign has to
  flip, and how to find a mean, a median, a mode and a range.
- **A chapter board in the left gutter.** It lists the whole course and marks
  where you are, crossing off the chapters behind you in chalk, and below that
  lists the sections of the chapter you are reading. Previous and next links sit
  at the foot of every chapter, and a breadcrumb trail above every title.
- **The solver on its own page, at `/pre-algebra/solver`.** It says what it
  solves, what it turns down and why, and why the answers stay as fractions. The
  same two boards still sit inside the chapter on equations.
- **Where this leads.** Chapters now point at the pages that follow from them,
  including both calculators: the chapter on order of operations explains why the
  adding machine and the scientific calculator give different answers to the same
  keys.

### Changed

- **`/pre-algebra` is now the course contents.** It lists the twelve chapters and
  no longer repeats what they hold. The topics, formulas, key words and worked
  examples that were on it have moved to the chapter each belongs to.
- Every page carries its own title and description, written for that page.

### Fixed

- **The sitemap was missing `/pre-algebra` and `/scientific`.** It listed four
  URLs and left out the two pages the site is for. It is now generated from the
  pages the build actually produced, so it cannot fall behind again, and CI fails
  if the two disagree.

## 1.2.0 (21 September 2026)

A lesson, not just a calculator. MathPencil now teaches the subject as well as
working the sums out.

### Added

- **Pre-algebra lesson at `/pre-algebra`.** What pre-algebra is, how it differs
  from algebra and algebra 2, the seven topics it covers, the formulas to know,
  the key words, and eight worked examples. It is written for a junior high
  student taking the class for the first time, so the sentences are short and
  every idea is shown with a number rather than only described.
- **Step-by-step solver on two chalkboards.** The first solves an equation with
  one letter in it and prints every move it made, including the check that puts
  the answer back in. The second puts a value in place of the letter and shows
  the substitution before the answer. Arithmetic is exact, so a third prints as
  `1/3` and never as `0.333333333333`.
- **Contents list in the left gutter.** A chalkboard listing the sections, which
  marks the one you are reading and crosses off in chalk the ones you have
  passed. It sticks to the top of the window as you scroll and falls back to a
  plain list of links when JavaScript is off.
- **Key words section.** Ten definitions, including the difference between an
  expression and an equation, which is the one that trips people up.
- **Scroll to top button on every long page.** It appears once there is somewhere
  to go back to, scrolls smoothly unless you have asked for less motion, and
  moves keyboard focus with the page.

### Changed

- Topic cards lift and take a blue edge when you hover over them or tab to them.
- Every page title and every line of copy on the site was rewritten without em
  dashes.
- The chalk stroke in the contents list now draws over 700ms.

### Refused, on purpose

- The solver turns down anything past one unknown, such as a letter squared, a
  letter on the bottom of a fraction, or two different letters in one equation.
  It says why in a sentence rather than printing an approximate answer. That is
  algebra, and there is a different page coming for it.

## 1.1.0 (21 September 2026)

### Added

- **Scientific calculator at `/scientific`.** Trigonometry in degrees or
  radians, logarithms, powers and roots, factorials, the constants pi and e,
  brackets, and a memory register. The keys build the whole expression in the
  window so you can read it back before you total it, and every calculation you
  strike stays listed above the live one.
- **A shift key** that reaches a second function on each key, printed in gold on
  the case the way an engineer's calculator prints it.
- **Keyboard and number pad support** from the moment the page loads, with the
  number pad read by key position so it keeps working with Num Lock off.

### Fixed

- In degrees, the quarter turns are now exact. `sin(180)` is 0, not a figure in
  the sixteenth decimal place that prints in exponential form and reads as a
  fault.

## 1.0.0 (20 September 2026)

### Added

- **The printing adding machine at `/`.** Every entry prints onto a paper tape,
  the tape stays on screen, and the total is struck at the bottom in ribbon red
  under a double rule, so the answer arrives with its working attached.
- **A field for a sum you already have written down.** Paste `(12 + 5) × 3 ÷ 2`
  and it is answered in one go, with brackets, thousands separators and whichever
  multiplication and minus characters your source happened to use.
- **Privacy policy, terms of use and contact pages**, and the AdSense
  configuration that pays for the hosting.
- **Share cards, canonical URLs and structured data** for every page.

### Notes

- Both arithmetic engines run in your browser. Nothing you key or paste is sent
  anywhere, and the pages are prerendered to static HTML, so there is no
  server-side calculation to send it to.
- Pasted text is read by a parser written by hand rather than handed to the
  browser's own expression evaluator. Running arbitrary code is too large a
  capability to give a calculator.
