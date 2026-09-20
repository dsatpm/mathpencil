import { useCallback, useEffect, useReducer } from "react";
import { Tape } from "./Tape";
import { Keypad } from "./Keypad";
import { Docket } from "./Docket";
import { OperationsTooltip } from "./OperationsTooltip";
import {
  displayText,
  initialState,
  reducer,
  type CalcAction,
  type Operator,
} from "../lib/calc-engine";

/** Keyboard keys that map straight onto a machine key. */
const KEY_MAP: Record<string, CalcAction> = {
  "+": { type: "operator", operator: "+" },
  "-": { type: "operator", operator: "-" },
  "*": { type: "operator", operator: "×" },
  x: { type: "operator", operator: "×" },
  "/": { type: "operator", operator: "÷" },
  "=": { type: "equals" },
  Enter: { type: "equals" },
  ".": { type: "point" },
  ",": { type: "point" },
  Backspace: { type: "backspace" },
  Delete: { type: "clearEntry" },
  Escape: { type: "allClear" },
  "%": { type: "percent" },
  // The Clear key sitting where NumLock does on a Mac numeric keypad.
  Clear: { type: "clearEntry" },
};

/**
 * The same keys addressed by physical position.
 *
 * With Num Lock off a numeric keypad reports `End`, `PageDown` and the like in
 * `event.key`, so a keypad-only visitor would find half the machine dead. The
 * code is where the key *is*, which does not change, so the numeric keypad is
 * read from there first and `event.key` is only the fallback.
 */
const CODE_MAP: Record<string, CalcAction> = {
  NumpadAdd: { type: "operator", operator: "+" },
  NumpadSubtract: { type: "operator", operator: "-" },
  NumpadMultiply: { type: "operator", operator: "×" },
  NumpadDivide: { type: "operator", operator: "÷" },
  NumpadDecimal: { type: "point" },
  NumpadComma: { type: "point" },
  NumpadEnter: { type: "equals" },
  NumpadEqual: { type: "equals" },
};

const NUMPAD_DIGIT = /^Numpad([0-9])$/;

/** The roller the tape feeds over, knurled the way a real platen is. */
function Platen() {
  return (
    <div
      aria-hidden="true"
      className="h-4 w-full bg-platen"
      style={{
        backgroundImage:
          "repeating-linear-gradient(90deg, rgba(255,255,255,0.09) 0 1px, transparent 1px 5px)",
      }}
    />
  );
}

/**
 * The whole machine: tape, platen, nameplate, keypad, and the docket beside it.
 *
 * The keyboard is a first-class way in, not a fallback — digits, operators,
 * Enter, Escape and Backspace all work the moment the page loads, without the
 * visitor clicking into anything first.
 */
export function AddingMachine() {
  const [state, dispatch] = useReducer(reducer, initialState);

  const sendToMachine = useCallback((value: number) => {
    dispatch({ type: "loadValue", value });
  }, []);

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.metaKey || event.ctrlKey || event.altKey) return;

      const target = event.target as HTMLElement | null;
      if (target && (target.tagName === "INPUT" || target.tagName === "TEXTAREA")) return;

      // The numeric keypad, read by position so Num Lock cannot disable it.
      const numpadDigit = NUMPAD_DIGIT.exec(event.code);
      if (numpadDigit !== null) {
        event.preventDefault();
        dispatch({ type: "digit", digit: numpadDigit[1] });
        return;
      }

      if (event.key >= "0" && event.key <= "9" && event.key.length === 1) {
        event.preventDefault();
        dispatch({ type: "digit", digit: event.key });
        return;
      }

      const action = CODE_MAP[event.code] ?? KEY_MAP[event.key];
      if (action !== undefined) {
        // Enter on a focused key should press that key, not total the machine.
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

  const pendingOperator: Operator | null = state.pending;
  const memoryHeld = state.memory !== 0;

  return (
    <div className="flex w-full flex-col items-center gap-4">
      <div className="w-full max-w-136 shadow-[0_18px_44px_-12px_rgba(0,0,0,0.7)]">
        {/* The paper is narrower than the machine, because it comes up out of it. */}
        <div className="bg-body pt-2">
          <div className="mx-auto w-[86%]">
            <Tape
              lines={state.tape}
              current={displayText(state)}
              isTotal={state.justTotaled}
              strikeCount={state.strikeCount}
              error={state.error}
            />
          </div>
        </div>

        <Platen />

        <div className="relative flex items-center justify-between gap-3 bg-body-lip px-4 py-1.5">
          <OperationsTooltip />
          {memoryHeld && (
            <span
              className="flex items-center gap-2 font-sans text-[0.66rem] font-bold uppercase tracking-[0.2em] text-key-act"
              aria-live="polite"
            >
              <span
                aria-hidden="true"
                className="h-1.5 w-1.5 rounded-full bg-key-act shadow-[0_0_6px_0_var(--color-key-act)]"
              />
              Memory held
            </span>
          )}
        </div>

        <Keypad dispatch={dispatch} pending={pendingOperator} memoryHeld={memoryHeld} />

        {/* The maker's stamp, moulded into the foot of the case. */}
        <div className="flex items-center justify-between gap-3 bg-body-lip px-4 py-2">
          <span className="font-sans text-[0.66rem] font-bold uppercase tracking-[0.34em] text-tape/45">
            MathPencil
          </span>
          <small className="font-sans text-[0.66rem] font-semibold tracking-[0.12em] text-tape/45">
            © {new Date().getFullYear()} HTPdevs
          </small>
        </div>
      </div>

      <Docket onSendToMachine={sendToMachine} />
    </div>
  );
}
