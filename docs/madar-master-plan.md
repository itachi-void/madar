# مدار — الخطة الرئيسية: التجربة، الصور، والبرومبتات

هذا الملف هو المرجع الواحد للنسخة الجديدة من مدار. فيه: التوجه، والتفاعلات المعتمدة، وخريطة الصفحات، والباك إند المقترح، و**كل صورة** في الموقع الجديد: إن كان لها ريفرنس في المشروع فمساره مكتوب، وإن لم يكن فبرومبتها كامل وجاهز للنسخ.

ملفات مرتبطة:

- `docs/madar-rejected-deferred.md` — المرفوض والمؤجل وشروط فتحه.
- `docs/madar-implemented.md` — ما هو منفذ فعليًا في الكود الآن.
- `docs/madar-reference-research.md` و`docs/madar-reference-links.json` — المراجع الخمسون.
- `docs/madar-creative-handoff.md` و`public/downloads/madar-reference-pack.zip` — الباكدج السابق، وهذا الملف يحل محله كخطة.

> **حالة الملف:** خطة وبرومبتات فقط. لم يُبنَ الباك إند ولم تُعدَّل الواجهة بعد.

## 0. قرارات مفترضة لحين تأكيدك

| # | القرار | الافتراض المستخدم في هذا الملف |
|---|---|---|
| 1 | موقع جديد أم تطوير الحالي | تجربة جديدة تُبنى مباشرة على الباك إند الجديد، مع الاحتفاظ باللغات الخمس والمحتوى والروابط القديمة (بتحويلات) |
| 2 | المنتجات | نخطط لعشر قطع أساسية حقيقية. البرومبتات تنتج **نماذج تصورية** للتصميم والحملات؛ صور البيع النهائية تكون للقطعة الحقيقية بنفس المواصفات |
| 3 | المنتجات التجريبية الستة | تُخفى من التجربة التجارية؛ برومبتاتها الاختيارية في ملف المؤجل |
| 4 | الأسواق والدفع | **معلّق**: مزود الدفع والعملة والشحن تحتاج قرارك |
| 5 | خدمات VIP (موعد التنسيق، المعاينة المبكرة) | صورها جاهزة لكنها **مشروطة** بوجود الخدمة فعلًا |

## 1. التوجه: «VIP هادئ بتوقيع واحد مدهش»

- **الهدوء أساس الفخامة:** مساحات واسعة، وصور كبيرة، وكلام قليل، وألوان المشروع الحالية: `#f6f3ed` أساس، `#ebe6db` رملي، `#292923` حبر، `#817866` حجر، `#d9d3c8` خطوط.
- **توقيع واحد غريب وجميل:** «المدار»؛ القطعة في المركز والقطع المتوافقة تدور حولها. لا نكرر المفاجآت في كل صفحة.
- **كل حركة تخدم قرارًا:** تقريب، أو قلب أمام/خلف، أو إضافة لإطلالة. لا حركة للزينة فقط.
- **الصدق جزء من الـVIP:** لا ندرة وهمية، ولا تقييمات مخترعة، ولا نسب ثقة في المقاس، ولا تغيير لون بفلتر.
- **إيقاع الحركة:** 120–180ms للأزرار والاختيارات، و240–320ms للوحات وتبديل الصور، و500–700ms لمشهد واحد فقط في الصفحة. منحنى `cubic-bezier(.2,.7,.1,1)`. تقليل الحركة يحوّل كل شيء إلى ظهور فوري أو Fade خفيف.
- **اللغات:** كل الصور بلا نص، وتكوينها محايد الاتجاه، فتخدم RTL وLTR معًا. لا نعكس صورة ملابس أبدًا لأن ذلك يقلب الأزرار.

## 2. التفاعلات المعتمدة

التصنيف: **موافق** = فكرة من القائمة كما هي؛ **تطوير** = تطوير لفكرة موجودة؛ **جديد** = اقتراح جديد.

| # | التفاعل | التصنيف | مستوحى من | أين | يعتمد على |
|---|---|---|---|---|---|
| 1 | **المدار** — القطعة البطلة في المركز وحتى 6 قطع متوافقة تدور ببطء (دورة كل ~60 ثانية) وتتوقف عند المرور أو التركيز؛ الضغط يضيف القطعة لصينية الإطلالة؛ زر «عرض كقائمة» وأسهم الكيبورد؛ مع تقليل الحركة تثبت القطع في دائرة | تطوير لـ«استوديو الإطلالة» و«كمّل الإطلالة» | R07 Mango، R50 Porsche، R47 Teenage Engineering | الرئيسية (معاينة)، صفحة `/studio/`، داخل المنتج | صور أمامية شفافة + جدول توافق تحريري في الباك إند |
| 2 | **غرفة القياس** — وضع ملء شاشة: قلب أمام/خلف (Crossfade 280ms)، وعدسة خامة (ضغط مطوّل أو مرور بتكبير ضمن دقة الصورة)، ونقطتا تفاصيل، ومعلومات الموديل لو حقيقية، وزر «أضف للإطلالة» | تطوير لعدسة الخامة + زاويتين + نقاط التفاصيل | R26 AETHER، R34 Norda، R39 Bellroy | صفحة المنتج | أمام/خلف/تفصيلتان لكل قطعة |
| 3 | صفحة منتج مركز التجربة: ارتداء ← أمام ← خلف ← تفاصيل؛ اللون والمقاس والقصّة والعناية؛ «كمّل الإطلالة» | موافق | R26 AETHER، R02 Massimo Dutti | صفحة المنتج | طقم الصور الخماسي + بيانات معتمدة |
| 4 | اختيار اللون بصورة القطعة نفسها | موافق | R39 Bellroy، R29 Colorful Standard | المنتج والمتجر | صورة حقيقية لكل لون فعلي؛ يظهر فقط عند وجود أكثر من لون |
| 5 | مساعد المقاس + «ليه المقاس ده؟» (نطاقات، وحالة «بين مقاسين»، وبلا نسب) | موافق | R05 UNIQLO، R28 Asket | المنتج + دليل المقاسات | جداول قياسات لكل منتج |
| 6 | شريط شراء ذكي للموبايل يعيدك للخيار الناقص | موافق | R49 Cowboy | المنتج | — |
| 7 | مقارنة قطعتين أو ثلاث كلوحة جانبية | موافق | R38 Cubitts، R45 Apple | المتجر والمنتج | بيانات متاحة فقط |
| 8 | **خزانتي** — مفضلة وإطلالات محفوظة على الحساب | تطوير للمفضلة + حفظ الإطلالات + حقيبة نهاية الأسبوع | R40 Peak Design | الحساب | باك إند |
| 9 | **بطاقة الإطلالة** — بطاقة تحريرية للحفظ أو المشاركة | تطوير لتصدير الإطلالة | R14 Louis Vuitton (فصل الحملة) | المدار + خزانتي | صور شفافة |
| 10 | **مختار الأسلوب** بالمناسبة («من يوم لمساء») | تطوير لاختبار الأسلوب الموجود | R40 Peak Design | `/style-finder/` | ترشيحات من الباك إند |
| 11 | **عائلة واحدة** — إطلالات أب وطفل متناسقة بمقاسات منفصلة | تطوير لتنسيق ألوان الرجال والأطفال | R08 Ralph Lauren، R10 Tommy | الرئيسية + الإطلالات | Looks في الباك إند |
| 12 | **مكتبة الخامات** — صفحة لكل خامة: ماكرو، وعناية، والقطع المصنوعة منها | جديد | R18 Loro Piana، R32 Vollebak، R44 Aesop | `/materials/` | ماكرو حقيقي + بيانات خامة معتمدة |
| 13 | **سؤال لفريق مدار** (مقاس/لون) والرد بالإيميل | جديد | R25 Patagonia | المنتج | باك إند + إيميل + شخص يرد |
| 14 | تنبيه رجوع المقاس | موافق | R24 Adidas | المنتج | باك إند + إيميل + مخزون حقيقي |
| 15 | **رحلة الطلب كحكاية** | جديد | R44 Aesop | الحساب | طلبات حقيقية |
| 16 | **موعد تنسيق خاص** | جديد — مشروط | R12 Hugo Boss | `/appointments/` | خدمة حقيقية |
| 17 | **معاينة مبكرة للأعضاء** | جديد — مشروط | R37 Gentle Monster (عالم الحملة) | `/early-access/` | إصدارات حقيقية |
| 18 | مشهد تمرير واحد لقطعة بطلة | موافق | R45 Apple | الرئيسية فقط | صور القطعة البطلة |
| 19 | حركات صغيرة: اختيار، إضافة مع «تراجع»، فتح لوحة | موافق | — | كل الموقع | — |

## 3. خريطة الصفحات الجديدة

| الصفحة | المحتوى | الصور |
|---|---|---|
| الرئيسية | Hero ← معاينة المدار ← عالما الرجال والأطفال ← مختارات ← شريط الخامة ← عائلة واحدة ← حملة المدينة ← الدفتر ← الخدمات | H01–H14 |
| المتجر وأقسامه | رأس القسم، وفلاتر، وكثافة الشبكة، ومقارنة | C01–C02 + صور المنتجات |
| المنتج | المعرض، وغرفة القياس، والاختيارات، والمقاس، وكمّل الإطلالة، وسؤال الفريق، وتنبيه المقاس | طقم المنتج الخماسي |
| استوديو المدار `/studio/` | التوقيع الكامل وصينية الإطلالة وبطاقة الإطلالة | H09–H10 + الصور الأمامية |
| الإطلالات | 4 إطلالات تحريرية قابلة للتسوق | L01–L04D |
| الدفتر | 4 قصص | J01–J04B |
| مكتبة الخامات | 5 خامات | M01–M05 |
| عن مدار | القصة وعالمان | A01–A02 + H03–H04 |
| مختار الأسلوب | 3 أسئلة ونتائج | SF01–SF08 |
| خزانتي / الحساب / الطلبات | محفوظات وإطلالات وطلبات | E02 |
| السلة والدفع والتأكيد | — | E01، E04 |
| موعد التنسيق / المعاينة المبكرة | مشروطتان | V01–V02 |
| 404 | — | E03 |
| الإيميلات والمشاركة | — | EM01–EM02، OG01 |

## 4. الباك إند: ووردبريس + WooCommerce من ورا، وReact قدام (معتمد)

القرار المعتمد: **WooCommerce هو لوحة الإدارة**، ومسؤول عن المنتجات والمخزون والطلبات والدفع والعملاء والإيميلات. **الواجهة تفضل React.** بكده Payload ملغي، والمشروع مش هيتنقل لـ Next.js.

التنفيذ موجود في إضافة `wordpress/madar-headless/`، وتفاصيلها التقنية في `wordpress/madar-headless/README.md`. تعليمات تثبيتها للـagent في `docs/wordpress-agent-prompt.md`.

| المرحلة | التنفيذ | الحالة |
|---|---|---|
| 1 — المحتوى والكتالوج | المنتجات واختلافاتها من WooCommerce؛ والإضافة تزوّد: الترجمات، وتوافق «المدار»، ونقاط التفاصيل، وأدوار الصور، والإطلالات، والخامات، ودليل المقاسات | **مكتوب ومُختبَر** |
| 2 — العملاء | تسجيل ودخول بتوكن، والملف والعناوين، والطلبات، و«خزانتي»، وتنبيه رجوع المقاس | **مكتوب ومُختبَر** |
| 3 — البيع | السلة والدفع عبر Store API الخاص بـ WooCommerce، مع ربط الطلب بالحساب ولغة الطلب | **مُختبَر بالدفع عند الاستلام**؛ بوابة الدفع والشحن **معلّقين على قرارك** |
| 4 — خدمات | «سؤال لفريق مدار» | **مكتوب ومُختبَر**؛ المواعيد والمعاينة المبكرة مؤجلين |
| 5 — لاحقًا | التقييمات بمراجعة | مؤجل |

اللغات: `eg` (افتراضي من حقول ووردبريس)، و`sa` و`en` و`fr` و`es` كحقول ترجمة في الإضافة. **بدون إضافة ترجمة مدفوعة.** الصور مشتركة بين اللغات.

**قراراتك المعلّقة قبل البيع الحقيقي:** السوق والعملة، ومزود الدفع، ومناطق الشحن وأسعاره، ومزود الإيميل، ومكان الاستضافة، والسياسات.

## 5. نظام الصور: المواصفات والتسمية

- **صور المنتج:** `front`/`back` بمقاس 1600×2400 PNG شفاف فعلي؛ تفصيلتان بمقاس 1600×1600 JPG (اسم كل تفصيلة مكتوب مع القطعة، مثل `coat-camel-collar.jpg`)؛ `on-model` بمقاس 1600×2400 JPG.
- **كل الصور:** sRGB، بلا نص أو لوجو أو علامة مائية. نسلّم الماستر فقط، والتنفيذ يولّد WebP/AVIF والأحجام المتجاوبة.
- **المجلدات المقترحة:** `madar-assets/products/<prefix>/`، و`madar-assets/editorial/`، و`madar-assets/materials/`، و`madar-assets/states/`.
- **الترتيب الإجباري للإنتاج:**
  1. **الموجة 1:** الصور الأمامية للـ13 قطعة (الماستر)، واعتمادها.
  2. **الموجة 2:** الظهر والتفاصيل والارتداء، مع إرفاق الماستر في كل برومبت.
  3. **الموجة 3:** الصور التحريرية التي تحتوي على منتجات، مع إرفاق الماسترات المذكورة لكل صورة.
  4. **الموجة 4:** الصور بلا منتجات (الأرضيات والحالات)، ويمكن عملها في أي وقت.
- **ريفرنس الصورة:** ارفق ملف الريفرنس المذكور كمرجع مزاج وتكوين. البرومبت نفسه يمنع نسخ الشخص أو المشهد.
- **منتج حقيقي:** نفس الزوايا والمواصفات تتحول لـ«بريف تصوير» للمصور، والبرومبت يبقى وصفًا مرجعيًا.
- **الأطفال الحقيقيون:** موافقة ولي الأمر وحقوق استخدام مكتوبة.

## 6. جرد الصور الموجودة في المشروع (الريفرنسات)

في فيجما ميك، الملفات موجودة في لوحة الملفات تحت المسار المكتوب، ورابط المعاينة هو نفس المسار بدون `public`. المشروع فيه 39 ملف صورة، **لكنها 17 صورة فوتوغرافية مختلفة فقط** بأسماء مكررة. حقوق الاستخدام التجاري لكل هذه الصور غير مؤكدة.

| الكود | كل مسارات الملف (نفس الصورة) | المقاس | المحتوى الفعلي | تُستخدم حاليًا في | القرار |
|---|---|---|---|---|---|
| U01 | `public/images/coat-camel.jpg`<br>`public/images/madar-source/7627380c25-m-coat-brown.jpg`<br>`public/images/madar-source/c2b7bf2834-madar-m-coat-brown.jpg` | 1200×1800 | رجل بمعطف جملي مفتوح فوق كنزة بياقة عالية، ماسك الياقة، خلفية بيج | الرئيسية (Hero، عالم الرجال، مشهد التمرير، العمود المرن، أثر المؤشر، تصنيف المعاطف)، صفحة عن مدار، مختار الأسلوب (رجال)، صورة المشاركة الافتراضية، المنتج 141، الإطلالة 1 | مرجع تصميم للمعطف الجملي ومرجع مزاج للـHero؛ يتقاعد من الواجهة بعد الاستبدال |
| U02 | `public/images/coat-camel-alt.jpg`<br>`public/images/madar-source/e1dcc22587-m-coat-brown-2.jpg`<br>`public/images/madar-source/1661d9cba5-madar-m-coat-brown-2.jpg` | 1200×1800 | نفس المعطف، اليدان في الجيوب، الأزرار الثلاثة واضحة | Hero البديلة، مشهد التمرير، بطاقة 141 البديلة، الإطلالة 1 (تفصيل)، قصة «معطف واحد» | أوضح مرجع لتوزيع الأزرار وشكل الأمام |
| U03 | `public/images/kids-adventure.jpg`<br>`public/images/madar-source/4745180458-k-brown-shirt.jpg`<br>`public/images/madar-source/a2be49d61d-madar-k-brown-shirt.jpg` | 896×1200 | طفل بجاكيت مبطّن أصفر في حديقة خريفية، لقطة كاملة | عالم الأطفال، العمود المرن، أثر المؤشر، تصنيف الأطفال، قصة «مساحة للنمو»، عن مدار، مختار الأسلوب، بطاقة 111 في الرئيسية، المنتج 134 | مرجع مزاج للأطفال فقط؛ لا يمثل أي منتج في الكتالوج |
| U04 | `public/images/kids-adventure-alt.jpg`<br>`public/images/madar-source/4fe9ae7e6c-madar-k-stripe.jpg`<br>`public/images/madar-source/fd1d8858ee-k-stripe.jpg` | 896×1200 | نفس الطفل بالجاكيت الأصفر، لقطة أقرب وضاحك | بطاقة 111 البديلة، المنتج 123، بديل 111، الإطلالة 3 | مرجع مزاج وتعبير فقط |
| U05 | `public/images/knit-cream.jpg`<br>`public/images/madar-source/6f8cb5fdae-f-sweaters.jpg`<br>`public/images/madar-source/94807ab5ca-madar-f-sweaters.jpg` | 896×1200 | رجل بكنزة كريمي مضلعة بياقة عالية، يده على صدره | بطاقة 86، تصنيف الكنزات، المنتج 86، قصة «معطف واحد» | مرجع تصميم للكنزة |
| U06 | `public/images/knit-cream-alt.jpg`<br>`public/images/madar-source/b6eae29d9c-madar-f-stack.jpg`<br>`public/images/madar-source/c14434c159-f-stack.jpg` | 896×1200 | نفس الكنزة، الرجل ناظر للجنب | بطاقة 86 البديلة، بديل 86 و128، الإطلالة 2 (تفصيل) | مرجع تصميم ثانٍ للكنزة |
| U07 | `public/images/madar-source/62e5f3ed58-madar-m-suit-chair.jpg`<br>`public/images/madar-source/62fef2cbdc-m-suit-chair.jpg` | 896×1200 | رجل ببدلة داكنة وكرافتة، داخلي بكرسي خشب وشباك | المنتج 98، بديل 93، الإطلالة 4 (تفصيل) | مرجع تصميم للبدلة الداكنة |
| U08 | `public/images/madar-source/7e6ebb435b-m-black-coat.jpg`<br>`public/images/madar-source/b98900834a-madar-m-black-coat.jpg` | 896×1200 | نفس البدلة الداكنة، لقطة كاملة (رغم أن الاسم «معطف أسود») | المنتج 93، بديل 98، الإطلالة 4 | مرجع للبدلة فقط؛ ليس صورة معطف |
| U09 | `public/images/madar-source/7c50bcdf3e-madar-k-arms.jpg`<br>`public/images/madar-source/e05a716c31-k-arms.jpg` | 896×1200 | ولد بجاكيت أسود في داخلي هادئ | المنتج 111، بديل 105 و123، الإطلالة 3 (تفصيل) | مرجع إضاءة داخلية للأطفال فقط |
| U10 | `public/images/madar-source/ce640db2e5-madar-m-white-wall.jpg`<br>`public/images/madar-source/7c6a9e1453-m-white-wall.jpg` | 896×1200 | رجل بكنزة سوداء أمام حائط خرساني | المنتج 128، بديل 118، الإطلالة 2 | مرجع خلفية وإضاءة؛ ليس أوفرشيرت |
| U11 | `public/images/city-edit.jpg` | 1200×1500 | رجل بمعطف أسود طويل ونظارة وشنطة على سلالم في المدينة | حملة المدينة في الرئيسية، قصة «المدينة»، عالم الرجال في عن مدار، نتيجة مختار الأسلوب | مرجع تصميم ومزاج للمعطف الأسود ID 93 والحملة |
| U12 | `public/images/story-wardrobe.jpg` | 1200×1800 | رف ملابس بألوان دافية ونبتة | قصة «خزانة أقل» | مرجع تكوين لقصص الدفتر |
| U13 | `public/images/suit-navy.jpg` | 1200×1801 | رجل ببدلة كحلي كاملة أمام مبنى زجاجي | بطاقة 98 في الرئيسية، تصنيف البدل، العمود المرن، أثر المؤشر | مرجع مزاج حضري فقط؛ البدلة الكحلي ليست منتج الكتالوج |
| U14 | `public/images/suit-navy-alt.jpg` | 1200×1800 | نفس البدلة الكحلي، لقطة أقرب | بطاقة 98 البديلة | مرجع مزاج فقط |
| U15 | `public/images/madar-source/0bda28db66-f-shoes.jpg` | 900×1200 | فلات لاي: تريكو بني، بوت، بنطلون كاروهات | قصة «معطف واحد، شتا كامل» | مرجع تكوين للفلات لاي |
| U16 | `public/images/madar-source/c550b0b972-madar-k-curly.jpg` | 896×1200 | ولد بجاكيت أسود في داخلي (ليس تيشيرت مقلّم) | المنتج 105 | مرجع إضاءة داخلية فقط |
| U17 | `public/images/madar-source/f4844d09e6-madar-m-stripe.jpg` | 896×1200 | رجل بكنزة داكنة (ليس قميص مقلّم) | المنتج 118 | مرجع إضاءة فقط |

**ملفات أخرى موجودة:**

| الملف | القرار |
|---|---|
| `public/images/madar-source/2d49b8bc06-test-product-tshirt.png`، `8299179828-test-product-jeans.png`، `63a3740926-test-product-hoodie.png`، `85ee7d776c-test-product-bracelet.png`، `5137cd6756-test-product-wallet.png`، `e0ca6527ad-test-product-sunglasses.png` | بطاقات نصية 600×600، ليست صورًا؛ تُخفى مع المنتجات التجريبية (برومبتات اختيارية في ملف المؤجل) |
| بروفات المعطف الأربع: `public/downloads/madar-reference-pack.zip` ← المجلد `02-received-coat-concepts/`: `coat_front_isolated.png`، `coat_back_isolated.png`، `coat_detail_collar_shoulder.jpg`، `coat_detail_pocket_buttons.jpg` | بروفات غير معتمدة للمعطف الجملي؛ المقاسات والشفافية سليمة، والتصميم يحتاج مطابقة (انظر §7.1) |
| `public/madar-mark.svg` | شعار فيكتور؛ يبقى ويُطوَّر يدويًا، **لا يُولَّد بالذكاء الاصطناعي** |
| `public/favicon.svg` | أيقونة افتراضية ليست شعار مدار؛ تُستبدل بنسخة من `madar-mark.svg` |
| `public/images/madar-source/*-visa.svg` وبقية شعارات البطاقات (mastercard، amex، diners، discover، jcb، maestro، laser) | تُستبدل بالشعارات الرسمية لطرق الدفع المعتمدة فقط بعد اختيار المزود؛ «laser» متوقفة |
| `aa1471a6ac-loader.svg`، `a36486a852-preloader.gif`، `4f98eefa38-default-skin.png`، `813cce1ec9-default-skin.svg` | أصول واجهة من ووردبريس؛ تُحذف مع الواجهة القديمة، والتحميل يكون بـCSS |
| `public/downloads/madar-reference-contact-sheet.jpg` | لوحة معاينة لكل الصور الحالية |

