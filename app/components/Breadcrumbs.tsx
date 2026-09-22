import { Link } from "react-router";

export interface Crumb {
  label: string;
  /** Left off on the last crumb, which is the page you are already on. */
  to?: string;
}

export interface BreadcrumbsProps {
  crumbs: Crumb[];
}

/**
 * The trail above the title: where this page sits in the course.
 *
 * The same array feeds the `BreadcrumbList` in the route's `meta()`, so what a
 * crawler is told about the hierarchy is what a visitor can see and click.
 *
 * The separators are decoration and are hidden from a screen reader, which gets
 * the structure from the list markup instead.
 */
export function Breadcrumbs({ crumbs }: BreadcrumbsProps) {
  return (
    <nav aria-label="Breadcrumb">
      <ol className="flex list-none flex-wrap items-center gap-x-2 gap-y-1 p-0 font-sans text-[0.78rem] leading-[1.2rem] text-pa-ink-soft">
        {crumbs.map((crumb, index) => {
          const isLast = index === crumbs.length - 1;

          return (
            <li key={crumb.label} className="flex items-center gap-x-2">
              {crumb.to !== undefined && !isLast ? (
                <Link
                  to={crumb.to}
                  className="text-pa-biro underline decoration-pa-biro/35 underline-offset-4 hover:decoration-pa-biro"
                >
                  {crumb.label}
                </Link>
              ) : (
                <span aria-current={isLast ? "page" : undefined} className="text-pa-ink">
                  {crumb.label}
                </span>
              )}

              {!isLast && (
                <span aria-hidden="true" className="text-pa-ink-soft/50">
                  ›
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
