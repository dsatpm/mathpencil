import { SciKey, type SciKeyVariant } from "./SciKey";
import type { SciAction } from "../lib/sci-engine";

export interface SciKeypadProps {
  dispatch: (action: SciAction) => void;
  shift: boolean;
  angleMode: "deg" | "rad";
  memoryHeld: boolean;
}

/**
 * A key on the face that writes into the expression.
 *
 * Every one of them is an insertion, which is what makes this instrument a
 * different thing from the adding machine: the keys compose a formula rather
 * than driving a mechanism, so `sin` prints `sin(` and waits.
 */
interface FaceKey {
  glyph: string;
  /** What the key writes into the expression. */
  insert: string;
  label?: string;
  hint?: string;
  /** The gold label above the glyph, reached by the shift key. */
  second?: string;
  shiftInsert?: string;
  shiftLabel?: string;
  shiftHint?: string;
  variant?: SciKeyVariant;
}

const FACE: FaceKey[][] = [
  [
    {
      glyph: "sin",
      insert: "sin(",
      variant: "function",
      hint: "Sine of an angle, in whichever mode the window shows.",
      second: "sin⁻¹",
      shiftInsert: "asin(",
      shiftLabel: "Inverse sine",
      shiftHint: "The angle whose sine this is. Takes a number between −1 and 1.",
    },
    {
      glyph: "cos",
      insert: "cos(",
      variant: "function",
      hint: "Cosine of an angle, in whichever mode the window shows.",
      second: "cos⁻¹",
      shiftInsert: "acos(",
      shiftLabel: "Inverse cosine",
      shiftHint: "The angle whose cosine this is. Takes a number between −1 and 1.",
    },
    {
      glyph: "tan",
      insert: "tan(",
      variant: "function",
      hint: "Tangent of an angle, in whichever mode the window shows.",
      second: "tan⁻¹",
      shiftInsert: "atan(",
      shiftLabel: "Inverse tangent",
      shiftHint: "The angle whose tangent this is.",
    },
    {
      glyph: "ln",
      insert: "ln(",
      variant: "function",
      hint: "Natural logarithm, to base e.",
      second: "eˣ",
      shiftInsert: "exp(",
      shiftLabel: "e to the power",
      shiftHint: "e raised to the power of what follows.",
    },
    {
      glyph: "log",
      insert: "log(",
      variant: "function",
      hint: "Logarithm to base 10.",
      second: "10ˣ",
      shiftInsert: "10^(",
      shiftLabel: "Ten to the power",
      shiftHint: "Ten raised to the power of what follows.",
    },
  ],
  [
    {
      glyph: "x²",
      insert: "²",
      variant: "function",
      label: "Square",
      hint: "Squares what is already entered.",
      second: "x³",
      shiftInsert: "³",
      shiftLabel: "Cube",
      shiftHint: "Cubes what is already entered.",
    },
    {
      glyph: "xʸ",
      insert: "^",
      variant: "function",
      label: "To the power of",
      hint: "Raises what is entered to the power that follows.",
    },
    {
      glyph: "√",
      insert: "√(",
      variant: "function",
      label: "Square root",
      hint: "Square root of what follows.",
      second: "∛",
      shiftInsert: "∛(",
      shiftLabel: "Cube root",
      shiftHint: "Cube root of what follows. Negatives are allowed.",
    },
    {
      glyph: "¹∕ₓ",
      insert: "⁻¹",
      variant: "function",
      label: "Reciprocal",
      hint: "One divided by what is already entered.",
      second: "|x|",
      shiftInsert: "abs(",
      shiftLabel: "Absolute value",
      shiftHint: "The size of a number with its sign dropped.",
    },
    {
      glyph: "π",
      insert: "π",
      variant: "function",
      label: "Pi",
      hint: "3.14159265359. Multiplication is implied, so 2π is two pi.",
      second: "e",
      shiftInsert: "e",
      shiftLabel: "e",
      shiftHint: "2.71828182846, the base of the natural logarithm.",
    },
  ],
  [
    { glyph: "7", insert: "7" },
    { glyph: "8", insert: "8" },
    { glyph: "9", insert: "9" },
    { glyph: "÷", insert: "÷", variant: "operator", label: "Divide" },
    {
      glyph: "n!",
      insert: "!",
      variant: "function",
      label: "Factorial",
      hint: "Every whole number up to this one, multiplied together. 5! is 120.",
      second: "mod",
      shiftInsert: "mod",
      shiftLabel: "Remainder",
      shiftHint: "The remainder after dividing. 17 mod 5 is 2.",
    },
  ],
  [
    { glyph: "4", insert: "4" },
    { glyph: "5", insert: "5" },
    { glyph: "6", insert: "6" },
    { glyph: "×", insert: "×", variant: "operator", label: "Multiply" },
    {
      glyph: "%",
      insert: "%",
      variant: "function",
      label: "Percent",
      hint: "Divides by a hundred: 40% is 0.4.",
    },
  ],
  [
    { glyph: "1", insert: "1" },
    { glyph: "2", insert: "2" },
    { glyph: "3", insert: "3" },
    { glyph: "−", insert: "−", variant: "operator", label: "Subtract" },
    {
      glyph: "Ans",
      insert: "Ans",
      variant: "function",
      label: "Last answer",
      hint: "The last answer struck, used as a figure in this expression.",
    },
  ],
  [
    { glyph: "0", insert: "0" },
    { glyph: ".", insert: ".", label: "Decimal point" },
    {
      glyph: "(−)",
      insert: "−",
      variant: "function",
      label: "Negative",
      hint: "A minus sign in front of a number, rather than between two.",
    },
    { glyph: "+", insert: "+", variant: "operator", label: "Add" },
  ],
];

