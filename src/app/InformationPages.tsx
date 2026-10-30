import { useState, type ReactNode } from "react"
import { Link } from "react-router"
import { useLocation } from "../i18n/navigation"
import { InformationShell } from "../components/InformationShell"
import { Button, Heading, Notice, PageIntro } from "../components/Interface"
import sizes from "../content/size-guide.json"
import { normalizePath } from "./paths"

function ClosingNote({
  title = "اختيارات أقرب ليك.",
  children,
  to = "/style-finder/",
  action = "اكتشف أسلوبك",
}: {
  title?: string
  children: ReactNode
  to?: string
  action?: string
}) {
  return (
    <section className="mdr-info-closing">
      <div>
        <p className="mdr-eyebrow" dir="ltr">
          YOUR NEXT CHAPTER
        </p>
        <Heading>{title}</Heading>
        <p>{children}</p>
      </div>
      <Link className="mdr-btn" to={to}>
        {action}
        <span aria-hidden="true">←</span>
      </Link>
    </section>
  )
}

function AboutPage() {
  return (
    <>
      <section className="mdr-about-hero" aria-labelledby="about-title">
        <div className="mdr-about-copy">
          <p className="mdr-eyebrow" dir="ltr">
            THE MADAR WAY / MEN + KIDS
          </p>
          <Heading level={1} id="about-title">
            عن مدار.
            <br />
            <em>أقلّ، ولكن أقرب إليك.</em>
          </Heading>
          <p className="mdr-lead">
            مش لازم تختار كتير علشان تلاقي اللي يشبهك. أحيانًا، كل اللي تحتاجه
            قطعة ترتاح لها، ولون تعرف ترجع له، وتفصيلة تحبّها.
          </p>
          <p className="mdr-info-copy">
            مدار مساحة لاكتشاف اختيارات للرجال والأطفال، بعيدًا عن زحمة
            الاحتمالات. نبدأ من يومك، ومن الحركة اللي تحبها، ونسيب لك المساحة
            تجمع إطلالتك بطريقتك.
          </p>
          <Link className="mdr-link" to="/shop/">
            ابدأ من التشكيلة <span aria-hidden="true">←</span>
          </Link>
          <span className="mdr-about-signature" dir="ltr">
            EVERYDAY, IN YOUR OWN WAY.
          </span>
        </div>
        <figure className="mdr-about-portrait">
          <img
            src="/images/coat-camel.jpg"
            alt="إطلالة رجالية بدرجات الجمل الهادئة من صور مدار"
            width={1200}
            height={1800}
            fetchPriority="high"
          />
          <figcaption>
            <span dir="ltr">01 / THE EVERYDAY EDIT</span>
            <span>حضور هادئ. مساحة لنفسك.</span>
          </figcaption>
        </figure>
      </section>
      <section
        className="mdr-info-manifesto"
        aria-labelledby="about-philosophy"
      >
        <p className="mdr-eyebrow" dir="ltr">
          LESS NOISE. MORE YOU.
        </p>
        <Heading id="about-philosophy">
          قطعة واحدة.
          <br />
          واحتمالات على مدار اليوم.
        </Heading>
        <p>
          نحب الألوان اللي تتجمع بسهولة، والطبقات اللي تغيّر الإطلالة من غير ما
          تغيّرك. الفكرة مش إن خزانة ملابسك تكبر؛ الفكرة إن كل اختيار يبقى أقرب
          ليك.
        </p>
      </section>
      <section className="mdr-info-values" aria-label="فكرة مدار">
        {[
          [
            "01",
            "اختيار، مش زحمة.",
            "ابدأ بما ترتاح له، وجرّب تنسيقه بأكثر من طريقة. مظهر يشبهك أهم من عدد القطع اللي عندك.",
          ],
          [
            "02",
            "مساحة ليومك.",
            "من مشوار بسيط لخروجة أكثر ترتيبًا؛ اختار الإيقاع اللي يناسب يومك، وسيب التفاصيل تكمّل الحكاية.",
          ],
          [
            "03",
            "وحكاياتهم الصغيرة.",
            "للأطفال، نبدأ من المساحة للحركة. اختار بالقياس الفعلي، وخلي الراحة جزءًا من الإطلالة، مش خطوة بعدها.",
          ],
        ].map(([number, title, copy]) => (
          <article key={number}>
            <span className="mdr-eyebrow" dir="ltr">
              {number} / MADAR
            </span>
            <Heading level={3}>{title}</Heading>
            <p>{copy}</p>
          </article>
        ))}
      </section>
      <section className="mdr-info-worlds" aria-label="اكتشف عوالم مدار">
        <Link to="/product-category/men/">
          <img
            src="/images/city-edit.jpg"
            alt="إطلالة رجالية من عالم مدار"
            width={1100}
            height={1557}
            loading="lazy"
          />
          <div>
            <span className="mdr-eyebrow" dir="ltr">
              01 / MEN
            </span>
            <Heading level={2}>على إيقاعك.</Heading>
            <span>
              اكتشف الرجال <span aria-hidden="true">←</span>
            </span>
          </div>
        </Link>
        <Link to="/product-category/kids/">
          <img
            src="/images/kids-adventure.jpg"
            alt="طفل يرتدي جاكيتًا بلون أصفر في مساحة خارجية"
            width={1100}
            height={1467}
            loading="lazy"
          />
          <div>
            <span className="mdr-eyebrow" dir="ltr">
              02 / KIDS
            </span>
            <Heading level={2}>مساحة للحكايات الصغيرة.</Heading>
            <span>
              اكتشف الأطفال <span aria-hidden="true">←</span>
            </span>
          </div>
        </Link>
      </section>
      <ClosingNote>
        ثلاثة أسئلة بسيطة، وبداية لاختيارات تشبه مزاجك ويومك.
      </ClosingNote>
    </>
  )
}

