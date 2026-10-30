import { useEffect, useRef, useState } from "react"
import { Link } from "react-router"
import { useNavigate } from "../i18n/navigation"
import {
  Button,
  Choice,
  EmptyState,
  Field,
  Heading,
  Notice,
  PageIntro,
} from "../components/Interface"
import { formatPrice, img } from "../data"
import { useCart } from "./CartContext"
import {
  checkoutService,
  tokenStorage,
  type CheckoutOrderPayload,
  type PlacedOrderReceipt,
  ApiClientError,
} from "../api"
import { email, phone, required, usePreviewForm } from "./usePreviewForm"
import { useI18n } from "../i18n/context"

const stepNames = ["بيانات التوصيل", "طريقة الدفع", "مراجعة الاختيارات"]

export function OrderSummary({
  lines,
  total,
  totalFormatted,
}: {
  lines: Array<{
    key: string
    id?: number
    productId?: number
    name?: string
    image?: string
    quantity: number
    price: number
    options?: string
  }>
  total: number
  totalFormatted?: string
}) {
  const { t } = useI18n()
  return (
    <aside
      className="mdr-cart-summary mdr-checkout-summary"
      aria-label={t("ملخص الاختيارات")}
    >
      <Heading>{t("اختياراتك.")}</Heading>
      <p className="mdr-summary-caption">{t("أسعار حقيقية مباشرة من المتجر")}</p>
      <ul className="mdr-summary-products">
        {lines.map((line) => {
          const itemImg = line.image || img("coat-camel")
          const itemName = line.name || t("قطعة مختارة")
          const itemTotal = line.price * line.quantity
          return (
            <li key={line.key}>
              <img
                src={itemImg}
                alt={itemName}
                width={64}
                height={80}
                style={{ objectFit: "cover" }}
              />
              <div>
                <span>{itemName}</span>
                <small>
                  {line.options || t("بدون خيارات إضافية")} · {t("الكمية")}{" "}
                  {line.quantity}
                </small>
                <span>{formatPrice(itemTotal)}</span>
              </div>
            </li>
          )
        })}
      </ul>
      <p>
        <span>{t("مجموع القطع")}</span>
        <span>{totalFormatted || formatPrice(total)}</span>
      </p>
      <p>
        <span>{t("الشحن")}</span>
        <span>{t("مجاني لكافة الطلبات")}</span>
      </p>
      <p className="mdr-summary-total">
        <span>{t("إجمالي الطلب")}</span>
        <strong>{totalFormatted || formatPrice(total)}</strong>
      </p>
      <p className="mdr-field__hint">
        {t("الضرائب مشمولة. يتم الدفع نقداً عند استلام الشحنة.")}
      </p>
    </aside>
  )
}

