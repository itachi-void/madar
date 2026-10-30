import { useEffect, useState, useCallback, useMemo, useRef } from "react"
import { Link, useSearchParams } from "react-router"
import { catalogService, type Product } from "../api"
import { useI18n } from "../i18n/context"
import { usePreviewStore } from "./PreviewStore"
import { formatPrice, img } from "../data"
import { Button } from "../components/Interface"

interface CatalogPageProps {
  audience?: "men" | "kids" | ""
}

export function CatalogPage({ audience: initialAudience = "" }: CatalogPageProps) {
  const { locale, t } = useI18n()
  const { favorites: favs, toggleFavorite: toggleFav } = usePreviewStore()
  const [searchParams, setSearchParams] = useSearchParams()

  const activeAudience = (searchParams.get("audience") as "men" | "kids" | null) || initialAudience || ""
  const [orderBy, setOrderBy] = useState<string>("menu_order")

  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [quickView, setQuickView] = useState<Product | null>(null)
  const quickDialog = useRef<HTMLDialogElement>(null)

  useEffect(() => {
    if (quickView && !quickDialog.current?.open) {
      quickDialog.current?.showModal()
    }
  }, [quickView])

  const loadCatalog = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const items = await catalogService.getProducts({
        lang: locale.lang,
        audience: activeAudience ? (activeAudience as "men" | "kids") : undefined,
      })
      setProducts(items)
    } catch (err) {
      console.error("Failed to load catalog:", err)
      setError(err instanceof Error ? err.message : t("تعذر الاتصال بالخادم"))
    } finally {
      setLoading(false)
    }
  }, [locale.lang, activeAudience, t])

  useEffect(() => {
    loadCatalog()
  }, [loadCatalog])

  const sortedProducts = useMemo(() => {
    const list = [...products]
    if (orderBy === "price_asc") {
      list.sort((a, b) => (a.price?.min ?? 0) - (b.price?.min ?? 0))
    } else if (orderBy === "price_desc") {
      list.sort((a, b) => (b.price?.min ?? 0) - (a.price?.min ?? 0))
    }
    return list
  }, [products, orderBy])

  const setAudienceFilter = (aud: "" | "men" | "kids") => {
    const next = new URLSearchParams(searchParams)
    if (aud) {
      next.set("audience", aud)
    } else {
      next.delete("audience")
    }
    setSearchParams(next)
  }

  const title =
    activeAudience === "men"
      ? t("عالم الرجال")
      : activeAudience === "kids"
      ? t("عالم الأطفال")
      : t("كل القطع")

  const description =
    activeAudience === "men"
      ? t("قطع فاخرة مصممة لرجل يبحث عن البساطة الراقية والأناقة اليومية.")
      : activeAudience === "kids"
      ? t("تصاميم مريحة بخامات طبيعية فاخرة تعتني بحكاياتهم الصغيرة.")
      : t("تشكيلة مدار الكاملة — حياكة إيطالية وأقمشة طبيعية مختارة بعناية.")

  return (
    <main id="mdr-main" className="mdr-commerce-page wp-block-group has-global-padding" tabIndex={-1}>
      {/* Breadcrumbs */}
      <div className="woocommerce wc-block-breadcrumbs alignwide has-font-size has-small-font-size wp-block-woocommerce-breadcrumbs" style={{ marginTop: 24 }}>
        <nav className="woocommerce-breadcrumb" aria-label={t("مسار التصفح")}>
          <Link to="/">{t("الرئيسية")}</Link> &nbsp;/&nbsp; <span>{title}</span>
        </nav>
      </div>

      {/* Heading & Controls */}
      <header className="store-heading" style={{ marginTop: 24, marginBottom: 32 }}>
        <div>
          <span className="quiet-kicker" dir="ltr">MADAR / COLLECTION</span>
          <h1 className="mdr-title" style={{ marginTop: 8 }}>{title}</h1>
          <p className="mdr-lead" style={{ marginTop: 8, color: "var(--mdr-stone)", maxWidth: "38rem" }}>
            {description}
          </p>
        </div>

        <div style={{ display: "flex", gap: 16, alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", marginTop: 24, borderBottom: "1px solid var(--mdr-line)", paddingBottom: 16 }}>
          {/* Audience Filter Tabs */}
          <div style={{ display: "flex", gap: 8 }}>
            <Button
              variant={activeAudience === "" ? "primary" : "secondary"}
              onClick={() => setAudienceFilter("")}
            >
              {t("الكل")}
            </Button>
            <Button
              variant={activeAudience === "men" ? "primary" : "secondary"}
              onClick={() => setAudienceFilter("men")}
            >
              {t("الرجال")}
            </Button>
            <Button
              variant={activeAudience === "kids" ? "primary" : "secondary"}
              onClick={() => setAudienceFilter("kids")}
            >
              {t("الأطفال")}
            </Button>
          </div>

          {/* Sorting */}
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <label htmlFor="mdr-sort" style={{ fontSize: 13, color: "var(--mdr-muted)" }}>
              {t("الترتيب:")}
            </label>
            <select
              id="mdr-sort"
              value={orderBy}
              onChange={(e) => setOrderBy(e.target.value)}
              style={{
                background: "var(--mdr-base)",
                border: "1px solid var(--mdr-line)",
                padding: "8px 12px",
                font: "inherit",
                fontSize: 13,
                cursor: "pointer",
              }}
            >
              <option value="menu_order">{t("الترتيب الافتراضي")}</option>
              <option value="price_asc">{t("السعر: من الأقل للأعلى")}</option>
              <option value="price_desc">{t("السعر: من الأعلى للأقل")}</option>
            </select>
          </div>
        </div>
      </header>

      {/* Product Grid */}
      <section aria-label={title}>
        <div className="store-product-grid">
          {loading ? (
            Array.from({ length: 8 }).map((_, i) => (
              <article key={i} className="store-product-card mdr-skeleton-card" aria-hidden="true">
                <div className="store-card-image mdr-skeleton-box" />
                <div className="store-card-meta">
                  <div className="mdr-skeleton-line" style={{ width: "70%", height: 16 }} />
                  <div className="mdr-skeleton-line" style={{ width: "30%", height: 16 }} />
                </div>
                <div className="mdr-skeleton-line" style={{ width: "50%", height: 12, marginTop: 6 }} />
              </article>
            ))
          ) : error ? (
            <div className="mdr-api-error" role="alert">
              <p>{error}</p>
              <Button variant="secondary" onClick={loadCatalog}>
                {t("إعادة المحاولة")}
              </Button>
            </div>
          ) : sortedProducts.length === 0 ? (
            <div className="mdr-api-empty">
              <p>{t("لا توجد منتجات مطابقة في هذا القسم حالياً.")}</p>
            </div>
          ) : (
            sortedProducts.map((p) => {
              const frontImg = p.images?.find((i) => i.role === "front")?.url || p.images?.[0]?.url || img("coat-camel")
              const altImg = p.images?.find((i) => i.role === "back" || i.role === "detail_1")?.url || p.images?.[1]?.url || frontImg
              const audienceLabel = p.audience === "kids" ? "KIDS" : "MEN"
              const priceVal = p.price?.min ?? 0
              const regularVal = p.price?.regular_min ?? priceVal
              const onSale = Boolean(p.price?.on_sale && regularVal > priceVal)
              const currency = p.price?.currency === "EGP" ? "ج.م" : (p.price?.currency || "ج.م")
              const targetPath = `/product/${p.slug}/`

              return (
                <article key={p.id} className="store-product-card mdr-reveal is-visible">
                  <div className="store-card-image">
                    <Link to={targetPath}>
                      <img className="store-card-main" src={frontImg} alt={p.name} loading="lazy" />
                      <img className="store-card-alternate" src={altImg} alt="" loading="lazy" />
                    </Link>
                    <button
                      type="button"
                      className="store-card-fav"
                      aria-label={t("حفظ أو إزالة القطعة")}
                      aria-pressed={favs.includes(p.id)}
                      onClick={() => toggleFav(p.id)}
                    >
                      {favs.includes(p.id) ? "♥" : "♡"}
                    </button>
                    <small>{audienceLabel}</small>
                    <button
                      type="button"
                      className="experience-quick-trigger"
                      onClick={() => setQuickView(p)}
                    >
                      {t("معاينة سريعة +")}
                    </button>
                  </div>
                  <div className="store-card-meta">
                    <Link to={targetPath}>{p.name}</Link>
                    <span>
                      {p.madar?.styling_only ? (
                        <small style={{ color: "var(--mdr-muted)" }}>{t("قطعة تنسيقية")}</small>
                      ) : onSale ? (
                        <>
                          <del>{formatPrice(regularVal, currency)}</del>{" "}
                          <ins>{formatPrice(priceVal, currency)}</ins>
                        </>
                      ) : (
                        formatPrice(priceVal, currency)
                      )}
                    </span>
                  </div>
                  <p>{p.madar?.fit || p.short_description || ""}</p>
                </article>
              )
            })
          )}
        </div>
      </section>

      {/* Quick View Dialog */}
      <dialog
        ref={quickDialog}
        className="mdr-drawer mdr-quick-view"
        aria-labelledby="quick-view-title"
        onClose={() => setQuickView(null)}
        onClick={(event) => {
          if (event.target === event.currentTarget) quickDialog.current?.close()
        }}
      >
        <div className="mdr-drawer__head">
          <h2 id="quick-view-title">{t("معاينة سريعة")}</h2>
          <button
            type="button"
            data-close
            aria-label={t("إغلاق المعاينة")}
            onClick={() => quickDialog.current?.close()}
          >
            ×
          </button>
        </div>
        {quickView && (
          <div className="mdr-drawer__body">
            <img
              className="mdr-quick-view__image"
              src={quickView.images?.find((i) => i.role === "front")?.url || quickView.images?.[0]?.url || img("coat-camel")}
              alt={quickView.name}
            />
            <h3>{quickView.name}</h3>
            <p>
              {formatPrice(
                quickView.price?.min,
                quickView.price?.currency === "EGP" ? "ج.م" : (quickView.price?.currency || "ج.م"),
              )}
            </p>
            <p>{quickView.madar?.fit || quickView.short_description}</p>
            <Link
              to={`/product/${quickView.slug}/`}
              className="mdr-btn"
              onClick={() => quickDialog.current?.close()}
            >
              {t("التفاصيل والمقاسات")} <span aria-hidden="true">←</span>
            </Link>
          </div>
        )}
      </dialog>
    </main>
  )
}

export function MenCatalogPage() {
  return <CatalogPage audience="men" />
}

export function KidsCatalogPage() {
  return <CatalogPage audience="kids" />
}

