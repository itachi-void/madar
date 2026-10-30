import { useEffect, useRef, useState } from "react"
import { Link, NavLink, useSearchParams } from "react-router"
import {
  Button,
  EmptyState,
  Field,
  Heading,
  Notice,
  PageIntro,
} from "../components/Interface"
import { formatPrice } from "../data"
import { useLocation, useNavigate } from "../i18n/navigation"
import { catalog, usePreviewStore } from "./PreviewStore"
import {
  email,
  password,
  phone,
  required,
  usePreviewForm,
} from "./usePreviewForm"

export function FavoritesPage() {
  const { favorites, toggleFavorite } = usePreviewStore()
  return (
    <main id="mdr-main" className="mdr-page mdr-commerce-page" tabIndex={-1}>
      <PageIntro eyebrow="SAVED FOR LATER" title="القطع المفضّلة.">
        اختياراتك خلال الجلسة الحالية. بدون حساب أو حفظ دائم؛ تُمسح عند إعادة
        تحميل الصفحة.
      </PageIntro>
      {!favorites.length ? (
        <EmptyState title="ما يعجبك، يبقى قريبًا.">
          احفظ القطع التي تحبها من التشكيلة لتعود إليها هنا.
        </EmptyState>
      ) : (
        <section className="store-section" aria-label="قطعك المفضلة">
          <div className="store-product-grid">
            {catalog
              .filter((product) => favorites.includes(product.id))
              .map((product) => (
                <article className="store-product-card" key={product.id}>
                  <Link to={product.path}>
                    <img
                      src={product.image}
                      alt={product.name}
                      width={600}
                      height={800}
                      loading="lazy"
                    />
                  </Link>
                  <div className="store-card-meta">
                    <Link to={product.path}>{product.name}</Link>
                    <span>{formatPrice(product.price)}</span>
                  </div>
                  <Button
                    variant="text"
                    aria-label={`إزالة ${product.name} من المفضلة`}
                    onClick={() => toggleFavorite(product.id)}
                  >
                    إزالة من المفضلة
                  </Button>
                </article>
              ))}
          </div>
        </section>
      )}
    </main>
  )
}

