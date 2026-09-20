/**
 * Number formatting for the tape.
 *
 * A printing adding machine groups thousands and never shows the float noise
 * that `0.1 + 0.2` produces in binary. Both of those are display concerns, so
 * they live here and nowhere else — the engine always holds real numbers.
 */

/** Digits of precision kept before formatting. Enough to be honest, few enough to hide binary artifacts. */
const SIGNIFICANT_DIGITS = 12;

/** Above this magnitude the tape prints exponential rather than a wall of digits. */
const EXPONENTIAL_CEILING = 1e12;

/** Below this magnitude JavaScript's own `toString` switches to exponential, so we do too. */
const EXPONENTIAL_FLOOR = 1e-6;

/** Groups the integer part in threes: `1234567` becomes `1,234,567`. */
function group(integerDigits: string): string {
  return integerDigits.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function toExponential(value: number): string {
  return value.toExponential(6).replace("e+", "e").replace(/e(-?)(\d)$/, "e$10$2");
}

/**
 * Formats a computed value the way the tape prints it.
 *
 * `0.1 + 0.2` formats as `0.3`, not `0.30000000000000004`: the sum is rounded
 * to twelve significant digits first, which is below the threshold where
 * double-precision artifacts appear.
 */
export function formatNumber(value: number): string {
  if (Number.isNaN(value)) return "—";
  if (!Number.isFinite(value)) return value > 0 ? "∞" : "-∞";
  if (value === 0) return "0";

  const magnitude = Math.abs(value);
  if (magnitude >= EXPONENTIAL_CEILING || magnitude < EXPONENTIAL_FLOOR) {
    return toExponential(value);
  }

  const rounded = Number(value.toPrecision(SIGNIFICANT_DIGITS));
  const sign = rounded < 0 ? "-" : "";
  const [integerDigits, fractionDigits = ""] = Math.abs(rounded).toString().split(".");

  return sign + group(integerDigits) + (fractionDigits ? `.${fractionDigits}` : "");
}

/**
 * Formats digits as they are being keyed in.
 *
 * Unlike {@link formatNumber} this preserves exactly what the visitor typed —
 * a trailing decimal point, a leading zero, trailing zeros after the point —
 * because rewriting someone's keystrokes underneath them is disorienting.
 */
export function formatEntry(keyed: string): string {
  const negative = keyed.startsWith("-");
  const unsigned = negative ? keyed.slice(1) : keyed;
  const pointIndex = unsigned.indexOf(".");
  const integerDigits = pointIndex === -1 ? unsigned : unsigned.slice(0, pointIndex);
  const rest = pointIndex === -1 ? "" : unsigned.slice(pointIndex);

  return (negative ? "-" : "") + group(integerDigits) + rest;
}
