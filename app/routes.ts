import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("scientific", "routes/scientific.tsx"),
  route("pre-algebra", "routes/pre-algebra.tsx"),
  // `solver` is declared before `:slug`, or the param would match it and the
  // solver page would be looked up as a chapter that does not exist.
  route("pre-algebra/solver", "routes/pre-algebra.solver.tsx"),
  route("pre-algebra/:slug", "routes/pre-algebra.chapter.tsx"),
  route("contact", "routes/contact.tsx"),
  route("privacy", "routes/privacy.tsx"),
  route("terms", "routes/terms.tsx"),
] satisfies RouteConfig;
