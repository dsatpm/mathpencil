import type { ReactNode } from "react";

export type KeyVariant = "digit" | "function" | "act" | "chiclet" | "bar";

export interface KeyProps {
  children: ReactNode;
  onPress: () => void;
  variant?: KeyVariant;
  /** Announced to assistive technology when the glyph alone is not a word. */
  label?: string;
  /** A one-line explanation, shown as the browser's own hover tooltip. */
  hint?: string;
  /** Rendered small and quiet under the main glyph, the way a machine engraves a second function. */
  pressed?: boolean;
  disabled?: boolean;
}

/**
 * One key on the machine face.
 *
 * Keys are moulded rubber, not widgets: square shoulders, a real cast shadow
 * with offset and blur, and 2px of travel when pressed. Nothing bounces.
 */
const VARIANT_CLASSES: Record<KeyVariant, string> = {
  digit:
    "bg-key text-key-face font-mono text-[1.4rem] font-medium shadow-[0_3px_0_0_var(--color-desk-deep),0_5px_10px_-2px_rgba(0,0,0,0.55)]",
  function:
    "bg-key text-key-face/85 font-sans text-[0.9rem] font-semibold tracking-[0.06em] uppercase shadow-[0_3px_0_0_var(--color-desk-deep),0_5px_10px_-2px_rgba(0,0,0,0.55)]",
  act: "bg-key-act text-white font-mono text-[1.45rem] font-semibold shadow-[0_3px_0_0_var(--color-key-act-deep),0_5px_10px_-2px_rgba(0,0,0,0.5)]",
  chiclet:
    "bg-body-lip text-key-face/80 font-sans text-[0.72rem] font-semibold tracking-[0.1em] uppercase shadow-[0_2px_0_0_var(--color-desk-deep)]",
  bar: "bg-key-act text-white font-sans text-[1.2rem] font-bold tracking-[0.2em] uppercase shadow-[0_4px_0_0_var(--color-key-act-deep),0_7px_14px_-3px_rgba(0,0,0,0.5)]",
};

const TRAVEL_CLASSES: Record<KeyVariant, string> = {
  digit: "active:translate-y-[3px] active:shadow-[0_0_0_0_var(--color-desk-deep)]",
  function: "active:translate-y-[3px] active:shadow-[0_0_0_0_var(--color-desk-deep)]",
  act: "active:translate-y-[3px] active:shadow-[0_0_0_0_var(--color-key-act-deep)]",
  chiclet: "active:translate-y-[2px] active:shadow-none",
  bar: "active:translate-y-[4px] active:shadow-[0_0_0_0_var(--color-key-act-deep)]",
};

export function Key({
  children,
  onPress,
  variant = "digit",
  label,
  hint,
  pressed = false,
  disabled = false,
}: KeyProps) {
  const isChiclet = variant === "chiclet";

  return (
    <button
      type="button"
      onClick={onPress}
      disabled={disabled}
      aria-label={label}
      title={hint ?? label}
      aria-pressed={pressed || undefined}
      className={[
        "w-full select-none rounded-sm transition-[transform,box-shadow] duration-90 ease-linear",
        "flex items-center justify-center",
        isChiclet ? "h-11 sm:h-9" : "h-[2.9rem]",
        VARIANT_CLASSES[variant],
        TRAVEL_CLASSES[variant],
        pressed ? "ring-1 ring-key-act ring-inset" : "",
        disabled ? "opacity-35 line-through decoration-2" : "hover:brightness-110",
      ].join(" ")}
    >
      {children}
    </button>
  );
}