export function CheckoutPage() {
  const { locale, t } = useI18n()
  const { items, itemsCount, totalFormatted, refreshCart } = useCart()
  const navigate = useNavigate()
  const [step, setStep] = useState(0)
  const [payment, setPayment] = useState<string>("cod")
  const [error, setError] = useState("")
  const [busy, setBusy] = useState(false)
  const title = useRef<HTMLHeadingElement>(null)

  const form = usePreviewForm(
    {
      checkoutName: "",
      checkoutEmail: "",
      checkoutPhone: "",
      checkoutCity: "",
      checkoutAddress: "",
      checkoutNotes: "",
    },
    {
      checkoutName: required,
      checkoutEmail: email,
      checkoutPhone: phone,
      checkoutCity: required,
      checkoutAddress: required,
    },
  )

  useEffect(() => {
    title.current?.focus({ preventScroll: true })
  }, [step])

  const cartLines = items.map((i) => ({
    key: i.key,
    id: i.id,
    name: i.name,
    image: i.images?.[0]?.src || i.images?.[0]?.thumbnail,
    quantity: i.quantity,
    price:
      parseFloat(i.prices?.price || "0") /
      Math.pow(10, i.prices?.currency_minor_unit ?? 2),
    options:
      i.variation?.map((v) => `${v.attribute}: ${v.value}`).join("، ") || "",
  }))

  const rawTotal = cartLines.reduce(
    (sum, line) => sum + line.quantity * line.price,
    0,
  )

  const changeStep = (next: number) => {
    setError("")
    setStep(next)
  }

  const submitOrder = async () => {
    setError("")
    setBusy(true)

    try {
      const nameParts = form.values.checkoutName.trim().split(" ")
      const first_name = nameParts[0] || ""
      const last_name = nameParts.slice(1).join(" ") || first_name

      const country = locale.code === "sa" ? "SA" : "EG"
      const postcode = country === "SA" ? "11564" : "11511"
      const state = country === "SA" ? "01" : "EGC"

      const payload: CheckoutOrderPayload = {
        billing_address: {
          first_name,
          last_name,
          address_1: form.values.checkoutAddress.trim(),
          address_2: "",
          city: form.values.checkoutCity.trim(),
          state,
          postcode,
          country,
          email: form.values.checkoutEmail.trim(),
          phone: form.values.checkoutPhone.trim(),
        },
        shipping_address: {
          first_name,
          last_name,
          address_1: form.values.checkoutAddress.trim(),
          address_2: "",
          city: form.values.checkoutCity.trim(),
          state,
          postcode,
          country,
          phone: form.values.checkoutPhone.trim(),
        },
        customer_note: form.values.checkoutNotes.trim() || undefined,
        payment_method: payment,
      }

      const res = await checkoutService.placeOrder(payload)

      // Build and persist receipt for confirmation page
      const receipt: PlacedOrderReceipt = {
        orderId: res.order_id,
        orderNumber: res.order_number,
        orderKey: res.order_key,
        status: res.status,
        date: new Date().toLocaleDateString(
          locale.code === "sa" ? "ar-SA" : "ar-EG",
          { dateStyle: "long" },
        ),
        paymentMethod: res.payment_method,
        paymentMethodTitle:
          res.payment_method === "cod"
            ? t("الدفع عند الاستلام")
            : t("بطاقة دفع إلكترونية"),
        customerName: `${res.billing_address.first_name} ${res.billing_address.last_name}`,
        customerEmail: res.billing_address.email || form.values.checkoutEmail,
        customerPhone: res.billing_address.phone || form.values.checkoutPhone,
        shippingAddressFormatted: `${res.shipping_address.address_1}، ${res.shipping_address.city}، ${res.shipping_address.country}`,
        customerNote: res.customer_note,
        lines: cartLines,
        totalFormatted,
      }

      checkoutService.saveLastOrder(receipt)

      // Clear Cart-Token so the next cart is empty and fresh
      tokenStorage.clearCartToken()
      await refreshCart()

      navigate(
        `/checkout/order-received/?order_id=${res.order_id}&key=${res.order_key}`,
      )
    } catch (err) {
      console.error("Order submission failed:", err)
      const errMsg =
        err instanceof ApiClientError
          ? err.message
          : err instanceof Error
          ? err.message
          : t("تعذر إتمام الطلب، يرجى مراجعة البيانات والمحاولة مجددًا.")
      setError(errMsg)
    } finally {
      setBusy(false)
    }
  }

  return (
    <main id="mdr-main" className="mdr-page mdr-commerce-page" tabIndex={-1}>
      <PageIntro eyebrow="A FEW CONSIDERED STEPS" title={t("التفاصيل الأخيرة.")}>
        {t("خطوات بسيطة لإتمام طلبك وتوصيله إلى عنوانك بعناية.")}
      </PageIntro>
      {!itemsCount ? (
        <EmptyState title={t("اختياراتك أولًا.")} to="/shop/">
          {t("أضف قطعة إلى السلة لبدء خطوات التوصيل والدفع.")}
        </EmptyState>
      ) : (
        <>
          <ol className="mdr-checkout-steps" aria-label={t("خطوات الدفع")}>
            {stepNames.map((name, index) => (
              <li
                key={name}
                aria-current={step === index ? "step" : undefined}
                className={index <= step ? "is-current" : ""}
              >
                <Button
                  variant="text"
                  disabled={index > step || busy}
                  onClick={() => changeStep(index)}
                >
                  <span className="mdr-step-number" aria-hidden="true">
                    0{index + 1}
                  </span>
                  {t(name)}
                </Button>
              </li>
            ))}
          </ol>
          <div className="mdr-cart-layout">
            <section className="mdr-checkout-form">
              <Heading ref={title} tabIndex={-1}>
                {t(stepNames[step])}
              </Heading>
              <p className="mdr-field__hint">
                {t("الحقول المعلّمة بـ * مطلوبة لإتمام الشحن وتأكيد الطلب.")}
              </p>
              {error && <Notice error>{error}</Notice>}
              <form
                noValidate
                aria-busy={busy}
                onSubmit={(event) => {
                  event.preventDefault()
                  if (busy) return
                  if (step === 0) {
                    if (form.validate()) changeStep(1)
                  } else if (step === 1) {
                    changeStep(2)
                  } else {
                    submitOrder()
                  }
                }}
              >
                {step === 0 && (
                  <div className="mdr-fields-grid">
                    <Field
                      {...form.field("checkoutName")}
                      label={t("الاسم الكامل")}
                      autoComplete="name"
                      required
                    />
                    <Field
                      {...form.field("checkoutEmail")}
                      label={t("البريد الإلكتروني")}
                      type="email"
                      dir="ltr"
                      autoComplete="email"
                      required
                    />
                    <Field
                      {...form.field("checkoutPhone")}
                      label={t("رقم الموبايل")}
                      type="tel"
                      inputMode="tel"
                      dir="ltr"
                      autoComplete="tel"
                      required
                    />
                    <Field
                      {...form.field("checkoutCity")}
                      label={t("المحافظة / المدينة")}
                      autoComplete="address-level2"
                      required
                    />
                    <Field
                      {...form.field("checkoutAddress")}
                      label={t("العنوان التفصيلي (الشارع، رقم المبنى)")}
                      autoComplete="street-address"
                      required
                    />
                    <Field
                      {...form.field("checkoutNotes")}
                      label={t("ملاحظات التوصيل (اختياري)")}
                      as="textarea"
                      rows={3}
                    />
                  </div>
                )}
                {step === 1 && (
                  <fieldset className="mdr-choice-stack">
                    <legend className="screen-reader-text">
                      {t("اختر طريقة الدفع")}
                    </legend>
                    <Choice
                      type="radio"
                      name="paymentMethod"
                      checked={payment === "cod"}
                      onChange={() => setPayment("cod")}
                    >
                      {t("الدفع عند الاستلام (COD)")}
                    </Choice>
                    <p
                      className="mdr-field__hint"
                      style={{ marginInlineStart: 28, marginTop: 4 }}
                    >
                      {t(
                        "ادفع نقداً أو عبر نقاط البيع المتنقلة عند وصول مندوبنا إلى باب منزلك.",
                      )}
                    </p>
                    <div style={{ marginTop: 16 }}>
                      <Choice
                        type="radio"
                        name="paymentMethod"
                        checked={payment === "card"}
                        onChange={() => setPayment("card")}
                      >
                        {t("بطاقة بنكية / دفع إلكتروني")}
                      </Choice>
                      {payment === "card" && (
                        <div
                          style={{
                            marginInlineStart: 28,
                            marginTop: 8,
                            padding: 12,
                            background: "var(--mdr-base)",
                            border: "1px solid var(--mdr-line)",
                          }}
                        >
                          <p style={{ fontSize: 13, color: "var(--mdr-stone)" }}>
                            {t(
                              "بوابات الدفع الإلكتروني قيد التهيئة في النسخة الحالية. يُرجى اختيار الدفع عند الاستلام لتأكيد طلبك فورياً.",
                            )}
                          </p>
                        </div>
                      )}
                    </div>
                  </fieldset>
                )}
                {step === 2 && (
                  <>
                    <section className="mdr-review-block">
                      <div className="mdr-review-title">
                        <Heading level={3}>{t("بيانات التوصيل")}</Heading>
                        <Button
                          variant="text"
                          disabled={busy}
                          onClick={() => changeStep(0)}
                        >
                          {t("تعديل البيانات")}
                        </Button>
                      </div>
                      <p translate="no">{form.values.checkoutName}</p>
                      <p translate="no">
                        {form.values.checkoutCity} —{" "}
                        {form.values.checkoutAddress}
                      </p>
                      <p dir="ltr" translate="no">
                        {form.values.checkoutEmail}
                        <br />
                        {form.values.checkoutPhone}
                      </p>
                      {form.values.checkoutNotes && (
                        <p translate="no">{form.values.checkoutNotes}</p>
                      )}
                    </section>
                    <section className="mdr-review-block">
                      <div className="mdr-review-title">
                        <Heading level={3}>{t("طريقة الدفع")}</Heading>
                        <Button
                          variant="text"
                          disabled={busy}
                          onClick={() => changeStep(1)}
                        >
                          {t("تعديل الطريقة")}
                        </Button>
                      </div>
                      <p>
                        {payment === "cod"
                          ? t("الدفع عند الاستلام")
                          : t("بطاقة بنكية")}
                      </p>
                    </section>
                  </>
                )}
                <div className="mdr-form-actions">
                  <Button type="submit" disabled={busy}>
                    {busy
                      ? t("جارٍ إرسال وتأكيد الطلب…")
                      : step === 0
                      ? t("متابعة إلى طريقة الدفع")
                      : step === 1
                      ? t("مراجعة الاختيارات")
                      : t("تأكيد وإرسال الطلب")}
                    <span aria-hidden="true">←</span>
                  </Button>
                  {step > 0 ? (
                    <Button
                      variant="text"
                      disabled={busy}
                      onClick={() => changeStep(step - 1)}
                    >
                      {t("الخطوة السابقة")}
                    </Button>
                  ) : (
                    <Link className="mdr-link" to="/cart/">
                      {t("العودة للسلة")}
                    </Link>
                  )}
                </div>
              </form>
            </section>
            <OrderSummary
              lines={cartLines}
              total={rawTotal}
              totalFormatted={totalFormatted}
            />
          </div>
        </>
      )}
    </main>
  )
}