**أصول لا تُولَّد بالذكاء الاصطناعي:** الشعار، والأيقونات (نظام أيقونات المشروع)، وشعارات الدفع الرسمية، و3 رسومات قياس فيكتور (قمصان وجواكت رجالي، وبنطلون رجالي، وأطفال) تُرسم في التصميم من بيانات القياسات.

## 7. صور المنتجات — كل البرومبتات

**التسلسل لكل قطعة:** ولّد `front` واعتمده ← ارفقه في برومبتات `back` و`detail` و`on-model`.

### 7.1 `coat-camel` — معطف صوف بلون الجمل (ID 141)

- **الريفرنس:** U01 `public/images/coat-camel.jpg`، U02 `public/images/coat-camel-alt.jpg` (مرجع تصميم)
- **بروفات موجودة:** `public/downloads/madar-reference-pack.zip` ← المجلد `02-received-coat-concepts/`: `coat_front_isolated.png`، `coat_back_isolated.png`، `coat_detail_collar_shoulder.jpg`، `coat_detail_pocket_buttons.jpg`. لو اعتمدت البروفة الأمامية، اعتبرها الماستر وتخطَّ برومبت الأمام.
- **الملفات:** `coat-camel-front.png`، `coat-camel-back.png`، `coat-camel-collar.jpg`، `coat-camel-pocket-buttons.jpg`، `coat-camel-on-model.jpg`

**الأمام — 1600×2400 PNG شفاف** · `coat-camel-front.png`

```text
Create an original product image for Madar.
Product identity: a camel, knee-length, single-breasted men's overcoat with notched lapels, raglan-style shoulder seams, exactly three dark round horn-look front buttons, two slanted welt pockets, plain sleeve cuffs, no belt, no visible branding.
View: straight-on full FRONT on an invisible (ghost) mannequin; the whole garment visible from collar to hem, including both sleeves.
Canvas: 1600 x 2400 px portrait; garment centered with an 8–10 percent clear margin on every side.
Background: a genuine transparent alpha channel (PNG). No white matte, no checkerboard pattern, no floor shadow, no hanger, no visible mannequin.
Light: soft, even studio light with gentle shape; true-to-life color; matte fabric texture.
This image is the DESIGN MASTER. Keep the construction simple and unambiguous so every later view can match it exactly.
Avoid: any text, letters, numbers, logos, brand marks, watermarks, signage, price tags or labels; distorted hands or extra fingers; plastic-looking fabric; oversaturated color; heavy retouching; busy backgrounds; collages, grids or split frames.
```

**الظهر — 1600×2400 PNG شفاف** · `coat-camel-back.png`

```text
Use the attached APPROVED FRONT MASTER (coat-camel-front.png) as the exact identity reference. Do not redesign the garment.
Product identity: a camel, knee-length, single-breasted men's overcoat with notched lapels, raglan-style shoulder seams, exactly three dark round horn-look front buttons, two slanted welt pockets, plain sleeve cuffs, no belt, no visible branding.
View: straight-on full BACK on an invisible mannequin, with identical scale, centering and margins to the front master so the two images align when the customer flips between them.
Back construction (a concept design decision): one center back seam and a single center vent from the lower back to the hem; raglan seams continue over the shoulders.
Canvas: 1600 x 2400 px; genuine transparent PNG background; no shadow, no hanger.
Avoid: any text, letters, numbers, logos, brand marks, watermarks, signage, price tags or labels; distorted hands or extra fingers; plastic-looking fabric; oversaturated color; heavy retouching; busy backgrounds; collages, grids or split frames.
```

**تفصيل 1 — 1600×1600** · `coat-camel-collar.jpg`

```text
Use the attached APPROVED FRONT MASTER (coat-camel-front.png) as the exact identity reference.
Product identity: a camel, knee-length, single-breasted men's overcoat with notched lapels, raglan-style shoulder seams, exactly three dark round horn-look front buttons, two slanted welt pockets, plain sleeve cuffs, no belt, no visible branding.
View: a close detail of the notched lapel, collar and shoulder seam, with the edge stitching visible.
Square 1600 x 1600 px; camera about 30–40 cm from the fabric; readable depth of field; soft raking side light that reveals texture and stitching; the garment fills the frame.
Every button, seam, stripe and color must match the master exactly. No invented labels, tags or care symbols.
Avoid: any text, letters, numbers, logos, brand marks, watermarks, signage, price tags or labels; distorted hands or extra fingers; plastic-looking fabric; oversaturated color; heavy retouching; busy backgrounds; collages, grids or split frames.
```

**تفصيل 2 — 1600×1600** · `coat-camel-pocket-buttons.jpg`

```text
Use the attached APPROVED FRONT MASTER (coat-camel-front.png) as the exact identity reference.
Product identity: a camel, knee-length, single-breasted men's overcoat with notched lapels, raglan-style shoulder seams, exactly three dark round horn-look front buttons, two slanted welt pockets, plain sleeve cuffs, no belt, no visible branding.
View: a close detail of one front button with its buttonhole and the slanted welt pocket beside it.
Square 1600 x 1600 px; camera about 30–40 cm from the fabric; readable depth of field; soft raking side light that reveals texture and stitching; the garment fills the frame.
Every button, seam, stripe and color must match the master exactly. No invented labels, tags or care symbols.
Avoid: any text, letters, numbers, logos, brand marks, watermarks, signage, price tags or labels; distorted hands or extra fingers; plastic-looking fabric; oversaturated color; heavy retouching; busy backgrounds; collages, grids or split frames.
```

**على الموديل — 1600×2400** · `coat-camel-on-model.jpg`

```text
Use the attached APPROVED FRONT MASTER (coat-camel-front.png) as the exact clothing reference. Do not redesign the garment.
Product identity: a camel, knee-length, single-breasted men's overcoat with notched lapels, raglan-style shoulder seams, exactly three dark round horn-look front buttons, two slanted welt pockets, plain sleeve cuffs, no belt, no visible branding.
Scene: An adult man around 30 stands relaxed against a warm limestone-colored plaster wall, the coat worn open over a camel rib-knit turtleneck and dark charcoal trousers, one hand lightly at the lapel.
Framing: full length or three-quarter length, 1600 x 2400 px portrait; the garment completely readable.
House style: quiet premium editorial for Madar, a men's and children's clothing label. Warm neutral palette of limestone, sand, camel, taupe and soft ink; soft directional natural light; matte, believable fabric texture; calm composition with generous negative space; natural skin texture; relaxed, dignified posture.
If a reference photograph is attached, use it only for mood, light and composition; never copy the person, face, exact scene or any third-party element.
Avoid: any text, letters, numbers, logos, brand marks, watermarks, signage, price tags or labels; distorted hands or extra fingers; plastic-looking fabric; oversaturated color; heavy retouching; busy backgrounds; collages, grids or split frames.
```

**مسار بديل: مطابق للأصل بدل التصميم الجديد** · ارفق `public/images/coat-camel.jpg` و`public/images/coat-camel-alt.jpg`

```text
REFERENCE-FAITHFUL PRODUCT EDIT, NOT A REDESIGN.
Use the two attached model photographs as the only authority for the camel coat. Preserve the visible construction, camel color, notched lapel shape, diagonal raglan shoulder seams, pocket openings, relative length, and the three visible dark front buttons in their original placement and closure direction. Do not mirror the garment.
Create a straight-on full-length FRONT product cutout on an invisible mannequin, centered on a 1600 x 2400 px canvas with 8–10 percent margins.
Reconstruct only what the photographs support. Do not invent hidden construction, lining, extra buttons, pockets or a rear view.
Output a PNG with a genuine transparent alpha channel. No white matte, checkerboard, floor shadow, hanger, visible mannequin, text, logo or watermark.
```

الظهر المطابق للأصل **لا يمكن** بالبرومبت؛ محتاج صورة ظهر حقيقية.

### 7.2 `suit-charcoal` — طقم بدلة سادة (ID 98)

- **الريفرنس:** U07 `public/images/madar-source/62e5f3ed58-madar-m-suit-chair.jpg`، U08 `public/images/madar-source/7e6ebb435b-m-black-coat.jpg` (مرجع تصميم)
- **ملاحظة:** البدلة الكحلي (U13/U14) في الرئيسية مش نفس المنتج؛ تتقاعد من بطاقة المنتج.
- **الملفات:** `suit-charcoal-front.png`، `suit-charcoal-back.png`، `suit-charcoal-lapel-button.jpg`، `suit-charcoal-cuff-weave.jpg`، `suit-charcoal-on-model.jpg`

**الأمام — 1600×2400 PNG شفاف** · `suit-charcoal-front.png`

```text
Create an original product image for Madar.
Product identity: a men's plain dark charcoal two-piece suit: single-breasted two-button jacket with notched lapels and flap pockets, and matching straight-leg flat-front trousers; for product cutouts show the jacket above the trousers as one balanced full-set composition.
View: straight-on full FRONT on an invisible (ghost) mannequin; the whole garment visible from collar to hem, including both sleeves.
Canvas: 1600 x 2400 px portrait; garment centered with an 8–10 percent clear margin on every side.
Background: a genuine transparent alpha channel (PNG). No white matte, no checkerboard pattern, no floor shadow, no hanger, no visible mannequin.
Light: soft, even studio light with gentle shape; true-to-life color; matte fabric texture.
This image is the DESIGN MASTER. Keep the construction simple and unambiguous so every later view can match it exactly.
Avoid: any text, letters, numbers, logos, brand marks, watermarks, signage, price tags or labels; distorted hands or extra fingers; plastic-looking fabric; oversaturated color; heavy retouching; busy backgrounds; collages, grids or split frames.
```

**الظهر — 1600×2400 PNG شفاف** · `suit-charcoal-back.png`

```text
Use the attached APPROVED FRONT MASTER (suit-charcoal-front.png) as the exact identity reference. Do not redesign the garment.
Product identity: a men's plain dark charcoal two-piece suit: single-breasted two-button jacket with notched lapels and flap pockets, and matching straight-leg flat-front trousers; for product cutouts show the jacket above the trousers as one balanced full-set composition.
View: straight-on full BACK on an invisible mannequin, with identical scale, centering and margins to the front master so the two images align when the customer flips between them.
Back construction (a concept design decision): jacket with a smooth back and a single center vent; trousers with two back welt pockets.
Canvas: 1600 x 2400 px; genuine transparent PNG background; no shadow, no hanger.
Avoid: any text, letters, numbers, logos, brand marks, watermarks, signage, price tags or labels; distorted hands or extra fingers; plastic-looking fabric; oversaturated color; heavy retouching; busy backgrounds; collages, grids or split frames.
```

**تفصيل 1 — 1600×1600** · `suit-charcoal-lapel-button.jpg`

```text
Use the attached APPROVED FRONT MASTER (suit-charcoal-front.png) as the exact identity reference.
Product identity: a men's plain dark charcoal two-piece suit: single-breasted two-button jacket with notched lapels and flap pockets, and matching straight-leg flat-front trousers; for product cutouts show the jacket above the trousers as one balanced full-set composition.
View: a close detail of the notched lapel and the fastened front button.
Square 1600 x 1600 px; camera about 30–40 cm from the fabric; readable depth of field; soft raking side light that reveals texture and stitching; the garment fills the frame.
Every button, seam, stripe and color must match the master exactly. No invented labels, tags or care symbols.
Avoid: any text, letters, numbers, logos, brand marks, watermarks, signage, price tags or labels; distorted hands or extra fingers; plastic-looking fabric; oversaturated color; heavy retouching; busy backgrounds; collages, grids or split frames.
```

**تفصيل 2 — 1600×1600** · `suit-charcoal-cuff-weave.jpg`

```text
Use the attached APPROVED FRONT MASTER (suit-charcoal-front.png) as the exact identity reference.
Product identity: a men's plain dark charcoal two-piece suit: single-breasted two-button jacket with notched lapels and flap pockets, and matching straight-leg flat-front trousers; for product cutouts show the jacket above the trousers as one balanced full-set composition.
View: a close detail of the sleeve cuff with its buttons and the fine suiting weave.
Square 1600 x 1600 px; camera about 30–40 cm from the fabric; readable depth of field; soft raking side light that reveals texture and stitching; the garment fills the frame.
Every button, seam, stripe and color must match the master exactly. No invented labels, tags or care symbols.
Avoid: any text, letters, numbers, logos, brand marks, watermarks, signage, price tags or labels; distorted hands or extra fingers; plastic-looking fabric; oversaturated color; heavy retouching; busy backgrounds; collages, grids or split frames.
```

**على الموديل — 1600×2400** · `suit-charcoal-on-model.jpg`

```text
Use the attached APPROVED FRONT MASTER (suit-charcoal-front.png) as the exact clothing reference. Do not redesign the garment.
Product identity: a men's plain dark charcoal two-piece suit: single-breasted two-button jacket with notched lapels and flap pockets, and matching straight-leg flat-front trousers; for product cutouts show the jacket above the trousers as one balanced full-set composition.
Scene: An adult man around 35 stands in a quiet interior with tall window light beside a simple wooden chair, wearing the suit with a white shirt and a slim dark tie.
Framing: full length or three-quarter length, 1600 x 2400 px portrait; the garment completely readable.
House style: quiet premium editorial for Madar, a men's and children's clothing label. Warm neutral palette of limestone, sand, camel, taupe and soft ink; soft directional natural light; matte, believable fabric texture; calm composition with generous negative space; natural skin texture; relaxed, dignified posture.
If a reference photograph is attached, use it only for mood, light and composition; never copy the person, face, exact scene or any third-party element.
Avoid: any text, letters, numbers, logos, brand marks, watermarks, signage, price tags or labels; distorted hands or extra fingers; plastic-looking fabric; oversaturated color; heavy retouching; busy backgrounds; collages, grids or split frames.
```

### 7.3 `knit-cream` — بلوفر تريكو بدرجات ترابي (ID 86)

- **الريفرنس:** U05 `public/images/knit-cream.jpg`، U06 `public/images/knit-cream-alt.jpg` (مرجع تصميم)
- **ملاحظة:** اسم الكتالوج «بدرجات ترابي» بينما الصور كريمي؛ نعتمد الكريمي إلا لو أكدت غير كده.
- **الملفات:** `knit-cream-front.png`، `knit-cream-back.png`، `knit-cream-collar-rib.jpg`، `knit-cream-cuff-hem.jpg`، `knit-cream-on-model.jpg`

**الأمام — 1600×2400 PNG شفاف** · `knit-cream-front.png`

```text
Create an original product image for Madar.
Product identity: a men's warm cream rib-knit turtleneck sweater with long sleeves, ribbed cuffs and hem, no cable motifs, no logos; soft matte knit appearance.
View: straight-on full FRONT on an invisible (ghost) mannequin; the whole garment visible from collar to hem, including both sleeves.
Canvas: 1600 x 2400 px portrait; garment centered with an 8–10 percent clear margin on every side.
Background: a genuine transparent alpha channel (PNG). No white matte, no checkerboard pattern, no floor shadow, no hanger, no visible mannequin.
Light: soft, even studio light with gentle shape; true-to-life color; matte fabric texture.
This image is the DESIGN MASTER. Keep the construction simple and unambiguous so every later view can match it exactly.
Avoid: any text, letters, numbers, logos, brand marks, watermarks, signage, price tags or labels; distorted hands or extra fingers; plastic-looking fabric; oversaturated color; heavy retouching; busy backgrounds; collages, grids or split frames.
```

**الظهر — 1600×2400 PNG شفاف** · `knit-cream-back.png`

```text
Use the attached APPROVED FRONT MASTER (knit-cream-front.png) as the exact identity reference. Do not redesign the garment.
Product identity: a men's warm cream rib-knit turtleneck sweater with long sleeves, ribbed cuffs and hem, no cable motifs, no logos; soft matte knit appearance.
View: straight-on full BACK on an invisible mannequin, with identical scale, centering and margins to the front master so the two images align when the customer flips between them.
Back construction (a concept design decision): plain back with the same vertical rib, ribbed hem and cuffs, side seams only.
Canvas: 1600 x 2400 px; genuine transparent PNG background; no shadow, no hanger.
Avoid: any text, letters, numbers, logos, brand marks, watermarks, signage, price tags or labels; distorted hands or extra fingers; plastic-looking fabric; oversaturated color; heavy retouching; busy backgrounds; collages, grids or split frames.
```

**تفصيل 1 — 1600×1600** · `knit-cream-collar-rib.jpg`

```text
Use the attached APPROVED FRONT MASTER (knit-cream-front.png) as the exact identity reference.
Product identity: a men's warm cream rib-knit turtleneck sweater with long sleeves, ribbed cuffs and hem, no cable motifs, no logos; soft matte knit appearance.
View: a close detail of the folded turtleneck collar and the vertical rib structure.
Square 1600 x 1600 px; camera about 30–40 cm from the fabric; readable depth of field; soft raking side light that reveals texture and stitching; the garment fills the frame.
Every button, seam, stripe and color must match the master exactly. No invented labels, tags or care symbols.
Avoid: any text, letters, numbers, logos, brand marks, watermarks, signage, price tags or labels; distorted hands or extra fingers; plastic-looking fabric; oversaturated color; heavy retouching; busy backgrounds; collages, grids or split frames.
```

**تفصيل 2 — 1600×1600** · `knit-cream-cuff-hem.jpg`

```text
Use the attached APPROVED FRONT MASTER (knit-cream-front.png) as the exact identity reference.
Product identity: a men's warm cream rib-knit turtleneck sweater with long sleeves, ribbed cuffs and hem, no cable motifs, no logos; soft matte knit appearance.
View: a close detail of the ribbed cuff resting on the ribbed hem.
Square 1600 x 1600 px; camera about 30–40 cm from the fabric; readable depth of field; soft raking side light that reveals texture and stitching; the garment fills the frame.
Every button, seam, stripe and color must match the master exactly. No invented labels, tags or care symbols.
Avoid: any text, letters, numbers, logos, brand marks, watermarks, signage, price tags or labels; distorted hands or extra fingers; plastic-looking fabric; oversaturated color; heavy retouching; busy backgrounds; collages, grids or split frames.
```

**على الموديل — 1600×2400** · `knit-cream-on-model.jpg`

```text
Use the attached APPROVED FRONT MASTER (knit-cream-front.png) as the exact clothing reference. Do not redesign the garment.
Product identity: a men's warm cream rib-knit turtleneck sweater with long sleeves, ribbed cuffs and hem, no cable motifs, no logos; soft matte knit appearance.
Scene: An adult man around 30 against a warm beige studio backdrop, the sweater worn with charcoal trousers, one relaxed hand at the chest.
Framing: full length or three-quarter length, 1600 x 2400 px portrait; the garment completely readable.
House style: quiet premium editorial for Madar, a men's and children's clothing label. Warm neutral palette of limestone, sand, camel, taupe and soft ink; soft directional natural light; matte, believable fabric texture; calm composition with generous negative space; natural skin texture; relaxed, dignified posture.
If a reference photograph is attached, use it only for mood, light and composition; never copy the person, face, exact scene or any third-party element.
Avoid: any text, letters, numbers, logos, brand marks, watermarks, signage, price tags or labels; distorted hands or extra fingers; plastic-looking fabric; oversaturated color; heavy retouching; busy backgrounds; collages, grids or split frames.
```

### 7.4 `coat-black` — معطف طويل أسود (ID 93)

- **الريفرنس:** U11 `public/images/city-edit.jpg` (مرجع مزاج وتصميم عام)
- **الملفات:** `coat-black-front.png`، `coat-black-back.png`، `coat-black-collar.jpg`، `coat-black-pocket-closure.jpg`، `coat-black-on-model.jpg`

**الأمام — 1600×2400 PNG شفاف** · `coat-black-front.png`

```text
Create an original product image for Madar.
Product identity: a men's long matte black single-breasted overcoat reaching just below the knee, notched lapels, exactly three dark front buttons, two welt pockets, plain cuffs, clearly an outer coat and not a suit jacket.
View: straight-on full FRONT on an invisible (ghost) mannequin; the whole garment visible from collar to hem, including both sleeves.
Canvas: 1600 x 2400 px portrait; garment centered with an 8–10 percent clear margin on every side.
Background: a genuine transparent alpha channel (PNG). No white matte, no checkerboard pattern, no floor shadow, no hanger, no visible mannequin.
Light: soft, even studio light with gentle shape; true-to-life color; matte fabric texture.
This image is the DESIGN MASTER. Keep the construction simple and unambiguous so every later view can match it exactly.
Avoid: any text, letters, numbers, logos, brand marks, watermarks, signage, price tags or labels; distorted hands or extra fingers; plastic-looking fabric; oversaturated color; heavy retouching; busy backgrounds; collages, grids or split frames.
```

**الظهر — 1600×2400 PNG شفاف** · `coat-black-back.png`

```text
Use the attached APPROVED FRONT MASTER (coat-black-front.png) as the exact identity reference. Do not redesign the garment.
Product identity: a men's long matte black single-breasted overcoat reaching just below the knee, notched lapels, exactly three dark front buttons, two welt pockets, plain cuffs, clearly an outer coat and not a suit jacket.
View: straight-on full BACK on an invisible mannequin, with identical scale, centering and margins to the front master so the two images align when the customer flips between them.
Back construction (a concept design decision): one center back seam and a single center vent.
Canvas: 1600 x 2400 px; genuine transparent PNG background; no shadow, no hanger.
Avoid: any text, letters, numbers, logos, brand marks, watermarks, signage, price tags or labels; distorted hands or extra fingers; plastic-looking fabric; oversaturated color; heavy retouching; busy backgrounds; collages, grids or split frames.
```

**تفصيل 1 — 1600×1600** · `coat-black-collar.jpg`