function AccountEntry() {
  const { setDemoAccount } = usePreviewStore()
  const navigate = useNavigate()
  const [busy, setBusy] = useState("")
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)
  useEffect(() => () => clearTimeout(timer.current), [])
  const login = usePreviewForm({ username: "", loginPassword: "" }, {
    username: required,
    loginPassword: required,
  })
  const register = usePreviewForm(
    { registerEmail: "", registerPassword: "", registerConfirm: "" },
    {
      registerEmail: email,
      registerPassword: password,
      registerConfirm: required,
    },
  )
  const [confirmationError, setConfirmationError] = useState("")
  const enter = (kind: string) => {
    setBusy(kind)
    timer.current = setTimeout(() => {
      setDemoAccount(true)
      navigate("/my-account/")
    }, 500)
  }
  return (
    <main id="mdr-main" className="mdr-page mdr-commerce-page" tabIndex={-1}>
      <PageIntro eyebrow="YOUR OWN MADAR" title="حسابي.">
        حسابك في مدار. تابع اختياراتك، وتعرّف على تجربة إدارة الطلبات والعناوين.
      </PageIntro>
      <div className="mdr-account-entry">
        <Notice>
          واجهة تجريبية فقط. استخدم بيانات غير حقيقية؛ لا يتم التحقق من بيانات
          الدخول أو إنشاء حساب أو إرسال بيانات. لوحة الحساب التالية للمعاينة
          وليست منطقة محمية.
        </Notice>
        <div className="mdr-account-forms">
          <section aria-labelledby="login-heading">
            <Heading id="login-heading">تسجيل الدخول</Heading>
            <form
              className="mdr-form-panel"
              noValidate
              aria-busy={busy === "login"}
              onSubmit={(event) => {
                event.preventDefault()
                if (!busy && login.validate()) enter("login")
              }}
            >
              <Field
                {...login.field("username")}
                label="اسم المستخدم أو البريد الإلكتروني"
                autoComplete="off"
                required
              />
              <Field
                {...login.field("loginPassword")}
                label="كلمة المرور"
                type="password"
                autoComplete="off"
                required
              />
              <div className="mdr-form-actions">
                <Button type="submit" disabled={Boolean(busy)}>
                  {busy === "login"
                    ? "جارٍ فتح المعاينة…"
                    : "تسجيل الدخول — تجريبي"}
                  <span aria-hidden="true">←</span>
                </Button>
              </div>
              <Link className="mdr-link" to="/my-account/lost-password/">
                نسيت كلمة مرورك؟
              </Link>
            </form>
          </section>
          <section aria-labelledby="register-heading">
            <Heading id="register-heading">تسجيل جديد</Heading>
            <form
              className="mdr-form-panel"
              noValidate
              aria-busy={busy === "register"}
              onSubmit={(event) => {
                event.preventDefault()
                if (busy || !register.validate()) return
                if (
                  register.values.registerPassword !==
                  register.values.registerConfirm
                ) {
                  setConfirmationError("كلمتا المرور غير متطابقتين.")
                  document.getElementById("registerConfirm")?.focus()
                  return
                }
                setConfirmationError("")
                enter("register")
              }}
            >
              <Field
                {...register.field("registerEmail")}
                label="البريد الإلكتروني"
                type="email"
                dir="ltr"
                autoComplete="off"
                required
              />
              <Field
                {...register.field("registerPassword")}
                label="كلمة المرور"
                type="password"
                autoComplete="off"
                hint="٨ أحرف على الأقل. لا تستخدم كلمة مرور حقيقية."
                required
              />
              <Field
                {...register.field("registerConfirm")}
                label="تأكيد كلمة المرور"
                type="password"
                autoComplete="off"
                error={confirmationError || register.errors.registerConfirm}
                required
              />
              <p className="mdr-field__hint">
                هذا النموذج لا يُنشئ حسابًا. راجع{" "}
                <Link to="/policies/#privacy">مسودة الخصوصية والسياسات</Link>{" "}
                لمعرفة حدود نسخة المعاينة.
              </p>
              <div className="mdr-form-actions">
                <Button type="submit" disabled={Boolean(busy)}>
                  {busy === "register"
                    ? "جارٍ فتح المعاينة…"
                    : "تسجيل جديد — تجريبي"}
                  <span aria-hidden="true">←</span>
                </Button>
              </div>
            </form>
          </section>
        </div>
        <div className="mdr-account-shortcut">
          <p className="mdr-field__hint">
            تريد استكشاف الواجهة بدون ملء النماذج؟
          </p>
          <Button
            variant="text"
            disabled={Boolean(busy)}
            onClick={() => {
              setDemoAccount(true)
              navigate("/my-account/")
            }}
          >
            تصفّح لوحة الحساب التجريبية <span aria-hidden="true">←</span>
          </Button>
        </div>
      </div>
    </main>
  )
}

export function PasswordPage() {
  const location = useLocation()
  const reset = location.pathname.includes("/reset-password")
  const [complete, setComplete] = useState(false)
  const [mismatch, setMismatch] = useState("")
  const recovery = usePreviewForm({ recoveryUsername: "" }, {
    recoveryUsername: required,
  })
  const newPassword = usePreviewForm({ newPassword: "", confirmPassword: "" }, {
    newPassword: password,
    confirmPassword: required,
  })
  return (
    <main id="mdr-main" className="mdr-page mdr-commerce-page" tabIndex={-1}>
      <PageIntro
        eyebrow="BACK TO YOUR MADAR"
        title={reset ? "كلمة مرور جديدة." : "نسيت كلمة المرور؟"}
      >
        معاينة خطوات استعادة الحساب فقط. لا يتم إرسال بريد أو تغيير أي كلمة مرور
        حقيقية.
      </PageIntro>
      <section className="mdr-password-page">
        {complete ? (
          <div className="mdr-form-panel">
            <Heading>
              {reset ? "اكتملت المعاينة." : "تمت معاينة طلب الاستعادة."}
            </Heading>
            <Notice>
              {reset
                ? "لم تتغير أي كلمة مرور في حساب حقيقي، ولم تُرسل أو تُحفظ بياناتك."
                : "في الموقع المتصل ستصلك رسالة استعادة. هنا لم يُرسل بريد إلكتروني، ولا يتم التحقق من وجود الحساب."}
            </Notice>
            <div className="mdr-form-actions">
              <Link
                className="mdr-btn"
                to={reset ? "/my-account/" : "/my-account/reset-password/"}
              >
                {reset ? "العودة لتسجيل الدخول" : "معاينة تعيين كلمة مرور"}
              </Link>
            </div>
          </div>
        ) : (
          <form
            className="mdr-form-panel"
            noValidate
            onSubmit={(event) => {
              event.preventDefault()
              if (reset) {
                if (!newPassword.validate()) return
                if (
                  newPassword.values.newPassword !==
                  newPassword.values.confirmPassword
                ) {
                  setMismatch("كلمتا المرور غير متطابقتين.")
                  document.getElementById("confirmPassword")?.focus()
                  return
                }
              } else if (!recovery.validate()) return
              setComplete(true)
            }}
          >
            {reset ? (
              <>
                <Field
                  {...newPassword.field("newPassword")}
                  label="كلمة المرور الجديدة"
                  type="password"
                  autoComplete="off"
                  hint="٨ أحرف على الأقل. استخدم كلمة مرور تجريبية."
                  required
                />
                <Field
                  {...newPassword.field("confirmPassword")}
                  label="تأكيد كلمة المرور الجديدة"
                  type="password"
                  autoComplete="off"
                  error={mismatch || newPassword.errors.confirmPassword}
                  required
                />
              </>
            ) : (
              <Field
                {...recovery.field("recoveryUsername")}
                label="اسم المستخدم أو البريد الإلكتروني"
                autoComplete="off"
                required
              />
            )}
            <div className="mdr-form-actions">
              <Button type="submit">
                {reset ? "معاينة تغيير كلمة المرور" : "معاينة طلب الاستعادة"}
                <span aria-hidden="true">←</span>
              </Button>
              <Link className="mdr-link" to="/my-account/">
                العودة لتسجيل الدخول
              </Link>
            </div>
          </form>
        )}
      </section>
    </main>
  )
}