/** The backspace arrow, drawn rather than borrowed from a font's glyph table. */
function BackspaceMark() {
  return (
    <svg viewBox="0 0 24 16" aria-hidden="true" className="h-3.5 w-5">
      <path
        d="M8 1 L23 1 L23 15 L8 15 L1 8 Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <path
        d="M12.5 5.5 L18.5 10.5 M18.5 5.5 L12.5 10.5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

/**
 * The instrument's face.
 *
 * Five columns: three of digits, one of operators in slate, and a right-hand
 * column of the constants and one-off operations that only a scientific
 * calculator has. Above them sit the six flat setting keys — shift, the angle
 * mode, and the memory register — because those change what a key press *means*
 * and are not part of the expression itself.
 */
export function SciKeypad({ dispatch, shift, angleMode, memoryHeld }: SciKeypadProps) {
  return (
    <div className="bg-sci-case px-3 pb-3 pt-2.5 sm:px-4">
      <div className="mb-2.5 grid grid-cols-3 gap-1.5 sm:grid-cols-6">
        <SciKey
          variant="chiclet"
          onPress={() => dispatch({ type: "toggleShift" })}
          label="Shift — reach the gold labels"
          hint="Reaches the gold label above each key, for one press."
          lit={shift}
        >
          <span className={shift ? "text-sci-shift-ink" : ""}>Shift</span>
        </SciKey>
        <SciKey
          variant="chiclet"
          onPress={() => dispatch({ type: "toggleAngle" })}
          label={`Angle mode: ${angleMode === "deg" ? "degrees" : "radians"}. Switch it.`}
          hint="Switches trigonometry between degrees and radians."
        >
          {angleMode === "deg" ? "Deg" : "Rad"}
        </SciKey>
        <SciKey
          variant="chiclet"
          onPress={() => dispatch({ type: "memoryClear" })}
          label="Memory clear"
          hint="Empties the stored number."
        >
          MC
        </SciKey>
        <SciKey
          variant="chiclet"
          onPress={() => dispatch({ type: "memoryRecall" })}
          label="Memory recall"
          hint="Writes the stored number into the expression."
          lit={memoryHeld}
        >
          MR
        </SciKey>
        <SciKey
          variant="chiclet"
          onPress={() => dispatch({ type: "memoryAdd" })}
          label="Add to memory"
          hint="Adds the figure on screen to the stored number."
        >
          M+
        </SciKey>
        <SciKey
          variant="chiclet"
          onPress={() => dispatch({ type: "memorySubtract" })}
          label="Subtract from memory"
          hint="Takes the figure on screen off the stored number."
        >
          M−
        </SciKey>
      </div>

      <div className="grid grid-cols-5 gap-2">
        <SciKey
          variant="function"
          onPress={() => dispatch({ type: "allClear" })}
          label="All clear"
          hint="Clears the window and the calculations above it. Memory survives."
        >
          AC
        </SciKey>
        <SciKey
          variant="function"
          onPress={() => dispatch({ type: "clearEntry" })}
          label="Clear the expression"
          hint="Clears the expression on screen and leaves what is struck above it."
        >
          C
        </SciKey>
        <SciKey
          variant="function"
          onPress={() => dispatch({ type: "backspace" })}
          label="Backspace"
          hint="Rubs out the last key press, whole — sin( comes off in one."
        >
          <BackspaceMark />
        </SciKey>
        <SciKey
          variant="function"
          onPress={() => dispatch({ type: "insert", text: "(" })}
          label="Open bracket"
        >
          (
        </SciKey>
        <SciKey
          variant="function"
          onPress={() => dispatch({ type: "insert", text: ")" })}
          label="Close bracket"
          hint="Brackets left open at the end close themselves when you total."
        >
          )
        </SciKey>

        {FACE.flat().map((key) => {
          const shifted = shift && key.shiftInsert !== undefined;
          const text = shifted ? key.shiftInsert! : key.insert;

          return (
            <SciKey
              key={key.glyph}
              variant={key.variant}
              // While shift is latched the gold label moves down into the key's
              // own slot, leaving its line empty rather than printing the same
              // word twice — the line is kept so no key changes height.
              second={key.second === undefined ? undefined : shifted ? " " : key.second}
              label={shifted ? key.shiftLabel : key.label}
              hint={shifted ? key.shiftHint : key.hint}
              onPress={() => dispatch({ type: "insert", text })}
            >
              {shifted ? (
                <span className="text-sci-shift-ink">{key.second}</span>
              ) : (
                key.glyph
              )}
            </SciKey>
          );
        })}

        <SciKey
          variant="act"
          onPress={() => dispatch({ type: "equals" })}
          label="Total"
          hint="Works the expression out and strikes the answer."
        >
          {/* On a narrow phone the key is a fifth of the width, which the word
              will not fit into at this tracking — so the sign carries it alone
              and the word returns once there is room for it. */}
          <span className="flex items-baseline gap-2">
            <span className="font-mono text-[1.35rem] tracking-normal">=</span>
            <span className="hidden sm:inline">Total</span>
          </span>
        </SciKey>
      </div>
    </div>
  );
}