```text
Use the attached APPROVED FRONT MASTER (coat-black-front.png) as the exact identity reference.
Product identity: a men's long matte black single-breasted overcoat reaching just below the knee, notched lapels, exactly three dark front buttons, two welt pockets, plain cuffs, clearly an outer coat and not a suit jacket.
View: a close detail of the lapel, collar and shoulder line.
Square 1600 x 1600 px; camera about 30–40 cm from the fabric; readable depth of field; soft raking side light that reveals texture and stitching; the garment fills the frame.
Every button, seam, stripe and color must match the master exactly. No invented labels, tags or care symbols.
Avoid: any text, letters, numbers, logos, brand marks, watermarks, signage, price tags or labels; distorted hands or extra fingers; plastic-looking fabric; oversaturated color; heavy retouching; busy backgrounds; collages, grids or split frames.
```

**تفصيل 2 — 1600×1600** · `coat-black-pocket-closure.jpg`

```text
Use the attached APPROVED FRONT MASTER (coat-black-front.png) as the exact identity reference.
Product identity: a men's long matte black single-breasted overcoat reaching just below the knee, notched lapels, exactly three dark front buttons, two welt pockets, plain cuffs, clearly an outer coat and not a suit jacket.
View: a close detail of the welt pocket and the front button closure.
Square 1600 x 1600 px; camera about 30–40 cm from the fabric; readable depth of field; soft raking side light that reveals texture and stitching; the garment fills the frame.
Every button, seam, stripe and color must match the master exactly. No invented labels, tags or care symbols.
Avoid: any text, letters, numbers, logos, brand marks, watermarks, signage, price tags or labels; distorted hands or extra fingers; plastic-looking fabric; oversaturated color; heavy retouching; busy backgrounds; collages, grids or split frames.
```

**على الموديل — 1600×2400** · `coat-black-on-model.jpg`

```text
Use the attached APPROVED FRONT MASTER (coat-black-front.png) as the exact clothing reference. Do not redesign the garment.
Product identity: a men's long matte black single-breasted overcoat reaching just below the knee, notched lapels, exactly three dark front buttons, two welt pockets, plain cuffs, clearly an outer coat and not a suit jacket.
Scene: An adult man around 35 walks slowly along a stone-paved city street on an overcast morning, the coat worn closed over a dark knit, carrying nothing branded.
Framing: full length or three-quarter length, 1600 x 2400 px portrait; the garment completely readable.
House style: quiet premium editorial for Madar, a men's and children's clothing label. Warm neutral palette of limestone, sand, camel, taupe and soft ink; soft directional natural light; matte, believable fabric texture; calm composition with generous negative space; natural skin texture; relaxed, dignified posture.
If a reference photograph is attached, use it only for mood, light and composition; never copy the person, face, exact scene or any third-party element.
Avoid: any text, letters, numbers, logos, brand marks, watermarks, signage, price tags or labels; distorted hands or extra fingers; plastic-looking fabric; oversaturated color; heavy retouching; busy backgrounds; collages, grids or split frames.
```

### 7.5 `overshirt` — أوفرشيرت قطن مبروم (ID 128)

- **الريفرنس:** من الصفر — ريفرنس إضاءة/مزاج فقط: U10 `public/images/madar-source/ce640db2e5-madar-m-white-wall.jpg`
- **الملفات:** `overshirt-front.png`، `overshirt-back.png`، `overshirt-collar-placket.jpg`، `overshirt-pocket-cuff.jpg`، `overshirt-on-model.jpg`

**الأمام — 1600×2400 PNG شفاف** · `overshirt-front.png`

```text
Create an original product image for Madar.
Product identity: a men's warm taupe overshirt in a substantial twill-look fabric, pointed collar, full button front with six matte buttons, two chest patch pockets with button flaps, buttoned cuffs, straight hem.
View: straight-on full FRONT on an invisible (ghost) mannequin; the whole garment visible from collar to hem, including both sleeves.
Canvas: 1600 x 2400 px portrait; garment centered with an 8–10 percent clear margin on every side.
Background: a genuine transparent alpha channel (PNG). No white matte, no checkerboard pattern, no floor shadow, no hanger, no visible mannequin.
Light: soft, even studio light with gentle shape; true-to-life color; matte fabric texture.
This image is the DESIGN MASTER. Keep the construction simple and unambiguous so every later view can match it exactly.
Avoid: any text, letters, numbers, logos, brand marks, watermarks, signage, price tags or labels; distorted hands or extra fingers; plastic-looking fabric; oversaturated color; heavy retouching; busy backgrounds; collages, grids or split frames.
```

**الظهر — 1600×2400 PNG شفاف** · `overshirt-back.png`

```text
Use the attached APPROVED FRONT MASTER (overshirt-front.png) as the exact identity reference. Do not redesign the garment.
Product identity: a men's warm taupe overshirt in a substantial twill-look fabric, pointed collar, full button front with six matte buttons, two chest patch pockets with button flaps, buttoned cuffs, straight hem.
View: straight-on full BACK on an invisible mannequin, with identical scale, centering and margins to the front master so the two images align when the customer flips between them.
Back construction (a concept design decision): a plain back yoke across the shoulders, no pleat.
Canvas: 1600 x 2400 px; genuine transparent PNG background; no shadow, no hanger.
Avoid: any text, letters, numbers, logos, brand marks, watermarks, signage, price tags or labels; distorted hands or extra fingers; plastic-looking fabric; oversaturated color; heavy retouching; busy backgrounds; collages, grids or split frames.
```

**تفصيل 1 — 1600×1600** · `overshirt-collar-placket.jpg`

```text
Use the attached APPROVED FRONT MASTER (overshirt-front.png) as the exact identity reference.
Product identity: a men's warm taupe overshirt in a substantial twill-look fabric, pointed collar, full button front with six matte buttons, two chest patch pockets with button flaps, buttoned cuffs, straight hem.
View: a close detail of the collar and the top of the button placket.
Square 1600 x 1600 px; camera about 30–40 cm from the fabric; readable depth of field; soft raking side light that reveals texture and stitching; the garment fills the frame.
Every button, seam, stripe and color must match the master exactly. No invented labels, tags or care symbols.
Avoid: any text, letters, numbers, logos, brand marks, watermarks, signage, price tags or labels; distorted hands or extra fingers; plastic-looking fabric; oversaturated color; heavy retouching; busy backgrounds; collages, grids or split frames.
```

**تفصيل 2 — 1600×1600** · `overshirt-pocket-cuff.jpg`

```text
Use the attached APPROVED FRONT MASTER (overshirt-front.png) as the exact identity reference.
Product identity: a men's warm taupe overshirt in a substantial twill-look fabric, pointed collar, full button front with six matte buttons, two chest patch pockets with button flaps, buttoned cuffs, straight hem.
View: a close detail of one chest pocket flap with its button, and a buttoned cuff.
Square 1600 x 1600 px; camera about 30–40 cm from the fabric; readable depth of field; soft raking side light that reveals texture and stitching; the garment fills the frame.
Every button, seam, stripe and color must match the master exactly. No invented labels, tags or care symbols.
Avoid: any text, letters, numbers, logos, brand marks, watermarks, signage, price tags or labels; distorted hands or extra fingers; plastic-looking fabric; oversaturated color; heavy retouching; busy backgrounds; collages, grids or split frames.
```

**على الموديل — 1600×2400** · `overshirt-on-model.jpg`

```text
Use the attached APPROVED FRONT MASTER (overshirt-front.png) as the exact clothing reference. Do not redesign the garment.
Product identity: a men's warm taupe overshirt in a substantial twill-look fabric, pointed collar, full button front with six matte buttons, two chest patch pockets with button flaps, buttoned cuffs, straight hem.
Scene: An adult man around 30 against a pale textured concrete wall, the overshirt worn open over a plain white T-shirt with stone-colored trousers.
Framing: full length or three-quarter length, 1600 x 2400 px portrait; the garment completely readable.
House style: quiet premium editorial for Madar, a men's and children's clothing label. Warm neutral palette of limestone, sand, camel, taupe and soft ink; soft directional natural light; matte, believable fabric texture; calm composition with generous negative space; natural skin texture; relaxed, dignified posture.
If a reference photograph is attached, use it only for mood, light and composition; never copy the person, face, exact scene or any third-party element.
Avoid: any text, letters, numbers, logos, brand marks, watermarks, signage, price tags or labels; distorted hands or extra fingers; plastic-looking fabric; oversaturated color; heavy retouching; busy backgrounds; collages, grids or split frames.
```

### 7.6 `shirt-striped` — قميص مقلّم بقصّة واسعة (ID 118)

- **الريفرنس:** من الصفر — ريفرنس إضاءة/مزاج فقط: U17 `public/images/madar-source/f4844d09e6-madar-m-stripe.jpg`
- **الملفات:** `shirt-striped-front.png`، `shirt-striped-back.png`، `shirt-striped-collar-stripes.jpg`، `shirt-striped-cuff-button.jpg`، `shirt-striped-on-model.jpg`

**الأمام — 1600×2400 PNG شفاف** · `shirt-striped-front.png`

```text
Create an original product image for Madar.
Product identity: a men's relaxed-fit long-sleeve shirt, off-white with fine evenly spaced navy vertical stripes, pointed collar, button front, button cuffs, gently curved hem.
View: straight-on full FRONT on an invisible (ghost) mannequin; the whole garment visible from collar to hem, including both sleeves.
Canvas: 1600 x 2400 px portrait; garment centered with an 8–10 percent clear margin on every side.
Background: a genuine transparent alpha channel (PNG). No white matte, no checkerboard pattern, no floor shadow, no hanger, no visible mannequin.
Light: soft, even studio light with gentle shape; true-to-life color; matte fabric texture.
This image is the DESIGN MASTER. Keep the construction simple and unambiguous so every later view can match it exactly.
Avoid: any text, letters, numbers, logos, brand marks, watermarks, signage, price tags or labels; distorted hands or extra fingers; plastic-looking fabric; oversaturated color; heavy retouching; busy backgrounds; collages, grids or split frames.
```

**الظهر — 1600×2400 PNG شفاف** · `shirt-striped-back.png`

```text
Use the attached APPROVED FRONT MASTER (shirt-striped-front.png) as the exact identity reference. Do not redesign the garment.
Product identity: a men's relaxed-fit long-sleeve shirt, off-white with fine evenly spaced navy vertical stripes, pointed collar, button front, button cuffs, gently curved hem.
View: straight-on full BACK on an invisible mannequin, with identical scale, centering and margins to the front master so the two images align when the customer flips between them.
Back construction (a concept design decision): a back yoke with a small center box pleat; stripes stay aligned across the yoke seam.
Canvas: 1600 x 2400 px; genuine transparent PNG background; no shadow, no hanger.
Avoid: any text, letters, numbers, logos, brand marks, watermarks, signage, price tags or labels; distorted hands or extra fingers; plastic-looking fabric; oversaturated color; heavy retouching; busy backgrounds; collages, grids or split frames.
```

**تفصيل 1 — 1600×1600** · `shirt-striped-collar-stripes.jpg`

```text
Use the attached APPROVED FRONT MASTER (shirt-striped-front.png) as the exact identity reference.
Product identity: a men's relaxed-fit long-sleeve shirt, off-white with fine evenly spaced navy vertical stripes, pointed collar, button front, button cuffs, gently curved hem.
View: a close detail of the collar and the alignment of the stripes at the placket.
Square 1600 x 1600 px; camera about 30–40 cm from the fabric; readable depth of field; soft raking side light that reveals texture and stitching; the garment fills the frame.
Every button, seam, stripe and color must match the master exactly. No invented labels, tags or care symbols.
Avoid: any text, letters, numbers, logos, brand marks, watermarks, signage, price tags or labels; distorted hands or extra fingers; plastic-looking fabric; oversaturated color; heavy retouching; busy backgrounds; collages, grids or split frames.
```

**تفصيل 2 — 1600×1600** · `shirt-striped-cuff-button.jpg`

```text
Use the attached APPROVED FRONT MASTER (shirt-striped-front.png) as the exact identity reference.
Product identity: a men's relaxed-fit long-sleeve shirt, off-white with fine evenly spaced navy vertical stripes, pointed collar, button front, button cuffs, gently curved hem.
View: a close detail of the buttoned cuff and its stripe alignment.
Square 1600 x 1600 px; camera about 30–40 cm from the fabric; readable depth of field; soft raking side light that reveals texture and stitching; the garment fills the frame.
Every button, seam, stripe and color must match the master exactly. No invented labels, tags or care symbols.
Avoid: any text, letters, numbers, logos, brand marks, watermarks, signage, price tags or labels; distorted hands or extra fingers; plastic-looking fabric; oversaturated color; heavy retouching; busy backgrounds; collages, grids or split frames.
```

**على الموديل — 1600×2400** · `shirt-striped-on-model.jpg`

```text
Use the attached APPROVED FRONT MASTER (shirt-striped-front.png) as the exact clothing reference. Do not redesign the garment.
Product identity: a men's relaxed-fit long-sleeve shirt, off-white with fine evenly spaced navy vertical stripes, pointed collar, button front, button cuffs, gently curved hem.
Scene: An adult man around 30 in a sunlit pale interior, the shirt worn untucked with sleeves slightly rolled, with stone trousers.
Framing: full length or three-quarter length, 1600 x 2400 px portrait; the garment completely readable.
House style: quiet premium editorial for Madar, a men's and children's clothing label. Warm neutral palette of limestone, sand, camel, taupe and soft ink; soft directional natural light; matte, believable fabric texture; calm composition with generous negative space; natural skin texture; relaxed, dignified posture.
If a reference photograph is attached, use it only for mood, light and composition; never copy the person, face, exact scene or any third-party element.
Avoid: any text, letters, numbers, logos, brand marks, watermarks, signage, price tags or labels; distorted hands or extra fingers; plastic-looking fabric; oversaturated color; heavy retouching; busy backgrounds; collages, grids or split frames.
```

### 7.7 `kids-sweatshirt-striped` — سويتشيرت أطفال بخطوط (ID 111)

- **الريفرنس:** من الصفر — ريفرنس إضاءة/مزاج فقط: U09 `public/images/madar-source/7c50bcdf3e-madar-k-arms.jpg`
- **الملفات:** `kids-sweatshirt-striped-front.png`، `kids-sweatshirt-striped-back.png`، `kids-sweatshirt-striped-collar-stripes.jpg`، `kids-sweatshirt-striped-cuff-hem.jpg`، `kids-sweatshirt-striped-on-model.jpg`

**الأمام — 1600×2400 PNG شفاف** · `kids-sweatshirt-striped-front.png`

```text
Create an original product image for Madar.
Product identity: a children's long-sleeve crewneck sweatshirt with broad muted navy and cream horizontal stripes, ribbed collar, cuffs and hem; no hood, no zipper, no drawstrings.
View: straight-on full FRONT on an invisible (ghost) mannequin; the whole garment visible from collar to hem, including both sleeves.
Canvas: 1600 x 2400 px portrait; garment centered with an 8–10 percent clear margin on every side.
Background: a genuine transparent alpha channel (PNG). No white matte, no checkerboard pattern, no floor shadow, no hanger, no visible mannequin.
Light: soft, even studio light with gentle shape; true-to-life color; matte fabric texture.
This image is the DESIGN MASTER. Keep the construction simple and unambiguous so every later view can match it exactly.
Avoid: any text, letters, numbers, logos, brand marks, watermarks, signage, price tags or labels; distorted hands or extra fingers; plastic-looking fabric; oversaturated color; heavy retouching; busy backgrounds; collages, grids or split frames.
```

**الظهر — 1600×2400 PNG شفاف** · `kids-sweatshirt-striped-back.png`

```text
Use the attached APPROVED FRONT MASTER (kids-sweatshirt-striped-front.png) as the exact identity reference. Do not redesign the garment.
Product identity: a children's long-sleeve crewneck sweatshirt with broad muted navy and cream horizontal stripes, ribbed collar, cuffs and hem; no hood, no zipper, no drawstrings.
View: straight-on full BACK on an invisible mannequin, with identical scale, centering and margins to the front master so the two images align when the customer flips between them.
Back construction (a concept design decision): plain back with stripes continuing at exactly the same spacing as the front.
Canvas: 1600 x 2400 px; genuine transparent PNG background; no shadow, no hanger.
Avoid: any text, letters, numbers, logos, brand marks, watermarks, signage, price tags or labels; distorted hands or extra fingers; plastic-looking fabric; oversaturated color; heavy retouching; busy backgrounds; collages, grids or split frames.
```

**تفصيل 1 — 1600×1600** · `kids-sweatshirt-striped-collar-stripes.jpg`

```text
Use the attached APPROVED FRONT MASTER (kids-sweatshirt-striped-front.png) as the exact identity reference.
Product identity: a children's long-sleeve crewneck sweatshirt with broad muted navy and cream horizontal stripes, ribbed collar, cuffs and hem; no hood, no zipper, no drawstrings.
View: a close detail of the ribbed collar and the stripe spacing.
Square 1600 x 1600 px; camera about 30–40 cm from the fabric; readable depth of field; soft raking side light that reveals texture and stitching; the garment fills the frame.
Every button, seam, stripe and color must match the master exactly. No invented labels, tags or care symbols.
Avoid: any text, letters, numbers, logos, brand marks, watermarks, signage, price tags or labels; distorted hands or extra fingers; plastic-looking fabric; oversaturated color; heavy retouching; busy backgrounds; collages, grids or split frames.
```

**تفصيل 2 — 1600×1600** · `kids-sweatshirt-striped-cuff-hem.jpg`

```text
Use the attached APPROVED FRONT MASTER (kids-sweatshirt-striped-front.png) as the exact identity reference.
Product identity: a children's long-sleeve crewneck sweatshirt with broad muted navy and cream horizontal stripes, ribbed collar, cuffs and hem; no hood, no zipper, no drawstrings.
View: a close detail of the ribbed cuff and hem.
Square 1600 x 1600 px; camera about 30–40 cm from the fabric; readable depth of field; soft raking side light that reveals texture and stitching; the garment fills the frame.
Every button, seam, stripe and color must match the master exactly. No invented labels, tags or care symbols.
Avoid: any text, letters, numbers, logos, brand marks, watermarks, signage, price tags or labels; distorted hands or extra fingers; plastic-looking fabric; oversaturated color; heavy retouching; busy backgrounds; collages, grids or split frames.
```

**على الموديل — 1600×2400** · `kids-sweatshirt-striped-on-model.jpg`

```text
Use the attached APPROVED FRONT MASTER (kids-sweatshirt-striped-front.png) as the exact clothing reference. Do not redesign the garment.
Product identity: a children's long-sleeve crewneck sweatshirt with broad muted navy and cream horizontal stripes, ribbed collar, cuffs and hem; no hood, no zipper, no drawstrings.
Scene: A child sits on a low wooden bench in a softly lit neutral living room, wearing the sweatshirt with navy trousers.
Framing: full length or three-quarter length, 1600 x 2400 px portrait; the garment completely readable.
House style: quiet premium editorial for Madar, a men's and children's clothing label. Warm neutral palette of limestone, sand, camel, taupe and soft ink; soft directional natural light; matte, believable fabric texture; calm composition with generous negative space; natural skin texture; relaxed, dignified posture.
The child appears 6–8 years old, in modest, age-appropriate everyday clothing, with a natural relaxed expression, in a calm and safe setting; no adult styling, no makeup, no posed adult attitude.
If a reference photograph is attached, use it only for mood, light and composition; never copy the person, face, exact scene or any third-party element.
Avoid: any text, letters, numbers, logos, brand marks, watermarks, signage, price tags or labels; distorted hands or extra fingers; plastic-looking fabric; oversaturated color; heavy retouching; busy backgrounds; collages, grids or split frames.
```

### 7.8 `kids-tee-striped` — تيشيرت أطفال مقلّم فاتح (ID 105)

- **الريفرنس:** من الصفر — ريفرنس إضاءة/مزاج فقط: U16 `public/images/madar-source/c550b0b972-madar-k-curly.jpg`
- **الملفات:** `kids-tee-striped-front.png`، `kids-tee-striped-back.png`، `kids-tee-striped-neck-stripes.jpg`، `kids-tee-striped-sleeve-hem.jpg`، `kids-tee-striped-on-model.jpg`

**الأمام — 1600×2400 PNG شفاف** · `kids-tee-striped-front.png`

```text
Create an original product image for Madar.
Product identity: a children's light cream short-sleeve crewneck T-shirt with narrow muted blue horizontal stripes, simple straight hem, no buttons, no hood.
View: straight-on full FRONT on an invisible (ghost) mannequin; the whole garment visible from collar to hem, including both sleeves.
Canvas: 1600 x 2400 px portrait; garment centered with an 8–10 percent clear margin on every side.
Background: a genuine transparent alpha channel (PNG). No white matte, no checkerboard pattern, no floor shadow, no hanger, no visible mannequin.
Light: soft, even studio light with gentle shape; true-to-life color; matte fabric texture.
This image is the DESIGN MASTER. Keep the construction simple and unambiguous so every later view can match it exactly.
Avoid: any text, letters, numbers, logos, brand marks, watermarks, signage, price tags or labels; distorted hands or extra fingers; plastic-looking fabric; oversaturated color; heavy retouching; busy backgrounds; collages, grids or split frames.
```

**الظهر — 1600×2400 PNG شفاف** · `kids-tee-striped-back.png`

```text
Use the attached APPROVED FRONT MASTER (kids-tee-striped-front.png) as the exact identity reference. Do not redesign the garment.
Product identity: a children's light cream short-sleeve crewneck T-shirt with narrow muted blue horizontal stripes, simple straight hem, no buttons, no hood.
View: straight-on full BACK on an invisible mannequin, with identical scale, centering and margins to the front master so the two images align when the customer flips between them.
Back construction (a concept design decision): plain back with stripes aligned to the front at the side seams.
Canvas: 1600 x 2400 px; genuine transparent PNG background; no shadow, no hanger.
Avoid: any text, letters, numbers, logos, brand marks, watermarks, signage, price tags or labels; distorted hands or extra fingers; plastic-looking fabric; oversaturated color; heavy retouching; busy backgrounds; collages, grids or split frames.
```

**تفصيل 1 — 1600×1600** · `kids-tee-striped-neck-stripes.jpg`

```text
Use the attached APPROVED FRONT MASTER (kids-tee-striped-front.png) as the exact identity reference.
Product identity: a children's light cream short-sleeve crewneck T-shirt with narrow muted blue horizontal stripes, simple straight hem, no buttons, no hood.
View: a close detail of the neckline rib and the stripe rhythm.
Square 1600 x 1600 px; camera about 30–40 cm from the fabric; readable depth of field; soft raking side light that reveals texture and stitching; the garment fills the frame.
Every button, seam, stripe and color must match the master exactly. No invented labels, tags or care symbols.
Avoid: any text, letters, numbers, logos, brand marks, watermarks, signage, price tags or labels; distorted hands or extra fingers; plastic-looking fabric; oversaturated color; heavy retouching; busy backgrounds; collages, grids or split frames.
```

