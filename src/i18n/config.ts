import localeData from "./locales.json" with { type: "json" }
export type LocaleCode = "eg" | "sa" | "en" | "fr" | "es"
export type Locale = {
  code: LocaleCode
  prefix: string
  lang: string
  direction: "rtl" | "ltr"
  label: string
}
export const locales = localeData as Locale[]
export type Dictionary = Record<string, string>

export function localeFromPath(path: string): Locale {
  return (
    locales.find(
      (locale) =>
        locale.prefix &&
        (path === locale.prefix || path.startsWith(locale.prefix + "/")),
    ) || locales[0]
  )
}

export function stripLocale(path: string) {
  const locale = localeFromPath(path)
  return locale.prefix ? path.slice(locale.prefix.length) || "/" : path
}

export function localePath(path: string, locale: LocaleCode) {
  const pathname = path.split(/[?#]/)[0]
  if (
    !path.startsWith("/") ||
    path.startsWith("//") ||
    /^\/(?:images|fonts|assets)\//.test(path) ||
    /\.[a-z0-9]+$/i.test(pathname)
  )
    return path
  if (localeFromPath(pathname).code !== "eg") return path
  return (
    (locales.find((candidate) => candidate.code === locale)?.prefix || "") +
    path
  )
}

export function switchLocalePath(path: string, locale: LocaleCode) {
  return localePath(stripLocale(path), locale)
}
