import { Button, Heading } from "../components/Interface"
import { useI18n } from "../i18n/context"
import { localePath } from "../i18n/config"

export function RouteError() {
  const { locale } = useI18n()
  return (
    <main id="mdr-main" className="mdr-page mdr-unavailable" tabIndex={-1}>
      <header className="mdr-page__head">
        <p className="mdr-eyebrow" dir="ltr">
          LET'S TRY THAT AGAIN
        </p>
        <Heading level={1}>تعذّر تحميل الصفحة.</Heading>
        <p className="mdr-lead">
          قد يكون الاتصال انقطع أو تم تحديث ملفات الموقع. أعد المحاولة لتحميل
          أحدث نسخة.
        </p>
        <div className="mdr-form-actions">
          <Button onClick={() => window.location.reload()}>
            إعادة المحاولة
          </Button>
          <Button
            variant="text"
            onClick={() => window.location.assign(localePath("/", locale.code))}
          >
            العودة للرئيسية
          </Button>
        </div>
      </header>
    </main>
  )
}