**تفصيل 2 — 1600×1600** · `kids-tee-striped-sleeve-hem.jpg`

```text
Use the attached APPROVED FRONT MASTER (kids-tee-striped-front.png) as the exact identity reference.
Product identity: a children's light cream short-sleeve crewneck T-shirt with narrow muted blue horizontal stripes, simple straight hem, no buttons, no hood.
View: a close detail of the sleeve hem stitching.
Square 1600 x 1600 px; camera about 30–40 cm from the fabric; readable depth of field; soft raking side light that reveals texture and stitching; the garment fills the frame.
Every button, seam, stripe and color must match the master exactly. No invented labels, tags or care symbols.
Avoid: any text, letters, numbers, logos, brand marks, watermarks, signage, price tags or labels; distorted hands or extra fingers; plastic-looking fabric; oversaturated color; heavy retouching; busy backgrounds; collages, grids or split frames.
```

**على الموديل — 1600×2400** · `kids-tee-striped-on-model.jpg`

```text
Use the attached APPROVED FRONT MASTER (kids-tee-striped-front.png) as the exact clothing reference. Do not redesign the garment.
Product identity: a children's light cream short-sleeve crewneck T-shirt with narrow muted blue horizontal stripes, simple straight hem, no buttons, no hood.
Scene: A child stands in a bright pale-stone courtyard, wearing the T-shirt with cream shorts.
Framing: full length or three-quarter length, 1600 x 2400 px portrait; the garment completely readable.
House style: quiet premium editorial for Madar, a men's and children's clothing label. Warm neutral palette of limestone, sand, camel, taupe and soft ink; soft directional natural light; matte, believable fabric texture; calm composition with generous negative space; natural skin texture; relaxed, dignified posture.
The child appears 4–6 years old, in modest, age-appropriate everyday clothing, with a natural relaxed expression, in a calm and safe setting; no adult styling, no makeup, no posed adult attitude.
If a reference photograph is attached, use it only for mood, light and composition; never copy the person, face, exact scene or any third-party element.
Avoid: any text, letters, numbers, logos, brand marks, watermarks, signage, price tags or labels; distorted hands or extra fingers; plastic-looking fabric; oversaturated color; heavy retouching; busy backgrounds; collages, grids or split frames.
```

### 7.9 `kids-shirt-brown` — قميص أطفال بني (ID 134)

- **الريفرنس:** من الصفر — ريفرنس إضاءة/مزاج فقط: U03 `public/images/kids-adventure.jpg`
- **الملفات:** `kids-shirt-brown-front.png`، `kids-shirt-brown-back.png`، `kids-shirt-brown-collar-buttons.jpg`، `kids-shirt-brown-pocket-cuff.jpg`، `kids-shirt-brown-on-model.jpg`

**الأمام — 1600×2400 PNG شفاف** · `kids-shirt-brown-front.png`

```text
Create an original product image for Madar.
Product identity: a children's warm medium-brown long-sleeve button-front shirt in a soft woven fabric, pointed collar, one plain chest patch pocket, simple button cuffs; not a padded jacket.
View: straight-on full FRONT on an invisible (ghost) mannequin; the whole garment visible from collar to hem, including both sleeves.
Canvas: 1600 x 2400 px portrait; garment centered with an 8–10 percent clear margin on every side.
Background: a genuine transparent alpha channel (PNG). No white matte, no checkerboard pattern, no floor shadow, no hanger, no visible mannequin.
Light: soft, even studio light with gentle shape; true-to-life color; matte fabric texture.
This image is the DESIGN MASTER. Keep the construction simple and unambiguous so every later view can match it exactly.
Avoid: any text, letters, numbers, logos, brand marks, watermarks, signage, price tags or labels; distorted hands or extra fingers; plastic-looking fabric; oversaturated color; heavy retouching; busy backgrounds; collages, grids or split frames.
```

**الظهر — 1600×2400 PNG شفاف** · `kids-shirt-brown-back.png`

```text
Use the attached APPROVED FRONT MASTER (kids-shirt-brown-front.png) as the exact identity reference. Do not redesign the garment.
Product identity: a children's warm medium-brown long-sleeve button-front shirt in a soft woven fabric, pointed collar, one plain chest patch pocket, simple button cuffs; not a padded jacket.
View: straight-on full BACK on an invisible mannequin, with identical scale, centering and margins to the front master so the two images align when the customer flips between them.
Back construction (a concept design decision): a plain back yoke, no pleat.
Canvas: 1600 x 2400 px; genuine transparent PNG background; no shadow, no hanger.
Avoid: any text, letters, numbers, logos, brand marks, watermarks, signage, price tags or labels; distorted hands or extra fingers; plastic-looking fabric; oversaturated color; heavy retouching; busy backgrounds; collages, grids or split frames.
```

**تفصيل 1 — 1600×1600** · `kids-shirt-brown-collar-buttons.jpg`

```text
Use the attached APPROVED FRONT MASTER (kids-shirt-brown-front.png) as the exact identity reference.
Product identity: a children's warm medium-brown long-sleeve button-front shirt in a soft woven fabric, pointed collar, one plain chest patch pocket, simple button cuffs; not a padded jacket.
View: a close detail of the collar and the top buttons.
Square 1600 x 1600 px; camera about 30–40 cm from the fabric; readable depth of field; soft raking side light that reveals texture and stitching; the garment fills the frame.
Every button, seam, stripe and color must match the master exactly. No invented labels, tags or care symbols.
Avoid: any text, letters, numbers, logos, brand marks, watermarks, signage, price tags or labels; distorted hands or extra fingers; plastic-looking fabric; oversaturated color; heavy retouching; busy backgrounds; collages, grids or split frames.
```

**تفصيل 2 — 1600×1600** · `kids-shirt-brown-pocket-cuff.jpg`

```text
Use the attached APPROVED FRONT MASTER (kids-shirt-brown-front.png) as the exact identity reference.
Product identity: a children's warm medium-brown long-sleeve button-front shirt in a soft woven fabric, pointed collar, one plain chest patch pocket, simple button cuffs; not a padded jacket.
View: a close detail of the chest pocket and a buttoned cuff.
Square 1600 x 1600 px; camera about 30–40 cm from the fabric; readable depth of field; soft raking side light that reveals texture and stitching; the garment fills the frame.
Every button, seam, stripe and color must match the master exactly. No invented labels, tags or care symbols.
Avoid: any text, letters, numbers, logos, brand marks, watermarks, signage, price tags or labels; distorted hands or extra fingers; plastic-looking fabric; oversaturated color; heavy retouching; busy backgrounds; collages, grids or split frames.
```

**على الموديل — 1600×2400** · `kids-shirt-brown-on-model.jpg`

```text
Use the attached APPROVED FRONT MASTER (kids-shirt-brown-front.png) as the exact clothing reference. Do not redesign the garment.
Product identity: a children's warm medium-brown long-sleeve button-front shirt in a soft woven fabric, pointed collar, one plain chest patch pocket, simple button cuffs; not a padded jacket.
Scene: A child walks along an autumn park path with fallen leaves in soft daylight, wearing the shirt with navy trousers.
Framing: full length or three-quarter length, 1600 x 2400 px portrait; the garment completely readable.
House style: quiet premium editorial for Madar, a men's and children's clothing label. Warm neutral palette of limestone, sand, camel, taupe and soft ink; soft directional natural light; matte, believable fabric texture; calm composition with generous negative space; natural skin texture; relaxed, dignified posture.
The child appears 7–9 years old, in modest, age-appropriate everyday clothing, with a natural relaxed expression, in a calm and safe setting; no adult styling, no makeup, no posed adult attitude.
If a reference photograph is attached, use it only for mood, light and composition; never copy the person, face, exact scene or any third-party element.
Avoid: any text, letters, numbers, logos, brand marks, watermarks, signage, price tags or labels; distorted hands or extra fingers; plastic-looking fabric; oversaturated color; heavy retouching; busy backgrounds; collages, grids or split frames.
```

### 7.10 `kids-polo-striped` — بولو أطفال مقلّم (ID 123)

- **الريفرنس:** من الصفر — ريفرنس إضاءة/مزاج فقط: U04 `public/images/kids-adventure-alt.jpg`
- **الملفات:** `kids-polo-striped-front.png`، `kids-polo-striped-back.png`، `kids-polo-striped-collar-placket.jpg`، `kids-polo-striped-fabric-stripes.jpg`، `kids-polo-striped-on-model.jpg`

**الأمام — 1600×2400 PNG شفاف** · `kids-polo-striped-front.png`

```text
Create an original product image for Madar.
Product identity: a children's short-sleeve polo shirt with muted navy-and-cream horizontal stripes, plain cream polo collar, short two-button placket; no padding, no full opening.
View: straight-on full FRONT on an invisible (ghost) mannequin; the whole garment visible from collar to hem, including both sleeves.
Canvas: 1600 x 2400 px portrait; garment centered with an 8–10 percent clear margin on every side.
Background: a genuine transparent alpha channel (PNG). No white matte, no checkerboard pattern, no floor shadow, no hanger, no visible mannequin.
Light: soft, even studio light with gentle shape; true-to-life color; matte fabric texture.
This image is the DESIGN MASTER. Keep the construction simple and unambiguous so every later view can match it exactly.
Avoid: any text, letters, numbers, logos, brand marks, watermarks, signage, price tags or labels; distorted hands or extra fingers; plastic-looking fabric; oversaturated color; heavy retouching; busy backgrounds; collages, grids or split frames.
```

**الظهر — 1600×2400 PNG شفاف** · `kids-polo-striped-back.png`

```text
Use the attached APPROVED FRONT MASTER (kids-polo-striped-front.png) as the exact identity reference. Do not redesign the garment.
Product identity: a children's short-sleeve polo shirt with muted navy-and-cream horizontal stripes, plain cream polo collar, short two-button placket; no padding, no full opening.
View: straight-on full BACK on an invisible mannequin, with identical scale, centering and margins to the front master so the two images align when the customer flips between them.
Back construction (a concept design decision): plain back with stripes aligned to the front.
Canvas: 1600 x 2400 px; genuine transparent PNG background; no shadow, no hanger.
Avoid: any text, letters, numbers, logos, brand marks, watermarks, signage, price tags or labels; distorted hands or extra fingers; plastic-looking fabric; oversaturated color; heavy retouching; busy backgrounds; collages, grids or split frames.
```

**تفصيل 1 — 1600×1600** · `kids-polo-striped-collar-placket.jpg`

```text
Use the attached APPROVED FRONT MASTER (kids-polo-striped-front.png) as the exact identity reference.
Product identity: a children's short-sleeve polo shirt with muted navy-and-cream horizontal stripes, plain cream polo collar, short two-button placket; no padding, no full opening.
View: a close detail of the polo collar and the two-button placket.
Square 1600 x 1600 px; camera about 30–40 cm from the fabric; readable depth of field; soft raking side light that reveals texture and stitching; the garment fills the frame.
Every button, seam, stripe and color must match the master exactly. No invented labels, tags or care symbols.
Avoid: any text, letters, numbers, logos, brand marks, watermarks, signage, price tags or labels; distorted hands or extra fingers; plastic-looking fabric; oversaturated color; heavy retouching; busy backgrounds; collages, grids or split frames.
```

**تفصيل 2 — 1600×1600** · `kids-polo-striped-fabric-stripes.jpg`

```text
Use the attached APPROVED FRONT MASTER (kids-polo-striped-front.png) as the exact identity reference.
Product identity: a children's short-sleeve polo shirt with muted navy-and-cream horizontal stripes, plain cream polo collar, short two-button placket; no padding, no full opening.
View: a close detail of the soft pique-look fabric and the stripe edge.
Square 1600 x 1600 px; camera about 30–40 cm from the fabric; readable depth of field; soft raking side light that reveals texture and stitching; the garment fills the frame.
Every button, seam, stripe and color must match the master exactly. No invented labels, tags or care symbols.
Avoid: any text, letters, numbers, logos, brand marks, watermarks, signage, price tags or labels; distorted hands or extra fingers; plastic-looking fabric; oversaturated color; heavy retouching; busy backgrounds; collages, grids or split frames.
```

**على الموديل — 1600×2400** · `kids-polo-striped-on-model.jpg`

```text
Use the attached APPROVED FRONT MASTER (kids-polo-striped-front.png) as the exact clothing reference. Do not redesign the garment.
Product identity: a children's short-sleeve polo shirt with muted navy-and-cream horizontal stripes, plain cream polo collar, short two-button placket; no padding, no full opening.
Scene: A child stands at the edge of a garden lawn, wearing the polo with cream chinos.
Framing: full length or three-quarter length, 1600 x 2400 px portrait; the garment completely readable.
House style: quiet premium editorial for Madar, a men's and children's clothing label. Warm neutral palette of limestone, sand, camel, taupe and soft ink; soft directional natural light; matte, believable fabric texture; calm composition with generous negative space; natural skin texture; relaxed, dignified posture.
The child appears 5–7 years old, in modest, age-appropriate everyday clothing, with a natural relaxed expression, in a calm and safe setting; no adult styling, no makeup, no posed adult attitude.
If a reference photograph is attached, use it only for mood, light and composition; never copy the person, face, exact scene or any third-party element.
Avoid: any text, letters, numbers, logos, brand marks, watermarks, signage, price tags or labels; distorted hands or extra fingers; plastic-looking fabric; oversaturated color; heavy retouching; busy backgrounds; collages, grids or split frames.
```

## 8. قطع التنسيق — مطلوبة علشان «المدار» والإطلالات تكمل

الكتالوج الحالي مفيهوش بناطيل. «المدار» والإطلالات محتاجين قطع سفلية. **دي إضافة مقترحة:** لو عندك قطع حقيقية بنفس الفكرة، تتحول لمنتجات. لو لأ، تظهر كـ«قطع تنسيق» غير معروضة للبيع، أو نشيلها من الإطلالات.

### 8.1 `trouser-charcoal` — بنطلون رمادي فحمي (قطعة تنسيق)

- **الريفرنس:** من الصفر — بدون ريفرنس
- **الملفات:** `trouser-charcoal-front.png`، `trouser-charcoal-back.png`، `trouser-charcoal-waistband.jpg`

**الأمام — 1600×2400 PNG شفاف** · `trouser-charcoal-front.png`

```text
Create an original product image for Madar.
Product identity: men's charcoal tapered trousers in a fine wool-look fabric, flat front, slanted side pockets, clean hem.
View: straight-on full FRONT on an invisible (ghost) mannequin; the whole garment visible from collar to hem, including both sleeves.
Canvas: 1600 x 2400 px portrait; garment centered with an 8–10 percent clear margin on every side.
Background: a genuine transparent alpha channel (PNG). No white matte, no checkerboard pattern, no floor shadow, no hanger, no visible mannequin.
Light: soft, even studio light with gentle shape; true-to-life color; matte fabric texture.
This image is the DESIGN MASTER. Keep the construction simple and unambiguous so every later view can match it exactly.
Avoid: any text, letters, numbers, logos, brand marks, watermarks, signage, price tags or labels; distorted hands or extra fingers; plastic-looking fabric; oversaturated color; heavy retouching; busy backgrounds; collages, grids or split frames.
```

**الظهر — 1600×2400 PNG شفاف** · `trouser-charcoal-back.png`

```text
Use the attached APPROVED FRONT MASTER (trouser-charcoal-front.png) as the exact identity reference. Do not redesign the garment.
Product identity: men's charcoal tapered trousers in a fine wool-look fabric, flat front, slanted side pockets, clean hem.
View: straight-on full BACK on an invisible mannequin, with identical scale, centering and margins to the front master so the two images align when the customer flips between them.
Back construction (a concept design decision): two back welt pockets.
Canvas: 1600 x 2400 px; genuine transparent PNG background; no shadow, no hanger.
Avoid: any text, letters, numbers, logos, brand marks, watermarks, signage, price tags or labels; distorted hands or extra fingers; plastic-looking fabric; oversaturated color; heavy retouching; busy backgrounds; collages, grids or split frames.
```

**تفصيل — 1600×1600** · `trouser-charcoal-waistband.jpg`

```text
Use the attached APPROVED FRONT MASTER (trouser-charcoal-front.png) as the exact identity reference.
Product identity: men's charcoal tapered trousers in a fine wool-look fabric, flat front, slanted side pockets, clean hem.
View: a close detail of the waistband, button and side pocket edge.
Square 1600 x 1600 px; camera about 30–40 cm from the fabric; readable depth of field; soft raking side light that reveals texture and stitching; the garment fills the frame.
Every button, seam, stripe and color must match the master exactly. No invented labels, tags or care symbols.
Avoid: any text, letters, numbers, logos, brand marks, watermarks, signage, price tags or labels; distorted hands or extra fingers; plastic-looking fabric; oversaturated color; heavy retouching; busy backgrounds; collages, grids or split frames.
```

### 8.2 `trouser-stone` — تشينو بلون الحجر (قطعة تنسيق)

- **الريفرنس:** من الصفر — بدون ريفرنس
- **الملفات:** `trouser-stone-front.png`، `trouser-stone-back.png`، `trouser-stone-waistband.jpg`

**الأمام — 1600×2400 PNG شفاف** · `trouser-stone-front.png`

```text
Create an original product image for Madar.
Product identity: men's stone-colored straight-leg chinos, flat front, slanted side pockets.
View: straight-on full FRONT on an invisible (ghost) mannequin; the whole garment visible from collar to hem, including both sleeves.
Canvas: 1600 x 2400 px portrait; garment centered with an 8–10 percent clear margin on every side.
Background: a genuine transparent alpha channel (PNG). No white matte, no checkerboard pattern, no floor shadow, no hanger, no visible mannequin.
Light: soft, even studio light with gentle shape; true-to-life color; matte fabric texture.
This image is the DESIGN MASTER. Keep the construction simple and unambiguous so every later view can match it exactly.
Avoid: any text, letters, numbers, logos, brand marks, watermarks, signage, price tags or labels; distorted hands or extra fingers; plastic-looking fabric; oversaturated color; heavy retouching; busy backgrounds; collages, grids or split frames.
```

**الظهر — 1600×2400 PNG شفاف** · `trouser-stone-back.png`

```text
Use the attached APPROVED FRONT MASTER (trouser-stone-front.png) as the exact identity reference. Do not redesign the garment.
Product identity: men's stone-colored straight-leg chinos, flat front, slanted side pockets.
View: straight-on full BACK on an invisible mannequin, with identical scale, centering and margins to the front master so the two images align when the customer flips between them.
Back construction (a concept design decision): two back welt pockets with buttons.
Canvas: 1600 x 2400 px; genuine transparent PNG background; no shadow, no hanger.
Avoid: any text, letters, numbers, logos, brand marks, watermarks, signage, price tags or labels; distorted hands or extra fingers; plastic-looking fabric; oversaturated color; heavy retouching; busy backgrounds; collages, grids or split frames.
```

**تفصيل — 1600×1600** · `trouser-stone-waistband.jpg`

```text
Use the attached APPROVED FRONT MASTER (trouser-stone-front.png) as the exact identity reference.
Product identity: men's stone-colored straight-leg chinos, flat front, slanted side pockets.
View: a close detail of the waistband, button and pocket edge.
Square 1600 x 1600 px; camera about 30–40 cm from the fabric; readable depth of field; soft raking side light that reveals texture and stitching; the garment fills the frame.
Every button, seam, stripe and color must match the master exactly. No invented labels, tags or care symbols.
Avoid: any text, letters, numbers, logos, brand marks, watermarks, signage, price tags or labels; distorted hands or extra fingers; plastic-looking fabric; oversaturated color; heavy retouching; busy backgrounds; collages, grids or split frames.
```

### 8.3 `kids-chino-navy` — تشينو أطفال كحلي (قطعة تنسيق)

- **الريفرنس:** من الصفر — بدون ريفرنس
- **الملفات:** `kids-chino-navy-front.png`، `kids-chino-navy-back.png`، `kids-chino-navy-waistband.jpg`

**الأمام — 1600×2400 PNG شفاف** · `kids-chino-navy-front.png`

```text
Create an original product image for Madar.
Product identity: children's navy pull-on chinos with a flat front waistband, elastic back waist and side pockets.
View: straight-on full FRONT on an invisible (ghost) mannequin; the whole garment visible from collar to hem, including both sleeves.
Canvas: 1600 x 2400 px portrait; garment centered with an 8–10 percent clear margin on every side.
Background: a genuine transparent alpha channel (PNG). No white matte, no checkerboard pattern, no floor shadow, no hanger, no visible mannequin.
Light: soft, even studio light with gentle shape; true-to-life color; matte fabric texture.
This image is the DESIGN MASTER. Keep the construction simple and unambiguous so every later view can match it exactly.
Avoid: any text, letters, numbers, logos, brand marks, watermarks, signage, price tags or labels; distorted hands or extra fingers; plastic-looking fabric; oversaturated color; heavy retouching; busy backgrounds; collages, grids or split frames.
```

**الظهر — 1600×2400 PNG شفاف** · `kids-chino-navy-back.png`

```text
Use the attached APPROVED FRONT MASTER (kids-chino-navy-front.png) as the exact identity reference. Do not redesign the garment.
Product identity: children's navy pull-on chinos with a flat front waistband, elastic back waist and side pockets.
View: straight-on full BACK on an invisible mannequin, with identical scale, centering and margins to the front master so the two images align when the customer flips between them.
Back construction (a concept design decision): elastic back waistband and one back patch pocket.
Canvas: 1600 x 2400 px; genuine transparent PNG background; no shadow, no hanger.
Avoid: any text, letters, numbers, logos, brand marks, watermarks, signage, price tags or labels; distorted hands or extra fingers; plastic-looking fabric; oversaturated color; heavy retouching; busy backgrounds; collages, grids or split frames.
```

**تفصيل — 1600×1600** · `kids-chino-navy-waistband.jpg`

```text
Use the attached APPROVED FRONT MASTER (kids-chino-navy-front.png) as the exact identity reference.
Product identity: children's navy pull-on chinos with a flat front waistband, elastic back waist and side pockets.
View: a close detail of the waistband and side pocket.
Square 1600 x 1600 px; camera about 30–40 cm from the fabric; readable depth of field; soft raking side light that reveals texture and stitching; the garment fills the frame.
Every button, seam, stripe and color must match the master exactly. No invented labels, tags or care symbols.
Avoid: any text, letters, numbers, logos, brand marks, watermarks, signage, price tags or labels; distorted hands or extra fingers; plastic-looking fabric; oversaturated color; heavy retouching; busy backgrounds; collages, grids or split frames.
```

