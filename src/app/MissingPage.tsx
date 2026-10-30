import { Link } from "react-router"
import { useLocation } from "../i18n/navigation"

export function MissingPage({
  sourceMissing = false,
}: {
  sourceMissing?: boolean
}) {
  const location = useLocation()
  return (
    <main id="mdr-main" className="mdr-page mdr-unavailable" tabIndex={-1}>
      <header className="mdr-page__head">
        <p className="mdr-eyebrow" dir="ltr">
          404 / MADAR
        </p>
        <h1 className="mdr-display">الصفحة غير متاحة.</h1>
        <p className="mdr-lead">
          {sourceMissing
            ? "هذا الرابط موجود في الموقع الأصلي، لكن الصفحة نفسها ترجع 404. لم نضف محتوى بديلًا غير موجود في المصدر."
            : "يمكنك الرجوع إلى المتجر، أو اكتشاف بقية صفحات مدار."}
        </p>
        <code dir="ltr">{location.pathname}</code>
        <div className="mdr-page-actions">
          <Link className="mdr-btn" to="/shop/">
            اكتشف التشكيلة <span aria-hidden="true">←</span>
          </Link>
          <Link className="mdr-link" to="/">
            العودة للرئيسية
          </Link>
        </div>
      </header>
    </main>
  )
}
