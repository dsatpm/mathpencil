import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("tools", "routes/tools.tsx"),
  route("tools/calculator", "routes/tools.calculator.tsx"),
  route("tools/scientific", "routes/tools.scientific.tsx"),
  route("pre-algebra", "routes/pre-algebra.tsx"),
  // `solver` is declared before `:slug`, or the param would match it and the
  // solver page would be looked up as a chapter that does not exist.
  route("pre-algebra/solver", "routes/pre-algebra.solver.tsx"),
  route("pre-algebra/:slug", "routes/pre-algebra.chapter.tsx"),
  route("contact", "routes/contact.tsx"),
  route("privacy", "routes/privacy.tsx"),
  route("terms", "routes/terms.tsx"),
  // Addresses that have moved. Each one prerenders a page that forwards to the
  // new address, for the case where nginx has no 301 for it. The map of old to
  // new lives in the route module, so add the path there as well.
  route("scientific", "routes/redirect.tsx", { id: "redirect-scientific" }),
] satisfies RouteConfig;
