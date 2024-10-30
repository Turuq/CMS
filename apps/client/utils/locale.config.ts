import { Pathnames, LocalePrefix } from "next-intl/routing";

export const defaultLocale = "en" as const;
export const locales = ["en", "ar"] as const;

export const pathnames = {
  "/": "/",
  "/pathnames": {
    en: "/pathnames",
    ar: "/مسارات",
  },
} satisfies Pathnames<typeof locales>;

export const localePrefix: LocalePrefix<typeof locales> = "always";

export const port = process.env.PORT || 3000;
export const host = process.env.BASE_URL
  ? `https://${process.env.BASE_URL}`
  : `http://localhost:${port}`;