## 9. الصور التحريرية والصفحات — كل البرومبتات

كل برومبت فيه أسماء الماسترات اللي لازم ترفقها. الصور اللي مكتوب لها ريفرنس، ارفق ملف الريفرنس معاها كمرجع مزاج.

### 9.0 جدول سريع

| الكود | الملف | المقاس | الصفحة | الريفرنس في المشروع | ارفق الماسترات |
|---|---|---|---|---|---|
| H01 | `home-hero-desktop.jpg` | 2400×1350 | الرئيسية: Hero (ديسكتوب) | U01 `public/images/coat-camel.jpg`، U02 `public/images/coat-camel-alt.jpg` | `coat-camel-front.png`، `knit-cream-front.png`، `trouser-charcoal-front.png` |
| H02 | `home-hero-mobile.jpg` | 1600×2400 | الرئيسية: Hero (موبايل) | U01 `public/images/coat-camel.jpg`، U02 `public/images/coat-camel-alt.jpg` | `coat-camel-front.png`، `knit-cream-front.png`، `trouser-charcoal-front.png` |
| H03 | `home-world-men.jpg` | 1600×2200 | الرئيسية + عن مدار: عالم الرجال | U11 `public/images/city-edit.jpg` | `coat-black-front.png` |
| H04 | `home-world-kids.jpg` | 1600×2200 | الرئيسية + عن مدار: عالم الأطفال | U03 `public/images/kids-adventure.jpg` | `kids-sweatshirt-striped-front.png`، `kids-chino-navy-front.png` |
| H05 | `category-coats.jpg` | 1200×1600 | الرئيسية: تصنيف المعاطف | U02 `public/images/coat-camel-alt.jpg` | `coat-camel-front.png` |
| H06 | `category-suits.jpg` | 1200×1600 | الرئيسية: تصنيف البدل | U07 `public/images/madar-source/62e5f3ed58-madar-m-suit-chair.jpg` | `suit-charcoal-front.png` |
| H07 | `category-knitwear.jpg` | 1200×1600 | الرئيسية: تصنيف التريكو | U05 `public/images/knit-cream.jpg` | `knit-cream-front.png` |
| H08 | `category-kids.jpg` | 1200×1600 | الرئيسية: تصنيف الأطفال | U04 `public/images/kids-adventure-alt.jpg` | `kids-polo-striped-front.png`، `kids-chino-navy-front.png` |
| H09 | `orbit-stage-desktop.jpg` | 2400×1350 | الرئيسية + استوديو المدار: أرضية المشهد | من الصفر — بدون ريفرنس | — |
| H10 | `orbit-stage-mobile.jpg` | 1600×2400 | الرئيسية + استوديو المدار: أرضية المشهد (موبايل) | من الصفر — بدون ريفرنس | — |
| H11 | `campaign-city-desktop.jpg` | 2400×1350 | الرئيسية + الإطلالات: حملة المدينة | U11 `public/images/city-edit.jpg`، U13 `public/images/suit-navy.jpg` | `suit-charcoal-front.png`، `coat-black-front.png` |
| H12 | `campaign-city-mobile.jpg` | 1600×2400 | الرئيسية + الإطلالات: حملة المدينة (موبايل) | U11 `public/images/city-edit.jpg`، U13 `public/images/suit-navy.jpg` | `suit-charcoal-front.png`، `coat-black-front.png` |
| H13 | `home-family.jpg` | 2400×1350 | الرئيسية: «عائلة واحدة» | من الصفر — بدون ريفرنس | `coat-camel-front.png`، `trouser-charcoal-front.png`، `kids-shirt-brown-front.png`، `kids-chino-navy-front.png` |
| H14 | `home-material-band.jpg` | 2400×900 | الرئيسية: شريط الخامة ← مكتبة الخامات | من الصفر — بدون ريفرنس | `coat-camel-front.png` |
| C01 | `shop-men-header.jpg` | 2400×900 | المتجر: رأس قسم الرجال | U10 `public/images/madar-source/ce640db2e5-madar-m-white-wall.jpg` | `overshirt-front.png`، `shirt-striped-front.png` |
| C02 | `shop-kids-header.jpg` | 2400×900 | المتجر: رأس قسم الأطفال | U03 `public/images/kids-adventure.jpg` | `kids-sweatshirt-striped-front.png`، `kids-tee-striped-front.png`، `kids-shirt-brown-front.png`، `kids-polo-striped-front.png` |
| L01 | `look-01-main.jpg` | 1600×2400 | الإطلالات: إطلالة 1 «الجملي» | U01 `public/images/coat-camel.jpg` | `coat-camel-front.png`، `knit-cream-front.png`، `trouser-charcoal-front.png` |
| L01D | `look-01-detail.jpg` | 1600×2000 | الإطلالات: إطلالة 1 تفصيل | U02 `public/images/coat-camel-alt.jpg` | `coat-camel-front.png`، `knit-cream-front.png`، `trouser-charcoal-front.png` |
| L02 | `look-02-main.jpg` | 1600×2400 | الإطلالات: إطلالة 2 «الطبقات الخفيفة» | U10 `public/images/madar-source/ce640db2e5-madar-m-white-wall.jpg` | `overshirt-front.png`، `shirt-striped-front.png`، `trouser-stone-front.png` |
| L02D | `look-02-detail.jpg` | 1600×2000 | الإطلالات: إطلالة 2 تفصيل | U06 `public/images/knit-cream-alt.jpg` | `overshirt-front.png`، `shirt-striped-front.png` |
| L03 | `look-03-main.jpg` | 1600×2400 | الإطلالات: إطلالة 3 «الأطفال» | U04 `public/images/kids-adventure-alt.jpg` | `kids-sweatshirt-striped-front.png`، `kids-chino-navy-front.png` |
| L03D | `look-03-detail.jpg` | 1600×2000 | الإطلالات: إطلالة 3 تفصيل | U09 `public/images/madar-source/7c50bcdf3e-madar-k-arms.jpg` | `kids-sweatshirt-striped-front.png` |
| L04 | `look-04-main.jpg` | 1600×2400 | الإطلالات: إطلالة 4 «المساء» | U08 `public/images/madar-source/7e6ebb435b-m-black-coat.jpg` | `suit-charcoal-front.png`، `coat-black-front.png` |
| L04D | `look-04-detail.jpg` | 1600×2000 | الإطلالات: إطلالة 4 تفصيل | U07 `public/images/madar-source/62e5f3ed58-madar-m-suit-chair.jpg` | `suit-charcoal-front.png`، `coat-black-front.png` |
| J01 | `story-one-coat-cover.jpg` | 2400×1600 | الدفتر: «معطف واحد، شتا كامل» (غلاف) | U02 `public/images/coat-camel-alt.jpg` | `coat-camel-front.png` |
| J01B | `story-one-coat-flatlay.jpg` | 1600×2000 | الدفتر: «معطف واحد» (فلات لاي) | U15 `public/images/madar-source/0bda28db66-f-shoes.jpg` | `coat-camel-front.png`، `knit-cream-front.png`، `overshirt-front.png`، `trouser-charcoal-front.png`، `trouser-stone-front.png` |
| J02 | `story-everyday-wardrobe-cover.jpg` | 2400×1600 | الدفتر: «خزانة أقل. احتمالات أكثر.» | U12 `public/images/story-wardrobe.jpg` | `coat-camel-front.png`، `knit-cream-front.png`، `overshirt-front.png`، `shirt-striped-front.png` |
| J02B | `story-everyday-wardrobe-shelf.jpg` | 1600×2000 | الدفتر: «خزانة أقل» (داخلي) | U15 `public/images/madar-source/0bda28db66-f-shoes.jpg` | `knit-cream-front.png`، `shirt-striped-front.png` |
| J03 | `story-little-explorers-cover.jpg` | 2400×1600 | الدفتر: «مساحة صغيرة للنمو» | U03 `public/images/kids-adventure.jpg` | `kids-shirt-brown-front.png`، `kids-chino-navy-front.png` |
| J03B | `story-little-explorers-detail.jpg` | 1600×2000 | الدفتر: «مساحة للنمو» (داخلي) | U03 `public/images/kids-adventure.jpg` | `kids-shirt-brown-front.png` |
| J04 | `story-city-layers-cover.jpg` | 2400×1600 | الدفتر: «المدينة، طبقة بعد طبقة» | U11 `public/images/city-edit.jpg` | `coat-black-front.png`، `knit-cream-front.png` |
| J04B | `story-city-layers-detail.jpg` | 1600×2000 | الدفتر: «المدينة» (داخلي) | U11 `public/images/city-edit.jpg` | `coat-black-front.png`، `knit-cream-front.png`، `shirt-striped-front.png` |
| M01 | `material-camel-coat.jpg` | 1600×1600 | مكتبة الخامات (فكرة جديدة) | من الصفر — بدون ريفرنس | `coat-camel-front.png` |
| M02 | `material-rib-knit.jpg` | 1600×1600 | مكتبة الخامات (فكرة جديدة) | U05 `public/images/knit-cream.jpg` | `knit-cream-front.png` |
| M03 | `material-suiting.jpg` | 1600×1600 | مكتبة الخامات (فكرة جديدة) | U07 `public/images/madar-source/62e5f3ed58-madar-m-suit-chair.jpg` | `suit-charcoal-front.png` |
| M04 | `material-striped-shirting.jpg` | 1600×1600 | مكتبة الخامات (فكرة جديدة) | من الصفر — بدون ريفرنس | `shirt-striped-front.png` |
| M05 | `material-kids-jersey.jpg` | 1600×1600 | مكتبة الخامات (فكرة جديدة) | من الصفر — بدون ريفرنس | `kids-sweatshirt-striped-front.png` |
| A01 | `about-portrait.jpg` | 1200×1800 | عن مدار: البورتريه | U01 `public/images/coat-camel.jpg` | `coat-camel-front.png`، `knit-cream-front.png` |
| A02 | `about-still-life.jpg` | 2400×1600 | عن مدار: طبيعة صامتة | U12 `public/images/story-wardrobe.jpg` | `knit-cream-front.png`، `overshirt-front.png`، `shirt-striped-front.png` |
| SF01 | `style-audience-men.jpg` | 1200×1500 | مختار الأسلوب | U01 `public/images/coat-camel.jpg` | `coat-camel-front.png` |
| SF02 | `style-audience-kids.jpg` | 1200×1500 | مختار الأسلوب | U03 `public/images/kids-adventure.jpg` | `kids-tee-striped-front.png` |
| SF03 | `style-occasion-everyday.jpg` | 1200×1500 | مختار الأسلوب | U10 `public/images/madar-source/ce640db2e5-madar-m-white-wall.jpg` | `overshirt-front.png`، `trouser-stone-front.png` |
| SF04 | `style-occasion-smart.jpg` | 1200×1500 | مختار الأسلوب | U07 `public/images/madar-source/62e5f3ed58-madar-m-suit-chair.jpg` | `suit-charcoal-front.png` |
| SF05 | `style-occasion-layers.jpg` | 1200×1500 | مختار الأسلوب | U11 `public/images/city-edit.jpg` | `coat-black-front.png`، `knit-cream-front.png` |
| SF06 | `style-palette-earth.jpg` | 1200×1500 | مختار الأسلوب | U15 `public/images/madar-source/0bda28db66-f-shoes.jpg` | `coat-camel-front.png`، `overshirt-front.png`، `kids-shirt-brown-front.png` |
| SF07 | `style-palette-mono.jpg` | 1200×1500 | مختار الأسلوب | U15 `public/images/madar-source/0bda28db66-f-shoes.jpg` | `coat-black-front.png`، `suit-charcoal-front.png` |
| SF08 | `style-palette-light.jpg` | 1200×1500 | مختار الأسلوب | U15 `public/images/madar-source/0bda28db66-f-shoes.jpg` | `knit-cream-front.png`، `shirt-striped-front.png`، `kids-tee-striped-front.png` |
| V01 | `vip-styling-appointment.jpg` | 2400×1350 | موعد تنسيق خاص (مشروطة بوجود الخدمة فعلًا) | من الصفر — بدون ريفرنس | `coat-camel-front.png` |
| V02 | `vip-early-access.jpg` | 2400×1350 | معاينة مبكرة للأعضاء (مشروطة بوجود إصدارات حقيقية) | من الصفر — بدون ريفرنس | `coat-black-front.png` |
| FR01 | `fitting-room-backdrop.jpg` | 2400×1600 | غرفة القياس: خلفية اختيارية | من الصفر — بدون ريفرنس | — |
| E01 | `state-empty-bag.jpg` | 1600×1200 | السلة الفاضية | من الصفر — بدون ريفرنس | — |
| E02 | `state-empty-wardrobe.jpg` | 1600×1200 | «خزانتي» الفاضية | من الصفر — بدون ريفرنس | `knit-cream-front.png` |
| E03 | `state-not-found.jpg` | 1600×1200 | صفحة 404 | من الصفر — بدون ريفرنس | `coat-camel-front.png` |
| E04 | `state-order-confirmed.jpg` | 1600×1200 | تأكيد الطلب | من الصفر — بدون ريفرنس | `knit-cream-front.png` |
| EM01 | `email-order.jpg` | 1200×600 | إيميل الطلب | من الصفر — بدون ريفرنس | `knit-cream-front.png` |
| EM02 | `email-back-in-stock.jpg` | 1200×600 | إيميل رجوع المقاس | من الصفر — بدون ريفرنس | `coat-camel-front.png` |
| OG01 | `og-default.jpg` | 1200×630 | صورة المشاركة الافتراضية | U01 `public/images/coat-camel.jpg` | `coat-camel-front.png` |

### 9.1 الرئيسية

**H01** · `home-hero-desktop.jpg` · 2400×1350 · الرئيسية: Hero (ديسكتوب)
- الريفرنس: U01 `public/images/coat-camel.jpg`، U02 `public/images/coat-camel-alt.jpg`
- ارفق: `coat-camel-front.png`، `knit-cream-front.png`، `trouser-charcoal-front.png`

```text
Create an original editorial photograph for Madar.
Use the attached APPROVED PRODUCT MASTERS (coat-camel-front.png, knit-cream-front.png, trouser-charcoal-front.png) as exact clothing references. Do not redesign, recolor or restyle them.
Scene: An adult man around 30 stands in a quiet limestone interior with a tall arched opening behind him, warm late-afternoon light falling softly from one side. He wears the approved camel coat open over the approved cream turtleneck and the approved charcoal trousers. Calm, confident, still.
Composition: Direction-neutral composition that works for Arabic (RTL) and Latin (LTR) layouts: subject centered, calm uncluttered lower 30 percent for overlaid copy, nothing important near the left or right edges. Never mirror the garment.
Size: 2400 x 1350 px.
House style: quiet premium editorial for Madar, a men's and children's clothing label. Warm neutral palette of limestone, sand, camel, taupe and soft ink; soft directional natural light; matte, believable fabric texture; calm composition with generous negative space; natural skin texture; relaxed, dignified posture.
If a reference photograph is attached, use it only for mood, light and composition; never copy the person, face, exact scene or any third-party element.
Avoid: any text, letters, numbers, logos, brand marks, watermarks, signage, price tags or labels; distorted hands or extra fingers; plastic-looking fabric; oversaturated color; heavy retouching; busy backgrounds; collages, grids or split frames.
```

**H02** · `home-hero-mobile.jpg` · 1600×2400 · الرئيسية: Hero (موبايل)
- الريفرنس: U01 `public/images/coat-camel.jpg`، U02 `public/images/coat-camel-alt.jpg`
- ارفق: `coat-camel-front.png`، `knit-cream-front.png`، `trouser-charcoal-front.png`

```text
Create an original editorial photograph for Madar.
Use the attached APPROVED PRODUCT MASTERS (coat-camel-front.png, knit-cream-front.png, trouser-charcoal-front.png) as exact clothing references. Do not redesign, recolor or restyle them.
Scene: The same scene and outfit as the desktop hero, composed for a tall phone screen.
Composition: Subject centered; calm top 18 percent and lower 30 percent for copy. Never mirror the garment.
Size: 1600 x 2400 px.
House style: quiet premium editorial for Madar, a men's and children's clothing label. Warm neutral palette of limestone, sand, camel, taupe and soft ink; soft directional natural light; matte, believable fabric texture; calm composition with generous negative space; natural skin texture; relaxed, dignified posture.
If a reference photograph is attached, use it only for mood, light and composition; never copy the person, face, exact scene or any third-party element.
Avoid: any text, letters, numbers, logos, brand marks, watermarks, signage, price tags or labels; distorted hands or extra fingers; plastic-looking fabric; oversaturated color; heavy retouching; busy backgrounds; collages, grids or split frames.
```

**H03** · `home-world-men.jpg` · 1600×2200 · الرئيسية + عن مدار: عالم الرجال
- الريفرنس: U11 `public/images/city-edit.jpg`
- ارفق: `coat-black-front.png`

```text
Create an original editorial photograph for Madar.
Use the attached APPROVED PRODUCT MASTERS (coat-black-front.png) as exact clothing references. Do not redesign, recolor or restyle them.
Scene: An adult man around 35 walks mid-stride along a stone-paved city street on an overcast morning, wearing the approved black coat closed over a dark knit.
Composition: Subject centered; calm lower 25 percent for a label.
Size: 1600 x 2200 px.
House style: quiet premium editorial for Madar, a men's and children's clothing label. Warm neutral palette of limestone, sand, camel, taupe and soft ink; soft directional natural light; matte, believable fabric texture; calm composition with generous negative space; natural skin texture; relaxed, dignified posture.
If a reference photograph is attached, use it only for mood, light and composition; never copy the person, face, exact scene or any third-party element.
Avoid: any text, letters, numbers, logos, brand marks, watermarks, signage, price tags or labels; distorted hands or extra fingers; plastic-looking fabric; oversaturated color; heavy retouching; busy backgrounds; collages, grids or split frames.
```

**H04** · `home-world-kids.jpg` · 1600×2200 · الرئيسية + عن مدار: عالم الأطفال
- الريفرنس: U03 `public/images/kids-adventure.jpg`
- ارفق: `kids-sweatshirt-striped-front.png`، `kids-chino-navy-front.png`

```text
Create an original editorial photograph for Madar.
Use the attached APPROVED PRODUCT MASTERS (kids-sweatshirt-striped-front.png, kids-chino-navy-front.png) as exact clothing references. Do not redesign, recolor or restyle them.
Scene: A child walks toward the camera along an autumn park path covered in fallen leaves, smiling naturally, wearing the approved striped sweatshirt and navy chinos.
Composition: Subject centered; calm lower 25 percent for a label.
Size: 1600 x 2200 px.
House style: quiet premium editorial for Madar, a men's and children's clothing label. Warm neutral palette of limestone, sand, camel, taupe and soft ink; soft directional natural light; matte, believable fabric texture; calm composition with generous negative space; natural skin texture; relaxed, dignified posture.
The child appears 6–8 years old, in modest, age-appropriate everyday clothing, with a natural relaxed expression, in a calm and safe setting; no adult styling, no makeup, no posed adult attitude.
If a reference photograph is attached, use it only for mood, light and composition; never copy the person, face, exact scene or any third-party element.
Avoid: any text, letters, numbers, logos, brand marks, watermarks, signage, price tags or labels; distorted hands or extra fingers; plastic-looking fabric; oversaturated color; heavy retouching; busy backgrounds; collages, grids or split frames.
```

**H05** · `category-coats.jpg` · 1200×1600 · الرئيسية: تصنيف المعاطف
- الريفرنس: U02 `public/images/coat-camel-alt.jpg`
- ارفق: `coat-camel-front.png`

```text
Create an original editorial photograph for Madar.
Use the attached APPROVED PRODUCT MASTERS (coat-camel-front.png) as exact clothing references. Do not redesign, recolor or restyle them.
Scene: A close three-quarter crop of a man wearing the approved camel coat, hands in the pockets; the face is cropped at the chin or turned away so the lapel and fabric lead.
Composition: Vertical crop, garment fills 70 percent of the frame.
Size: 1200 x 1600 px.
House style: quiet premium editorial for Madar, a men's and children's clothing label. Warm neutral palette of limestone, sand, camel, taupe and soft ink; soft directional natural light; matte, believable fabric texture; calm composition with generous negative space; natural skin texture; relaxed, dignified posture.
If a reference photograph is attached, use it only for mood, light and composition; never copy the person, face, exact scene or any third-party element.
Avoid: any text, letters, numbers, logos, brand marks, watermarks, signage, price tags or labels; distorted hands or extra fingers; plastic-looking fabric; oversaturated color; heavy retouching; busy backgrounds; collages, grids or split frames.
```

**H06** · `category-suits.jpg` · 1200×1600 · الرئيسية: تصنيف البدل
- الريفرنس: U07 `public/images/madar-source/62e5f3ed58-madar-m-suit-chair.jpg`
- ارفق: `suit-charcoal-front.png`

```text
Create an original editorial photograph for Madar.
Use the attached APPROVED PRODUCT MASTERS (suit-charcoal-front.png) as exact clothing references. Do not redesign, recolor or restyle them.
Scene: A man seated on a simple wooden chair by tall window light in the approved charcoal suit, cropped from the shoulders to the knees.
Composition: Vertical crop.
Size: 1200 x 1600 px.
House style: quiet premium editorial for Madar, a men's and children's clothing label. Warm neutral palette of limestone, sand, camel, taupe and soft ink; soft directional natural light; matte, believable fabric texture; calm composition with generous negative space; natural skin texture; relaxed, dignified posture.
If a reference photograph is attached, use it only for mood, light and composition; never copy the person, face, exact scene or any third-party element.
Avoid: any text, letters, numbers, logos, brand marks, watermarks, signage, price tags or labels; distorted hands or extra fingers; plastic-looking fabric; oversaturated color; heavy retouching; busy backgrounds; collages, grids or split frames.
```

**H07** · `category-knitwear.jpg` · 1200×1600 · الرئيسية: تصنيف التريكو
- الريفرنس: U05 `public/images/knit-cream.jpg`
- ارفق: `knit-cream-front.png`
- ملاحظة: اسم التصنيف الحالي «الكنزات والكشمير» فيه ادعاء خامة غير مؤكد؛ الاسم المقترح «التريكو».

