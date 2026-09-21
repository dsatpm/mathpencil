import { NavLink } from "react-router";

/**
 * The legal and navigational links every page carries. Kept as data so the next
 * one is a line rather than a layout change.
 */
const FOOTER_LINKS: Array<{ to: string; label: string }> = [
  { to: "/", label: "Calculator" },
  { to: "/scientific", label: "Scientific" },
  { to: "/privacy", label: "Privacy" },
  { to: "/terms", label: "Terms" },
  { to: "/contact", label: "Contact" },
];

/**
 * The bar below the desk.
 *
 * It mirrors the masthead exactly — same dark ground, same hairline, same
 * uppercase grotesk at the same tracking — because the two bars are the same
 * object: the edge of the desk, above and below. Nothing here is required to
 * get an answer, which is why it lives after the machine rather than beside it.
 */
export function SiteFooter() {
  return (
    <footer className="w-full border-t border-desk-edge/70 bg-desk-deep">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-3 px-4 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <nav aria-label="Legal and site">
          <ul className="flex list-none flex-wrap items-center gap-x-5 gap-y-2 p-0 font-sans text-[0.78rem] font-semibold uppercase tracking-[0.14em]">
            {FOOTER_LINKS.map((link) => (
              <li key={link.to}>
                <NavLink
                  to={link.to}
                  end
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

        <small className="font-sans text-[0.72rem] font-semibold tracking-[0.1em] text-tape/45">
          © {new Date().getFullYear()} HTPdevs. MathPencil is free to use.
        </small>
      </div>
    </footer>
  );
}