type Question = {
  title: string
  answer: ReactNode
}
type HelpGroup = {
  id: string
  title: string
  questions: Question[]
}
const helpGroups: HelpGroup[] = [
  {
    id: "sizes",
    title: "المقاس والاختيار",
    questions: [
      {
        title: "أبدأ باختيار المقاس إزاي؟",
        answer: (
          <>
            خد قياس الصدر والوسط، وللأطفال ابدأ بالطول. قارن الأرقام مع{" "}
            <Link to="/size-guide/">دليل المقاسات</Link>، وراجع وصف القصّة
            وخيارات المقاس في صفحة القطعة؛ الجداول استرشادية ومش قياسًا تفصيليًا
            لكل منتج.
          </>
        ),
      },
      {
        title: "أنا بين مقاسين، أختار إيه؟",
        answer:
          "لو بتفضّل مساحة وراحة أكثر، المقاس الأكبر ممكن يكون أنسب، زي ما بيوضح دليل المنتج. لكن القصّة وطريقة لبسك للقطعة تفرق؛ ما تعتمدش على حرف المقاس وحده.",
      },
      {
        title: "مش عارف أبدأ من أي قطعة.",
        answer: (
          <>
            جرّب <Link to="/style-finder/">اكتشف أسلوبك</Link>. اختار عالم الرجال
            أو الأطفال، شكل اليوم، ومزاج الألوان، وهتظهر لك ترشيحات من القطع
            الموجودة للتنسيق، مش ضمانًا للمقاس أو التوافر.
          </>
        ),
      },
    ],
  },
  {
    id: "shopping",
    title: "التشكيلة واختياراتك",
    questions: [
      {
        title: "أعرف تفاصيل الخامة والعناية منين؟",
        answer:
          "ابدأ بوصف القطعة وتبويب المعلومات في صفحة المنتج. الصور تساعدك في تخيّل الإطلالة، لكن تعليمات العناية المكتوبة على بطاقة القطعة هي المرجع عند الغسيل.",
      },
      {
        title: "هلاقي القطع اللي حفظتها فين؟",
        answer: (
          <>
            من رمز المفضلة أعلى الصفحة، أو من{" "}
            <Link to="/my-account/?view=favorites">صفحة القطع المفضّلة</Link>.
            المفضلة والسلة بيحتفظوا باختياراتك خلال الجلسة الحالية فقط،
            وبيتمسحوا مع إعادة تحميل الصفحة.
          </>
        ),
      },
      {
        title: "هل الأسعار والمخزون متصلين بالمتجر الأصلي؟",
        answer:
          "لا. الأسعار والصور مأخوذة من النسخة المنقولة، لكن مفيش مزامنة للمخزون أو الأسعار الحالية. خيارات المقاس المعروضة لا تعتبر تأكيدًا لتوافر القطعة للشراء.",
      },
    ],
  },
  {
    id: "orders",
    title: "الحساب والطلب والدفع",
    questions: [
      {
        title: "أقدر أعمل طلب أو أدفع فعليًا؟",
        answer: (
          <>
            النسخة الحالية معاينة واجهة فقط. تقدر تجرب{" "}
            <Link to="/cart/">السلة</Link> وخطوات التوصيل والدفع، لكن مفيش طلب
            حقيقي أو شحنة أو خصم أي مبلغ. ما تدخلش بيانات شخصية أو بنكية حقيقية.
          </>
        ),
      },
      {
        title: "تسجيل الدخول واستعادة كلمة المرور شغّالين؟",
        answer: (
          <>
            نماذج <Link to="/my-account/">الحساب</Link> بتفتح تجربة تجريبية غير
            محمية. مفيش تحقق من حسابات أو إنشاء مستخدم، واستعادة كلمة المرور ما
            بتبعتش بريدًا إلكترونيًا.
          </>
        ),
      },
      {
        title: "ليه ظهر رفض للدفع؟",
        answer:
          "لو اخترت البطاقة التجريبية وحالة «محاكاة رفض الدفع»، الواجهة هتعرض رسالة توضيحية علشان تجرّب إعادة المحاولة. غيّر الحالة إلى النجاح أو اختار معاينة الدفع عند الاستلام؛ مفيش معاملة مالية حصلت.",
      },
    ],
  },
  {
    id: "delivery",
    title: "الشحن والاستبدال",
    questions: [
      {
        title: "الشحن بكام وهيوصل إمتى؟",
        answer: (
          <>
            رسوم الشحن ومناطقه ومواعيده لسه غير معتمدة للموقع الجديد. إجمالي
            المعاينة بيحسب القطع فقط، ومش بيحسب شحنًا أو رسومًا إضافية. راجع{" "}
            <Link to="/policies/#shipping">مسودة الشحن</Link> لمعرفة التفاصيل
            المطلوب تأكيدها قبل الإطلاق.
          </>
        ),
      },
      {
        title: "إزاي أطلب استبدال أو استرجاع؟",
        answer: (
          <>
            مفيش طلبات حقيقية في المعاينة، وبالتالي مفيش طلب استبدال أو استرجاع
            بيتسجل هنا.{" "}
            <Link to="/policies/#returns">سياسة الاستبدال والاسترجاع</Link> لسه
            مسودة للمراجعة؛ المدد والشروط وقناة تقديم الطلب محتاجة اعتماد قبل
            التشغيل.
          </>
        ),
      },
    ],
  },
  {
    id: "care",
    title: "العناية بالقطعة",
    questions: [
      {
        title: "أحافظ على القطعة إزاي؟",
        answer:
          "اقرأ بطاقة العناية أولًا، وافصل الألوان، واستخدم طريقة الغسيل والتجفيف الموصى بها للقطعة نفسها. ما تعمّمش تعليمات قطعة قطن على التريكو أو الصوف؛ نوع الخامة والتشطيب بيغيّروا طريقة العناية.",
      },
      {
        title: "أقدر أتواصل مع الدعم؟",
        answer:
          "قنوات الدعم وساعات العمل للموقع الجديد لسه محتاجة اعتماد. ما تعتمدش على بيانات التواصل المنقولة من المرجع باعتبارها قناة خدمة مؤكدة، وما تشاركش بيانات دفع أو كلمات مرور.",
      },
    ],
  },
]

