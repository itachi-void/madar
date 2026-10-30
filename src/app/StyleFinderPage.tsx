import { useEffect, useRef, useState } from "react"
import { Link } from "react-router"
import { InformationShell } from "../components/InformationShell"
import {
  Button,
  Choice,
  Heading,
  Notice,
  PageIntro,
} from "../components/Interface"
import {
  emptyStyleAnswers,
  recommendStyle,
  styleLabels,
  type StyleAnswers,
} from "../content/style-edits"
import { formatPrice } from "../data"
import { catalog, usePreviewStore } from "./PreviewStore"

const steps = [
  {
    field: "audience",
    title: "بنختار لمين؟",
    hint: "عالمين، ومساحة لكل يوم.",
    options: [
      {
        value: "men",
        title: "عالم الرجال",
        copy: "اختيارات ليومك، بطريقتك.",
        image: "/images/coat-camel.jpg",
      },
      {
        value: "kids",
        title: "عالم الأطفال",
        copy: "حكايات صغيرة ومساحة للحركة.",
        image: "/images/kids-adventure.jpg",
      },
    ],
  },
  {
    field: "occasion",
    title: "إيقاع يومك عامل إزاي؟",
    hint: "فكّر في الموقف اللي بتدور له على إطلالة.",
    options: [
      {
        value: "everyday",
        title: "يوم براحتك",
        copy: "مشاوير بسيطة وتنسيق سهل.",
        image: "",
      },
      {
        value: "smart",
        title: "خروجة مرتّبة",
        copy: "تفصيلة مختلفة وحضور أهدى.",
        image: "",
      },
      {
        value: "layers",
        title: "وقت للطبقات",
        copy: "قطع تتجمع وتغيّر الإطلالة.",
        image: "",
      },
    ],
  },
  {
    field: "palette",
    title: "أنهي مزاج ألوان أقرب ليك؟",
    hint: "اختار إحساس التنسيق، مش لونًا أو خيار منتج مضمونًا.",
    options: [
      {
        value: "earth",
        title: "درجات دافية",
        copy: "إحساس ترابي، قريب من الجمل والبني.",
        image: "",
      },
      {
        value: "mono",
        title: "تباين هادئ",
        copy: "إحساس أغمق وتفاصيل بسيطة.",
        image: "",
      },
      {
        value: "light",
        title: "درجات فاتحة",
        copy: "إحساس خفيف ومساحة للألوان الهادية.",
        image: "",
      },
    ],
  },
] as const

