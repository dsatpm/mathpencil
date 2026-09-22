import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("scientific", "routes/scientific.tsx"),
  route("pre-algebra", "routes/pre-algebra.tsx"),
  route("contact", "routes/contact.tsx"),
  route("privacy", "routes/privacy.tsx"),
  route("terms", "routes/terms.tsx"),
] satisfies RouteConfig;
