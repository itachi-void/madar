import { useEffect } from "react"
import { useLocation } from "react-router"
import pages from "../content/pages.json"
import authoredPages from "../content/authored-pages.json"
import { catalog } from "./PreviewStore"
import { normalizePath } from "./paths"
import { useI18n } from "../i18n/context"
import { locales, localePath, stripLocale } from "../i18n/config"

const routeTitles: Record<string, string> = {
  "/": "مدار — رجال وأطفال",
  "/cart/": "سلة المشتريات",
  "/checkout/": "إتمام الشراء — معاينة",
  "/checkout/order-received/": "اكتملت المعاينة",
  "/my-account/": "حسابي",
  "/my-account/orders/": "الطلبات — معاينة",
  "/my-account/edit-address/": "عنوان التوصيل — معاينة",
  "/my-account/edit-account/": "تفاصيل الحساب — معاينة",
  "/my-account/reset-password/": "كلمة مرور جديدة — معاينة",
}
const privateRoute = /^\/(?:cart|checkout|my-account)(?:\/|$)/

export function useRouteMetadata() {
  const { pathname, search } = useLocation()
  const { locale, t } = useI18n()
  useEffect(() => {
    const path = normalizePath(stripLocale(pathname))
    const captured = pages.find((page) => page.path === path)
    const authored = authoredPages.find((page) => page.path === path)
    const product = catalog.find((item) => item.path === path)
    const params = new URLSearchParams(search)
    const unavailable =
      (path === "/" && params.has("page_id")) ||
      !(captured || routeTitles[path] || authored)
    const favorite =
      path === "/my-account/" && params.get("view") === "favorites"
    const searchTerm = path === "/shop/" ? params.get("s")?.trim() : ""
    const pageTitle = unavailable
      ? "الصفحة غير متاحة"
      : favorite
        ? "القطع المفضّلة"
        : searchTerm
          ? `نتائج البحث عن «${searchTerm}»`
          : authored?.title || routeTitles[path] || captured?.title || "مدار"
    const title =
      path === "/" && !unavailable ? pageTitle : `${pageTitle} — مدار`
    const description = unavailable
      ? "هذه الصفحة غير متاحة. اكتشف تشكيلة مدار للرجال والأطفال."
      : authored
        ? authored.description
        : product
          ? `${product.name} من تشكيلة مدار. اكتشف الصور والتفاصيل والمقاسات المتاحة في نسخة العرض.`
          : privateRoute.test(path)
            ? `${pageTitle} في مدار. واجهة تجريبية فقط بدون تسجيل حساب أو إنشاء طلب أو معالجة مدفوعات.`
            : path === "/"
              ? "مدار للرجال والأطفال. حضور هادئ، واختيارات مدروسة على مدار يومك. اكتشف التشكيلة والإطلالات ودفتر مدار."
              : `${pageTitle} من مدار. اكتشف الاختيارات والتفاصيل من عالم الرجال والأطفال.`
    document.title = t(title)
    const upsert = (
      selector: string,
      tag: string,
      attributes: Record<string, string>,
    ) => {
      let element = document.head.querySelector(selector)
      if (!element) {
        element = document.createElement(tag)
        document.head.appendChild(element)
      }
      Object.entries(attributes).forEach(([name, value]) =>
        element!.setAttribute(name, value),
      )
      return element
    }
    const canonical = new URL(
      encodeURI(localePath(path, locale.code)),
      window.location.origin,
    ).href
    const image = new URL(
      product?.image || "/images/coat-camel.jpg",
      window.location.origin,
    ).href
    upsert('meta[name="description"]', "meta", {
      name: "description",
      content: t(description),
    })
    upsert('link[rel="canonical"]', "link", {
      rel: "canonical",
      href: canonical,
    })
    for (const [property, content] of Object.entries({
      "og:title": t(title),
      "og:description": t(description),
      "og:url": canonical,
      "og:type": product ? "product" : "website",
      "og:image": image,
      "og:locale": {
        eg: "ar_EG",
        sa: "ar_SA",
        en: "en_GB",
        fr: "fr_FR",
        es: "es_ES",
      }[locale.code],
      "og:site_name": t("مدار"),
    })) {
      upsert(`meta[property="${property}"]`, "meta", { property, content })
    }
    upsert('meta[name="twitter:card"]', "meta", {
      name: "twitter:card",
      content: "summary_large_image",
    })
    upsert('meta[name="twitter:title"]', "meta", {
      name: "twitter:title",
      content: t(title),
    })
    upsert('meta[name="twitter:description"]', "meta", {
      name: "twitter:description",
      content: t(description),
    })
    upsert('meta[name="twitter:image"]', "meta", {
      name: "twitter:image",
      content: image,
    })
    const alternates: Element[] = []
    for (const language of locales) {
      const link = document.createElement("link")
      link.rel = "alternate"
      link.hreflang = language.lang
      link.href = new URL(
        encodeURI(localePath(path, language.code)),
        window.location.origin,
      ).href
      document.head.appendChild(link)
      alternates.push(link)
    }
    // Preserve the host's preview-wide noindex; private/error/search pages stay excluded after launch.
    const robots = document.head.querySelector('meta[name="robots"]')
    const previousRobots = robots?.getAttribute("content")
    const restricted =
      privateRoute.test(path) ||
      unavailable ||
      Boolean(searchTerm) ||
      Boolean(authored?.draft)
    if (restricted)
      upsert('meta[name="robots"]', "meta", {
        name: "robots",
        content: "noindex, nofollow",
      })
    const structured = document.createElement("script")
    structured.type = "application/ld+json"
    structured.id = "mdr-route-schema"
    const graph: object[] = []
    if (!restricted) {
      graph.push({
        "@type": "BreadcrumbList",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: t("مدار"),
            item: window.location.origin + localePath("/", locale.code),
          },
          ...(path === "/"
            ? []
            : [
                {
                  "@type": "ListItem",
                  position: 2,
                  name: t(pageTitle),
                  item: canonical,
                },
              ]),
        ],
      })
      if (product)
        graph.push({
          "@type": "Product",
          name: t(product.name),
          image,
          url: canonical,
          description: t(description),
          brand: { "@type": "Brand", name: t("مدار") },
        })
      structured.textContent = JSON.stringify({
        "@context": "https://schema.org",
        "@graph": graph,
      }).replace(/</g, "\\u003c")
      document.head.appendChild(structured)
    }
    return () => {
      structured.remove()
      alternates.forEach((link) => link.remove())
      if (restricted) {
        const current = document.head.querySelector('meta[name="robots"]')
        if (previousRobots === undefined || previousRobots === null)
          current?.remove()
        else current?.setAttribute("content", previousRobots)
      }
    }
  }, [pathname, search, locale, t])
}
