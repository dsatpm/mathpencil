import { useEffect, useMemo, useReducer } from "react";
import { SciDisplay } from "./SciDisplay";
import { SciKeypad } from "./SciKeypad";
import { initialState, preview, reducer, type SciAction } from "../lib/sci-engine";

/** Keyboard keys that write straight into the expression. */
const INSERT_MAP: Record<string, string> = {
  "+": "+",
  "-": "−",
  // `x` is not a multiplication sign here, unlike on the adding machine: the
  // letters are needed to spell `exp`, and a key cannot be both.
  "*": "×",
  "/": "÷",
  "^": "^",
  "(": "(",
  ")": ")",
  ".": ".",
  ",": ".",
  "!": "!",
  "%": "%",
  // The characters someone with a proper keyboard layout will reach for.
  "×": "×",
  "÷": "÷",
  "√": "√(",
  π: "π",
};

/** Keyboard keys that work the instrument rather than writing into it. */
const ACTION_MAP: Record<string, SciAction> = {
  "=": { type: "equals" },
  Enter: { type: "equals" },
  Backspace: { type: "backspace" },
  Delete: { type: "clearEntry" },
  Escape: { type: "allClear" },
  Clear: { type: "clearEntry" },
};

/**
 * The numeric keypad addressed by physical position.
 *
 * With Num Lock off a keypad reports `End` and `PageDown` in `event.key`, so a
 * keypad-only visitor would find half the instrument dead. The code is where the
 * key *is*, which does not change.
 */
const CODE_INSERT_MAP: Record<string, string> = {
  NumpadAdd: "+",
  NumpadSubtract: "−",
  NumpadMultiply: "×",
  NumpadDivide: "÷",
  NumpadDecimal: ".",
  NumpadComma: ".",
};

const CODE_ACTION_MAP: Record<string, SciAction> = {
  NumpadEnter: { type: "equals" },
  NumpadEqual: { type: "equals" },
};

const NUMPAD_DIGIT = /^Numpad([0-9])$/;

/**
 * The whole instrument: window, case, and face.
 *
 * Like the adding machine, the keyboard is a first-class way in rather than a
 * fallback — digits, operators, brackets, Enter, Escape and Backspace all work
 * the moment the page loads, with nothing to click into first.
 */
export function ScientificCalculator() {
  const [state, dispatch] = useReducer(reducer, initialState);

  const running = useMemo(() => preview(state), [state]);

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.metaKey || event.ctrlKey || event.altKey) return;

      const target = event.target as HTMLElement | null;
      if (target && (target.tagName === "INPUT" || target.tagName === "TEXTAREA")) return;

      const numpadDigit = NUMPAD_DIGIT.exec(event.code);
      if (numpadDigit !== null) {
        event.preventDefault();
        dispatch({ type: "insert", text: numpadDigit[1] });
        return;
      }

      if (event.key >= "0" && event.key <= "9" && event.key.length === 1) {
        event.preventDefault();
        dispatch({ type: "insert", text: event.key });
        return;
      }

      // Letters are written through as they are typed, so a function can be
      // spelled out — `sin(45)` off the keyboard reaches the same parser the
      // keys write to. A word it does not know comes back as a sentence saying
      // so, which is a better answer than a keystroke that vanished.
      if (event.key.length === 1 && /[a-z]/i.test(event.key)) {
        event.preventDefault();
        dispatch({ type: "insert", text: event.key });
        return;
      }

      const inserted = CODE_INSERT_MAP[event.code] ?? INSERT_MAP[event.key];
      if (inserted !== undefined) {
        event.preventDefault();
        dispatch({ type: "insert", text: inserted });
        return;
      }

      const action = CODE_ACTION_MAP[event.code] ?? ACTION_MAP[event.key];
      if (action !== undefined) {
        // Enter on a focused key should press that key, not total the expression.
        if (
          (event.key === "Enter" || event.code === "NumpadEnter") &&
          target?.tagName === "BUTTON"
        ) {
          return;
        }
        event.preventDefault();
        dispatch(action);
      }
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  return (
    // The instrument occupies the same 34rem column the adding machine and every
    // sheet of paper on the site occupy, so two machines on one desk line up.
    <div className="on-instrument w-full max-w-136 shadow-[0_18px_44px_-12px_rgba(0,0,0,0.7)]">
      {/* The bezel: the window is recessed into the case, so it gets a dark
          surround rather than sitting flush with the keys. */}
      <div className="bg-sci-bezel p-2.5 sm:p-3">
        <SciDisplay state={state} preview={running} />
      </div>

      <div className="flex items-center justify-between gap-3 bg-sci-lip px-4 py-1.5">
        <p className="font-sans text-[0.62rem] font-bold uppercase tracking-[0.18em] text-sci-key-face/55">
          <span className="text-sci-shift-ink">Shift</span> reaches the gold labels
        </p>
        <p className="font-sans text-[0.62rem] font-bold uppercase tracking-[0.18em] text-sci-key-face/40">
          {state.angleMode === "deg" ? "Degrees" : "Radians"}
        </p>
      </div>

      <SciKeypad
        dispatch={dispatch}
        shift={state.shift}
        angleMode={state.angleMode}
        memoryHeld={state.memory !== 0}
      />

      {/* The maker's stamp, moulded into the foot of the case. */}
      <div className="flex items-center justify-between gap-3 bg-sci-lip px-4 py-2">
        <span className="font-sans text-[0.66rem] font-bold uppercase tracking-[0.34em] text-sci-key-face/45">
          MathPencil SC
        </span>
        <small className="font-sans text-[0.66rem] font-semibold tracking-[0.12em] text-sci-key-face/45">
          © {new Date().getFullYear()} HTPdevs
        </small>
      </div>
    </div>
  );
}
