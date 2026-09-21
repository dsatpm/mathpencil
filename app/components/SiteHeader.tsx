import { NavLink } from "react-router";

/**
 * The links in the bar. Kept as data so adding the next one is a single line
 * rather than a layout change.
 */
const NAV_LINKS: Array<{ to: string; label: string }> = [
  { to: "/scientific", label: "Scientific" },
  { to: "/contact", label: "Contact" },
];

/**
 * The bar above the desk.
 *
 * It is deliberately quiet: the machine is the page, so the masthead is one
 * line of type on the desk surface with a hairline under it. Sizes are in `rem`
 * throughout, so a browser text-size setting scales the bar with the machine.
 */
export function SiteHeader() {
  return (
    <header className="w-full border-b border-desk-edge/70 bg-desk-deep">
      <nav
        aria-label="Site"
        className="mx-auto flex w-full max-w-5xl items-center justify-between gap-4 px-4 py-3 sm:px-6"
      >
        <NavLink to="/" className="flex items-center no-underline">
          {/* The wordmark is drawn on its own cream ground, so it is set on a
              matching plate rather than floated on the dark bar, where its
              edges would read as a stray rectangle. */}
          <img
            src="/mathpencil.png"
            alt="MathPencil"
            width={200}
            height={40}
            className="h-7 w-auto rounded-sm"
          />
        </NavLink>

        <ul className="flex list-none items-center gap-5 p-0 font-sans text-[0.82rem] font-semibold uppercase tracking-[0.14em]">
          {NAV_LINKS.map((link) => (
            <li key={link.to}>
              <NavLink
                to={link.to}
                className={({ isActive }) =>
                  [
                    "no-underline transition-colors duration-90",
                    isActive ? "text-key-act" : "text-tape/70 hover:text-tape",
                  ].join(" ")
                }
              >
                {link.label}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