```text
Create an original editorial photograph for Madar.
Use the attached APPROVED PRODUCT MASTERS (knit-cream-front.png) as exact clothing references. Do not redesign, recolor or restyle them.
Scene: A man adjusting the folded collar of the approved cream turtleneck, cropped chest-up, face partly out of frame.
Composition: Vertical crop.
Size: 1200 x 1600 px.
House style: quiet premium editorial for Madar, a men's and children's clothing label. Warm neutral palette of limestone, sand, camel, taupe and soft ink; soft directional natural light; matte, believable fabric texture; calm composition with generous negative space; natural skin texture; relaxed, dignified posture.
If a reference photograph is attached, use it only for mood, light and composition; never copy the person, face, exact scene or any third-party element.
Avoid: any text, letters, numbers, logos, brand marks, watermarks, signage, price tags or labels; distorted hands or extra fingers; plastic-looking fabric; oversaturated color; heavy retouching; busy backgrounds; collages, grids or split frames.
```

**H08** · `category-kids.jpg` · 1200×1600 · الرئيسية: تصنيف الأطفال
- الريفرنس: U04 `public/images/kids-adventure-alt.jpg`
- ارفق: `kids-polo-striped-front.png`، `kids-chino-navy-front.png`

```text
Create an original editorial photograph for Madar.
Use the attached APPROVED PRODUCT MASTERS (kids-polo-striped-front.png, kids-chino-navy-front.png) as exact clothing references. Do not redesign, recolor or restyle them.
Scene: A child laughing at the edge of a garden lawn in the approved striped polo and navy chinos, cropped from the knees up.
Composition: Vertical crop.
Size: 1200 x 1600 px.
House style: quiet premium editorial for Madar, a men's and children's clothing label. Warm neutral palette of limestone, sand, camel, taupe and soft ink; soft directional natural light; matte, believable fabric texture; calm composition with generous negative space; natural skin texture; relaxed, dignified posture.
The child appears 5–7 years old, in modest, age-appropriate everyday clothing, with a natural relaxed expression, in a calm and safe setting; no adult styling, no makeup, no posed adult attitude.
If a reference photograph is attached, use it only for mood, light and composition; never copy the person, face, exact scene or any third-party element.
Avoid: any text, letters, numbers, logos, brand marks, watermarks, signage, price tags or labels; distorted hands or extra fingers; plastic-looking fabric; oversaturated color; heavy retouching; busy backgrounds; collages, grids or split frames.
```

**H09** · `orbit-stage-desktop.jpg` · 2400×1350 · الرئيسية + استوديو المدار: أرضية المشهد
- الريفرنس: من الصفر — بدون ريفرنس

```text
Create an original editorial photograph for Madar.
Scene: A seamless warm limestone surface seen from directly above, with a very subtle elliptical pool of soft light at the center. Completely empty: no objects, no props, fine natural mineral texture.
Composition: Perfectly even edges and no focal object, so product cutouts can be placed on top in code.
Size: 2400 x 1350 px.
House style: quiet premium editorial for Madar, a men's and children's clothing label. Warm neutral palette of limestone, sand, camel, taupe and soft ink; soft directional natural light; matte, believable fabric texture; calm composition with generous negative space; natural skin texture; relaxed, dignified posture.
Avoid: any text, letters, numbers, logos, brand marks, watermarks, signage, price tags or labels; distorted hands or extra fingers; plastic-looking fabric; oversaturated color; heavy retouching; busy backgrounds; collages, grids or split frames.
```

**H10** · `orbit-stage-mobile.jpg` · 1600×2400 · الرئيسية + استوديو المدار: أرضية المشهد (موبايل)
- الريفرنس: من الصفر — بدون ريفرنس

```text
Create an original editorial photograph for Madar.
Scene: The same empty limestone surface composed for a tall phone screen.
Composition: Perfectly even edges; no focal object.
Size: 1600 x 2400 px.
House style: quiet premium editorial for Madar, a men's and children's clothing label. Warm neutral palette of limestone, sand, camel, taupe and soft ink; soft directional natural light; matte, believable fabric texture; calm composition with generous negative space; natural skin texture; relaxed, dignified posture.
Avoid: any text, letters, numbers, logos, brand marks, watermarks, signage, price tags or labels; distorted hands or extra fingers; plastic-looking fabric; oversaturated color; heavy retouching; busy backgrounds; collages, grids or split frames.
```

**H11** · `campaign-city-desktop.jpg` · 2400×1350 · الرئيسية + الإطلالات: حملة المدينة
- الريفرنس: U11 `public/images/city-edit.jpg`، U13 `public/images/suit-navy.jpg`
- ارفق: `suit-charcoal-front.png`، `coat-black-front.png`

```text
Create an original editorial photograph for Madar.
Use the attached APPROVED PRODUCT MASTERS (suit-charcoal-front.png, coat-black-front.png) as exact clothing references. Do not redesign, recolor or restyle them.
Scene: An adult man walks past a modern glass-and-stone building at blue hour, wearing the approved charcoal suit under the open approved black coat; soft reflections, quiet street, no visible signage.
Composition: Direction-neutral composition that works for Arabic (RTL) and Latin (LTR) layouts: subject centered, calm uncluttered lower 30 percent for overlaid copy, nothing important near the left or right edges. Never mirror the garment.
Size: 2400 x 1350 px.
House style: quiet premium editorial for Madar, a men's and children's clothing label. Warm neutral palette of limestone, sand, camel, taupe and soft ink; soft directional natural light; matte, believable fabric texture; calm composition with generous negative space; natural skin texture; relaxed, dignified posture.
If a reference photograph is attached, use it only for mood, light and composition; never copy the person, face, exact scene or any third-party element.
Avoid: any text, letters, numbers, logos, brand marks, watermarks, signage, price tags or labels; distorted hands or extra fingers; plastic-looking fabric; oversaturated color; heavy retouching; busy backgrounds; collages, grids or split frames.
```

**H12** · `campaign-city-mobile.jpg` · 1600×2400 · الرئيسية + الإطلالات: حملة المدينة (موبايل)
- الريفرنس: U11 `public/images/city-edit.jpg`، U13 `public/images/suit-navy.jpg`
- ارفق: `suit-charcoal-front.png`، `coat-black-front.png`

```text
Create an original editorial photograph for Madar.
Use the attached APPROVED PRODUCT MASTERS (suit-charcoal-front.png, coat-black-front.png) as exact clothing references. Do not redesign, recolor or restyle them.
Scene: The same campaign moment composed for a tall phone screen.
Composition: Subject centered; calm top 18 percent and lower 30 percent.
Size: 1600 x 2400 px.
House style: quiet premium editorial for Madar, a men's and children's clothing label. Warm neutral palette of limestone, sand, camel, taupe and soft ink; soft directional natural light; matte, believable fabric texture; calm composition with generous negative space; natural skin texture; relaxed, dignified posture.
If a reference photograph is attached, use it only for mood, light and composition; never copy the person, face, exact scene or any third-party element.
Avoid: any text, letters, numbers, logos, brand marks, watermarks, signage, price tags or labels; distorted hands or extra fingers; plastic-looking fabric; oversaturated color; heavy retouching; busy backgrounds; collages, grids or split frames.
```

**H13** · `home-family.jpg` · 2400×1350 · الرئيسية: «عائلة واحدة»
- الريفرنس: من الصفر — بدون ريفرنس
- ارفق: `coat-camel-front.png`، `trouser-charcoal-front.png`، `kids-shirt-brown-front.png`، `kids-chino-navy-front.png`

```text
Create an original editorial photograph for Madar.
Use the attached APPROVED PRODUCT MASTERS (coat-camel-front.png, trouser-charcoal-front.png, kids-shirt-brown-front.png, kids-chino-navy-front.png) as exact clothing references. Do not redesign, recolor or restyle them.
Scene: A father around 35 and a child walk hand in hand along a quiet tree-lined autumn path, seen at a three-quarter angle from slightly behind. The father wears the approved camel coat and charcoal trousers; the child wears the approved brown shirt and navy chinos. Their tones coordinate without matching exactly.
Composition: Direction-neutral composition that works for Arabic (RTL) and Latin (LTR) layouts: subject centered, calm uncluttered lower 30 percent for overlaid copy, nothing important near the left or right edges. Never mirror the garment.
Size: 2400 x 1350 px.
House style: quiet premium editorial for Madar, a men's and children's clothing label. Warm neutral palette of limestone, sand, camel, taupe and soft ink; soft directional natural light; matte, believable fabric texture; calm composition with generous negative space; natural skin texture; relaxed, dignified posture.
The child appears 7–9 years old, in modest, age-appropriate everyday clothing, with a natural relaxed expression, in a calm and safe setting; no adult styling, no makeup, no posed adult attitude.
Avoid: any text, letters, numbers, logos, brand marks, watermarks, signage, price tags or labels; distorted hands or extra fingers; plastic-looking fabric; oversaturated color; heavy retouching; busy backgrounds; collages, grids or split frames.
```

**H14** · `home-material-band.jpg` · 2400×900 · الرئيسية: شريط الخامة ← مكتبة الخامات
- الريفرنس: من الصفر — بدون ريفرنس
- ارفق: `coat-camel-front.png`
- ملاحظة: مرجع إضافي: بروفة الياقة المستلمة داخل `public/downloads/madar-reference-pack.zip` ← المجلد `02-received-coat-concepts/`: `coat_front_isolated.png`، `coat_back_isolated.png`، `coat_detail_collar_shoulder.jpg`، `coat_detail_pocket_buttons.jpg`

```text
Create an original editorial photograph for Madar.
Use the attached APPROVED PRODUCT MASTERS (coat-camel-front.png) as exact clothing references. Do not redesign, recolor or restyle them.
Scene: An extreme close macro of the approved camel coat fabric along the lapel edge with a single neat stitch line, raking light revealing the brushed surface.
Composition: Wide panoramic band; texture spans the whole frame evenly.
Size: 2400 x 900 px.
House style: quiet premium editorial for Madar, a men's and children's clothing label. Warm neutral palette of limestone, sand, camel, taupe and soft ink; soft directional natural light; matte, believable fabric texture; calm composition with generous negative space; natural skin texture; relaxed, dignified posture.
Avoid: any text, letters, numbers, logos, brand marks, watermarks, signage, price tags or labels; distorted hands or extra fingers; plastic-looking fabric; oversaturated color; heavy retouching; busy backgrounds; collages, grids or split frames.
```

### 9.2 المتجر

**C01** · `shop-men-header.jpg` · 2400×900 · المتجر: رأس قسم الرجال
- الريفرنس: U10 `public/images/madar-source/ce640db2e5-madar-m-white-wall.jpg`
- ارفق: `overshirt-front.png`، `shirt-striped-front.png`

```text
Create an original editorial photograph for Madar.
Use the attached APPROVED PRODUCT MASTERS (overshirt-front.png, shirt-striped-front.png) as exact clothing references. Do not redesign, recolor or restyle them.
Scene: A quiet still life: the approved overshirt and striped shirt hang on simple pale wooden hangers against a pale plaster wall in soft window light. No person.
Composition: Wide band; garments in the central third, calm space on both sides.
Size: 2400 x 900 px.
House style: quiet premium editorial for Madar, a men's and children's clothing label. Warm neutral palette of limestone, sand, camel, taupe and soft ink; soft directional natural light; matte, believable fabric texture; calm composition with generous negative space; natural skin texture; relaxed, dignified posture.
If a reference photograph is attached, use it only for mood, light and composition; never copy the person, face, exact scene or any third-party element.
Avoid: any text, letters, numbers, logos, brand marks, watermarks, signage, price tags or labels; distorted hands or extra fingers; plastic-looking fabric; oversaturated color; heavy retouching; busy backgrounds; collages, grids or split frames.
```

**C02** · `shop-kids-header.jpg` · 2400×900 · المتجر: رأس قسم الأطفال
- الريفرنس: U03 `public/images/kids-adventure.jpg`
- ارفق: `kids-sweatshirt-striped-front.png`، `kids-tee-striped-front.png`، `kids-shirt-brown-front.png`، `kids-polo-striped-front.png`

```text
Create an original editorial photograph for Madar.
Use the attached APPROVED PRODUCT MASTERS (kids-sweatshirt-striped-front.png, kids-tee-striped-front.png, kids-shirt-brown-front.png, kids-polo-striped-front.png) as exact clothing references. Do not redesign, recolor or restyle them.
Scene: The four approved children's garments folded neatly on a low pale wooden bench in a sunlit room. No child.
Composition: Wide band; garments in the central third.
Size: 2400 x 900 px.
House style: quiet premium editorial for Madar, a men's and children's clothing label. Warm neutral palette of limestone, sand, camel, taupe and soft ink; soft directional natural light; matte, believable fabric texture; calm composition with generous negative space; natural skin texture; relaxed, dignified posture.
If a reference photograph is attached, use it only for mood, light and composition; never copy the person, face, exact scene or any third-party element.
Avoid: any text, letters, numbers, logos, brand marks, watermarks, signage, price tags or labels; distorted hands or extra fingers; plastic-looking fabric; oversaturated color; heavy retouching; busy backgrounds; collages, grids or split frames.
```

### 9.3 الإطلالات

**L01** · `look-01-main.jpg` · 1600×2400 · الإطلالات: إطلالة 1 «الجملي»
- الريفرنس: U01 `public/images/coat-camel.jpg`
- ارفق: `coat-camel-front.png`، `knit-cream-front.png`، `trouser-charcoal-front.png`

```text
Create an original editorial photograph for Madar.
Use the attached APPROVED PRODUCT MASTERS (coat-camel-front.png, knit-cream-front.png, trouser-charcoal-front.png) as exact clothing references. Do not redesign, recolor or restyle them.
Scene: Full-length portrait of an adult man against a warm limestone wall wearing the approved camel coat open, the cream turtleneck and charcoal trousers.
Composition: Full length, subject centered.
Size: 1600 x 2400 px.
House style: quiet premium editorial for Madar, a men's and children's clothing label. Warm neutral palette of limestone, sand, camel, taupe and soft ink; soft directional natural light; matte, believable fabric texture; calm composition with generous negative space; natural skin texture; relaxed, dignified posture.
If a reference photograph is attached, use it only for mood, light and composition; never copy the person, face, exact scene or any third-party element.
Avoid: any text, letters, numbers, logos, brand marks, watermarks, signage, price tags or labels; distorted hands or extra fingers; plastic-looking fabric; oversaturated color; heavy retouching; busy backgrounds; collages, grids or split frames.
```

**L01D** · `look-01-detail.jpg` · 1600×2000 · الإطلالات: إطلالة 1 تفصيل
- الريفرنس: U02 `public/images/coat-camel-alt.jpg`
- ارفق: `coat-camel-front.png`، `knit-cream-front.png`، `trouser-charcoal-front.png`

```text
Create an original editorial photograph for Madar.
Use the attached APPROVED PRODUCT MASTERS (coat-camel-front.png, knit-cream-front.png, trouser-charcoal-front.png) as exact clothing references. Do not redesign, recolor or restyle them.
Scene: A close crop at the waist: the coat open, the turtleneck hem, the trouser waistband and a hand resting in the coat pocket.
Composition: Vertical detail crop.
Size: 1600 x 2000 px.
House style: quiet premium editorial for Madar, a men's and children's clothing label. Warm neutral palette of limestone, sand, camel, taupe and soft ink; soft directional natural light; matte, believable fabric texture; calm composition with generous negative space; natural skin texture; relaxed, dignified posture.
If a reference photograph is attached, use it only for mood, light and composition; never copy the person, face, exact scene or any third-party element.
Avoid: any text, letters, numbers, logos, brand marks, watermarks, signage, price tags or labels; distorted hands or extra fingers; plastic-looking fabric; oversaturated color; heavy retouching; busy backgrounds; collages, grids or split frames.
```

**L02** · `look-02-main.jpg` · 1600×2400 · الإطلالات: إطلالة 2 «الطبقات الخفيفة»
- الريفرنس: U10 `public/images/madar-source/ce640db2e5-madar-m-white-wall.jpg`
- ارفق: `overshirt-front.png`، `shirt-striped-front.png`، `trouser-stone-front.png`

```text
Create an original editorial photograph for Madar.
Use the attached APPROVED PRODUCT MASTERS (overshirt-front.png, shirt-striped-front.png, trouser-stone-front.png) as exact clothing references. Do not redesign, recolor or restyle them.
Scene: Full-length portrait of an adult man against a pale concrete wall, the approved overshirt worn open over the striped shirt with stone chinos.
Composition: Full length, subject centered.
Size: 1600 x 2400 px.
House style: quiet premium editorial for Madar, a men's and children's clothing label. Warm neutral palette of limestone, sand, camel, taupe and soft ink; soft directional natural light; matte, believable fabric texture; calm composition with generous negative space; natural skin texture; relaxed, dignified posture.
If a reference photograph is attached, use it only for mood, light and composition; never copy the person, face, exact scene or any third-party element.
Avoid: any text, letters, numbers, logos, brand marks, watermarks, signage, price tags or labels; distorted hands or extra fingers; plastic-looking fabric; oversaturated color; heavy retouching; busy backgrounds; collages, grids or split frames.
```

**L02D** · `look-02-detail.jpg` · 1600×2000 · الإطلالات: إطلالة 2 تفصيل
- الريفرنس: U06 `public/images/knit-cream-alt.jpg`
- ارفق: `overshirt-front.png`، `shirt-striped-front.png`

```text
Create an original editorial photograph for Madar.
Use the attached APPROVED PRODUCT MASTERS (overshirt-front.png, shirt-striped-front.png) as exact clothing references. Do not redesign, recolor or restyle them.
Scene: A close crop of the striped shirt collar sitting inside the overshirt collar.
Composition: Vertical detail crop.
Size: 1600 x 2000 px.
House style: quiet premium editorial for Madar, a men's and children's clothing label. Warm neutral palette of limestone, sand, camel, taupe and soft ink; soft directional natural light; matte, believable fabric texture; calm composition with generous negative space; natural skin texture; relaxed, dignified posture.
If a reference photograph is attached, use it only for mood, light and composition; never copy the person, face, exact scene or any third-party element.
Avoid: any text, letters, numbers, logos, brand marks, watermarks, signage, price tags or labels; distorted hands or extra fingers; plastic-looking fabric; oversaturated color; heavy retouching; busy backgrounds; collages, grids or split frames.
```

**L03** · `look-03-main.jpg` · 1600×2400 · الإطلالات: إطلالة 3 «الأطفال»
- الريفرنس: U04 `public/images/kids-adventure-alt.jpg`
- ارفق: `kids-sweatshirt-striped-front.png`، `kids-chino-navy-front.png`

```text
Create an original editorial photograph for Madar.
Use the attached APPROVED PRODUCT MASTERS (kids-sweatshirt-striped-front.png, kids-chino-navy-front.png) as exact clothing references. Do not redesign, recolor or restyle them.
Scene: A child stands in a garden in autumn light wearing the approved striped sweatshirt and navy chinos.
Composition: Full length, subject centered.
Size: 1600 x 2400 px.
House style: quiet premium editorial for Madar, a men's and children's clothing label. Warm neutral palette of limestone, sand, camel, taupe and soft ink; soft directional natural light; matte, believable fabric texture; calm composition with generous negative space; natural skin texture; relaxed, dignified posture.
The child appears 6–8 years old, in modest, age-appropriate everyday clothing, with a natural relaxed expression, in a calm and safe setting; no adult styling, no makeup, no posed adult attitude.
If a reference photograph is attached, use it only for mood, light and composition; never copy the person, face, exact scene or any third-party element.
Avoid: any text, letters, numbers, logos, brand marks, watermarks, signage, price tags or labels; distorted hands or extra fingers; plastic-looking fabric; oversaturated color; heavy retouching; busy backgrounds; collages, grids or split frames.
```

**L03D** · `look-03-detail.jpg` · 1600×2000 · الإطلالات: إطلالة 3 تفصيل
- الريفرنس: U09 `public/images/madar-source/7c50bcdf3e-madar-k-arms.jpg`
- ارفق: `kids-sweatshirt-striped-front.png`

```text
Create an original editorial photograph for Madar.
Use the attached APPROVED PRODUCT MASTERS (kids-sweatshirt-striped-front.png) as exact clothing references. Do not redesign, recolor or restyle them.
Scene: A close crop of the sweatshirt cuff and stripes while the child holds a fallen leaf.
Composition: Vertical detail crop.
Size: 1600 x 2000 px.
House style: quiet premium editorial for Madar, a men's and children's clothing label. Warm neutral palette of limestone, sand, camel, taupe and soft ink; soft directional natural light; matte, believable fabric texture; calm composition with generous negative space; natural skin texture; relaxed, dignified posture.
The child appears 6–8 years old, in modest, age-appropriate everyday clothing, with a natural relaxed expression, in a calm and safe setting; no adult styling, no makeup, no posed adult attitude.
If a reference photograph is attached, use it only for mood, light and composition; never copy the person, face, exact scene or any third-party element.
Avoid: any text, letters, numbers, logos, brand marks, watermarks, signage, price tags or labels; distorted hands or extra fingers; plastic-looking fabric; oversaturated color; heavy retouching; busy backgrounds; collages, grids or split frames.
```

**L04** · `look-04-main.jpg` · 1600×2400 · الإطلالات: إطلالة 4 «المساء»
- الريفرنس: U08 `public/images/madar-source/7e6ebb435b-m-black-coat.jpg`
- ارفق: `suit-charcoal-front.png`، `coat-black-front.png`

```text
Create an original editorial photograph for Madar.
Use the attached APPROVED PRODUCT MASTERS (suit-charcoal-front.png, coat-black-front.png) as exact clothing references. Do not redesign, recolor or restyle them.
Scene: Full-length portrait of an adult man in an evening interior with a tall window and a wooden chair, wearing the approved charcoal suit with the black coat worn open.
Composition: Full length, subject centered.
Size: 1600 x 2400 px.
House style: quiet premium editorial for Madar, a men's and children's clothing label. Warm neutral palette of limestone, sand, camel, taupe and soft ink; soft directional natural light; matte, believable fabric texture; calm composition with generous negative space; natural skin texture; relaxed, dignified posture.
If a reference photograph is attached, use it only for mood, light and composition; never copy the person, face, exact scene or any third-party element.
Avoid: any text, letters, numbers, logos, brand marks, watermarks, signage, price tags or labels; distorted hands or extra fingers; plastic-looking fabric; oversaturated color; heavy retouching; busy backgrounds; collages, grids or split frames.
```

