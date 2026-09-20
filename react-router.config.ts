import type { Config } from "@react-router/dev/config";

export default {
  // No route uses a loader or action, so there is nothing for a runtime
  // server to do. Pre-render every static route to HTML at build time and
  // serve the result from nginx as plain files.
  ssr: false,
  prerender: true,
} satisfies Config;
