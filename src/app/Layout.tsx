import { useEffect, useLayoutEffect, useRef, type MouseEvent } from "react"
import { Link, Outlet, useNavigation, useNavigationType } from "react-router"
import Header from "../components/Header"
import Footer from "../components/Footer"
import { useMadarEffects } from "../useMadarEffects"
import { usePreviewStore } from "./PreviewStore"
import { useRouteMetadata } from "./useRouteMetadata"
import { useLocation, useNavigate } from "../i18n/navigation"
import { useI18n } from "../i18n/context"

export function Layout() {
  const location = useLocation()
  const { locale } = useI18n()
  const navigate = useNavigate()
  const navigation = useNavigation()
  const navigationType = useNavigationType()
  const scrollPositions = useRef(new Map<string, number>())
  const activeScrollKey = useRef(location.key)
  const { message, dismissMessage } = usePreviewStore()
  const key = location.pathname + location.search
  useMadarEffects(key)
  useRouteMetadata()
  useEffect(dismissMessage, [key, dismissMessage])

  useLayoutEffect(() => {
    activeScrollKey.current = location.key
  }, [location.key])

  useEffect(() => {
    const previous = window.history.scrollRestoration
    window.history.scrollRestoration = "manual"
    const rememberScroll = () =>
      scrollPositions.current.set(activeScrollKey.current, window.scrollY)
    window.addEventListener("scroll", rememberScroll, { passive: true })
    return () => {
      window.removeEventListener("scroll", rememberScroll)
      window.history.scrollRestoration = previous
    }
  }, [])

  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      if (location.hash) {
        let id = location.hash.slice(1)
        try {
          id = decodeURIComponent(id)
        } catch {
          /* Malformed hashes have no matching target. */
        }
        const target = document.getElementById(id)
        target?.scrollIntoView({ block: "start" })
      } else {
        window.scrollTo({
          top:
            navigationType === "POP"
              ? scrollPositions.current.get(location.key) || 0
              : 0,
          behavior: "instant",
        })
        document
          .querySelector<HTMLElement>("main")
          ?.focus({ preventScroll: true })
      }
    })
    return () => {
      cancelAnimationFrame(frame)
    }
  }, [key, location.hash, location.key, navigationType])

  useEffect(() => {
    if (!message) return
    const timer = window.setTimeout(dismissMessage, 6500)
    return () => window.clearTimeout(timer)
  }, [message, dismissMessage])

  const followLocalLink = (event: MouseEvent<HTMLDivElement>) => {
    if (
      event.defaultPrevented ||
      event.button !== 0 ||
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey
    )
      return
    const anchor = (event.target as Element).closest<HTMLAnchorElement>(
      "a[href]",
    )
    if (
      !anchor ||
      anchor.hasAttribute("download") ||
      (anchor.target && anchor.target !== "_self")
    )
      return
    const url = new URL(anchor.href, window.location.href)
    if (
      url.origin !== window.location.origin ||
      /\.(?:jpg|jpeg|png|svg|webp|pdf|zip)$/i.test(url.pathname)
    )
      return
    event.preventDefault()
    navigate(url.pathname + url.search + url.hash)
  }

  return (
    <>
      <a className="skip-link screen-reader-text" href="#mdr-main">
        تخطى إلى المحتوى
      </a>
      <div
        className="wp-site-blocks"
        onClickCapture={() =>
          scrollPositions.current.set(location.key, window.scrollY)
        }
        onClick={followLocalLink}
      >
        <Header />
        {locale.code === "sa" && (
          <p className="mdr-region-note">
            نسخة سعودية باللغة العربية. الأسعار المرجعية بالجنيه المصري؛ الأسعار
            والضريبة والشحن داخل السعودية لم تُعتمد بعد. لا يوجد شراء أو دفع
            فعلي.
          </p>
        )}
        {navigation.state !== "idle" && (
          <div className="mdr-route-progress" role="status">
            <span className="screen-reader-text">جارٍ تحميل الصفحة…</span>
          </div>
        )}
        <div
          className="mdr-route-view"
          key={key}
          aria-busy={navigation.state !== "idle"}
        >
          <Outlet />
        </div>
        <Footer />
        {message && (
          <aside className="mdr-preview-toast" role="status">
            <span>{message}</span>
            {message.includes("سلة") && <Link to="/cart/">عرض السلة</Link>}
            <button
              type="button"
              onClick={dismissMessage}
              aria-label="إغلاق التنبيه"
            >
              ×
            </button>
          </aside>
        )}
      </div>
    </>
  )
}
