import { Fragment, useEffect, useRef, useState, useCallback } from "react"
import { img, formatPrice, productPath } from "../data"
import { usePreviewStore } from "../app/PreviewStore"
import { Button } from "./Interface"
import { catalogService, type Product } from "../api"
import { useI18n } from "../i18n/context"

const Marquee = () => {
  const [paused, setPaused] = useState(false)
  const items = [
    "رجال وأطفال",
    "اختيارات على ذوقك",
    "أقل، ولكن أجمل",
    "THOUGHTFULLY CHOSEN.",
  ]
  const group = (hidden?: boolean) => (
    <div className="home-line-group" aria-hidden={hidden || undefined}>
      {items.map((t, i) => (
        <Fragment key={i}>
          <span dir={i === 3 ? undefined : "auto"}>{t}</span>
          <i aria-hidden="true">✳</i>
        </Fragment>
      ))}
    </div>
  )
  return (
    <div className="quiet-marquee" data-home-line-scroll data-paused={paused}>
      <div className="home-line-track">
        {group()}
        {group(true)}
      </div>
      <Button
        variant="text"
        className="mdr-marquee-pause"
        aria-label={paused ? "تشغيل الشريط المتحرك" : "إيقاف الشريط المتحرك"}
        aria-pressed={paused}
        onClick={() => setPaused(!paused)}
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.3"
          aria-hidden="true"
        >
          {paused ? (
            <path d="m8 5 11 7-11 7V5Z" />
          ) : (
            <path d="M8 5v14M16 5v14" />
          )}
        </svg>
      </Button>
    </div>
  )
}

const categories = [
  {
    img: "coat-camel",
    label: "المعاطف الفاخرة",
    href: "/product-category/men/",
  },
  { img: "suit-navy", label: "البدل والتفصيل", href: productPath(98) },
  { img: "knit-cream", label: "الكنزات والكشمير", href: productPath(86) },
  {
    img: "kids-adventure",
    label: "عالم الأطفال",
    href: "/product-category/kids/",
  },
]

const stories = [
  {
    img: "story-wardrobe",
    tag: "THE EVERYDAY WARDROBE",
    title: "خزانة أقل. احتمالات أكثر.",
  },
  {
    img: "kids-adventure",
    tag: "LITTLE EXPLORERS",
    title: "مساحة صغيرة للنمو.",
  },
  { img: "city-edit", tag: "THE CITY EDIT", title: "المدينة، طبقة بعد طبقة." },
]

const services = [
  { n: "01", t: "مقاس أقرب ليك", d: "دليل واضح للقياس، قبل اختيار القطعة." },
  { n: "02", t: "اختيارات على ذوقك", d: "نرتّب لك التشكيلة حسب اهتماماتك." },
  { n: "03", t: "التفاصيل من البداية", d: "الشحن والسياسات واضحة قبل الطلب." },
]

