import type { ReactNode } from "react";

export type SciKeyVariant = "digit" | "function" | "operator" | "act" | "chiclet";

export interface SciKeyProps {
  children: ReactNode;
  onPress: () => void;
  variant?: SciKeyVariant;
  /**
   * The shifted function, printed in gold above the glyph the way an engineer's
   * calculator prints the second function on the case itself.
   */
  second?: ReactNode;
  /** Announced to assistive technology when the glyph alone is not a word. */
  label?: string;
  /** A one-line explanation, shown as the browser's own hover tooltip. */
  hint?: string;
  /** Lit: a latched setting such as shift, or the current angle mode. */
  lit?: boolean;
}

/**
 * One key on the instrument's face.
 *
 * The same moulded-rubber logic as the adding machine's keys — square
 * shoulders, a real cast shadow, travel rather than a bounce — in the
 * instrument's own palette. Two label inks: white for the key's own glyph, and
 * gold above it for whatever the shift key reaches.
 */
const VARIANT_CLASSES: Record<SciKeyVariant, string> = {
  digit:
    "bg-sci-key text-sci-key-face font-mono text-[1.25rem] font-medium shadow-[0_3px_0_0_var(--color-sci-key-deep),0_5px_10px_-2px_rgba(0,0,0,0.6)]",
  function:
    "bg-sci-key text-sci-fn font-sans text-[0.82rem] font-semibold tracking-[0.02em] shadow-[0_3px_0_0_var(--color-sci-key-deep),0_5px_10px_-2px_rgba(0,0,0,0.6)]",
  operator:
    "bg-sci-op text-white font-mono text-[1.25rem] font-semibold shadow-[0_3px_0_0_var(--color-sci-op-deep),0_5px_10px_-2px_rgba(0,0,0,0.55)]",
  act: "bg-sci-act text-[#1a1305] font-sans text-[1.05rem] font-bold tracking-[0.12em] uppercase shadow-[0_3px_0_0_var(--color-sci-act-deep),0_6px_12px_-3px_rgba(0,0,0,0.55)]",
  chiclet:
    "bg-sci-lip text-sci-key-face/85 font-sans text-[0.7rem] font-semibold tracking-[0.1em] uppercase shadow-[0_2px_0_0_var(--color-sci-key-deep)]",
};

const TRAVEL_CLASSES: Record<SciKeyVariant, string> = {
  digit: "active:translate-y-[3px] active:shadow-[0_0_0_0_var(--color-sci-key-deep)]",
  function: "active:translate-y-[3px] active:shadow-[0_0_0_0_var(--color-sci-key-deep)]",
  operator: "active:translate-y-[3px] active:shadow-[0_0_0_0_var(--color-sci-op-deep)]",
  act: "active:translate-y-[3px] active:shadow-[0_0_0_0_var(--color-sci-act-deep)]",
  chiclet: "active:translate-y-[2px] active:shadow-none",
};

export function SciKey({
  children,
  onPress,
  variant = "digit",
  second,
  label,
  hint,
  lit = false,
}: SciKeyProps) {
  const isChiclet = variant === "chiclet";

  return (
    <button
      type="button"
      onClick={onPress}
      aria-label={label}
      title={hint ?? label}
      aria-pressed={lit || undefined}
      className={[
        "w-full select-none rounded-sm transition-[transform,box-shadow] duration-90 ease-linear",
        "flex flex-col items-center justify-center gap-px leading-none",
        isChiclet ? "h-10 sm:h-9" : "h-[2.95rem]",
        VARIANT_CLASSES[variant],
        TRAVEL_CLASSES[variant],
        lit ? "ring-1 ring-sci-act ring-inset" : "",
        "hover:brightness-115",
      ].join(" ")}
    >
      {second !== undefined && (
        <span
          aria-hidden="true"
          className="font-sans text-[0.55rem] font-bold uppercase tracking-[0.06em] text-sci-shift-ink"
        >
          {second}
        </span>
      )}
      <span className="flex items-center justify-center">{children}</span>
    </button>
  );
}
