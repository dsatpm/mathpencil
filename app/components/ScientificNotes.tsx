import { PaperSheet } from "./PaperSheet";

/**
 * The notes filed under the instrument: what it is for, how the face is worked,
 * what every function key does, and where it disagrees with the adding machine
 * on the home page.
 *
 * All of it sits below the fold, for the same reason the machine's notes do:
 * nothing here is needed to get an answer.
 */

/** A keyboard key and what the instrument does with it. */
const KEYBOARD_ROWS: Array<{ keys: string; does: string }> = [
  { keys: "0–9", does: "Write a digit. The main row and the number pad both work." },
  { keys: ". or ,", does: "Decimal point. Either character, because keyboards disagree." },
  { keys: "+ − * /", does: "Operators. Unlike the adding machine, x is a letter here, not a times sign." },
  {
    keys: "Letters",
    does: "Spell a function out: type sin(45) or log(1000) straight in. A word it does not know comes back as a sentence, not a wrong answer.",
  },
  { keys: "^", does: "To the power of. 2^10 is 1,024." },
  { keys: "( )", does: "Brackets. Any left open at the end close themselves." },
  { keys: "! and %", does: "Factorial, and divide by a hundred." },
  { keys: "Enter or =", does: "Total. The answer is struck into the large line." },
  { keys: "Backspace", does: "Rub out the last key press, so sin( comes off in one." },
  { keys: "Delete", does: "Clear the expression, keep what is struck above it." },
  { keys: "Escape", does: "All clear. Memory and the angle mode survive." },
  { keys: "Tab, then Enter", does: "Move between keys and press the focused one." },
];

/** Every function on the face, in one line each. */
const FUNCTION_ROWS: Array<{ key: string; does: string }> = [
  {
    key: "sin cos tan",
    does: "Trigonometry, read in whichever unit the window shows, DEG or RAD. The shifted keys sin⁻¹, cos⁻¹ and tan⁻¹ go the other way, from a ratio back to an angle, and answer in the same unit.",
  },
  {
    key: "ln log",
    does: "Natural logarithm and logarithm to base ten. Shifted, they become eˣ and 10ˣ, the operations that undo them.",
  },
  {
    key: "x² xʸ",
    does: "Square, and raise to any power. Powers are right-associative and bind tighter than × and ÷, so 2^3^2 is 512 and −2² is −4, exactly as written arithmetic reads them.",
  },
  {
    key: "√ ∛",
    does: "Square root, and cube root behind the shift. A cube root takes negatives; a square root does not, and says so rather than printing a fault.",
  },
  {
    key: "¹∕ₓ |x|",
    does: "Reciprocal of what is already entered, and absolute value behind the shift.",
  },
  {
    key: "π e",
    does: "The two constants. Multiplication is implied next to them, so 2π is two pi and 3(4+1) is fifteen.",
  },
  {
    key: "n! mod",
    does: "Factorial, where 5! is 120, and behind the shift, the remainder after a division: 17 mod 5 is 2.",
  },
  {
    key: "%",
    does: "Divides by a hundred, and nothing more: 40% is 0.4, and 200 + 10% is 200.1. This is the one key that behaves differently from the adding machine on the home page, where % reads as a percentage of the running total.",
  },
  {
    key: "Ans",
    does: "The last answer struck, used as a figure inside a new expression. Pressing an operator straight after a total does this for you: the window shows Ans × 2.",
  },
  {
    key: "MC MR M+ M−",
    does: "The memory register. M+ and M− add and subtract the figure on screen; MR writes the stored number into the expression; MC empties it. An M lights in the window whenever something is held.",
  },
  {
    key: "DEG / RAD",
    does: "Switches the unit trigonometry is read in. Changing it withdraws the answer beneath, because the same expression means something else in the other mode.",
  },
  {
    key: "AC / C",
    does: "C clears the expression and leaves the calculations above it standing. AC clears the window entirely. Memory and the angle mode are settings of the instrument, so both survive.",
  },
];