function AccountDetails({ address = false }: { address?: boolean }) {
  const [complete, setComplete] = useState(false)
  const form = usePreviewForm(
    {
      accountName: "",
      accountEmail: "",
      accountPhone: "",
      accountCity: "",
      accountAddress: "",
    },
    address
      ? {
          accountName: required,
          accountPhone: phone,
          accountCity: required,
          accountAddress: required,
        }
      : { accountName: required, accountEmail: email },
  )
  return (
    <section>
      <Heading>{address ? "عنوان التوصيل." : "تفاصيل الحساب."}</Heading>
      <p className="mdr-lead">
        استخدم بيانات تجريبية. التعديلات للمعاينة فقط ولا تُحفظ في حساب أو متصفح.
      </p>
      {complete && (
        <Notice>تمت معاينة التعديل بنجاح. لم تُرسل أو تُحفظ أي بيانات.</Notice>
      )}
      <form
        noValidate
        onSubmit={(event) => {
          event.preventDefault()
          if (form.validate()) setComplete(true)
        }}
      >
        <div className="mdr-fields-grid">
          <Field
            {...form.field("accountName")}
            label="الاسم الكامل"
            autoComplete="off"
            required
          />
          {address ? (
            <>
              <Field
                {...form.field("accountPhone")}
                label="رقم الموبايل"
                type="tel"
                dir="ltr"
                autoComplete="off"
                required
              />
              <Field
                {...form.field("accountCity")}
                label="المحافظة / المدينة"
                autoComplete="off"
                required
              />
              <Field
                {...form.field("accountAddress")}
                label="العنوان بالتفصيل"
                autoComplete="off"
                required
              />
            </>
          ) : (
            <Field
              {...form.field("accountEmail")}
              label="البريد الإلكتروني"
              type="email"
              dir="ltr"
              autoComplete="off"
              required
            />
          )}
        </div>
        <div className="mdr-form-actions">
          <Button type="submit">
            معاينة التعديل <span aria-hidden="true">←</span>
          </Button>
          {!address && (
            <Link className="mdr-link" to="/my-account/reset-password/">
              معاينة تغيير كلمة المرور
            </Link>
          )}
        </div>
      </form>
    </section>
  )
}