**L04D** · `look-04-detail.jpg` · 1600×2000 · الإطلالات: إطلالة 4 تفصيل
- الريفرنس: U07 `public/images/madar-source/62e5f3ed58-madar-m-suit-chair.jpg`
- ارفق: `suit-charcoal-front.png`، `coat-black-front.png`

```text
Create an original editorial photograph for Madar.
Use the attached APPROVED PRODUCT MASTERS (suit-charcoal-front.png, coat-black-front.png) as exact clothing references. Do not redesign, recolor or restyle them.
Scene: A seated crop showing the suit lapels and the edge of the open coat.
Composition: Vertical detail crop.
Size: 1600 x 2000 px.
House style: quiet premium editorial for Madar, a men's and children's clothing label. Warm neutral palette of limestone, sand, camel, taupe and soft ink; soft directional natural light; matte, believable fabric texture; calm composition with generous negative space; natural skin texture; relaxed, dignified posture.
If a reference photograph is attached, use it only for mood, light and composition; never copy the person, face, exact scene or any third-party element.
Avoid: any text, letters, numbers, logos, brand marks, watermarks, signage, price tags or labels; distorted hands or extra fingers; plastic-looking fabric; oversaturated color; heavy retouching; busy backgrounds; collages, grids or split frames.
```

### 9.4 الدفتر

**J01** · `story-one-coat-cover.jpg` · 2400×1600 · الدفتر: «معطف واحد، شتا كامل» (غلاف)
- الريفرنس: U02 `public/images/coat-camel-alt.jpg`
- ارفق: `coat-camel-front.png`

```text
Create an original editorial photograph for Madar.
Use the attached APPROVED PRODUCT MASTERS (coat-camel-front.png) as exact clothing references. Do not redesign, recolor or restyle them.
Scene: A man buttoning the approved camel coat in front of a pale wooden door in morning light.
Composition: Landscape cover; subject in the central third.
Size: 2400 x 1600 px.
House style: quiet premium editorial for Madar, a men's and children's clothing label. Warm neutral palette of limestone, sand, camel, taupe and soft ink; soft directional natural light; matte, believable fabric texture; calm composition with generous negative space; natural skin texture; relaxed, dignified posture.
If a reference photograph is attached, use it only for mood, light and composition; never copy the person, face, exact scene or any third-party element.
Avoid: any text, letters, numbers, logos, brand marks, watermarks, signage, price tags or labels; distorted hands or extra fingers; plastic-looking fabric; oversaturated color; heavy retouching; busy backgrounds; collages, grids or split frames.
```

**J01B** · `story-one-coat-flatlay.jpg` · 1600×2000 · الدفتر: «معطف واحد» (فلات لاي)
- الريفرنس: U15 `public/images/madar-source/0bda28db66-f-shoes.jpg`
- ارفق: `coat-camel-front.png`، `knit-cream-front.png`، `overshirt-front.png`، `trouser-charcoal-front.png`، `trouser-stone-front.png`

```text
Create an original editorial photograph for Madar.
Use the attached APPROVED PRODUCT MASTERS (coat-camel-front.png, knit-cream-front.png, overshirt-front.png, trouser-charcoal-front.png, trouser-stone-front.png) as exact clothing references. Do not redesign, recolor or restyle them.
Scene: A top-down flat lay on warm linen: the approved camel coat folded at the center with the cream knit, overshirt and the two trousers arranged around it, plus a pair of plain unbranded brown leather boots as a styling prop.
Composition: Top-down, evenly spaced, nothing touching the edges.
Size: 1600 x 2000 px.
House style: quiet premium editorial for Madar, a men's and children's clothing label. Warm neutral palette of limestone, sand, camel, taupe and soft ink; soft directional natural light; matte, believable fabric texture; calm composition with generous negative space; natural skin texture; relaxed, dignified posture.
If a reference photograph is attached, use it only for mood, light and composition; never copy the person, face, exact scene or any third-party element.
Avoid: any text, letters, numbers, logos, brand marks, watermarks, signage, price tags or labels; distorted hands or extra fingers; plastic-looking fabric; oversaturated color; heavy retouching; busy backgrounds; collages, grids or split frames.
```

**J02** · `story-everyday-wardrobe-cover.jpg` · 2400×1600 · الدفتر: «خزانة أقل. احتمالات أكثر.»
- الريفرنس: U12 `public/images/story-wardrobe.jpg`
- ارفق: `coat-camel-front.png`، `knit-cream-front.png`، `overshirt-front.png`، `shirt-striped-front.png`

```text
Create an original editorial photograph for Madar.
Use the attached APPROVED PRODUCT MASTERS (coat-camel-front.png, knit-cream-front.png, overshirt-front.png, shirt-striped-front.png) as exact clothing references. Do not redesign, recolor or restyle them.
Scene: A calm minimal wardrobe rail holding a few of the approved garments in camel, cream, taupe and off-white, with a plant and soft daylight.
Composition: Landscape cover.
Size: 2400 x 1600 px.
House style: quiet premium editorial for Madar, a men's and children's clothing label. Warm neutral palette of limestone, sand, camel, taupe and soft ink; soft directional natural light; matte, believable fabric texture; calm composition with generous negative space; natural skin texture; relaxed, dignified posture.
If a reference photograph is attached, use it only for mood, light and composition; never copy the person, face, exact scene or any third-party element.
Avoid: any text, letters, numbers, logos, brand marks, watermarks, signage, price tags or labels; distorted hands or extra fingers; plastic-looking fabric; oversaturated color; heavy retouching; busy backgrounds; collages, grids or split frames.
```

**J02B** · `story-everyday-wardrobe-shelf.jpg` · 1600×2000 · الدفتر: «خزانة أقل» (داخلي)
- الريفرنس: U15 `public/images/madar-source/0bda28db66-f-shoes.jpg`
- ارفق: `knit-cream-front.png`، `shirt-striped-front.png`

```text
Create an original editorial photograph for Madar.
Use the attached APPROVED PRODUCT MASTERS (knit-cream-front.png, shirt-striped-front.png) as exact clothing references. Do not redesign, recolor or restyle them.
Scene: A neat stack of folded knits and shirts on a pale oak shelf.
Composition: Vertical.
Size: 1600 x 2000 px.
House style: quiet premium editorial for Madar, a men's and children's clothing label. Warm neutral palette of limestone, sand, camel, taupe and soft ink; soft directional natural light; matte, believable fabric texture; calm composition with generous negative space; natural skin texture; relaxed, dignified posture.
If a reference photograph is attached, use it only for mood, light and composition; never copy the person, face, exact scene or any third-party element.
Avoid: any text, letters, numbers, logos, brand marks, watermarks, signage, price tags or labels; distorted hands or extra fingers; plastic-looking fabric; oversaturated color; heavy retouching; busy backgrounds; collages, grids or split frames.
```

**J03** · `story-little-explorers-cover.jpg` · 2400×1600 · الدفتر: «مساحة صغيرة للنمو»
- الريفرنس: U03 `public/images/kids-adventure.jpg`
- ارفق: `kids-shirt-brown-front.png`، `kids-chino-navy-front.png`

```text
Create an original editorial photograph for Madar.
Use the attached APPROVED PRODUCT MASTERS (kids-shirt-brown-front.png, kids-chino-navy-front.png) as exact clothing references. Do not redesign, recolor or restyle them.
Scene: A child crouches to look at leaves in an autumn park, wearing the approved brown shirt and navy chinos.
Composition: Landscape cover.
Size: 2400 x 1600 px.
House style: quiet premium editorial for Madar, a men's and children's clothing label. Warm neutral palette of limestone, sand, camel, taupe and soft ink; soft directional natural light; matte, believable fabric texture; calm composition with generous negative space; natural skin texture; relaxed, dignified posture.
The child appears 7–9 years old, in modest, age-appropriate everyday clothing, with a natural relaxed expression, in a calm and safe setting; no adult styling, no makeup, no posed adult attitude.
If a reference photograph is attached, use it only for mood, light and composition; never copy the person, face, exact scene or any third-party element.
Avoid: any text, letters, numbers, logos, brand marks, watermarks, signage, price tags or labels; distorted hands or extra fingers; plastic-looking fabric; oversaturated color; heavy retouching; busy backgrounds; collages, grids or split frames.
```

**J03B** · `story-little-explorers-detail.jpg` · 1600×2000 · الدفتر: «مساحة للنمو» (داخلي)
- الريفرنس: U03 `public/images/kids-adventure.jpg`
- ارفق: `kids-shirt-brown-front.png`

```text
Create an original editorial photograph for Madar.
Use the attached APPROVED PRODUCT MASTERS (kids-shirt-brown-front.png) as exact clothing references. Do not redesign, recolor or restyle them.
Scene: A close detail of a child's hands holding acorns, with the brown shirt cuff visible.
Composition: Vertical.
Size: 1600 x 2000 px.
House style: quiet premium editorial for Madar, a men's and children's clothing label. Warm neutral palette of limestone, sand, camel, taupe and soft ink; soft directional natural light; matte, believable fabric texture; calm composition with generous negative space; natural skin texture; relaxed, dignified posture.
The child appears 7–9 years old, in modest, age-appropriate everyday clothing, with a natural relaxed expression, in a calm and safe setting; no adult styling, no makeup, no posed adult attitude.
If a reference photograph is attached, use it only for mood, light and composition; never copy the person, face, exact scene or any third-party element.
Avoid: any text, letters, numbers, logos, brand marks, watermarks, signage, price tags or labels; distorted hands or extra fingers; plastic-looking fabric; oversaturated color; heavy retouching; busy backgrounds; collages, grids or split frames.
```

**J04** · `story-city-layers-cover.jpg` · 2400×1600 · الدفتر: «المدينة، طبقة بعد طبقة»
- الريفرنس: U11 `public/images/city-edit.jpg`
- ارفق: `coat-black-front.png`، `knit-cream-front.png`

```text
Create an original editorial photograph for Madar.
Use the attached APPROVED PRODUCT MASTERS (coat-black-front.png, knit-cream-front.png) as exact clothing references. Do not redesign, recolor or restyle them.
Scene: A man pauses on wide stone city steps in the approved black coat worn over the cream knit.
Composition: Landscape cover.
Size: 2400 x 1600 px.
House style: quiet premium editorial for Madar, a men's and children's clothing label. Warm neutral palette of limestone, sand, camel, taupe and soft ink; soft directional natural light; matte, believable fabric texture; calm composition with generous negative space; natural skin texture; relaxed, dignified posture.
If a reference photograph is attached, use it only for mood, light and composition; never copy the person, face, exact scene or any third-party element.
Avoid: any text, letters, numbers, logos, brand marks, watermarks, signage, price tags or labels; distorted hands or extra fingers; plastic-looking fabric; oversaturated color; heavy retouching; busy backgrounds; collages, grids or split frames.
```

**J04B** · `story-city-layers-detail.jpg` · 1600×2000 · الدفتر: «المدينة» (داخلي)
- الريفرنس: U11 `public/images/city-edit.jpg`
- ارفق: `coat-black-front.png`، `knit-cream-front.png`، `shirt-striped-front.png`

```text
Create an original editorial photograph for Madar.
Use the attached APPROVED PRODUCT MASTERS (coat-black-front.png, knit-cream-front.png, shirt-striped-front.png) as exact clothing references. Do not redesign, recolor or restyle them.
Scene: A close detail at the neck showing three layers: the striped shirt collar, the cream knit and the black coat lapel.
Composition: Vertical.
Size: 1600 x 2000 px.
House style: quiet premium editorial for Madar, a men's and children's clothing label. Warm neutral palette of limestone, sand, camel, taupe and soft ink; soft directional natural light; matte, believable fabric texture; calm composition with generous negative space; natural skin texture; relaxed, dignified posture.
If a reference photograph is attached, use it only for mood, light and composition; never copy the person, face, exact scene or any third-party element.
Avoid: any text, letters, numbers, logos, brand marks, watermarks, signage, price tags or labels; distorted hands or extra fingers; plastic-looking fabric; oversaturated color; heavy retouching; busy backgrounds; collages, grids or split frames.
```

### 9.5 مكتبة الخامات (جديد)

**M01** · `material-camel-coat.jpg` · 1600×1600 · مكتبة الخامات (فكرة جديدة)
- الريفرنس: من الصفر — بدون ريفرنس
- ارفق: `coat-camel-front.png`
- ملاحظة: صورة بصرية فقط؛ قبل الإطلاق تُستبدل بماكرو حقيقي للخامة نفسها، ولا يُكتب تركيب الخامة إلا من بطاقة معتمدة. مرجع إضافي: `public/downloads/madar-reference-pack.zip` ← المجلد `02-received-coat-concepts/`: `coat_front_isolated.png`، `coat_back_isolated.png`، `coat_detail_collar_shoulder.jpg`، `coat_detail_pocket_buttons.jpg`

```text
Create an original editorial photograph for Madar.
Use the attached APPROVED PRODUCT MASTERS (coat-camel-front.png) as exact clothing references. Do not redesign, recolor or restyle them.
Scene: A macro photograph of a dense brushed camel coat fabric with one row of fine edge stitching, matching the approved garment exactly; soft raking light; the texture fills the frame.
Composition: Square, even texture to all edges.
Size: 1600 x 1600 px.
House style: quiet premium editorial for Madar, a men's and children's clothing label. Warm neutral palette of limestone, sand, camel, taupe and soft ink; soft directional natural light; matte, believable fabric texture; calm composition with generous negative space; natural skin texture; relaxed, dignified posture.
Avoid: any text, letters, numbers, logos, brand marks, watermarks, signage, price tags or labels; distorted hands or extra fingers; plastic-looking fabric; oversaturated color; heavy retouching; busy backgrounds; collages, grids or split frames.
```

**M02** · `material-rib-knit.jpg` · 1600×1600 · مكتبة الخامات (فكرة جديدة)
- الريفرنس: U05 `public/images/knit-cream.jpg`
- ارفق: `knit-cream-front.png`
- ملاحظة: صورة بصرية فقط؛ قبل الإطلاق تُستبدل بماكرو حقيقي للخامة نفسها، ولا يُكتب تركيب الخامة إلا من بطاقة معتمدة.

```text
Create an original editorial photograph for Madar.
Use the attached APPROVED PRODUCT MASTERS (knit-cream-front.png) as exact clothing references. Do not redesign, recolor or restyle them.
Scene: A macro photograph of a cream rib knit with vertical wales, matching the approved garment exactly; soft raking light; the texture fills the frame.
Composition: Square, even texture to all edges.
Size: 1600 x 1600 px.
House style: quiet premium editorial for Madar, a men's and children's clothing label. Warm neutral palette of limestone, sand, camel, taupe and soft ink; soft directional natural light; matte, believable fabric texture; calm composition with generous negative space; natural skin texture; relaxed, dignified posture.
If a reference photograph is attached, use it only for mood, light and composition; never copy the person, face, exact scene or any third-party element.
Avoid: any text, letters, numbers, logos, brand marks, watermarks, signage, price tags or labels; distorted hands or extra fingers; plastic-looking fabric; oversaturated color; heavy retouching; busy backgrounds; collages, grids or split frames.
```

**M03** · `material-suiting.jpg` · 1600×1600 · مكتبة الخامات (فكرة جديدة)
- الريفرنس: U07 `public/images/madar-source/62e5f3ed58-madar-m-suit-chair.jpg`
- ارفق: `suit-charcoal-front.png`
- ملاحظة: صورة بصرية فقط؛ قبل الإطلاق تُستبدل بماكرو حقيقي للخامة نفسها، ولا يُكتب تركيب الخامة إلا من بطاقة معتمدة.

```text
Create an original editorial photograph for Madar.
Use the attached APPROVED PRODUCT MASTERS (suit-charcoal-front.png) as exact clothing references. Do not redesign, recolor or restyle them.
Scene: A macro photograph of a charcoal fine twill suiting weave, matching the approved garment exactly; soft raking light; the texture fills the frame.
Composition: Square, even texture to all edges.
Size: 1600 x 1600 px.
House style: quiet premium editorial for Madar, a men's and children's clothing label. Warm neutral palette of limestone, sand, camel, taupe and soft ink; soft directional natural light; matte, believable fabric texture; calm composition with generous negative space; natural skin texture; relaxed, dignified posture.
If a reference photograph is attached, use it only for mood, light and composition; never copy the person, face, exact scene or any third-party element.
Avoid: any text, letters, numbers, logos, brand marks, watermarks, signage, price tags or labels; distorted hands or extra fingers; plastic-looking fabric; oversaturated color; heavy retouching; busy backgrounds; collages, grids or split frames.
```

**M04** · `material-striped-shirting.jpg` · 1600×1600 · مكتبة الخامات (فكرة جديدة)
- الريفرنس: من الصفر — بدون ريفرنس
- ارفق: `shirt-striped-front.png`
- ملاحظة: صورة بصرية فقط؛ قبل الإطلاق تُستبدل بماكرو حقيقي للخامة نفسها، ولا يُكتب تركيب الخامة إلا من بطاقة معتمدة.

```text
Create an original editorial photograph for Madar.
Use the attached APPROVED PRODUCT MASTERS (shirt-striped-front.png) as exact clothing references. Do not redesign, recolor or restyle them.
Scene: A macro photograph of off-white shirting with fine navy stripes, a button and its buttonhole, matching the approved garment exactly; soft raking light; the texture fills the frame.
Composition: Square, even texture to all edges.
Size: 1600 x 1600 px.
House style: quiet premium editorial for Madar, a men's and children's clothing label. Warm neutral palette of limestone, sand, camel, taupe and soft ink; soft directional natural light; matte, believable fabric texture; calm composition with generous negative space; natural skin texture; relaxed, dignified posture.
Avoid: any text, letters, numbers, logos, brand marks, watermarks, signage, price tags or labels; distorted hands or extra fingers; plastic-looking fabric; oversaturated color; heavy retouching; busy backgrounds; collages, grids or split frames.
```

**M05** · `material-kids-jersey.jpg` · 1600×1600 · مكتبة الخامات (فكرة جديدة)
- الريفرنس: من الصفر — بدون ريفرنس
- ارفق: `kids-sweatshirt-striped-front.png`
- ملاحظة: صورة بصرية فقط؛ قبل الإطلاق تُستبدل بماكرو حقيقي للخامة نفسها، ولا يُكتب تركيب الخامة إلا من بطاقة معتمدة.

```text
Create an original editorial photograph for Madar.
Use the attached APPROVED PRODUCT MASTERS (kids-sweatshirt-striped-front.png) as exact clothing references. Do not redesign, recolor or restyle them.
Scene: A macro photograph of a soft striped navy-and-cream jersey next to a rib collar, matching the approved garment exactly; soft raking light; the texture fills the frame.
Composition: Square, even texture to all edges.
Size: 1600 x 1600 px.
House style: quiet premium editorial for Madar, a men's and children's clothing label. Warm neutral palette of limestone, sand, camel, taupe and soft ink; soft directional natural light; matte, believable fabric texture; calm composition with generous negative space; natural skin texture; relaxed, dignified posture.
Avoid: any text, letters, numbers, logos, brand marks, watermarks, signage, price tags or labels; distorted hands or extra fingers; plastic-looking fabric; oversaturated color; heavy retouching; busy backgrounds; collages, grids or split frames.
```

### 9.6 عن مدار

**A01** · `about-portrait.jpg` · 1200×1800 · عن مدار: البورتريه
- الريفرنس: U01 `public/images/coat-camel.jpg`
- ارفق: `coat-camel-front.png`، `knit-cream-front.png`

```text
Create an original editorial photograph for Madar.
Use the attached APPROVED PRODUCT MASTERS (coat-camel-front.png, knit-cream-front.png) as exact clothing references. Do not redesign, recolor or restyle them.
Scene: A quiet portrait of a man seated on a low stone bench in a limestone interior, wearing the approved camel coat over the cream knit, looking out of frame.
Composition: Vertical; subject centered.
Size: 1200 x 1800 px.
House style: quiet premium editorial for Madar, a men's and children's clothing label. Warm neutral palette of limestone, sand, camel, taupe and soft ink; soft directional natural light; matte, believable fabric texture; calm composition with generous negative space; natural skin texture; relaxed, dignified posture.
If a reference photograph is attached, use it only for mood, light and composition; never copy the person, face, exact scene or any third-party element.
Avoid: any text, letters, numbers, logos, brand marks, watermarks, signage, price tags or labels; distorted hands or extra fingers; plastic-looking fabric; oversaturated color; heavy retouching; busy backgrounds; collages, grids or split frames.
```

**A02** · `about-still-life.jpg` · 2400×1600 · عن مدار: طبيعة صامتة
- الريفرنس: U12 `public/images/story-wardrobe.jpg`
- ارفق: `knit-cream-front.png`، `overshirt-front.png`، `shirt-striped-front.png`

```text
Create an original editorial photograph for Madar.
Use the attached APPROVED PRODUCT MASTERS (knit-cream-front.png, overshirt-front.png, shirt-striped-front.png) as exact clothing references. Do not redesign, recolor or restyle them.
Scene: A long pale oak table with neatly folded approved garments, a coiled cloth tape measure and soft daylight. Do not imply a specific workshop or manufacturing claim.
Composition: Landscape.
Size: 2400 x 1600 px.
House style: quiet premium editorial for Madar, a men's and children's clothing label. Warm neutral palette of limestone, sand, camel, taupe and soft ink; soft directional natural light; matte, believable fabric texture; calm composition with generous negative space; natural skin texture; relaxed, dignified posture.
If a reference photograph is attached, use it only for mood, light and composition; never copy the person, face, exact scene or any third-party element.
Avoid: any text, letters, numbers, logos, brand marks, watermarks, signage, price tags or labels; distorted hands or extra fingers; plastic-looking fabric; oversaturated color; heavy retouching; busy backgrounds; collages, grids or split frames.
```

### 9.7 مختار الأسلوب

**SF01** · `style-audience-men.jpg` · 1200×1500 · مختار الأسلوب
- الريفرنس: U01 `public/images/coat-camel.jpg`
- ارفق: `coat-camel-front.png`

```text
Create an original editorial photograph for Madar.
Use the attached APPROVED PRODUCT MASTERS (coat-camel-front.png) as exact clothing references. Do not redesign, recolor or restyle them.
Scene: A man in the approved camel coat in three-quarter view against a limestone wall.
Composition: Vertical card; subject centered.
Size: 1200 x 1500 px.
House style: quiet premium editorial for Madar, a men's and children's clothing label. Warm neutral palette of limestone, sand, camel, taupe and soft ink; soft directional natural light; matte, believable fabric texture; calm composition with generous negative space; natural skin texture; relaxed, dignified posture.
If a reference photograph is attached, use it only for mood, light and composition; never copy the person, face, exact scene or any third-party element.
Avoid: any text, letters, numbers, logos, brand marks, watermarks, signage, price tags or labels; distorted hands or extra fingers; plastic-looking fabric; oversaturated color; heavy retouching; busy backgrounds; collages, grids or split frames.
```

