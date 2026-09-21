import type { Route } from "./+types/terms";
import { PaperSheet } from "../components/PaperSheet";
import { SiteFooter } from "../components/SiteFooter";
import { SiteHeader } from "../components/SiteHeader";
import { absoluteUrl, SITE_NAME } from "../lib/site";

const TITLE = "Terms of use — MathPencil";
const DESCRIPTION =
  "The terms on which MathPencil is offered: free to use, no account, no warranty that an answer is fit for a decision that matters.";

/** Last substantive change to these terms. Update it whenever the text below changes. */
const EFFECTIVE = "20 September 2026";

export function meta({}: Route.MetaArgs) {
  return [
    { title: TITLE },
    { name: "description", content: DESCRIPTION },
    { tagName: "link", rel: "canonical", href: absoluteUrl("/terms") },
    { property: "og:site_name", content: SITE_NAME },
    { property: "og:title", content: TITLE },
    { property: "og:description", content: DESCRIPTION },
    { property: "og:type", content: "website" },
    { property: "og:url", content: absoluteUrl("/terms") },
    { property: "og:image", content: absoluteUrl("/og.png") },
    { property: "og:image:width", content: "1200" },
    { property: "og:image:height", content: "630" },
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:image", content: absoluteUrl("/og.png") },
  ];
}

const HEADING = "mt-7 font-sans text-[1.1rem] font-bold leading-tight text-ink";
const BODY = "mt-2 font-sans text-[1rem] leading-[1.6rem] text-ink-soft";
const LINK = "text-ink underline decoration-ink/30 underline-offset-4 hover:decoration-ink";
const LIST = "mt-2 list-disc pl-5 font-sans text-[1rem] leading-[1.6rem] text-ink-soft";

export default function Terms() {
  return (
    <div className="flex min-h-dvh w-full flex-col bg-desk-deep">
      <SiteHeader />

      <main className="flex flex-1 w-full justify-center bg-desk px-4 py-8 sm:py-12">
        <PaperSheet as="article">
          <p className="font-sans text-[0.72rem] font-semibold uppercase tracking-[0.2em] text-ink-soft">
            In effect from {EFFECTIVE}
          </p>
          <h1 className="mt-2 font-sans text-[1.6rem] font-bold leading-tight text-ink">
            Terms of use
          </h1>

          <p className={BODY}>
            MathPencil is published at{" "}
            <a href="/" className={LINK}>
              mathpencil.com
            </a>{" "}
            by HTPdevs. Using the site means accepting what follows. It is short, because a
            calculator does not need a long contract.
          </p>

          <h2 className={HEADING}>What you get</h2>
          <p className={BODY}>
            Permission to use MathPencil for your own purposes, personal or commercial, at no charge.
            There is no account to create, no licence to buy and no limit on how much arithmetic you
            do. We may change, add to or withdraw features at any time, and we do not promise the
            site will always be available.
          </p>

          <h2 className={HEADING}>Check your own arithmetic</h2>
          <p className={BODY}>
            MathPencil is offered as it is, with no warranty of any kind — including no warranty that
            a given answer is correct, or that the site is fit for any particular purpose. It is
            built carefully and the two engines behind it are described openly on the{" "}
            <a href="/#how-it-works" className={LINK}>
              home page
            </a>
            , but software has faults, and a figure on a screen is not professional advice. Do not
            rely on MathPencil alone for anything financial, medical, structural, legal or otherwise
            consequential. Verify a result that matters.
          </p>

          <h2 className={HEADING}>What you agree not to do</h2>
          <ul className={LIST}>
            <li>
              Attempt to interfere with the site, its server, or anyone else's use of it — including
              by automated request volume intended to degrade it.
            </li>
            <li>Present MathPencil as your own product, or remove or obscure its attribution.</li>
            <li>
              Use the site in a way that breaks the law where you are, or that infringes someone
              else's rights.
            </li>
            <li>
              Interfere with, mask or automate interaction with the advertising on the page, including
              generating clicks or impressions that are not genuine.
            </li>
          </ul>

          <h2 className={HEADING}>Ownership</h2>
          <p className={BODY}>
            The MathPencil name, its wordmark, its design and its source code belong to HTPdevs. The
            numbers you key in are yours; we never receive them, as set out in the{" "}
            <a href="/privacy" className={LINK}>
              privacy policy
            </a>
            .
          </p>

          <h2 className={HEADING}>Advertising and other sites</h2>
          <p className={BODY}>
            The page carries advertising served by Google, and an ad may link somewhere we have no
            control over. We are not responsible for the content, products or practices of any site
            an advertisement leads to, and a link is not an endorsement.
          </p>

          <h2 className={HEADING}>Liability</h2>
          <p className={BODY}>
            To the fullest extent the law allows, HTPdevs is not liable for any loss or damage arising
            from your use of MathPencil or from reliance on a result it produced — including lost
            profit, lost data, or consequential loss of any kind. Nothing here limits liability that
            cannot lawfully be limited, and if you are a consumer, this does not affect the statutory
            rights you have where you live.
          </p>

          <h2 className={HEADING}>Changes to these terms</h2>
          <p className={BODY}>
            If these terms change in a way that matters, the date at the top of this page changes with
            them. Continuing to use the site after that is acceptance of the new version.
          </p>

          <h2 className={HEADING}>Getting in touch</h2>
          <p className={BODY}>
            Questions about these terms, a bug, or a key that should exist:{" "}
            <a href="mailto:support@htpdevs.com" className={LINK}>
              support@htpdevs.com
            </a>
            .
          </p>

          <a
            href="/"
            className="mt-8 inline-block rounded-sm bg-key-act px-5 py-3 font-sans text-[1.2rem] font-bold uppercase tracking-[0.16em] text-white no-underline shadow-[0_3px_0_0_var(--color-key-act-deep)] transition-[transform,box-shadow] duration-90 ease-linear active:translate-y-0.75 active:shadow-[0_0_0_0_var(--color-key-act-deep)]"
          >
            Back to the calculator
          </a>
        </PaperSheet>
      </main>

      <SiteFooter />
    </div>
  );
}