export function StyleFinderPage() {
  const [answers, setAnswers] = useState<StyleAnswers>({ ...emptyStyleAnswers })
  const [step, setStep] = useState(0)
  const [interacted, setInteracted] = useState(false)
  const heading = useRef<HTMLHeadingElement>(null)
  const { favorites, toggleFavorite } = usePreviewStore()
  const result = step === steps.length
  const question = steps[Math.min(step, steps.length - 1)]
  const selected = answers[question.field]
  const recommendations = recommendStyle(answers).flatMap((id) => {
    const product = catalog.find((item) => item.id === id)
    return product ? [product] : []
  })
  useEffect(() => {
    if (interacted) {
      heading.current?.focus({ preventScroll: true })
      heading.current?.scrollIntoView({
        block: "start",
        behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
          ? "instant"
          : "smooth",
      })
    }
  }, [step, interacted])

  const restart = () => {
    setAnswers({ ...emptyStyleAnswers })
    setStep(0)
    setInteracted(true)
    requestAnimationFrame(() => heading.current?.focus())
  }

  return (
    <InformationShell>
      <PageIntro eyebrow="A LITTLE MORE YOU" title="أسلوبك، على مدار يومك.">
        ثلاثة أسئلة خفيفة، واختيارات من التشكيلة الموجودة. مفيش إجابة صح وغلط؛
        بس بداية أقرب ليك.
      </PageIntro>
      {result ? (
        <section className="mdr-style-results" aria-labelledby="style-question">
          <div className="mdr-style-result-head">
            <div>
              <p className="mdr-eyebrow" dir="ltr">
                YOUR CONSIDERED EDIT
              </p>
              <Heading id="style-question" ref={heading} tabIndex={-1}>
                اختيارات أقرب ليك.
              </Heading>
            </div>
            <Button variant="text" onClick={() => setStep(0)}>
              عدّل اختياراتك
            </Button>
          </div>
          <ul className="mdr-style-summary" aria-label="اختيارات التنسيق">
            <li>
              {answers.audience && styleLabels.audience[answers.audience]}
            </li>
            <li>
              {answers.occasion && styleLabels.occasion[answers.occasion]}
            </li>
            <li>{answers.palette && styleLabels.palette[answers.palette]}</li>
          </ul>
          <div className="mdr-style-products">
            {recommendations.map((product) => (
              <article className="mdr-style-product" key={product.id}>
                <Link className="mdr-style-product-image" to={product.path}>
                  <img
                    src={product.image}
                    alt={product.name}
                    width={600}
                    height={800}
                  />
                  <span>
                    التفاصيل والمقاسات <span aria-hidden="true">←</span>
                  </span>
                </Link>
                <div className="mdr-style-product-meta">
                  <Heading level={3}>
                    <Link to={product.path}>{product.name}</Link>
                  </Heading>
                  <p>{formatPrice(product.price)}</p>
                </div>
                <Button
                  variant="text"
                  aria-pressed={favorites.includes(product.id)}
                  aria-label={`${
                    favorites.includes(product.id) ? "إزالة" : "حفظ"
                  } ${product.name} ${
                    favorites.includes(product.id) ? "من" : "في"
                  } المفضلة`}
                  onClick={() => toggleFavorite(product.id)}
                >
                  {favorites.includes(product.id)
                    ? "محفوظة في المفضلة"
                    : "احفظها لوقت تاني"}
                  <span aria-hidden="true">
                    {favorites.includes(product.id) ? "−" : "+"}
                  </span>
                </Button>
              </article>
            ))}
          </div>
          <Notice>
            دي ترشيحات تحريرية للتنسيق، مش تحديد مقاس أو تأكيد توافر. ممكن بعض
            القطع تكون أقرب للمزاج العام من اللون المختار؛ راجع الصور والخيارات
            في صفحة كل قطعة.
          </Notice>
          <div className="mdr-form-actions">
            <Link
              className="mdr-btn"
              to={
                answers.audience === "kids"
                  ? "/product-category/kids/"
                  : "/product-category/men/"
              }
            >
              شوف بقية التشكيلة <span aria-hidden="true">←</span>
            </Link>
            <Button variant="text" onClick={restart}>
              ابدأ من جديد
            </Button>
            <Link className="mdr-link" to="/size-guide/">
              اعرف المقاس الأقرب
            </Link>
          </div>
        </section>
      ) : (
        <div className="mdr-style-layout">
          <section className="mdr-style-panel" aria-labelledby="style-question">
            <ol
              className="mdr-style-progress"
              aria-label="خطوات اكتشاف الأسلوب"
            >
              {steps.map((item, index) => (
                <li
                  key={item.field}
                  className={index <= step ? "is-current" : ""}
                  aria-current={index === step ? "step" : undefined}
                >
                  <span dir="ltr">0{index + 1}</span>
                  <span>{["عالمك", "يومك", "ألوانك"][index]}</span>
                </li>
              ))}
            </ol>
            <p className="mdr-eyebrow">السؤال {step + 1} من 3</p>
            <Heading id="style-question" ref={heading} tabIndex={-1}>
              {question.title}
            </Heading>
            <p className="mdr-info-copy">{question.hint}</p>
            <form
              onSubmit={(event) => {
                event.preventDefault()
                if (selected) {
                  setInteracted(true)
                  setStep(step + 1)
                }
              }}
            >
              <fieldset
                className={`mdr-style-options mdr-style-options--${question.field}`}
                key={question.field}
              >
                <legend className="screen-reader-text">{question.title}</legend>
                {question.options.map((option, index) => (
                  <div className="mdr-style-option" key={option.value}>
                    <Choice
                      type="radio"
                      name={`style-${question.field}`}
                      value={option.value}
                      checked={selected === option.value}
                      onChange={() =>
                        setAnswers((current) => ({
                          ...current,
                          [question.field]: option.value,
                        }))
                      }
                    >
                      {option.image ? (
                        <img
                          src={option.image}
                          alt=""
                          width={400}
                          height={500}
                        />
                      ) : question.field === "palette" ? (
                        <span
                          className={`mdr-palette mdr-palette--${option.value}`}
                          aria-hidden="true"
                        >
                          <i />
                          <i />
                          <i />
                        </span>
                      ) : (
                        <span
                          className="mdr-style-option-number"
                          dir="ltr"
                          aria-hidden="true"
                        >
                          0{index + 1}
                        </span>
                      )}
                      <strong>{option.title}</strong>
                      <small>{option.copy}</small>
                    </Choice>
                  </div>
                ))}
              </fieldset>
              <div className="mdr-form-actions">
                <Button type="submit" disabled={!selected}>
                  {step === 2 ? "شوف اختياراتك" : "التالي"}
                  <span aria-hidden="true">←</span>
                </Button>
                {step > 0 && (
                  <Button variant="text" onClick={() => setStep(step - 1)}>
                    السؤال السابق
                  </Button>
                )}
              </div>
            </form>
            <p className="mdr-style-session-note">
              إجاباتك للترشيح داخل الصفحة فقط؛ مش بنرسلها أو نحفظها. إعادة
              التحميل بتبدأ التجربة من جديد.
            </p>
          </section>
          <figure className="mdr-style-editorial">
            <img
              src={
                answers.audience === "kids"
                  ? "/images/kids-adventure.jpg"
                  : "/images/city-edit.jpg"
              }
              alt={
                answers.audience === "kids"
                  ? "إطلالة من صور عالم الأطفال في مدار"
                  : "إطلالة رجالية من صور مدار"
              }
              width={1100}
              height={1500}
            />
            <figcaption>
              <span dir="ltr">YOUR DAY. YOUR OWN WAY.</span>
              <Heading level={2}>
                مش قالب تمشي عليه.
                <br />
                مساحة تكون فيها نفسك.
              </Heading>
            </figcaption>
          </figure>
        </div>
      )}
    </InformationShell>
  )
}