/** The questions this instrument's own behaviour raises. Mirrored into FAQ structured data. */
export const SCIENTIFIC_FAQ: Array<{ question: string; answer: string }> = [
  {
    question: "Is this a different calculator from the one on the home page?",
    answer:
      "Yes, and deliberately so. The home page is a printing adding machine: each key resolves what is already standing and prints it to a paper tape, which is what you want for a column of receipts. This is a scientific instrument: the keys compose a whole expression, you can see it before it is worked out, and nothing is resolved until you total. Formulas are read whole, so they are entered whole.",
  },
  {
    question: "Why does sin(30) give 0.5 here and −0.988 on another calculator?",
    answer:
      "Because of the angle mode. In DEG the instrument reads 30 as thirty degrees, whose sine is exactly 0.5. In RAD it reads it as thirty radians, whose sine is −0.988. The mode is printed at the top left of the window at all times, and the DEG/RAD key switches it, which withdraws the answer underneath, because the same expression means something else in the other unit.",
  },
  {
    question: "What does 2 + 3 × 4 come to?",
    answer:
      "Fourteen. This instrument honours operator precedence and brackets the way written arithmetic does: multiplication and division bind tighter than addition and subtraction, powers bind tighter still, and brackets override all of it. The adding machine on the home page answers 20 to the same keys, because a printing machine resolves each operator as it is pressed, and its tape shows exactly that route.",
  },
  {
    question: "Are my calculations sent anywhere?",
    answer:
      "No. Everything here is arithmetic running in your own browser. Nothing you enter is transmitted to MathPencil, stored on a server, or written to your device. Closing the tab is the end of it.",
  },
  {
    question: "Do I need an account, an app, or a download?",
    answer:
      "No. MathPencil is a web page. There is no sign-up, no install, no paid tier and no usage limit, and the scientific calculator is as free as the adding machine.",
  },
  {
    question: "What happens if I ask for something that has no answer?",
    answer:
      "It says so, in a sentence, instead of printing a wrong figure: the square root of a negative number, the tangent of 90°, the logarithm of zero, a factorial of a half, a division by zero. The expression stays on screen so you can correct the part that was wrong rather than key the whole thing again.",
  },
  {
    question: "Can I leave brackets unclosed?",
    answer:
      "Yes. Brackets still open when you total are closed for you, which is how a keypad is actually used: sin(45 is read as sin(45). Everything else has to be a complete expression: a trailing operator or two numbers with nothing between them comes back as a sentence saying so.",
  },
];