export default function Home() {
  const { favorites: favs, toggleFavorite: toggleFav } = usePreviewStore()
  const { locale } = useI18n()
  const [subscribed, setSubscribed] = useState(false)
  const [items, setItems] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [quickView, setQuickView] = useState<Product | null>(null)
  const quickDialog = useRef<HTMLDialogElement>(null)

  const fetchProducts = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await catalogService.getProducts({ lang: locale.lang })
      setItems(data.filter((p) => !p.madar?.styling_only).slice(0, 4))
    } catch (err) {
      console.error("Home: failed to fetch products:", err)
      setError(err instanceof Error ? err.message : "تعذر الاتصال بالخادم")
    } finally {
      setLoading(false)
    }
  }, [locale.lang])

  useEffect(() => {
    fetchProducts()
  }, [fetchProducts])

  useEffect(() => {
    if (quickView && !quickDialog.current?.open)
      quickDialog.current?.showModal()
  }, [quickView])

  return (
    <main className="mdr-home complete-store" id="mdr-main" tabIndex={-1}>
      <div className="motion-curtain" aria-hidden="true">
        <span>MADAR / مدار</span>
      </div>

      <section className="quiet-hero">
        <div className="quiet-hero-copy">
          <div className="quiet-kicker">مدار / عالم الرجال والأطفال</div>
          <h1>
            حضورٌ هادئ.
            <br />
            <em>أثرٌ لا يُنسى.</em>
          </h1>
          <p>
            لأيامك العادية، بطريقتك الاستثنائية.
            <br />
            ولحكاياتهم الصغيرة، مساحة للنمو.
          </p>
          <a className="quiet-cta" href="/shop/">
            اكتشف التشكيلة <span>←</span>
          </a>
          <div className="quiet-hero-foot">
            <span>القاهرة / مختارة بعناية</span>
            <span dir="ltr">EVERYDAY, ELEVATED.</span>
          </div>
        </div>
        <div className="quiet-hero-visual">
          <img
            className="quiet-main-photo"
            src={img("coat-camel")}
            alt="معطف الصوف البكر الإيطالي بلون الجمل"
            width={1200}
            height={1800}
            fetchPriority="high"
          />
          <img
            className="quiet-alternate-photo"
            src={img("coat-camel-alt")}
            alt="تفاصيل المعطف والقصّة الإيطالية المتقنة"
            width={1200}
            height={1800}
            loading="lazy"
          />
          <div className="quiet-photo-top">
            <span dir="ltr">AUTUMN / 26</span>
            <span>THE EVERYDAY EDIT</span>
          </div>
          <a className="quiet-photo-note" href={productPath(141)}>
            <span>
              من النظرة الأولى،
              <br />
              إلى كل يوم.
            </span>
            <span className="quiet-circle">↗</span>
          </a>
        </div>
      </section>

      <Marquee />

      <nav className="motion-guide" aria-label="جرّب الحركات">
        <span>MOTION PLAYGROUND</span>
        <a href="#motion-scroll">مشهد التمرير ↓</a>
        <a href="#motion-elastic">الصور المرنة ↓</a>
        <a href="#motion-trail">أثر المؤشر ↓</a>
        <a href="#shop">انتقال المنتج والسلة ↗</a>
      </nav>

      <section className="quiet-worlds" id="madar-worlds">
        <a href="/product-category/men/" id="men">
          <img
            loading="lazy"
            src={img("coat-camel")}
            alt="للرجل، على مدار يومه."
            width={1100}
            height={1649}
          />
          <span>
            <small dir="ltr">01 / MEN</small>
            <strong>للرجل، على مدار يومه.</strong>
            <b>استكشف الرجال ←</b>
          </span>
        </a>
        <a href="/product-category/kids/" id="kids">
          <img
            loading="lazy"
            src={img("kids-adventure")}
            alt="حكايات صغيرة. لحظات كبيرة."
            width={1100}
            height={1467}
          />
          <span>
            <small dir="ltr">02 / KIDS</small>
            <strong>حكايات صغيرة. لحظات كبيرة.</strong>
            <b>استكشف الأطفال ←</b>
          </span>
        </a>
      </section>

      <section className="store-section mdr-picks" id="shop">
        <div className="store-heading">
          <div>
            <span className="quiet-kicker" dir="ltr">
              THE CONSIDERED EDIT
            </span>
            <h2>مساحة لما تحبّ.</h2>
          </div>
          <a className="quiet-line-button" href="/shop/">
            كل القطع ↗
          </a>
        </div>
        <div className="store-product-grid">
          {loading ? (
            Array.from({ length: 4 }).map((_, i) => (
              <article key={i} className="store-product-card mdr-skeleton-card" aria-hidden="true">
                <div className="store-card-image mdr-skeleton-box" />
                <div className="store-card-meta">
                  <div className="mdr-skeleton-line" style={{ width: "65%", height: 16 }} />
                  <div className="mdr-skeleton-line" style={{ width: "30%", height: 16 }} />
                </div>
                <div className="mdr-skeleton-line" style={{ width: "50%", height: 12, marginTop: 6 }} />
              </article>
            ))
          ) : error ? (
            <div className="mdr-api-error" role="alert">
              <p>تعذر تحميل التشكيلة: {error}</p>
              <Button variant="secondary" onClick={fetchProducts}>إعادة المحاولة</Button>
            </div>
          ) : items.length === 0 ? (
            <div className="mdr-api-empty">
              <p>لا توجد منتجات متاحة حالياً.</p>
            </div>
          ) : (
            items.map((p) => {
              const frontImg = p.images?.find((i) => i.role === "front")?.url || p.images?.[0]?.url || img("coat-camel")
              const altImg = p.images?.find((i) => i.role === "back" || i.role === "detail_1")?.url || p.images?.[1]?.url || frontImg
              const audienceLabel = p.audience === "kids" ? "KIDS" : "MEN"
              const priceVal = p.price?.min ?? 0
              const regularVal = p.price?.regular_min ?? priceVal
              const onSale = Boolean(p.price?.on_sale && regularVal > priceVal)
              const currency = p.price?.currency === "EGP" ? "ج.م" : (p.price?.currency || "ج.م")
              const targetPath = `/product/${p.slug}/`

              return (
                <article key={p.id} className="store-product-card mdr-reveal">
                  <div className="store-card-image">
                    <a href={targetPath}>
                      <img className="store-card-main" src={frontImg} alt={p.name} loading="lazy" />
                      <img className="store-card-alternate" src={altImg} alt="" loading="lazy" />
                    </a>
                    <button
                      type="button"
                      className="store-card-fav"
                      aria-label="حفظ أو إزالة القطعة"
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
                      معاينة سريعة +
                    </button>
                  </div>
                  <div className="store-card-meta">
                    <a href={targetPath}>{p.name}</a>
                    <span>
                      {onSale ? (
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

      <section className="store-manifesto">
        <span className="quiet-kicker" dir="ltr">
          THE MADAR PHILOSOPHY
        </span>
        <h2>ليست أكثر. بل أقرب إليك.</h2>
        <p>قصّة ترتاح فيها، لون يعود معك كل موسم، وقطعة تصبح جزءًا من حكايتك.</p>
        <a className="quiet-line-button" href="/about/">
          اقرأ حكايتنا ↗
        </a>
      </section>

      <section id="motion-scroll" className="motion-scroll">
        <div className="motion-scroll-stage">
          <img
            className="motion-scene-base"
            loading="lazy"
            src={img("coat-camel")}
            alt="معطف الصوف البكر الإيطالي"
          />
          <img
            className="motion-scene-reveal"
            loading="lazy"
            src={img("coat-camel-alt")}
            alt="الزاوية الحركية للمعطف"
          />
          <div className="motion-scene-copy">
            <span>01 / THE MOVING EDIT</span>
            <h2>
              كل حركة،
              <br />
              <em>حكاية مختلفة.</em>
            </h2>
            <a href="/shop/" className="motion-scene-link">
              اكتشف القطع ↗
            </a>
          </div>
          <div className="motion-scroll-cue">
            <span>كمّل التمرير لتتغيّر الصورة</span>
            <span>↓</span>
          </div>
          <span className="motion-progress">
            <i style={{ width: "calc(var(--scene-progress, 0) * 100%)" }} />
          </span>
        </div>
      </section>

      <section id="motion-elastic" className="motion-editorial">
        <div className="motion-editorial-heading">
          <span>02 / A DIFFERENT RHYTHM</span>
          <h2>على مدار يومك.</h2>
          <p>مرّر وشاهد الصور تتحرّك بإيقاعات مختلفة.</p>
        </div>
        <div className="motion-elastic-grid">
          {[
            [
              "coat-camel",
              "عالم الرجال",
              "01 / إيقاعك الخاص ↗",
              "/product-category/men/",
            ],
            [
              "kids-adventure",
              "عالم الأطفال",
              "02 / لحظات صغيرة ↗",
              "/product-category/kids/",
            ],
            [
              "suit-navy",
              "عالم الرجال",
              "03 / إيقاعك الخاص ↗",
              "/product-category/men/",
            ],
          ].map(([name, alt, label, href], i) => (
            <a
              key={i}
              href={href}
              className={`motion-elastic-column motion-column-${i}`}
            >
              <img src={img(name)} alt={alt} loading="lazy" />
              <span>{label}</span>
            </a>
          ))}
        </div>
      </section>

      <section id="motion-trail" className="motion-trail">
        <span className="motion-trail-eyebrow">03 / FOLLOW YOUR CURIOSITY</span>
        <h2>اتبع إحساسك.</h2>
        <p className="motion-pointer-hint">
          حرّك المؤشر هنا… وشاهد الاختيارات تظهر.
        </p>
        <div className="motion-touch-edit" aria-hidden="true">
          <img src={img("coat-camel")} alt="" loading="lazy" />
          <img src={img("kids-adventure")} alt="" loading="lazy" />
        </div>
        <a className="quiet-line-button" href="/shop/">
          كل اختيارات مدار ↗
        </a>
      </section>

      <section className="experience-categories">
        <div className="experience-section-heading">
          <span className="experience-eyebrow" dir="ltr">
            EVERYDAY, IN EVERY WAY
          </span>
          <h2>ابدأ بما يشبهك.</h2>
          <a href="/style-finder/">خلّينا نختار معاك ↗</a>
        </div>
        <div className="experience-category-grid">
          {categories.map((c) => (
            <a key={c.label} href={c.href}>
              <img
                src={img(c.img)}
                alt={c.label}
                loading="lazy"
                width={600}
                height={800}
              />
              <span>{c.label} ↗</span>
            </a>
          ))}
        </div>
      </section>

      <section className="experience-campaign" id="lookbook">
        <a href="/lookbook/">
          <img
            src={img("city-edit")}
            alt="إطلالة رجالية في المدينة"
            loading="lazy"
            width={1100}
            height={1557}
          />
        </a>
        <div>
          <span className="experience-eyebrow" dir="ltr">
            THE CITY EDIT / CHAPTER 01
          </span>
          <h2>
            من أول مشوار،
            <br />
            <em>لآخر حكاية.</em>
          </h2>
          <p>
            إطلالات تُجمع بهدوء، وتعيش معك على مدار اليوم. اكتشف الدفتر، ثم اختر
            القطع التي تشبهك.
          </p>
          <a className="quiet-cta" href="/lookbook/">
            تسوّق الإطلالة <span>←</span>
          </a>
          <span className="experience-campaign-number" dir="ltr">
            01 — 03 / MADAR EDITIONS
          </span>
        </div>
      </section>

      <section className="experience-journal-home" id="journal">
        <div className="experience-section-heading">
          <span className="experience-eyebrow" dir="ltr">
            NOT JUST WHAT YOU WEAR
          </span>
          <h2>من دفتر مدار.</h2>
          <a href="/journal/">كل الحكايات ↗</a>
        </div>
        <div className="experience-story-grid">
          {stories.map((s) => (
            <a key={s.title} href="/journal/">
              <img
                src={img(s.img)}
                alt={s.title}
                loading="lazy"
                width={800}
                height={1000}
              />
              <span className="experience-eyebrow" dir="ltr">
                {s.tag}
              </span>
              <h3>{s.title} ↗</h3>
            </a>
          ))}
        </div>
      </section>

      <section className="experience-services">
        {services.map((s) => (
          <a
            key={s.n}
            href={
              s.n === "02"
                ? "/style-finder/"
                : s.n === "01"
                  ? "/size-guide/"
                  : "/help/"
            }
          >
            <span dir="ltr">{s.n} /</span>
            <h3>{s.t}</h3>
            <p>{s.d}</p>
            <b>↗</b>
          </a>
        ))}
      </section>

      <section className="experience-newsletter">
        <div>
          <span className="experience-eyebrow" dir="ltr">
            LET GOOD THINGS FIND YOU
          </span>
          <h2>على مدار الجديد.</h2>
          <p>اشترك في نشرتنا لتصلك أحدث الإطلاقات والتشكيلات الحصرية.</p>
        </div>
        <form
          onSubmit={(e) => {
            e.preventDefault()
            setSubscribed(true)
            e.currentTarget.reset()
          }}
        >
          <label>
            البريد الإلكتروني
            <div>
              <input type="email" required placeholder="you@example.com" />
              <button type="submit" aria-label="اشتراك">
                ←
              </button>
            </div>
          </label>
          <label className="experience-consent">
            <input type="checkbox" required /> أوافق على استلام تحديثات ورسائل
            مدار الحصرية.
          </label>
          <p role="status">
            {subscribed
              ? "تمت معاينة النموذج فقط؛ لم يُرسل البريد ولم يحدث اشتراك فعلي."
              : ""}
          </p>
        </form>
      </section>

      <ul className="mdr-trust mdr-trust--home">
        <li>
          <span>
            <strong>الدفع عند الاستلام</strong>
            <small>افحص طلبك وادفع وقت ما يوصلك.</small>
          </span>
        </li>
        <li>
          <span>
            <strong>استبدال واسترجاع خلال 14 يوم</strong>
            <small>لو المقاس مش مظبوط، نبدّلهولك.</small>
          </span>
        </li>
        <li>
          <span>
            <strong>شحن مجاني فوق 1٬500 ج.م</strong>
            <small>توصيل لكل المحافظات خلال ٢–٥ أيام.</small>
          </span>
        </li>
        <li>
          <span>
            <strong>محتاج مساعدة؟</strong>
            <small>
              <a
                href="https://wa.me/201000000000"
                target="_blank"
                rel="noopener noreferrer"
              >
                كلّمنا على واتساب
              </a>
            </small>
          </span>
        </li>
      </ul>
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
          <h2 id="quick-view-title">معاينة سريعة</h2>
          <button
            type="button"
            data-close
            aria-label="إغلاق المعاينة"
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
            <a
              href={`/product/${quickView.slug}/`}
              className="mdr-btn"
              onClick={() => quickDialog.current?.close()}
            >
              التفاصيل والمقاسات <span aria-hidden="true">←</span>
            </a>
          </div>
        )}
      </dialog>
    </main>
  )
}
