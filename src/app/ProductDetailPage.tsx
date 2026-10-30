import { useEffect, useState, useCallback } from "react"
import { useParams, Link } from "react-router"
import { catalogService, type Product } from "../api"
import { useI18n } from "../i18n/context"
import { useCart } from "./CartContext"
import { formatPrice, img } from "../data"
import { Button } from "../components/Interface"

export function ProductDetailPage() {
  const { slug } = useParams<{ slug: string }>()
  const { locale, t } = useI18n()
  const { addItem, actionLoading } = useCart()

  const [product, setProduct] = useState<Product | null>(null)
  const [pairs, setPairs] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [selectedImageIndex, setSelectedImageIndex] = useState(0)
  const [selectedSize, setSelectedSize] = useState<string>("")
  const [addError, setAddError] = useState<string | null>(null)
  const [addSuccess, setAddSuccess] = useState(false)

  const loadProduct = useCallback(async () => {
    if (!slug) return
    setLoading(true)
    setError(null)
    try {
      const data = await catalogService.getProductBySlug(slug, locale.lang)
      setProduct(data)
      setSelectedImageIndex(0)

      // Auto-select first in-stock variation size
      if (data.variations?.length) {
        const firstInStock = data.variations.find((v) => v.in_stock) || data.variations[0]
        const sizeAttr = Object.values(firstInStock.attributes)[0]
        if (sizeAttr) setSelectedSize(sizeAttr)
      }

      // Load paired products for "Complete the Look" if present
      if (data.madar?.pairs?.length) {
        catalogService
          .getProducts({ lang: locale.lang, ids: data.madar.pairs })
          .then((pairItems) => setPairs(pairItems))
          .catch((err) => console.warn("Failed to load pairs:", err))
      } else {
        setPairs([])
      }
    } catch (err) {
      console.error("Failed to load product detail:", err)
      setError(err instanceof Error ? err.message : t("تعذر العثور على المنتج."))
    } finally {
      setLoading(false)
    }
  }, [slug, locale.lang, t])

  useEffect(() => {
    loadProduct()
  }, [loadProduct])

  if (loading) {
    return (
      <main id="mdr-main" className="mdr-commerce-page wp-block-group has-global-padding" style={{ paddingBlock: 48 }} tabIndex={-1}>
        <div className="woocommerce wc-block-breadcrumbs alignwide has-font-size has-small-font-size wp-block-woocommerce-breadcrumbs">
          <div className="mdr-skeleton-line" style={{ width: 220, height: 16 }} />
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: 48, marginTop: 32 }}>
          <div className="mdr-skeleton-box" style={{ width: "100%", aspectRatio: "3 / 4", borderRadius: 0 }} />
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            <div className="mdr-skeleton-line" style={{ width: "75%", height: 36 }} />
            <div className="mdr-skeleton-line" style={{ width: "35%", height: 24 }} />
            <div className="mdr-skeleton-line" style={{ width: "90%", height: 60 }} />
            <div className="mdr-skeleton-line" style={{ width: "60%", height: 44, marginTop: 24 }} />
          </div>
        </div>
      </main>
    )
  }

  if (error || !product) {
    return (
      <main id="mdr-main" className="mdr-commerce-page wp-block-group has-global-padding" style={{ paddingBlock: 64 }} tabIndex={-1}>
        <div className="mdr-api-error" role="alert">
          <h2 style={{ fontSize: 24, marginBottom: 12 }}>{t("المنتج غير موجود")}</h2>
          <p>{error || t("لم نتمكن من العثور على القطعة المطلوبة.")}</p>
          <div style={{ display: "flex", gap: 12, justifyContent: "center", marginTop: 16 }}>
            <Button variant="secondary" onClick={loadProduct}>
              {t("إعادة المحاولة")}
            </Button>
            <Link to="/shop/" className="mdr-btn mdr-btn--primary">
              {t("العودة للكتالوج")}
            </Link>
          </div>
        </div>
      </main>
    )
  }

  const images = product.images?.length
    ? product.images
    : [{ id: 0, url: img("coat-camel"), width: 1200, height: 1600, alt: product.name }]

  const activeImage = images[selectedImageIndex] || images[0]
  const currency = product.price?.currency === "EGP" ? "ج.م" : (product.price?.currency || "ج.م")
  const priceVal = product.price?.min ?? 0
  const regularVal = product.price?.regular_min ?? priceVal
  const onSale = Boolean(product.price?.on_sale && regularVal > priceVal)

  // Size attributes list
  const sizeAttribute = product.attributes?.find(
    (a) => a.key.includes("size") || a.name.includes("مقاس") || a.label.includes("مقاس"),
  )
  const sizeOptions = sizeAttribute?.options || []

  return (
    <main id="mdr-main" className="mdr-commerce-page wp-block-group has-global-padding" tabIndex={-1}>
      {/* Breadcrumbs */}
      <div className="woocommerce wc-block-breadcrumbs alignwide has-font-size has-small-font-size wp-block-woocommerce-breadcrumbs" style={{ marginTop: 24 }}>
        <nav className="woocommerce-breadcrumb" aria-label={t("مسار التصفح")}>
          <Link to="/">{t("الرئيسية")}</Link> &nbsp;/&nbsp;{" "}
          <Link to="/shop/">{t("الكتالوج")}</Link> &nbsp;/&nbsp;{" "}
          {product.audience && (
            <>
              <Link to={`/product-category/${product.audience}/`}>
                {product.audience === "kids" ? t("عالم الأطفال") : t("عالم الرجال")}
              </Link>{" "}
              &nbsp;/&nbsp;{" "}
            </>
          )}
          <span>{product.name}</span>
        </nav>
      </div>

      {/* Product Hero Details Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "clamp(24px, 4vw, 56px)", marginTop: 32 }}>
        {/* Gallery Column */}
        <div>
          <div style={{ position: "relative", overflow: "hidden", aspectRatio: "3 / 4", background: "var(--mdr-sand)", border: "1px solid var(--mdr-line)" }}>
            <img
              src={activeImage.url}
              alt={activeImage.alt || product.name}
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
            {product.madar?.hotspots?.map((hs) => (
              <div
                key={hs.id}
                style={{
                  position: "absolute",
                  left: `${hs.x}%`,
                  top: `${hs.y}%`,
                  transform: "translate(-50%, -50%)",
                  width: 22,
                  height: 22,
                  borderRadius: "50%",
                  background: "var(--mdr-base)",
                  color: "var(--mdr-ink)",
                  display: "grid",
                  placeItems: "center",
                  fontSize: 10,
                  cursor: "pointer",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
                }}
                title={hs.label ? `${hs.label}: ${hs.text}` : hs.text}
              >
                +
              </div>
            ))}
          </div>

          {/* Thumbnail Selectors */}
          {images.length > 1 && (
            <div style={{ display: "flex", gap: 12, marginTop: 16, overflowX: "auto", paddingBottom: 8 }}>
              {images.map((im, idx) => (
                <button
                  key={im.id || idx}
                  type="button"
                  onClick={() => setSelectedImageIndex(idx)}
                  style={{
                    width: 70,
                    height: 90,
                    padding: 0,
                    border: selectedImageIndex === idx ? "2px solid var(--mdr-ink)" : "1px solid var(--mdr-line)",
                    background: "none",
                    cursor: "pointer",
                    overflow: "hidden",
                    opacity: selectedImageIndex === idx ? 1 : 0.6,
                    transition: "opacity 0.2s ease",
                  }}
                >
                  <img src={im.url} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Meta Column */}
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <div>
            <span className="quiet-kicker" dir="ltr">
              {product.audience === "kids" ? "02 / KIDS" : "01 / MEN"}
            </span>
            <h1 className="mdr-title" style={{ marginTop: 8 }}>{product.name}</h1>
          </div>

          {/* Pricing */}
          <div style={{ fontSize: 24, fontWeight: 500 }}>
            {product.madar?.styling_only ? (
              <span style={{ fontSize: 16, color: "var(--mdr-muted)" }}>{t("قطعة تنسيقية خاصة (غير مخصصة للبيع الفردي)")}</span>
            ) : onSale ? (
              <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                <del style={{ color: "var(--mdr-muted)", fontSize: 18 }}>{formatPrice(regularVal, currency)}</del>
                <ins style={{ color: "var(--mdr-ink)", textDecoration: "none" }}>{formatPrice(priceVal, currency)}</ins>
              </div>
            ) : (
              <span>{formatPrice(priceVal, currency)}</span>
            )}
          </div>

          {/* Short description */}
          {product.short_description && (
            <div
              style={{ color: "var(--mdr-ink-soft)", lineHeight: 1.8, fontSize: 15 }}
              dangerouslySetInnerHTML={{ __html: product.short_description }}
            />
          )}

          {/* Sizes / Variations */}
          {sizeOptions.length > 0 && !product.madar?.styling_only && (
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <label style={{ fontSize: 13, fontWeight: 600 }}>{t("المقاس:")}</label>
                {product.madar?.size_chart && (
                  <span style={{ fontSize: 12, color: "var(--mdr-stone)", cursor: "pointer" }}>
                    {t("دليل المقاسات")}
                  </span>
                )}
              </div>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                {sizeOptions.map((opt) => {
                  const variation = product.variations?.find((v) =>
                    Object.values(v.attributes).some((val) => val.toLowerCase() === opt.value.toLowerCase()),
                  )
                  const isAvailable = variation ? variation.in_stock : true
                  const isSelected = selectedSize.toLowerCase() === opt.value.toLowerCase()

                  return (
                    <button
                      key={opt.value}
                      type="button"
                      disabled={!isAvailable}
                      onClick={() => setSelectedSize(opt.value)}
                      style={{
                        minWidth: 48,
                        height: 44,
                        padding: "0 14px",
                        border: isSelected ? "2px solid var(--mdr-ink)" : "1px solid var(--mdr-line)",
                        background: isSelected ? "var(--mdr-ink)" : "var(--mdr-base)",
                        color: isSelected ? "var(--mdr-base)" : isAvailable ? "var(--mdr-ink)" : "var(--mdr-muted)",
                        opacity: isAvailable ? 1 : 0.4,
                        cursor: isAvailable ? "pointer" : "not-allowed",
                        textDecoration: isAvailable ? "none" : "line-through",
                        fontSize: 13,
                        fontWeight: 500,
                      }}
                    >
                      {opt.label}
                    </button>
                  )
                })}
              </div>
            </div>
          )}

          {/* Stock status */}
          <div>
            {product.in_stock ? (
              <span style={{ color: "#2e7d32", fontSize: 13, display: "inline-flex", alignItems: "center", gap: 6 }}>
                ● {t("متوفر في المخزون")}
              </span>
            ) : (
              <span style={{ color: "#c62828", fontSize: 13, display: "inline-flex", alignItems: "center", gap: 6 }}>
                ○ {t("غير متوفر حالياً")}
              </span>
            )}
          </div>

          {/* Active Add to Cart Button */}
          {!product.madar?.styling_only && (
            <div style={{ marginTop: 8 }}>
              <button
                type="button"
                className="mdr-btn mdr-btn--primary"
                disabled={actionLoading || !product.in_stock}
                onClick={async () => {
                  if (!product || actionLoading) return
                  setAddError(null)
                  setAddSuccess(false)

                  // Variable product check
                  if (product.variations?.length) {
                    if (!selectedSize) {
                      setAddError(t("يرجى اختيار المقاس أولاً."))
                      return
                    }
                    const variation = product.variations.find((v) =>
                      Object.values(v.attributes).some(
                        (val) => val.toLowerCase() === selectedSize.toLowerCase(),
                      ),
                    )
                    if (!variation) {
                      setAddError(t("المقاس المحدد غير متاح."))
                      return
                    }
                    if (!variation.in_stock) {
                      setAddError(t("هذا المقاس غير متوفر في المخزون حالياً."))
                      return
                    }

                    const variationParams = Object.entries(variation.attributes).map(
                      ([attr, val]) => ({
                        attribute: attr,
                        value: val,
                      }),
                    )

                    const ok = await addItem({
                      id: product.id,
                      quantity: 1,
                      variation: variationParams,
                    })
                    if (ok) {
                      setAddSuccess(true)
                      setTimeout(() => setAddSuccess(false), 4000)
                    }
                  } else {
                    // Simple product
                    if (!product.in_stock) {
                      setAddError(t("هذا المنتج غير متوفر في المخزون حالياً."))
                      return
                    }
                    const ok = await addItem({ id: product.id, quantity: 1 })
                    if (ok) {
                      setAddSuccess(true)
                      setTimeout(() => setAddSuccess(false), 4000)
                    }
                  }
                }}
                style={{
                  width: "100%",
                  height: 52,
                  fontSize: 15,
                  cursor: actionLoading || !product.in_stock ? "not-allowed" : "pointer",
                  opacity: !product.in_stock ? 0.6 : 1,
                }}
              >
                {actionLoading
                  ? t("جارٍ الإضافة لسلة المشتريات...")
                  : addSuccess
                  ? t("✓ أُضيفت القطعة بنجاح إلى السلة")
                  : !product.in_stock
                  ? t("غير متوفر في المخزون")
                  : t("أضف إلى السلة")}
              </button>

              {addError && (
                <p style={{ color: "#c62828", fontSize: 13, marginTop: 8 }} role="alert">
                  {addError}
                </p>
              )}

              {addSuccess && (
                <Link
                  to="/cart/"
                  className="mdr-link"
                  style={{
                    display: "block",
                    textAlign: "center",
                    marginTop: 10,
                    fontSize: 13,
                    color: "var(--mdr-ink)",
                    fontWeight: 600,
                  }}
                >
                  {t("متابعة إلى سلة المشتريات")} <span aria-hidden="true">←</span>
                </Link>
              )}
            </div>
          )}

          {/* Details & Care Tab / Accordion */}
          <div style={{ borderTop: "1px solid var(--mdr-line)", paddingTop: 24, display: "flex", flexDirection: "column", gap: 16 }}>
            {product.madar?.fit && (
              <div>
                <strong style={{ display: "block", fontSize: 13, marginBottom: 4 }}>{t("القصّة والمقاس:")}</strong>
                <p style={{ fontSize: 13, color: "var(--mdr-muted)", margin: 0 }}>{product.madar.fit}</p>
              </div>
            )}
            {product.madar?.care && (
              <div>
                <strong style={{ display: "block", fontSize: 13, marginBottom: 4 }}>{t("العناية والغسيل:")}</strong>
                <p style={{ fontSize: 13, color: "var(--mdr-muted)", margin: 0 }}>{product.madar.care}</p>
              </div>
            )}
            {product.description && (
              <div>
                <strong style={{ display: "block", fontSize: 13, marginBottom: 4 }}>{t("تفاصيل القطعة:")}</strong>
                <div
                  style={{ fontSize: 13, color: "var(--mdr-muted)", lineHeight: 1.8 }}
                  dangerouslySetInnerHTML={{ __html: product.description }}
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Complete the Look / Pairs Section */}
      {pairs.length > 0 && (
        <section style={{ marginTop: 72, borderTop: "1px solid var(--mdr-line)", paddingTop: 48 }}>
          <div className="store-heading" style={{ marginBottom: 24 }}>
            <div>
              <span className="quiet-kicker" dir="ltr">ORBIT / STYLING</span>
              <h2 style={{ fontSize: 28, marginTop: 8 }}>{t("كمّل الإطلالة")}</h2>
            </div>
          </div>
          <div className="store-product-grid">
            {pairs.map((pair) => (
              <article key={pair.id} className="store-product-card mdr-reveal is-visible">
                <div className="store-card-image">
                  <Link to={`/product/${pair.slug}/`}>
                    <img
                      className="store-card-main"
                      src={pair.images?.find((i) => i.role === "front")?.url || pair.images?.[0]?.url || img("coat-camel")}
                      alt={pair.name}
                      loading="lazy"
                    />
                  </Link>
                </div>
                <div className="store-card-meta">
                  <Link to={`/product/${pair.slug}/`}>{pair.name}</Link>
                  <span>{formatPrice(pair.price?.min, currency)}</span>
                </div>
              </article>
            ))}
          </div>
        </section>
      )}
    </main>
  )
}