export function ScientificNotes() {
  return (
    <div className="mt-8 flex w-full flex-col items-center gap-4 sm:mt-12">
      <PaperSheet ariaLabelledBy="sci-what-it-is">
        <h2
          id="sci-what-it-is"
          className="font-sans text-[1.35rem] font-bold leading-tight text-ink sm:text-[1.5rem]"
        >
          What the scientific calculator is for
        </h2>

        <p className="mt-3 font-sans text-[1rem] leading-[1.6rem] text-ink-soft">
          Some arithmetic is a list of figures to be added up. Some is a formula. This is the
          instrument for the second kind: trigonometry, logarithms, powers and roots, the constants
          π and e, and the brackets that hold a formula together. You build the whole expression in
          the window, read it back before committing to it, and then total it.
        </p>

        <p className="mt-3 font-sans text-[1rem] leading-[1.6rem] text-ink-soft">
          That makes it useful for homework and coursework, for a physics or chemistry problem set,
          for the kind of geometry that turns up in a workshop or on a building site, and for any
          figure you would otherwise have to work out in three separate steps and hope you
          transcribed correctly in between. Every calculation you strike stays listed above the live
          expression, so a chain of steps can be read back rather than remembered.
        </p>

        <p className="mt-3 font-sans text-[1rem] leading-[1.6rem] text-ink-soft">
          It is free, it needs no account, and it is made by{" "}
          <a
            href="https://htpdevs.tech"
            className="text-ink underline decoration-ink/30 underline-offset-4 hover:decoration-ink"
          >
            HTPdevs
          </a>
          . For a running total rather than a formula, the{" "}
          <a
            href="/"
            className="text-ink underline decoration-ink/30 underline-offset-4 hover:decoration-ink"
          >
            printing adding machine
          </a>{" "}
          is the better instrument.
        </p>
      </PaperSheet>

      <PaperSheet ariaLabelledBy="sci-how-to-use">
        <h2
          id="sci-how-to-use"
          className="font-sans text-[1.35rem] font-bold leading-tight text-ink sm:text-[1.5rem]"
        >
          How to use it
        </h2>

        <h3 className="mt-5 font-sans text-[1.05rem] font-bold text-ink">
          Building an expression
        </h3>
        <p className="mt-2 font-sans text-[1rem] leading-[1.6rem] text-ink-soft">
          Press keys in the order you would write the formula. A function key writes its own opening
          bracket. <span className="font-mono">sin</span> puts <span className="font-mono">sin(</span>{" "}
          on screen and waits for the angle. The running value sits under the expression in faint
          type as soon as what you have written makes sense; it is faint on purpose, because it is
          not an answer until you press <span className="font-mono">=</span>, which strikes it into
          the large line.
        </p>

        <h3 className="mt-5 font-sans text-[1.05rem] font-bold text-ink">The shift key</h3>
        <p className="mt-2 font-sans text-[1rem] leading-[1.6rem] text-ink-soft">
          Every key with a gold label above it has a second function behind{" "}
          <span className="font-semibold text-ink">Shift</span>. Press Shift, then the key: the gold
          label drops into the key face so you can see what you are about to get, and the latch
          releases after one press. <span className="font-mono">Shift</span> lights in the window
          while it is held.
        </p>

        <h3 className="mt-5 font-sans text-[1.05rem] font-bold text-ink">Degrees or radians</h3>
        <p className="mt-2 font-sans text-[1rem] leading-[1.6rem] text-ink-soft">
          The mode is printed at the top left of the window and never hidden, because a
          trigonometric answer read in the wrong unit is not a small error. Switching it withdraws
          the struck answer rather than leaving a figure standing that the new mode would not
          produce.
        </p>

        <h3 className="mt-5 font-sans text-[1.05rem] font-bold text-ink">
          Using the keyboard or the number pad
        </h3>
        <p className="mt-2 font-sans text-[1rem] leading-[1.6rem] text-ink-soft">
          The keyboard works the moment the page loads. There is nothing to click into first. The
          number pad is read by key position rather than by the character it reports, so it keeps
          working with Num&nbsp;Lock off.
        </p>

        <dl className="mt-4 grid grid-cols-[7.5rem_1fr] gap-x-4 gap-y-2.5 border-t border-ink/15 pt-4 font-sans text-[0.95rem]">
          {KEYBOARD_ROWS.map((row) => (
            <div key={row.keys} className="contents">
              <dt className="font-mono text-[0.9rem] font-semibold text-ink">{row.keys}</dt>
              <dd className="m-0 leading-[1.45rem] text-ink-soft">{row.does}</dd>
            </div>
          ))}
        </dl>
      </PaperSheet>

      <PaperSheet ariaLabelledBy="sci-functions">
        <h2
          id="sci-functions"
          className="font-sans text-[1.35rem] font-bold leading-tight text-ink sm:text-[1.5rem]"
        >
          Every key on the face
        </h2>

        <p className="mt-3 font-sans text-[1rem] leading-[1.6rem] text-ink-soft">
          The same one-line notes are on the instrument itself: hover or focus any key and the
          browser shows what it does.
        </p>

        <dl className="mt-4 grid grid-cols-[6.5rem_1fr] gap-x-4 gap-y-3 border-t border-ink/15 pt-4 font-sans text-[0.95rem]">
          {FUNCTION_ROWS.map((row) => (
            <div key={row.key} className="contents">
              <dt className="font-mono text-[0.9rem] font-semibold text-ink">{row.key}</dt>
              <dd className="m-0 leading-[1.45rem] text-ink-soft">{row.does}</dd>
            </div>
          ))}
        </dl>
      </PaperSheet>

      <PaperSheet ariaLabelledBy="sci-how-it-works">
        <h2
          id="sci-how-it-works"
          className="font-sans text-[1.35rem] font-bold leading-tight text-ink sm:text-[1.5rem]"
        >
          How does this work?
        </h2>

        <p className="mt-3 font-sans text-[1rem] leading-[1.6rem] text-ink-soft">
          What the keys build is text, and that text is read by a tokenizer and a recursive-descent
          parser written by hand. The grammar is the ordinary one: addition and subtraction at the
          bottom, multiplication, division and <span className="font-mono">mod</span> above them,
          powers above those and right-associative, then the postfix operations:{" "}
          <span className="font-mono">!</span>, <span className="font-mono">%</span>,{" "}
          <span className="font-mono">x²</span>, and finally brackets, constants and functions.
          Multiplication next to a constant or a bracket is implied, so{" "}
          <span className="font-mono">2π</span> and <span className="font-mono">3(4+1)</span> read
          the way they are written.
        </p>

        <p className="mt-3 font-sans text-[1rem] leading-[1.6rem] text-ink-soft">
          It is a parser rather than a call to the browser's own expression evaluator on purpose. The
          ability to run arbitrary code is far too large a capability to hand a calculator, and a
          parser can explain itself: anything the grammar does not accept comes back as a sentence
          about what is wrong with it, not as a wrong answer.
        </p>

        <p className="mt-3 font-sans text-[1rem] leading-[1.6rem] text-ink-soft">
          In degrees, the quarter turns are answered exactly rather than left to a radian conversion:{" "}
          <span className="font-mono">sin(180)</span> is 0, not 1.22×10⁻¹⁶. Everything is rounded to
          twelve significant figures at the moment of printing, which hides binary floating-point
          noise while keeping far more precision than the work needs, and the full value is what{" "}
          <span className="font-mono">Ans</span> carries into the next expression.
        </p>

        <p className="mt-3 font-sans text-[1rem] leading-[1.6rem] text-ink-soft">
          The page itself is rendered to plain HTML ahead of time and served as a static file. There
          is no server-side calculation and nothing to send a figure to.
        </p>
      </PaperSheet>

      <PaperSheet ariaLabelledBy="sci-faq">
        <h2
          id="sci-faq"
          className="font-sans text-[1.35rem] font-bold leading-tight text-ink sm:text-[1.5rem]"
        >
          Common questions
        </h2>

        <dl className="mt-4">
          {SCIENTIFIC_FAQ.map((entry, index) => (
            <div
              key={entry.question}
              className={index === 0 ? "" : "mt-4 border-t border-ink/15 pt-4"}
            >
              <dt className="font-sans text-[1rem] font-bold leading-[1.45rem] text-ink">
                {entry.question}
              </dt>
              <dd className="m-0 mt-1.5 font-sans text-[1rem] leading-[1.6rem] text-ink-soft">
                {entry.answer}
              </dd>
            </div>
          ))}
        </dl>
      </PaperSheet>

      <PaperSheet ariaLabelledBy="sci-ads-note">
        <h2
          id="sci-ads-note"
          className="font-sans text-[1.35rem] font-bold leading-tight text-ink sm:text-[1.5rem]"
        >
          Advertising and your privacy
        </h2>

        <p className="mt-3 font-sans text-[1rem] leading-[1.6rem] text-ink-soft">
          MathPencil is free, and advertising is what pays for it. Ads are served by Google AdSense,
          which may set cookies or read device identifiers to choose and measure them. Your
          calculations are never part of that: they stay in your browser and are not shared with any
          advertiser. What is collected, by whom, and how to turn personalised advertising off is set
          out in the{" "}
          <a
            href="/privacy"
            className="text-ink underline decoration-ink/30 underline-offset-4 hover:decoration-ink"
          >
            privacy policy
          </a>
          .
        </p>
      </PaperSheet>
    </div>
  );
}
