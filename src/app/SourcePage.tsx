import { useEffect, useMemo, useRef } from "react"
import { useLoaderData, useSearchParams } from "react-router"
import { useSourceInteractions } from "./useSourceInteractions"
import { useI18n } from "../i18n/context"
import { localizeHtml } from "../i18n/html"

export type CapturedPage = {
  path: string
  title: string
  bodyClass: string
  html: string
}

export function SourcePage() {
  const page = useLoaderData<CapturedPage>()
  const { locale, t } = useI18n()
  const html = useMemo(
    () => localizeHtml(page.html, locale, t),
    [page.html, locale, t],
  )
  const root = useRef<HTMLDivElement>(null)
  const [search] = useSearchParams()
  useSourceInteractions(root, page, search.toString(), true)

  useEffect(() => {
    const classes = page.bodyClass.split(/\s+/).filter(Boolean)
    document.body.classList.add(...classes, "mdr-imported-view")
    return () =>
      document.body.classList.remove(
        ...classes,
        "mdr-imported-view",
        "mdr-density-large",
      )
  }, [page])

  return (
    <>
      {/* Build-time sanitized public markup; scripts, handlers, nonces, and server form actions are removed. */}
      <div
        className="mdr-source-page"
        ref={root}
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </>
  )
}
