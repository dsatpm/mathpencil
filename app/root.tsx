import {
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "react-router";

import type { Route } from "./+types/root";
import "./app.css";

/** The AdSense publisher this site bills to. */
const ADSENSE_CLIENT = "ca-pub-6663003555554484";

export const links: Route.LinksFunction = () => [
  // The ad script is third-party and async; warming its connections keeps it
  // off the critical path rather than in front of the fonts.
  { rel: "preconnect", href: "https://pagead2.googlesyndication.com", crossOrigin: "anonymous" },
  { rel: "preconnect", href: "https://googleads.g.doubleclick.net", crossOrigin: "anonymous" },
  {
    rel: "preload",
    href: "/fonts/sometype-mono-latin.woff2",
    as: "font",
    type: "font/woff2",
    crossOrigin: "anonymous",
  },
  {
    rel: "preload",
    href: "/fonts/familjen-grotesk-latin.woff2",
    as: "font",
    type: "font/woff2",
    crossOrigin: "anonymous",
  },
  // Declared rather than left to the implicit /favicon.ico convention. The
  // implicit lookup only fires when the document is at the root scope, and a
  // browser that cached a failed fetch has no link to revalidate against — the
  // site served 403 for long enough that most visitors have one cached.
  // `sizes: "any"` tells the browser the .ico carries several resolutions
  // (48x48 and 32x32) so it stops at this one rather than hunting for an SVG.
  { rel: "icon", href: "/favicon.ico", sizes: "any" },
];

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        {/* Pinch-zoom is stated rather than assumed: nothing here caps the
            scale, so the machine grows under two fingers like any other page. */}
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, user-scalable=yes, viewport-fit=cover"
        />
        {/* The browser chrome takes the colour of the masthead, so the bar above
            the page matches the bar inside it. */}
        <meta name="theme-color" content="#0c211f" />
        <Meta />
        <Links />
        {/* AdSense. Loaded async so it never holds up the machine, and left in
            the document head where Google's own crawler looks for it. */}
        <script
          async
          src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_CLIENT}`}
          crossOrigin="anonymous"
        />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  let message = "Oops!";
  let details = "An unexpected error occurred.";
  let stack: string | undefined;

  if (isRouteErrorResponse(error)) {
    message = error.status === 404 ? "404" : "Error";
    details =
      error.status === 404
        ? "The requested page could not be found."
        : error.statusText || details;
  } else if (import.meta.env.DEV && error && error instanceof Error) {
    details = error.message;
    stack = error.stack;
  }

  return (
    <main className="flex min-h-dvh items-center justify-center bg-desk px-4 py-12">
      <div className="on-paper w-full max-w-136 bg-tape px-6 py-7">
        <h1 className="font-mono text-[2.5rem] font-medium leading-none text-ribbon">{message}</h1>
        <p className="mt-3 font-sans text-[1rem] text-ink">{details}</p>
        <a
          href="/"
          className="mt-5 inline-block rounded-sm bg-key-act px-5 py-3 font-sans text-[1.2rem] font-bold uppercase tracking-[0.16em] text-white shadow-[0_3px_0_0_var(--color-key-act-deep)] transition-[transform,box-shadow] duration-90 ease-linear active:translate-y-0.75 active:shadow-[0_0_0_0_var(--color-key-act-deep)]"
        >
          Back to the calculator
        </a>
        {stack && (
          <pre className="mt-6 w-full overflow-x-auto border-t border-ink/20 pt-4 font-mono text-[0.75rem] text-ink-soft">
            <code>{stack}</code>
          </pre>
        )}
      </div>
    </main>
  );
}
