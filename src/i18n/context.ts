import { createContext, useContext } from "react"
import { locales, type Dictionary, type Locale } from "./config"
import { createTranslator } from "./translate"

export type LocaleData = {
  locale: Locale
  dictionary: Dictionary
}
export type LocaleValue = LocaleData & { t: (value: string) => string }
const defaultValue: LocaleValue = {
  locale: locales[0],
  dictionary: {},
  t: (value) => value,
}
export const LocaleContext = createContext<LocaleValue>(defaultValue)
export const useI18n = () => useContext(LocaleContext)
export const localeCache = new Map<string, LocaleValue>([["eg", defaultValue]])

export function localeValue(data: LocaleData): LocaleValue {
  const value = { ...data, t: createTranslator(data.locale, data.dictionary) }
  localeCache.set(data.locale.code, value)
  return value
}

export async function loadLocale(locale: Locale): Promise<LocaleData> {
  const dictionary =
    locale.code === "eg"
      ? {}
      : (
          await {
            sa: () => import("./locales/sa.json"),
            en: () => import("./locales/en.json"),
            fr: () => import("./locales/fr.json"),
            es: () => import("./locales/es.json"),
          }[locale.code]()
        ).default
  const data = { locale, dictionary }
  localeValue(data)
  return data
}