function Dashboard() {
  const location = useLocation()
  const navigate = useNavigate()
  const { setDemoAccount, checkoutPreview, favorites } = usePreviewStore()
  const path = location.pathname.replace(/\/+$/, "")
  const orders = path.endsWith("/orders")
  const address = path.endsWith("/edit-address")
  const details = path.endsWith("/edit-account")
  return (
    <main id="mdr-main" className="mdr-page mdr-commerce-page" tabIndex={-1}>
      <PageIntro eyebrow="YOUR OWN MADAR / DEMO" title="مساحتك في مدار.">
        أهلًا بك في لوحة الحساب التجريبية. لا توجد جلسة تسجيل دخول حقيقية، وتُمسح
        حالة العرض عند إعادة تحميل الصفحة.
      </PageIntro>
      <div className="mdr-account-layout">
        <nav className="mdr-account-nav" aria-label="قائمة الحساب">
          <NavLink end to="/my-account/">
            نظرة عامة <span aria-hidden="true">←</span>
          </NavLink>
          <NavLink to="/my-account/orders/">الطلبات</NavLink>
          <NavLink to="/my-account/edit-address/">العناوين</NavLink>
          <NavLink to="/my-account/edit-account/">تفاصيل الحساب</NavLink>
          <Link to="/my-account/?view=favorites">
            المفضلة <span>{favorites.length}</span>
          </Link>
          <Button
            variant="text"
            onClick={() => {
              setDemoAccount(false)
              navigate("/my-account/")
            }}
          >
            إنهاء معاينة الحساب
          </Button>
        </nav>
        <div className="mdr-account-content">
          {orders ? (
            checkoutPreview ? (
              <section>
                <Heading>معاينات الطلبات.</Heading>
                <Notice>
                  لا توجد طلبات حقيقية. هذه آخر معاينة دفع خلال الجلسة الحالية.
                </Notice>
                <div className="mdr-order-preview">
                  <span className="mdr-eyebrow" dir="ltr">
                    PREVIEW / NOT AN ORDER
                  </span>
                  <p>
                    {checkoutPreview.lines.reduce(
                      (sum, line) => sum + line.quantity,
                      0,
                    )}{" "}
                    قطع · {formatPrice(checkoutPreview.total)}
                  </p>
                  <Link className="mdr-link" to="/checkout/order-received/">
                    عرض المعاينة <span aria-hidden="true">←</span>
                  </Link>
                </div>
              </section>
            ) : (
              <EmptyState title="لا توجد طلبات بعد.">
                لا يوجد اتصال بحساب أو سجل طلبات. يمكنك تجربة إضافة قطعة وإكمال
                معاينة الدفع.
              </EmptyState>
            )
          ) : address || details ? (
            <AccountDetails key={path} address={address} />
          ) : (
            <section>
              <Heading>اختياراتك، أقرب إليك.</Heading>
              <p className="mdr-lead">
                من هنا تستكشف حالات الطلبات والعناوين وتفاصيل الحساب، بدون إنشاء
                حساب أو حفظ بيانات.
              </p>
              <div className="mdr-account-cards">
                <Link to="/my-account/orders/">
                  <span className="mdr-eyebrow" dir="ltr">
                    01 / ORDERS
                  </span>
                  <Heading level={3}>الطلبات</Heading>
                  <p>
                    {checkoutPreview
                      ? "معاينة واحدة خلال هذه الجلسة"
                      : "لا توجد طلبات أو معاينات حاليًا"}
                  </p>
                  <span aria-hidden="true">←</span>
                </Link>
                <Link to="/my-account/edit-address/">
                  <span className="mdr-eyebrow" dir="ltr">
                    02 / ADDRESSES
                  </span>
                  <Heading level={3}>العناوين</Heading>
                  <p>تعرّف على واجهة عنوان التوصيل</p>
                  <span aria-hidden="true">←</span>
                </Link>
              </div>
            </section>
          )}
        </div>
      </div>
    </main>
  )
}

export function AccountPage() {
  const { demoAccount, checkoutPreview } = usePreviewStore()
  const [search] = useSearchParams()
  const location = useLocation()
  if (search.get("view") === "favorites") return <FavoritesPage />
  // A checkout preview is viewable without pretending the visitor authenticated.
  if (
    !demoAccount &&
    location.pathname.includes("/orders") &&
    checkoutPreview
  ) {
    return (
      <main id="mdr-main" className="mdr-page mdr-commerce-page" tabIndex={-1}>
        <PageIntro
          eyebrow="SESSION PREVIEW / NOT AN ACCOUNT"
          title="معاينة الطلب."
        >
          هذه معاينة الجلسة الحالية وليست بيانات حساب مسجّل.
        </PageIntro>
        <section className="mdr-password-page">
          <Notice>اكتملت معاينة واحدة بدون إنشاء طلب أو تحصيل مبلغ.</Notice>
          <Link className="mdr-btn" to="/checkout/order-received/">
            عرض تفاصيل المعاينة
          </Link>
        </section>
      </main>
    )
  }
  return demoAccount ? <Dashboard /> : <AccountEntry />
}
