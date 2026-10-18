import type { Route } from "./+types/privacy";
import { PaperSheet } from "../components/PaperSheet";
import { ScrollToTop } from "../components/ScrollToTop";
import { SiteFooter } from "../components/SiteFooter";
import { SiteHeader } from "../components/SiteHeader";
import { absoluteUrl, SITE_NAME } from "../lib/site";

const TITLE = "Privacy policy | MathPencil";
const DESCRIPTION =
  "What MathPencil does and does not collect: calculations stay in your browser, the site sets no cookies of its own, and Google AdSense serves the advertising.";

/** Last substantive change to this policy. Update it whenever the text below changes. */
const EFFECTIVE = "17 October 2026";

export function meta({}: Route.MetaArgs) {
  return [
    { title: TITLE },
    { name: "description", content: DESCRIPTION },
    { tagName: "link", rel: "canonical", href: absoluteUrl("/privacy") },
    { property: "og:site_name", content: SITE_NAME },
    { property: "og:title", content: TITLE },
    { property: "og:description", content: DESCRIPTION },
    { property: "og:type", content: "website" },
    { property: "og:url", content: absoluteUrl("/privacy") },
    { property: "og:image", content: absoluteUrl("/og.png") },
    { property: "og:image:width", content: "1200" },
    { property: "og:image:height", content: "630" },
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:image", content: absoluteUrl("/og.png") },
  ];
}

/** Shared type for a section heading followed by prose. */
const HEADING = "mt-7 font-sans text-[1.1rem] font-bold leading-tight text-ink";
const BODY = "mt-2 font-sans text-[1rem] leading-[1.6rem] text-ink-soft";
const LINK = "text-ink underline decoration-ink/30 underline-offset-4 hover:decoration-ink";
const LIST = "mt-2 list-disc pl-5 font-sans text-[1rem] leading-[1.6rem] text-ink-soft";

