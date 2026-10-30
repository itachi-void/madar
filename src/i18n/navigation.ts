import { useCallback } from "react"
import {
  useLocation as useRouterLocation,
  useNavigate as useRouterNavigate,
  type NavigateOptions,
  type To,
} from "react-router"
import { useI18n } from "./context"
import { localePath, stripLocale } from "./config"

export function useLocation() {
  const location = useRouterLocation()
  return { ...location, pathname: stripLocale(location.pathname) }
}

export function useNavigate() {
  const navigate = useRouterNavigate()
  const { locale } = useI18n()
  return useCallback(
    (to: To | number, options?: NavigateOptions) => {
      if (typeof to === "number") return navigate(to)
      return navigate(
        typeof to === "string"
          ? localePath(to, locale.code)
          : {
              ...to,
              pathname: to.pathname
                ? localePath(to.pathname, locale.code)
                : undefined,
            },
        options,
      )
    },
    [navigate, locale.code],
  )
}
