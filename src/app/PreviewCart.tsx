import { useState, type FormEvent } from "react"
import { Link } from "react-router"
import { useCart } from "./CartContext"
import { cartService } from "../api"
import { img } from "../data"
import { EmptyState, PageIntro, Button } from "../components/Interface"
import { useI18n } from "../i18n/context"

export function PreviewCart() {
  const { t } = useI18n()
  const {
    cart,
    items,
    loading,
    error,
    actionLoading,
    updateQuantity,
    removeItem,
    applyCoupon,
    removeCoupon,
    subtotalFormatted,
    discountFormatted,
    totalFormatted,
    refreshCart,
  } = useCart()

  const [couponCode, setCouponCode] = useState("")
  const [couponMsg, setCouponMsg] = useState<{ text: string; error?: boolean } | null>(null)

  const handleApplyCoupon = async (e: FormEvent) => {
    e.preventDefault()
    if (!couponCode.trim()) return
    setCouponMsg(null)
    const result = await applyCoupon(couponCode.trim())
    if (result.ok) {
      setCouponCode("")
      setCouponMsg({ text: t("تم تطبيق رمز الخصم بنجاح.") })
    } else {
      setCouponMsg({ text: result.message || t("رمز الخصم غير صالح."), error: true })
    }
  }

  if (loading) {
    return (
      <main id="mdr-main" className="mdr-page mdr-preview-cart" tabIndex={-1}>
        <PageIntro eyebrow="YOUR CONSIDERED EDIT" title={t("سلة المشتريات")}>
          {t("اختياراتك، في مكان واحد. راجع القطع والمقاسات قبل متابعة تجربة الدفع.")}
        </PageIntro>
        <div className="mdr-cart-layout">
          <section aria-label={t("قطع السلة")}>
            {Array.from({ length: 2 }).map((_, i) => (
              <article className="mdr-cart-line mdr-skeleton-card" key={i}>
                <div className="mdr-skeleton-box" style={{ width: 80, height: 100 }} />
                <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 10 }}>
                  <div className="mdr-skeleton-line" style={{ width: "60%", height: 18 }} />
                  <div className="mdr-skeleton-line" style={{ width: "30%", height: 14 }} />
                  <div className="mdr-skeleton-line" style={{ width: "40%", height: 28, marginTop: 8 }} />
                </div>
                <div className="mdr-skeleton-line" style={{ width: 70, height: 20 }} />
              </article>
            ))}
          </section>
          <aside className="mdr-cart-summary">
            <div className="mdr-skeleton-line" style={{ width: "50%", height: 24, marginBottom: 16 }} />
            <div className="mdr-skeleton-line" style={{ width: "80%", height: 20, marginBottom: 12 }} />
            <div className="mdr-skeleton-line" style={{ width: "100%", height: 48, marginTop: 24 }} />
          </aside>
        </div>
      </main>
    )
  }

  if (error && !items.length) {
    return (
      <main id="mdr-main" className="mdr-page mdr-preview-cart" tabIndex={-1}>
        <PageIntro eyebrow="YOUR CONSIDERED EDIT" title={t("سلة المشتريات")}>
          {t("اختياراتك، في مكان واحد. راجع القطع والمقاسات قبل متابعة تجربة الدفع.")}
        </PageIntro>
        <div className="mdr-api-error" role="alert" style={{ textAlign: "center", padding: "48px 16px" }}>
          <h2 style={{ fontSize: 20, marginBottom: 8 }}>{t("تعذر الاتصال بسلة المشتريات")}</h2>
          <p style={{ color: "var(--mdr-stone)", marginBottom: 16 }}>{error}</p>
          <Button variant="secondary" onClick={refreshCart}>
            {t("إعادة المحاولة")}
          </Button>
        </div>
      </main>
    )
  }

  const hasDiscount = parseFloat(cart?.totals?.total_discount || "0") > 0

  return (
    <main id="mdr-main" className="mdr-page mdr-preview-cart" tabIndex={-1}>
      <PageIntro eyebrow="YOUR CONSIDERED EDIT" title={t("سلة المشتريات")}>
        {t("اختياراتك، في مكان واحد. راجع القطع والمقاسات قبل متابعة تجربة الدفع.")}
      </PageIntro>

      {!items.length ? (
        <EmptyState title={t("مساحة لقطعتك القادمة.")}>
          {t("سلتك فارغة حاليًا. خذ وقتك في اكتشاف ما يشبهك.")}
        </EmptyState>
      ) : (
        <div className="mdr-cart-layout">
          <section aria-label={t("قطع السلة")}>
            {items.map((line) => {
              const imageSrc =
                line.images?.[0]?.src ||
                line.images?.[0]?.thumbnail ||
                img("coat-camel")
              const variationText =
                line.variation?.map((v) => `${v.attribute}: ${v.value}`).join("، ") || ""
              const lineTotal = cartService.formatAmount(
                line.totals?.line_total,
                line.totals?.currency_symbol === "EGP" ? "ج.م" : (line.totals?.currency_symbol || "ج.م"),
                line.totals?.currency_minor_unit ?? 2,
              )

              // Extract product path
              const permalinkUrl = line.permalink ? new URL(line.permalink, "http://madar.local") : null
              const itemPath = permalinkUrl ? permalinkUrl.pathname : "/shop/"

              return (
                <article className="mdr-cart-line" key={line.key}>
                  <Link to={itemPath}>
                    <img src={imageSrc} alt={line.name} />
                  </Link>
                  <div>
                    <Link to={itemPath}>{line.name}</Link>
                    {variationText && <p>{variationText}</p>}
                    <label>
                      {t("الكمية")}
                      <input
                        aria-label={`${t("كمية")} ${line.name}${variationText ? `، ${variationText}` : ""}`}
                        type="number"
                        min={1}
                        max={line.quantity_limits?.maximum || 99}
                        value={line.quantity}
                        disabled={actionLoading}
                        onChange={(event) => {
                          const val = Number(event.target.value)
                          if (!isNaN(val)) updateQuantity(line.key, val)
                        }}
                      />
                    </label>
                    <button
                      type="button"
                      className="mdr-link"
                      disabled={actionLoading}
                      aria-label={`${t("إزالة")} ${line.name}${variationText ? `، ${variationText}` : ""}`}
                      onClick={() => removeItem(line.key)}
                    >
                      {t("إزالة القطعة")}
                    </button>
                  </div>
                  <span>{lineTotal}</span>
                </article>
              )
            })}

            {/* Coupons Section */}
            <div style={{ marginTop: 24, paddingTop: 16, borderTop: "1px solid var(--mdr-line)" }}>
              {cart?.coupons && cart.coupons.length > 0 && (
                <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 12, flexWrap: "wrap" }}>
                  <span style={{ fontSize: 13, fontWeight: 500 }}>{t("القسائم المطبقة:")}</span>
                  {cart.coupons.map((c) => (
                    <span
                      key={c.code}
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 6,
                        background: "var(--mdr-base)",
                        border: "1px solid var(--mdr-line)",
                        padding: "4px 10px",
                        fontSize: 12,
                        borderRadius: 4,
                      }}
                    >
                      <strong>{c.code}</strong>
                      <button
                        type="button"
                        aria-label={`${t("إزالة القسيمة")} ${c.code}`}
                        style={{ background: "none", border: "none", cursor: "pointer", color: "var(--mdr-stone)", padding: 0 }}
                        onClick={() => removeCoupon(c.code)}
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              )}

              <form onSubmit={handleApplyCoupon} style={{ display: "flex", gap: 8, maxWidth: 360 }}>
                <input
                  type="text"
                  placeholder={t("رمز القسيمة أو الخصم")}
                  value={couponCode}
                  disabled={actionLoading}
                  onChange={(e) => setCouponCode(e.target.value)}
                  style={{
                    flex: 1,
                    background: "var(--mdr-base)",
                    border: "1px solid var(--mdr-line)",
                    padding: "8px 12px",
                    font: "inherit",
                    fontSize: 13,
                  }}
                />
                <Button
                  type="submit"
                  variant="secondary"
                  disabled={actionLoading || !couponCode.trim()}
                >
                  {t("تطبيق")}
                </Button>
              </form>
              {couponMsg && (
                <p style={{ fontSize: 12, marginTop: 6, color: couponMsg.error ? "#c62828" : "#2e7d32" }}>
                  {couponMsg.text}
                </p>
              )}
            </div>

            <div style={{ marginTop: 24 }}>
              <Link className="mdr-link" to="/shop/">
                {t("استمر في اكتشاف التشكيلة")}
              </Link>
            </div>
          </section>

          <aside className="mdr-cart-summary">
            <h2 className="mdr-title">{t("ملخّص السلة")}</h2>
            <p className="mdr-summary-caption">{t("أسعار حقيقية مباشرة من المتجر")}</p>
            <p>
              <span>{t("المجموع الفرعي")}</span>
              <strong>{subtotalFormatted}</strong>
            </p>
            {hasDiscount && (
              <p style={{ color: "#2e7d32" }}>
                <span>{t("الخصم")}</span>
                <strong>- {discountFormatted}</strong>
              </p>
            )}
            <p style={{ borderTop: "1px solid var(--mdr-line)", paddingTop: 12, marginTop: 8 }}>
              <span>{t("الإجمالي")}</span>
              <strong style={{ fontSize: 20 }}>{totalFormatted}</strong>
            </p>
            <p className="mdr-lead" style={{ fontSize: 13, color: "var(--mdr-stone)" }}>
              {t("الضرائب مشمولة. يتم احتساب الشحن في خطوة الدفع.")}
            </p>
            <Link className="mdr-btn" to="/checkout/">
              {t("متابعة إلى الدفع")} <span aria-hidden="true">←</span>
            </Link>
          </aside>
        </div>
      )}
    </main>
  )
}