export default function Privacy() {
  return (
    <div className="flex min-h-dvh w-full flex-col bg-desk-deep">
      <SiteHeader />

      <main className="flex flex-1 w-full justify-center bg-desk px-4 py-8 sm:py-12">
        <PaperSheet as="article">
          <p className="font-sans text-[0.72rem] font-semibold uppercase tracking-[0.2em] text-ink-soft">
            In effect from {EFFECTIVE}
          </p>
          <h1 className="mt-2 font-sans text-[1.6rem] font-bold leading-tight text-ink">
            Privacy policy
          </h1>

          <p className={BODY}>
            MathPencil is free math lessons and calculators for learners of every age, published at{" "}
            <a href="/" className={LINK}>
              mathpencil.com
            </a>{" "}
            by HTPdevs. This policy explains what happens to information when the site is used. It
            states what is collected, what is not, and who else is involved.
          </p>

          <h2 className={HEADING}>The short version</h2>
          <ul className={LIST}>
            <li>Your calculations never leave your browser. We do not receive them or store them.</li>
            <li>There is no account, no sign-up and no newsletter. We do not ask for your name or email.</li>
            <li>MathPencil sets no cookies of its own and saves nothing to your device.</li>
            <li>We run no analytics or tracking scripts of our own.</li>
            <li>
              Children use MathPencil, so ads are not personalised. Google is told to treat the site
              as child-directed, which turns off interest-based ads and remarketing.
            </li>
            <li>
              Advertising is served by Google, which still uses cookies and similar identifiers to
              show contextual ads, count them and prevent fraud. That is the only third party on the
              page.
            </li>
          </ul>

          <h2 className={HEADING}>What you key into the calculator</h2>
          <p className={BODY}>
            Both the keypad and the paste field are arithmetic running locally in your browser. The
            figures you key, the sums you paste and the tape they print are held in the page's memory
            for as long as the tab is open, and are discarded when you close or reload it. They are
            not transmitted to us, not written to your device, and not shared with anyone,
            including advertisers.
          </p>

          <h2 className={HEADING}>Cookies and local storage</h2>
          <p className={BODY}>
            MathPencil itself sets no cookies and writes nothing to local storage. Cookies you may
            find from this site come from Google's advertising, described next, or, in the European
            Economic Area, the United Kingdom and Switzerland, from the consent notice that records
            the choice you made.
          </p>

          <h2 className={HEADING}>Advertising</h2>
          <p className={BODY}>
            MathPencil is free to use and carries advertising to pay for its hosting and development.
            Ads are served by Google AdSense. MathPencil is used by children as well as adults, so
            the site is set up for Google to treat it as child-directed. Under that setting Google
            does not show interest-based ads or remarketing ads here, and the ads are chosen from
            the content of the page you are reading rather than from your browsing history. Google
            and its partners may still set or read cookies and similar identifiers to serve those
            ads, to limit how often you see the same one, to measure whether an ad worked, and to
            detect fraud.
          </p>
          <p className={BODY}>
            Google's own description of how it uses information from sites that use its services is
            at{" "}
            <a
              href="https://policies.google.com/technologies/partner-sites"
              className={LINK}
              rel="noopener"
            >
              policies.google.com/technologies/partner-sites
            </a>
            . Google's controls for personalised advertising on other sites are at{" "}
            <a href="https://myadcenter.google.com" className={LINK} rel="noopener">
              myadcenter.google.com
            </a>
            , and you can opt out of personalisation by many other vendors at{" "}
            <a href="https://optout.aboutads.info" className={LINK} rel="noopener">
              optout.aboutads.info
            </a>{" "}
            or, in Europe,{" "}
            <a href="https://www.youronlinechoices.eu" className={LINK} rel="noopener">
              youronlinechoices.eu
            </a>
            .
          </p>

          <h2 className={HEADING}>If you are in the EEA, the UK or Switzerland</h2>
          <p className={BODY}>
            Before any advertising cookie or identifier that requires consent is used, you are asked
            for that consent through a consent notice, and your choice is recorded and passed to
            Google and its partners. You can change it at any time through the notice. Where we and
            Google rely on consent, you may withdraw it; where information is handled for security
            and the basic operation of the site, the basis is our legitimate interest in keeping it
            running.
          </p>

          <h2 className={HEADING}>If you are in California or another US state</h2>
          <p className={BODY}>
            We do not sell personal information, and we do not share it for cross-context behavioural
            advertising: interest-based ads and remarketing are switched off on this site, as
            described above. We hold no account, profile or contact record about you that could be
            requested or deleted, because we never collect one.
          </p>

          <h2 className={HEADING}>Server logs</h2>
          <p className={BODY}>
            The web server that delivers the page keeps ordinary access logs: the IP address the
            request came from, the time, the page requested, the browser's user-agent string, and any
            errors. These are the standard records a web server keeps to stay secure and to diagnose
            faults. They are not used to build a profile of you, are not combined with anything else,
            and are rotated and deleted in the normal course of server maintenance.
          </p>

          <h2 className={HEADING}>Children</h2>
          <p className={BODY}>
            MathPencil is for learners of every age, and children use it. There is no account, no
            sign-up and no form that asks for a name or an email address, so the site does not
            collect personal information from anyone, of any age. Because children use the site,
            advertising is set to the child-directed treatment described above: no interest-based
            ads and no remarketing. If you are a parent or guardian and have a question about this,
            write to the address below.
          </p>

          <h2 className={HEADING}>Changes to this policy</h2>
          <p className={BODY}>
            If this policy changes in a way that matters, the date at the top of this page changes
            with it. The current version is always the one published here.
          </p>

          <h2 className={HEADING}>Getting in touch</h2>
          <p className={BODY}>
            Questions about privacy, or about anything else, go to{" "}
            <a href="mailto:support@htpdevs.com" className={LINK}>
              support@htpdevs.com
            </a>
            . There is more on the{" "}
            <a href="/contact" className={LINK}>
              contact page
            </a>
            .
          </p>

          <a
            href="/"
            className="mt-8 inline-block rounded-sm bg-key-act px-5 py-3 font-sans text-[1.2rem] font-bold uppercase tracking-[0.16em] text-white no-underline shadow-[0_3px_0_0_var(--color-key-act-deep)] transition-[transform,box-shadow] duration-90 ease-linear active:translate-y-0.75 active:shadow-[0_0_0_0_var(--color-key-act-deep)]"
          >
            Back to the home page
          </a>
        </PaperSheet>
      </main>

      <ScrollToTop />
      <SiteFooter />
    </div>
  );
}