function HelpPage() {
  return (
    <>
      <PageIntro eyebrow="A LITTLE HELP GOES A LONG WAY" title="خلّينا نسهّلها.">
        من أول اختيار المقاس، لآخر خطوة في المعاينة. إجابات واضحة تساعدك تكمل
        على راحتك.
      </PageIntro>
      <div className="mdr-info-reading-layout">
        <nav className="mdr-info-index" aria-label="موضوعات المساعدة">
          <span className="mdr-eyebrow">ابدأ من هنا</span>
          {helpGroups.map((group) => (
            <Link key={group.id} to={`#${group.id}`}>
              {group.title}
              <span aria-hidden="true">←</span>
            </Link>
          ))}
        </nav>
        <div>
          {helpGroups.map((group) => (
            <section
              className="mdr-faq-group"
              id={group.id}
              key={group.id}
              aria-labelledby={`${group.id}-title`}
            >
              <Heading id={`${group.id}-title`}>{group.title}</Heading>
              {group.questions.map((question) => (
                <details className="mdr-faq" key={question.title}>
                  <summary>
                    <span>{question.title}</span>
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.3"
                      aria-hidden="true"
                    >
                      <path d="M5 12h14M12 5v14" />
                    </svg>
                  </summary>
                  <div className="mdr-faq-answer">{question.answer}</div>
                </details>
              ))}
            </section>
          ))}
          <Notice>
            هذه نسخة واجهة تجريبية؛ الحساب والطلب والدفع غير متصلين بخادم.
            استخدم بيانات تجريبية فقط.
          </Notice>
        </div>
      </div>
      <ClosingNote
        title="الخطوة الأولى: مقاس أقرب."
        to="/size-guide/"
        action="افتح دليل المقاسات"
      >
        قياسات واضحة تساعدك تبدأ، مع الرجوع دائمًا لتفاصيل كل قطعة.
      </ClosingNote>
    </>
  )
}

