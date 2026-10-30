import { useLayoutEffect, useMemo } from "react"
import { useLoaderData, useLocation } from "react-router"
import {
  LocaleContext,
  localeCache,
  localeValue,
  type LocaleData,
} from "./context"
import { localeFromPath } from "./config"
import errorCopy from "./error-copy.json"
import { Layout } from "../app/Layout"
import { RouteError } from "../app/RouteError"
import "../theme/locales.css"

export function LocaleLayout() {
  const data = useLoaderData<LocaleData>()
  const value = useMemo(() => localeValue(data), [data])
  useLayoutEffect(() => {
    document.documentElement.lang = data.locale.lang
    document.documentElement.dir = data.locale.direction
    document.documentElement.dataset.locale = data.locale.code
  }, [data.locale])
  return (
    <LocaleContext.Provider value={value}>
      <Layout />
    </LocaleContext.Provider>
  )
}

export function LocaleError() {
  const location = useLocation()
  const locale = localeFromPath(location.pathname)
  // Keep the retry screen readable even if the full language chunk cannot load.
  const value = useMemo(
    () =>
      localeCache.get(locale.code) ||
      localeValue({
        locale,
        dictionary: locale.code === "eg" ? {} : errorCopy[locale.code],
      }),
    [locale],
  )
  useLayoutEffect(() => {
    document.documentElement.lang = locale.lang
    document.documentElement.dir = locale.direction
    document.documentElement.dataset.locale = locale.code
    document.title = value.t("تعذّر تحميل الصفحة.") + " — " + value.t("مدار")
  }, [locale, value])
  return (
    <LocaleContext.Provider value={value}>
      <RouteError />
    </LocaleContext.Provider>
  )
}
