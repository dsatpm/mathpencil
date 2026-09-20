import { Key } from "./Key";
import { OPERATION_HINTS } from "./OperationsTooltip";
import type { CalcAction, Operator } from "../lib/calc-engine";

export interface KeypadProps {
  dispatch: (action: CalcAction) => void;
  /** Highlights the operator the machine is holding. */
  pending: Operator | null;
  memoryHeld: boolean;
}

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

const DIGIT_ROWS = [
  ["7", "8", "9"],
  ["4", "5", "6"],
  ["1", "2", "3"],
];

const OPERATOR_COLUMN: Array<{ operator: Operator; label: string }> = [
  { operator: "÷", label: "Divide" },
  { operator: "×", label: "Multiply" },
  { operator: "-", label: "Subtract" },
  { operator: "+", label: "Add" },
];

/**
 * The machine face.
 *
 * Four columns of moulded keys with the operators held in the right-hand
 * column in Olivetti orange, a flat memory strip above them, and the TOTAL bar
 * spanning the foot the way an adding machine's total bar does.
 */
export function Keypad({ dispatch, pending, memoryHeld }: KeypadProps) {
  return (
    <div className="bg-body px-3 pb-3 pt-2.5 sm:px-4">
      <div className="mb-2.5 grid grid-cols-5 gap-1.5">
        <Key
          variant="chiclet"
          onPress={() => dispatch({ type: "memoryClear" })}
          label="Memory clear"
          hint={OPERATION_HINTS["MC"]}
        >
          MC
        </Key>
        <Key
          variant="chiclet"
          onPress={() => dispatch({ type: "memoryRecall" })}
          label="Memory recall"
          hint={OPERATION_HINTS["MR"]}
          pressed={memoryHeld}
        >
          MR
        </Key>
        <Key
          variant="chiclet"
          onPress={() => dispatch({ type: "memorySubtract" })}
          label="Subtract from memory"
          hint={OPERATION_HINTS["M−"]}
        >
          M−
        </Key>
        <Key
          variant="chiclet"
          onPress={() => dispatch({ type: "memoryAdd" })}
          label="Add to memory"
          hint={OPERATION_HINTS["M+"]}
        >
          M+
        </Key>
        <Key
          variant="chiclet"
          onPress={() => dispatch({ type: "backspace" })}
          label="Backspace"
          hint={OPERATION_HINTS["⌫"]}
        >
          <BackspaceMark />
        </Key>
      </div>

      <div className="grid grid-cols-4 gap-2">
        <Key
          variant="function"
          onPress={() => dispatch({ type: "allClear" })}
          label="All clear, tear off the tape"
          hint={OPERATION_HINTS["AC"]}
        >
          AC
        </Key>
        <Key
          variant="function"
          onPress={() => dispatch({ type: "clearEntry" })}
          label="Clear entry"
          hint={OPERATION_HINTS["C"]}
        >
          C
        </Key>
        <Key
          variant="function"
          onPress={() => dispatch({ type: "squareRoot" })}
          label="Square root"
          hint={OPERATION_HINTS["√"]}
        >
          <span className="font-mono text-[1.15rem]">√</span>
        </Key>
        <Key
          variant="act"
          onPress={() => dispatch({ type: "operator", operator: "÷" })}
          label="Divide"
          pressed={pending === "÷"}
        >
          ÷
        </Key>

        {DIGIT_ROWS.map((row, rowIndex) => (
          <FragmentRow key={row[0]} row={row} dispatch={dispatch}>
            <Key
              variant="act"
              onPress={() =>
                dispatch({ type: "operator", operator: OPERATOR_COLUMN[rowIndex + 1].operator })
              }
              label={OPERATOR_COLUMN[rowIndex + 1].label}
              pressed={pending === OPERATOR_COLUMN[rowIndex + 1].operator}
            >
              {OPERATOR_COLUMN[rowIndex + 1].operator === "-"
                ? "−"
                : OPERATOR_COLUMN[rowIndex + 1].operator}
            </Key>
          </FragmentRow>
        ))}

        <Key
          variant="function"
          onPress={() => dispatch({ type: "negate" })}
          label="Change sign"
          hint={OPERATION_HINTS["±"]}
        >
          <span className="font-mono text-[1.15rem]">±</span>
        </Key>
        <Key onPress={() => dispatch({ type: "digit", digit: "0" })}>0</Key>
        <Key onPress={() => dispatch({ type: "point" })} label="Decimal point">
          .
        </Key>
        <Key
          variant="function"
          onPress={() => dispatch({ type: "percent" })}
          label="Percent"
          hint={OPERATION_HINTS["%"]}
        >
          <span className="font-mono text-[1.15rem]">%</span>
        </Key>
      </div>

      <div className="mt-2">
        {/* The bar carries the equals sign a cold visitor scans for, alongside
            the word the machine itself would use. */}
        <Key
          variant="bar"
          onPress={() => dispatch({ type: "equals" })}
          label="Total"
          hint={OPERATION_HINTS["="]}
        >
          <span className="flex items-baseline gap-3">
            <span className="font-mono text-[1.35rem] tracking-normal">=</span>
            <span>Total</span>
          </span>
        </Key>
      </div>
    </div>
  );
}

function FragmentRow({
  row,
  dispatch,
  children,
}: {
  row: string[];
  dispatch: (action: CalcAction) => void;
  children: React.ReactNode;
}) {
  return (
    <>
      {row.map((digit) => (
        <Key key={digit} onPress={() => dispatch({ type: "digit", digit })}>
          {digit}
        </Key>
      ))}
      {children}
    </>
  );
}