function SizeGuidePage() {
  const [audience, setAudience] = useState<"men" | "kids">("men")
  const men = audience === "men"
  return (
    <>
      <PageIntro eyebrow="A BETTER FIT STARTS HERE" title="المقاس الأقرب ليك.">
        دقيقة للقياس بتفرق في الاختيار. استخدم شريط قياس مرن، وخلي الوقفة طبيعية
        والشريط مريح من غير شدّ.
      </PageIntro>
      <section className="mdr-measure-steps" aria-label="طريقة أخذ القياس">
        {[
          [
            "01",
            "الصدر",
            "لفّ الشريط حول أوسع جزء من الصدر، وخليه مستقيمًا وموازيًا للأرض.",
          ],
          [
            "02",
            "الوسط",
            "قِس حول الوسط الطبيعي من غير شدّ الشريط أو حبس النفس.",
          ],
          [
            "03",
            "طول الطفل",
            "خلي الطفل واقفًا من غير حذاء، وقِس من أعلى الرأس لحد الأرض.",
          ],
        ].map(([number, title, copy]) => (
          <article key={number}>
            <span className="mdr-eyebrow" dir="ltr">
              {number} / MEASURE
            </span>
            <Heading level={2}>{title}</Heading>
            <p>{copy}</p>
          </article>
        ))}
      </section>
      <section className="mdr-size-section" aria-labelledby="size-table-title">
        <div className="mdr-size-section-head">
          <div>
            <p className="mdr-eyebrow" dir="ltr">
              THE SIZE REFERENCE
            </p>
            <Heading id="size-table-title">اختار عالمك.</Heading>
          </div>
          <div
            className="mdr-info-switch"
            role="group"
            aria-label="اختيار جدول المقاسات"
          >
            <Button
              variant="text"
              aria-pressed={men}
              onClick={() => setAudience("men")}
            >
              رجالي
            </Button>
            <Button
              variant="text"
              aria-pressed={!men}
              onClick={() => setAudience("kids")}
            >
              أطفال
            </Button>
          </div>
        </div>
        <p className="mdr-info-copy">
          الأرقام التالية من جدول دليل المنتج الموجود بالفعل في النسخة المنقولة.
          هي مرجع استرشادي، وليست قياسات فعلية لكل قطعة أو وعدًا بأن كل المقاسات
          متاحة.
        </p>
        <div
          className="mdr-size-table-wrap"
          role="region"
          aria-label={`جدول مقاسات ${men ? "الرجال" : "الأطفال"}`}
          tabIndex={0}
        >
          <table className="mdr-size-table">
            <caption>
              {men
                ? "رجالي — القياسات بالسنتيمتر"
                : "أطفال — السن بالسنوات، والطول والصدر بالسنتيمتر"}
            </caption>
            <thead>
              <tr>
                {(men
                  ? ["المقاس", "الصدر", "الوسط", "الطول"]
                  : ["السن", "الطول", "الصدر"]
                ).map((label) => (
                  <th scope="col" key={label}>
                    {label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {sizes[audience].map((row) => (
                <tr key={row[0]}>
                  <th scope="row" dir="ltr">
                    {row[0]}
                  </th>
                  {row.slice(1).map((value, index) => (
                    <td dir="ltr" key={index}>
                      {value}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mdr-size-source">
          مصدر الأرقام: <Link to={sizes.sourcePage}>صفحة البلوفر التريكو</Link>.
          الجدول نفسه متاح من زر «دليل المقاسات» في صفحة المنتج.
        </p>
        <Notice>
          القصّة وطريقة القياس ممكن تختلف بين القطع. عمود «الطول» في جدول الرجال
          منقول كما هو؛ المرجع لا يوضح طريقة أخذه، فلا تعتبره طول الجسم أو قياسًا
          مؤكدًا لمنتج بعينه.
        </Notice>
      </section>
      <section className="mdr-size-advice">
        <div>
          <Heading>بين مقاسين؟</Heading>
          <p>
            لو بتفضّل مساحة وراحة أكثر، دليل المنتج بينصح بالاختيار الأكبر. راجع
            القصّة وخيارات المنتج قبل أي قرار، خصوصًا لو بتضيف طبقات تحت القطعة.
          </p>
        </div>
        <div>
          <Heading>السن بداية، مش قياس.</Heading>
          <p>
            أطفال في نفس السن ممكن تختلف أطوالهم. اعتمد على طول الطفل وقياس
            الصدر في الجدول، وما تختارش بالسن وحده.
          </p>
        </div>
      </section>
      <ClosingNote
        title="من القياس، للاختيار."
        to={men ? "/product-category/men/" : "/product-category/kids/"}
        action={men ? "اكتشف الرجال" : "اكتشف الأطفال"}
      >
        شوف الصور، واقرأ تفاصيل القصّة، واختار على راحتك.
      </ClosingNote>
    </>
  )
}

const policySections = [
  {
    id: "privacy",
    title: "الخصوصية في نسخة المعاينة",
    paragraphs: [
      "البيانات اللي بتكتبها في نماذج الحساب والتوصيل والمراجعات والاشتراك لا تُرسل من التطبيق لإنشاء حساب أو طلب أو اشتراك فعلي. ما تدخلش بيانات شخصية أو كلمات مرور حقيقية.",
      "السلة والمفضلة وإجابات «اكتشف أسلوبك» بتعيش في ذاكرة الصفحة فقط، ومش بيتم حفظها في حساب أو في التخزين المحلي للمتصفح. إعادة تحميل الصفحة بتمسح الحالة المؤقتة. ملخص معاينة الدفع لا يحتفظ بالاسم أو البريد أو العنوان أو رقم الموبايل.",
      "الاستضافة قد تعالج بيانات اتصال فنية، وأي رابط خارجي بتفتحه بيخضع لسياسة الجهة الخارجية. قبل التشغيل، لازم تتحدد جهات المعالجة وأغراضها ومدد الاحتفاظ ووسيلة ممارسة حقوق الخصوصية.",
    ],
  },
  {
    id: "orders",
    title: "الحسابات والطلبات",
    paragraphs: [
      "تسجيل الدخول والتسجيل الجديد واستعادة كلمة المرور واجهات تجريبية غير متصلة بنظام حسابات. لوحة الحساب ليست منطقة محمية، ولا تعتبر إثباتًا لتسجيل الدخول.",
      "إكمال خطوات الدفع يعرض تأكيد معاينة فقط. لا ينشئ رقم طلب حقيقيًا أو فاتورة أو التزامًا بالشحن. الصور والأسعار من الكتالوج المنقول، وليست عرضًا مرتبطًا بمخزون حي.",
    ],
  },
  {
    id: "shipping",
    title: "الشحن والتوصيل — بانتظار الاعتماد",
    paragraphs: [
      "لم تُعتمد بعد مناطق التوصيل، ورسوم الشحن، والحد الأدنى للشحن المجاني، أو المدة المتوقعة. لا تتضمن هذه المسودة أرقامًا بديلة أو وعودًا غير مؤكدة.",
      "قبل قبول أي طلب فعلي، يجب توضيح تكلفة التوصيل ومناطقه والمدة التقديرية وطريقة التتبع والتعامل مع تعذر التسليم. معاينة الدفع الحالية تحسب قيمة القطع فقط.",
    ],
  },
  {
    id: "returns",
    title: "الاستبدال والاسترجاع — بانتظار الاعتماد",
    paragraphs: [
      "تحتاج سياسة المتجر إلى تحديد إجراءات طلب الاستبدال أو الاسترجاع، والمدد والشروط، وحالة القطعة، وتكلفة النقل، وطريقة رد المبلغ وتوقيته، مع مراجعة الحقوق المقررة قانونًا.",
      "هذه مسودة وليست سياسة نهائية أو تقييدًا لحقوق المستهلك. لا يوجد في نسخة المعاينة مسار يرسل طلب استرجاع حقيقيًا أو يعالج رد مبالغ.",
    ],
  },
  {
    id: "payments",
    title: "الدفع والأسعار",
    paragraphs: [
      "الدفع عند الاستلام والبطاقة البنكية داخل الواجهة طريقتان للمحاكاة فقط. التطبيق لا يطلب بيانات بطاقة حقيقية، ولا يتصل ببوابة دفع، ولا يخصم أي مبلغ.",
      "قبل التشغيل، يلزم اعتماد وسائل الدفع والأسعار والضرائب أو الرسوم المطبقة، وإظهار المبلغ النهائي بوضوح قبل تأكيد الطلب. إجمالي المعاينة ليس مبلغًا واجب السداد.",
    ],
  },
  {
    id: "contact",
    title: "التواصل والمراجعة قبل الإطلاق",
    paragraphs: [
      "اسم الكيان التجاري وبيانات التواصل الرسمية وساعات الدعم والجهة المسؤولة عن الخصوصية تحتاج اعتمادًا من صاحب المتجر. بيانات التواصل المنقولة من المرجع لا تُعتبر قناة تشغيل مؤكدة لهذه النسخة.",
      "تُراجع هذه المسودة قانونيًا وتشغيليًا قبل اعتمادها، وتُحدّث لتعكس ما يفعله الموقع المتصل فعلًا. المحتوى هنا أصلي للموقع الجديد، وليس سياسة منقولة أو معتمدة من الموقع السابق.",
    ],
  },
]

function PoliciesPage() {
  return (
    <>
      <PageIntro
        eyebrow="CLEAR FROM THE BEGINNING / DRAFT"
        title="الخصوصية والسياسات."
      >
        التفاصيل تكون واضحة من البداية. هنا نوضح ما تفعله نسخة المعاينة الآن،
        وما يحتاج اعتمادًا قبل تشغيل المتجر.
      </PageIntro>
      <div className="mdr-policy-banner">
        <span className="mdr-policy-badge">مسودة للمراجعة — غير معتمدة</span>
        <p>
          المحتوى التالي ليس سياسة تجارية نهائية. تفاصيل الشحن والاسترجاع
          والتواصل تحتاج تأكيد صاحب المتجر ومراجعة مناسبة قبل الإطلاق.
        </p>
      </div>
      <div className="mdr-info-reading-layout">
        <nav className="mdr-info-index" aria-label="أقسام السياسات">
          <span className="mdr-eyebrow">في هذه الصفحة</span>
          {policySections.map((section) => (
            <Link key={section.id} to={`#${section.id}`}>
              {section.title.split(" — ")[0]}
              <span aria-hidden="true">←</span>
            </Link>
          ))}
        </nav>
        <div className="mdr-policy-sections">
          {policySections.map((section, index) => (
            <section
              id={section.id}
              key={section.id}
              aria-labelledby={`policy-${section.id}`}
            >
              <p className="mdr-eyebrow" dir="ltr">
                0{index + 1} / THE DETAILS
              </p>
              <Heading id={`policy-${section.id}`}>{section.title}</Heading>
              {section.paragraphs.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </section>
          ))}
          <Notice>
            قد تظهر بصفحات المنتجات عبارات من المرجع عن الشحن والاسترجاع. هي
            محتوى منقول، وليست تأكيدًا لسياسة تشغيل أو خدمة فعلية في هذه النسخة.
          </Notice>
        </div>
      </div>
      <ClosingNote
        title="عندك سؤال عن التجربة؟"
        to="/help/"
        action="افتح المساعدة"
      >
        ابدأ بالأسئلة الشائعة علشان تعرف الفرق بين معاينة الواجهة والخدمة
        الفعلية.
      </ClosingNote>
    </>
  )
}

export function InformationPage() {
  const path = normalizePath(useLocation().pathname)
  return (
    <InformationShell>
      {path === "/about/" ? (
        <AboutPage />
      ) : path === "/help/" ? (
        <HelpPage />
      ) : path === "/size-guide/" ? (
        <SizeGuidePage />
      ) : (
        <PoliciesPage />
      )}
    </InformationShell>
  )
}
