import createMiddleware from "next-intl/middleware";
import { locales } from "./i18n";

export default createMiddleware({
  // A list of all locales that are supported
  locales: locales,

  // Used when no locale matches
  defaultLocale: "de",

  // Automatically redirect to locale-specific URLs
  localePrefix: "always",
});

export const config = {
  // Match only internationalized pathnames
  matcher: ["/", "/(de|en|fr|it)/:path*"],
};
