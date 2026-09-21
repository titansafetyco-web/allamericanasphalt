export type Locale = "en" | "es";

export const locales = ["en", "es"] as const;
export const LOCALE_COOKIE = "aaa-locale";

export function parseLocale(value?: string | null): Locale {
  return value === "es" ? "es" : "en";
}
