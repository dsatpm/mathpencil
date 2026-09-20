import type { Route } from "./+types/contact";
import { SiteHeader } from "../components/SiteHeader";
import { absoluteUrl, SITE_NAME } from "../lib/site";

const TITLE = "Contact — MathPencil";
const DESCRIPTION = "How to reach the people who build MathPencil.";

export function meta({}: Route.MetaArgs) {
  return [
    { title: TITLE },
    { name: "description", content: DESCRIPTION },
    { tagName: "link", rel: "canonical", href: absoluteUrl("/contact") },
    { property: "og:site_name", content: SITE_NAME },
    { property: "og:title", content: TITLE },
    { property: "og:description", content: DESCRIPTION },
    { property: "og:type", content: "website" },
    { property: "og:url", content: absoluteUrl("/contact") },
    { property: "og:image", content: absoluteUrl("/mathpencil.png") },
    { name: "twitter:card", content: "summary" },
  ];
}

export default function Contact() {
  return (
    <div className="flex min-h-dvh w-full flex-col bg-desk-deep">
      <SiteHeader />

      <main className="flex flex-1 w-full items-center justify-center bg-desk px-4 py-10">
        <section className="on-paper w-full max-w-136 bg-tape px-6 py-7 shadow-[0_18px_44px_-12px_rgba(0,0,0,0.7)]">
          <h1 className="font-sans text-[1.6rem] font-bold leading-tight text-ink">Contact</h1>

          <p className="mt-3 font-sans text-[1rem] leading-[1.6rem] text-ink-soft">
            Something adding up wrong, a key that should exist, or a sum the machine refuses?
            Tell us and it gets fixed.
          </p>

          <dl className="mt-6 grid grid-cols-[6rem_1fr] gap-x-4 gap-y-3 font-sans text-[0.95rem]">
            <dt className="font-semibold uppercase tracking-[0.12em] text-[0.75rem] text-ink-soft">
              Email
            </dt>
            <dd className="m-0">
              <a
                href="mailto:support@htpdevs.com"
                className="font-mono text-ink underline decoration-ink/30 underline-offset-4 hover:decoration-ink"
              >
                support@htpdevs.com
              </a>
            </dd>

            <dt className="font-semibold uppercase tracking-[0.12em] text-[0.75rem] text-ink-soft">
              Built by
            </dt>
            <dd className="m-0 text-ink">HTPdevs</dd>
          </dl>

          <a
            href="/"
            className="mt-7 inline-block rounded-sm bg-key-act px-5 py-3 font-sans text-[0.85rem] font-bold uppercase tracking-[0.2em] text-white no-underline shadow-[0_3px_0_0_var(--color-key-act-deep)] transition-[transform,box-shadow] duration-90 ease-linear active:translate-y-0.75 active:shadow-[0_0_0_0_var(--color-key-act-deep)]"
          >
            Back to the calculator
          </a>
        </section>
      </main>
    </div>
  );
}