**SF02** · `style-audience-kids.jpg` · 1200×1500 · مختار الأسلوب
- الريفرنس: U03 `public/images/kids-adventure.jpg`
- ارفق: `kids-tee-striped-front.png`

```text
Create an original editorial photograph for Madar.
Use the attached APPROVED PRODUCT MASTERS (kids-tee-striped-front.png) as exact clothing references. Do not redesign, recolor or restyle them.
Scene: A child in the approved striped T-shirt in a bright courtyard.
Composition: Vertical card; subject centered.
Size: 1200 x 1500 px.
House style: quiet premium editorial for Madar, a men's and children's clothing label. Warm neutral palette of limestone, sand, camel, taupe and soft ink; soft directional natural light; matte, believable fabric texture; calm composition with generous negative space; natural skin texture; relaxed, dignified posture.
The child appears 4–6 years old, in modest, age-appropriate everyday clothing, with a natural relaxed expression, in a calm and safe setting; no adult styling, no makeup, no posed adult attitude.
If a reference photograph is attached, use it only for mood, light and composition; never copy the person, face, exact scene or any third-party element.
Avoid: any text, letters, numbers, logos, brand marks, watermarks, signage, price tags or labels; distorted hands or extra fingers; plastic-looking fabric; oversaturated color; heavy retouching; busy backgrounds; collages, grids or split frames.
```

**SF03** · `style-occasion-everyday.jpg` · 1200×1500 · مختار الأسلوب
- الريفرنس: U10 `public/images/madar-source/ce640db2e5-madar-m-white-wall.jpg`
- ارفق: `overshirt-front.png`، `trouser-stone-front.png`

```text
Create an original editorial photograph for Madar.
Use the attached APPROVED PRODUCT MASTERS (overshirt-front.png, trouser-stone-front.png) as exact clothing references. Do not redesign, recolor or restyle them.
Scene: A man walking through a sunlit neighborhood street in the approved overshirt and stone chinos.
Composition: Vertical card; subject centered.
Size: 1200 x 1500 px.
House style: quiet premium editorial for Madar, a men's and children's clothing label. Warm neutral palette of limestone, sand, camel, taupe and soft ink; soft directional natural light; matte, believable fabric texture; calm composition with generous negative space; natural skin texture; relaxed, dignified posture.
If a reference photograph is attached, use it only for mood, light and composition; never copy the person, face, exact scene or any third-party element.
Avoid: any text, letters, numbers, logos, brand marks, watermarks, signage, price tags or labels; distorted hands or extra fingers; plastic-looking fabric; oversaturated color; heavy retouching; busy backgrounds; collages, grids or split frames.
```

**SF04** · `style-occasion-smart.jpg` · 1200×1500 · مختار الأسلوب
- الريفرنس: U07 `public/images/madar-source/62e5f3ed58-madar-m-suit-chair.jpg`
- ارفق: `suit-charcoal-front.png`

```text
Create an original editorial photograph for Madar.
Use the attached APPROVED PRODUCT MASTERS (suit-charcoal-front.png) as exact clothing references. Do not redesign, recolor or restyle them.
Scene: A man in the approved charcoal suit by tall window light.
Composition: Vertical card; subject centered.
Size: 1200 x 1500 px.
House style: quiet premium editorial for Madar, a men's and children's clothing label. Warm neutral palette of limestone, sand, camel, taupe and soft ink; soft directional natural light; matte, believable fabric texture; calm composition with generous negative space; natural skin texture; relaxed, dignified posture.
If a reference photograph is attached, use it only for mood, light and composition; never copy the person, face, exact scene or any third-party element.
Avoid: any text, letters, numbers, logos, brand marks, watermarks, signage, price tags or labels; distorted hands or extra fingers; plastic-looking fabric; oversaturated color; heavy retouching; busy backgrounds; collages, grids or split frames.
```

**SF05** · `style-occasion-layers.jpg` · 1200×1500 · مختار الأسلوب
- الريفرنس: U11 `public/images/city-edit.jpg`
- ارفق: `coat-black-front.png`، `knit-cream-front.png`

```text
Create an original editorial photograph for Madar.
Use the attached APPROVED PRODUCT MASTERS (coat-black-front.png, knit-cream-front.png) as exact clothing references. Do not redesign, recolor or restyle them.
Scene: A man in the approved black coat over the cream knit on a cool city morning.
Composition: Vertical card; subject centered.
Size: 1200 x 1500 px.
House style: quiet premium editorial for Madar, a men's and children's clothing label. Warm neutral palette of limestone, sand, camel, taupe and soft ink; soft directional natural light; matte, believable fabric texture; calm composition with generous negative space; natural skin texture; relaxed, dignified posture.
If a reference photograph is attached, use it only for mood, light and composition; never copy the person, face, exact scene or any third-party element.
Avoid: any text, letters, numbers, logos, brand marks, watermarks, signage, price tags or labels; distorted hands or extra fingers; plastic-looking fabric; oversaturated color; heavy retouching; busy backgrounds; collages, grids or split frames.
```

**SF06** · `style-palette-earth.jpg` · 1200×1500 · مختار الأسلوب
- الريفرنس: U15 `public/images/madar-source/0bda28db66-f-shoes.jpg`
- ارفق: `coat-camel-front.png`، `overshirt-front.png`، `kids-shirt-brown-front.png`

```text
Create an original editorial photograph for Madar.
Use the attached APPROVED PRODUCT MASTERS (coat-camel-front.png, overshirt-front.png, kids-shirt-brown-front.png) as exact clothing references. Do not redesign, recolor or restyle them.
Scene: A top-down flat lay of the camel, taupe and brown approved garments on warm linen.
Composition: Vertical card; subject centered.
Size: 1200 x 1500 px.
House style: quiet premium editorial for Madar, a men's and children's clothing label. Warm neutral palette of limestone, sand, camel, taupe and soft ink; soft directional natural light; matte, believable fabric texture; calm composition with generous negative space; natural skin texture; relaxed, dignified posture.
If a reference photograph is attached, use it only for mood, light and composition; never copy the person, face, exact scene or any third-party element.
Avoid: any text, letters, numbers, logos, brand marks, watermarks, signage, price tags or labels; distorted hands or extra fingers; plastic-looking fabric; oversaturated color; heavy retouching; busy backgrounds; collages, grids or split frames.
```

**SF07** · `style-palette-mono.jpg` · 1200×1500 · مختار الأسلوب
- الريفرنس: U15 `public/images/madar-source/0bda28db66-f-shoes.jpg`
- ارفق: `coat-black-front.png`، `suit-charcoal-front.png`

```text
Create an original editorial photograph for Madar.
Use the attached APPROVED PRODUCT MASTERS (coat-black-front.png, suit-charcoal-front.png) as exact clothing references. Do not redesign, recolor or restyle them.
Scene: A top-down flat lay of the black and charcoal approved garments on pale stone.
Composition: Vertical card; subject centered.
Size: 1200 x 1500 px.
House style: quiet premium editorial for Madar, a men's and children's clothing label. Warm neutral palette of limestone, sand, camel, taupe and soft ink; soft directional natural light; matte, believable fabric texture; calm composition with generous negative space; natural skin texture; relaxed, dignified posture.
If a reference photograph is attached, use it only for mood, light and composition; never copy the person, face, exact scene or any third-party element.
Avoid: any text, letters, numbers, logos, brand marks, watermarks, signage, price tags or labels; distorted hands or extra fingers; plastic-looking fabric; oversaturated color; heavy retouching; busy backgrounds; collages, grids or split frames.
```

**SF08** · `style-palette-light.jpg` · 1200×1500 · مختار الأسلوب
- الريفرنس: U15 `public/images/madar-source/0bda28db66-f-shoes.jpg`
- ارفق: `knit-cream-front.png`، `shirt-striped-front.png`، `kids-tee-striped-front.png`

```text
Create an original editorial photograph for Madar.
Use the attached APPROVED PRODUCT MASTERS (knit-cream-front.png, shirt-striped-front.png, kids-tee-striped-front.png) as exact clothing references. Do not redesign, recolor or restyle them.
Scene: A top-down flat lay of the cream, off-white and pale approved garments on pale oak.
Composition: Vertical card; subject centered.
Size: 1200 x 1500 px.
House style: quiet premium editorial for Madar, a men's and children's clothing label. Warm neutral palette of limestone, sand, camel, taupe and soft ink; soft directional natural light; matte, believable fabric texture; calm composition with generous negative space; natural skin texture; relaxed, dignified posture.
If a reference photograph is attached, use it only for mood, light and composition; never copy the person, face, exact scene or any third-party element.
Avoid: any text, letters, numbers, logos, brand marks, watermarks, signage, price tags or labels; distorted hands or extra fingers; plastic-looking fabric; oversaturated color; heavy retouching; busy backgrounds; collages, grids or split frames.
```

### 9.8 خدمات VIP (مشروطة)

**V01** · `vip-styling-appointment.jpg` · 2400×1350 · موعد تنسيق خاص
- الريفرنس: من الصفر — بدون ريفرنس
- ارفق: `coat-camel-front.png`
- **مشروطة بوجود الخدمة فعلًا**

```text
Create an original editorial photograph for Madar.
Use the attached APPROVED PRODUCT MASTERS (coat-camel-front.png) as exact clothing references. Do not redesign, recolor or restyle them.
Scene: A calm private fitting room with a full-length mirror; a stylist's hand adjusts the lapel of the approved camel coat on a client; faces mostly out of frame.
Composition: Direction-neutral composition that works for Arabic (RTL) and Latin (LTR) layouts: subject centered, calm uncluttered lower 30 percent for overlaid copy, nothing important near the left or right edges. Never mirror the garment.
Size: 2400 x 1350 px.
House style: quiet premium editorial for Madar, a men's and children's clothing label. Warm neutral palette of limestone, sand, camel, taupe and soft ink; soft directional natural light; matte, believable fabric texture; calm composition with generous negative space; natural skin texture; relaxed, dignified posture.
Avoid: any text, letters, numbers, logos, brand marks, watermarks, signage, price tags or labels; distorted hands or extra fingers; plastic-looking fabric; oversaturated color; heavy retouching; busy backgrounds; collages, grids or split frames.
```

**V02** · `vip-early-access.jpg` · 2400×1350 · معاينة مبكرة للأعضاء
- الريفرنس: من الصفر — بدون ريفرنس
- ارفق: `coat-black-front.png`
- **مشروطة بوجود إصدارات حقيقية**

```text
Create an original editorial photograph for Madar.
Use the attached APPROVED PRODUCT MASTERS (coat-black-front.png) as exact clothing references. Do not redesign, recolor or restyle them.
Scene: A single garment on a pale wooden hanger, partly covered by a sheer unbranded linen garment cover, in soft directional light; a sense of quiet anticipation.
Composition: Direction-neutral composition that works for Arabic (RTL) and Latin (LTR) layouts: subject centered, calm uncluttered lower 30 percent for overlaid copy, nothing important near the left or right edges. Never mirror the garment.
Size: 2400 x 1350 px.
House style: quiet premium editorial for Madar, a men's and children's clothing label. Warm neutral palette of limestone, sand, camel, taupe and soft ink; soft directional natural light; matte, believable fabric texture; calm composition with generous negative space; natural skin texture; relaxed, dignified posture.
Avoid: any text, letters, numbers, logos, brand marks, watermarks, signage, price tags or labels; distorted hands or extra fingers; plastic-looking fabric; oversaturated color; heavy retouching; busy backgrounds; collages, grids or split frames.
```

### 9.9 غرفة القياس

**FR01** · `fitting-room-backdrop.jpg` · 2400×1600 · غرفة القياس: خلفية اختيارية
- الريفرنس: من الصفر — بدون ريفرنس

```text
Create an original editorial photograph for Madar.
Scene: An empty warm plaster wall with a soft vertical light gradient. No objects.
Composition: Perfectly even, no focal point.
Size: 2400 x 1600 px.
House style: quiet premium editorial for Madar, a men's and children's clothing label. Warm neutral palette of limestone, sand, camel, taupe and soft ink; soft directional natural light; matte, believable fabric texture; calm composition with generous negative space; natural skin texture; relaxed, dignified posture.
Avoid: any text, letters, numbers, logos, brand marks, watermarks, signage, price tags or labels; distorted hands or extra fingers; plastic-looking fabric; oversaturated color; heavy retouching; busy backgrounds; collages, grids or split frames.
```

### 9.10 الحالات الفاضية والتأكيد

**E01** · `state-empty-bag.jpg` · 1600×1200 · السلة الفاضية
- الريفرنس: من الصفر — بدون ريفرنس

```text
Create an original editorial photograph for Madar.
Scene: A single empty pale wooden hanger on a simple wall hook against warm plaster, with a soft shadow.
Composition: Object slightly above center; calm space below for copy.
Size: 1600 x 1200 px.
House style: quiet premium editorial for Madar, a men's and children's clothing label. Warm neutral palette of limestone, sand, camel, taupe and soft ink; soft directional natural light; matte, believable fabric texture; calm composition with generous negative space; natural skin texture; relaxed, dignified posture.
Avoid: any text, letters, numbers, logos, brand marks, watermarks, signage, price tags or labels; distorted hands or extra fingers; plastic-looking fabric; oversaturated color; heavy retouching; busy backgrounds; collages, grids or split frames.
```

**E02** · `state-empty-wardrobe.jpg` · 1600×1200 · «خزانتي» الفاضية
- الريفرنس: من الصفر — بدون ريفرنس
- ارفق: `knit-cream-front.png`

```text
Create an original editorial photograph for Madar.
Use the attached APPROVED PRODUCT MASTERS (knit-cream-front.png) as exact clothing references. Do not redesign, recolor or restyle them.
Scene: An empty pale oak shelf with one neatly folded approved cream knit at the far end.
Composition: Calm space for copy.
Size: 1600 x 1200 px.
House style: quiet premium editorial for Madar, a men's and children's clothing label. Warm neutral palette of limestone, sand, camel, taupe and soft ink; soft directional natural light; matte, believable fabric texture; calm composition with generous negative space; natural skin texture; relaxed, dignified posture.
Avoid: any text, letters, numbers, logos, brand marks, watermarks, signage, price tags or labels; distorted hands or extra fingers; plastic-looking fabric; oversaturated color; heavy retouching; busy backgrounds; collages, grids or split frames.
```

**E03** · `state-not-found.jpg` · 1600×1200 · صفحة 404
- الريفرنس: من الصفر — بدون ريفرنس
- ارفق: `coat-camel-front.png`

```text
Create an original editorial photograph for Madar.
Use the attached APPROVED PRODUCT MASTERS (coat-camel-front.png) as exact clothing references. Do not redesign, recolor or restyle them.
Scene: An empty limestone room with a single wooden chair; the approved camel coat draped over its back; a door slightly open; soft light.
Composition: Calm space for copy.
Size: 1600 x 1200 px.
House style: quiet premium editorial for Madar, a men's and children's clothing label. Warm neutral palette of limestone, sand, camel, taupe and soft ink; soft directional natural light; matte, believable fabric texture; calm composition with generous negative space; natural skin texture; relaxed, dignified posture.
Avoid: any text, letters, numbers, logos, brand marks, watermarks, signage, price tags or labels; distorted hands or extra fingers; plastic-looking fabric; oversaturated color; heavy retouching; busy backgrounds; collages, grids or split frames.
```

**E04** · `state-order-confirmed.jpg` · 1600×1200 · تأكيد الطلب
- الريفرنس: من الصفر — بدون ريفرنس
- ارفق: `knit-cream-front.png`
- ملاحظة: لا نَعِد بتغليف معين قبل اعتماده تشغيليًا.

```text
Create an original editorial photograph for Madar.
Use the attached APPROVED PRODUCT MASTERS (knit-cream-front.png) as exact clothing references. Do not redesign, recolor or restyle them.
Scene: A folded garment wrapped in plain unbranded off-white tissue paper, tied with a natural cotton ribbon on a linen surface.
Composition: Calm space for copy.
Size: 1600 x 1200 px.
House style: quiet premium editorial for Madar, a men's and children's clothing label. Warm neutral palette of limestone, sand, camel, taupe and soft ink; soft directional natural light; matte, believable fabric texture; calm composition with generous negative space; natural skin texture; relaxed, dignified posture.
Avoid: any text, letters, numbers, logos, brand marks, watermarks, signage, price tags or labels; distorted hands or extra fingers; plastic-looking fabric; oversaturated color; heavy retouching; busy backgrounds; collages, grids or split frames.
```

### 9.11 الإيميلات

**EM01** · `email-order.jpg` · 1200×600 · إيميل الطلب
- الريفرنس: من الصفر — بدون ريفرنس
- ارفق: `knit-cream-front.png`

```text
Create an original editorial photograph for Madar.
Use the attached APPROVED PRODUCT MASTERS (knit-cream-front.png) as exact clothing references. Do not redesign, recolor or restyle them.
Scene: The same wrapped garment as the order confirmation, composed as a wide email banner.
Composition: Object in the central third.
Size: 1200 x 600 px.
House style: quiet premium editorial for Madar, a men's and children's clothing label. Warm neutral palette of limestone, sand, camel, taupe and soft ink; soft directional natural light; matte, believable fabric texture; calm composition with generous negative space; natural skin texture; relaxed, dignified posture.
Avoid: any text, letters, numbers, logos, brand marks, watermarks, signage, price tags or labels; distorted hands or extra fingers; plastic-looking fabric; oversaturated color; heavy retouching; busy backgrounds; collages, grids or split frames.
```

**EM02** · `email-back-in-stock.jpg` · 1200×600 · إيميل رجوع المقاس
- الريفرنس: من الصفر — بدون ريفرنس
- ارفق: `coat-camel-front.png`

```text
Create an original editorial photograph for Madar.
Use the attached APPROVED PRODUCT MASTERS (coat-camel-front.png) as exact clothing references. Do not redesign, recolor or restyle them.
Scene: The approved camel coat hanging alone on a simple rail in soft morning light.
Composition: Object in the central third.
Size: 1200 x 600 px.
House style: quiet premium editorial for Madar, a men's and children's clothing label. Warm neutral palette of limestone, sand, camel, taupe and soft ink; soft directional natural light; matte, believable fabric texture; calm composition with generous negative space; natural skin texture; relaxed, dignified posture.
Avoid: any text, letters, numbers, logos, brand marks, watermarks, signage, price tags or labels; distorted hands or extra fingers; plastic-looking fabric; oversaturated color; heavy retouching; busy backgrounds; collages, grids or split frames.
```

### 9.12 المشاركة

**OG01** · `og-default.jpg` · 1200×630 · صورة المشاركة الافتراضية
- الريفرنس: U01 `public/images/coat-camel.jpg`
- ارفق: `coat-camel-front.png`

```text
Create an original editorial photograph for Madar.
Use the attached APPROVED PRODUCT MASTERS (coat-camel-front.png) as exact clothing references. Do not redesign, recolor or restyle them.
Scene: A man in the approved camel coat against a warm limestone wall.
Composition: Subject centered; calm left and right thirds for the brand mark added in code.
Size: 1200 x 630 px.
House style: quiet premium editorial for Madar, a men's and children's clothing label. Warm neutral palette of limestone, sand, camel, taupe and soft ink; soft directional natural light; matte, believable fabric texture; calm composition with generous negative space; natural skin texture; relaxed, dignified posture.
If a reference photograph is attached, use it only for mood, light and composition; never copy the person, face, exact scene or any third-party element.
Avoid: any text, letters, numbers, logos, brand marks, watermarks, signage, price tags or labels; distorted hands or extra fingers; plastic-looking fabric; oversaturated color; heavy retouching; busy backgrounds; collages, grids or split frames.
```

## 10. خريطة الاستبدال: القديم ← الجديد

| الاستخدام الحالي | الصورة الحالية | الجديد |
|---|---|---|
| Hero الرئيسية | U01 + U02 | H01 + H02 |
| عالما الرجال والأطفال | U01، U03 | H03، H04 |
| تصنيفات الرئيسية | U01، U13، U05، U03 | H05–H08 |
| مختارات الرئيسية والكتالوج | U01–U10، U13، U14، U16، U17 | صور المنتجات §7 (on-model رئيسية، front بديلة) |
| مشهد التمرير، والعمود المرن، وأثر المؤشر | U01، U02، U03، U13 | تتقاعد: يحل محلها مشهد واحد (H01) + معاينة المدار (H09/H10) |
| حملة المدينة | U11 | H11 + H12 |
| الإطلالات | 7627380c25، e1dcc22587، 7c6a9e1453، c14434c159، fd1d8858ee، e05a716c31، 7e6ebb435b، 62fef2cbdc | L01–L04D |
| قصص الدفتر | U12، U03، U11، وصور قصة «معطف واحد» | J01–J04B |
| عن مدار | U01، U11، U03 | A01، H03، H04، A02 |
| مختار الأسلوب | U01، U03، U11 + خيارات بلا صور | SF01–SF08 |
| صورة المشاركة الافتراضية | U01 | OG01 |

## 11. عدّ الإنتاج

| المجموعة | العدد |
|---|---|
| صور المنتجات العشرة (5 لكل قطعة) | 50 |
| قطع التنسيق الثلاث (3 لكل قطعة) | 9 |
| صور تحريرية وصفحات | 57 (منها 2 مشروطة) |
| **الإجمالي** | **116** |

ابدأ بالموجة 1 (13 صورة أمامية). بعد اعتمادها، كل الباقي يتولد بإرفاقها.

## 12. قائمة فحص قبل اعتماد أي صورة

- [ ] المقاس مطابق، والـPNG شفاف فعلًا (مش أبيض أو مربعات مرسومة).
- [ ] الأزرار والخياطات والخطوط واللون مطابقة للماستر في كل الزوايا.
- [ ] الأمام والخلف بنفس المقياس والمحاذاة.
- [ ] لا نص ولا لوجو ولا علامة مائية، ولا أيدي مشوهة.
- [ ] الصورة غير معكوسة.
- [ ] التكوين يترك مساحة النص المطلوبة، ويصلح للاتجاهين.
- [ ] الأطفال: تعبير طبيعي ولبس مناسب للسن.
- [ ] الصورة المولدة متعلّمة كـ«تصوّر» في بيانات الوسائط إلى أن تُستبدل بتصوير حقيقي.