export function CheckoutResult() {
  const { t } = useI18n()
  const [receipt, setReceipt] = useState<PlacedOrderReceipt | null>(null)

  useEffect(() => {
    const saved = checkoutService.getLastOrder()
    if (saved) {
      setReceipt(saved)
    }
  }, [])

  return (
    <main id="mdr-main" className="mdr-page mdr-commerce-page" tabIndex={-1}>
      <PageIntro
        eyebrow="ORDER CONFIRMED / تم تأكيد الطلب"
        title={
          receipt
            ? `${t("تم تأكيد طلبك بنجاح")} #${receipt.orderNumber}`
            : t("تفاصيل الطلب")
        }
      >
        {receipt
          ? t(
              "شكرًا لثقتك بمدار. تم تسجيل طلبك بنجاح في النظام وسيتواصل معك فريقنا لتأكيد موعد التوصيل.",
            )
          : t("تظهر هنا تفاصيل طلبك بعد إتمامه بنجاح.")}
      </PageIntro>

      {receipt ? (
        <div className="mdr-cart-layout">
          <section className="mdr-result-content">
            <span
              className="mdr-result-check"
              aria-hidden="true"
              style={{
                width: 56,
                height: 56,
                borderRadius: "50%",
                background: "var(--mdr-ink)",
                color: "var(--mdr-base)",
                display: "grid",
                placeItems: "center",
                marginBottom: 24,
              }}
            >
              <svg
                width="28"
                height="28"
                viewBox="0 0 32 32"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
              >
                <path d="m7 16 6 6L26 9" />
              </svg>
            </span>

            <Heading>{t("طلبك في طريقه إليك بعناية.")}</Heading>
            <p className="mdr-lead" style={{ marginTop: 8 }}>
              {t("رقم الطلب:")} <strong>#{receipt.orderNumber}</strong> ·{" "}
              {t("التاريخ:")} {receipt.date}
            </p>

            <div
              style={{
                background: "var(--mdr-base)",
                border: "1px solid var(--mdr-line)",
                padding: "20px 24px",
                marginTop: 24,
                marginBottom: 24,
                display: "flex",
                flexDirection: "column",
                gap: 12,
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  borderBottom: "1px solid var(--mdr-line)",
                  paddingBottom: 8,
                }}
              >
                <span style={{ color: "var(--mdr-stone)", fontSize: 13 }}>
                  {t("العميل")}
                </span>
                <strong style={{ fontSize: 14 }}>{receipt.customerName}</strong>
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  borderBottom: "1px solid var(--mdr-line)",
                  paddingBottom: 8,
                }}
              >
                <span style={{ color: "var(--mdr-stone)", fontSize: 13 }}>
                  {t("الهاتف")}
                </span>
                <span dir="ltr" style={{ fontSize: 14 }}>
                  {receipt.customerPhone}
                </span>
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  borderBottom: "1px solid var(--mdr-line)",
                  paddingBottom: 8,
                }}
              >
                <span style={{ color: "var(--mdr-stone)", fontSize: 13 }}>
                  {t("عنوان التوصيل")}
                </span>
                <span style={{ fontSize: 14, textAlign: "left", maxWidth: 260 }}>
                  {receipt.shippingAddressFormatted}
                </span>
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  borderBottom: "1px solid var(--mdr-line)",
                  paddingBottom: 8,
                }}
              >
                <span style={{ color: "var(--mdr-stone)", fontSize: 13 }}>
                  {t("طريقة الدفع")}
                </span>
                <span style={{ fontSize: 14 }}>
                  {receipt.paymentMethodTitle}
                </span>
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  paddingTop: 4,
                }}
              >
                <span style={{ color: "var(--mdr-stone)", fontSize: 13 }}>
                  {t("حالة الطلب")}
                </span>
                <span style={{ color: "#2e7d32", fontWeight: 600, fontSize: 14 }}>
                  {receipt.status === "processing"
                    ? t("قيد المعالجة والتجهيز")
                    : receipt.status}
                </span>
              </div>
            </div>

            <div className="mdr-form-actions">
              <Link className="mdr-btn" to="/shop/">
                {t("اكتشف المزيد من التشكيلة")} <span aria-hidden="true">←</span>
              </Link>
              <Link className="mdr-link" to="/my-account/orders/">
                {t("عرض سجل الطلبات")}
              </Link>
            </div>
          </section>

          <OrderSummary
            lines={receipt.lines.map((l) => ({
              key: String(l.id),
              name: l.name,
              quantity: l.quantity,
              price: l.price,
              options: l.options,
              image: l.image,
            }))}
            total={receipt.lines.reduce(
              (sum, l) => sum + l.quantity * l.price,
              0,
            )}
            totalFormatted={receipt.totalFormatted}
          />
        </div>
      ) : (
        <EmptyState title={t("لا توجد طلبات حديثة للعرض.")} to="/shop/">
          {t("يمكنك اكتشاف التشكيلة واختيار ما يناسبك للبدء.")}
        </EmptyState>
      )}
    </main>
  )
}
