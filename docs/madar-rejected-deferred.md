# مدار — المرفوض والمؤجل

ده الملف المنفصل لكل فكرة مش داخلة في الخطة الحالية: إما **مرفوضة** وسبب رفضها، أو **مؤجلة** والشرط اللي يفتحها. الخطة المعتمدة في `docs/madar-master-plan.md`.

## 1. مرفوض — مش هنعمله

| الفكرة | السبب | البديل المعتمد |
|---|---|---|
| لف صورة مسطحة وتسميتها «عرض 360» | خداع بصري؛ صورتان لا تُظهران الجوانب | قلب أمام/خلف داخل «غرفة القياس» |
| تمديد صورة الشخص لعمل «مقارنة قصّات» | لا يمثل قصّة حقيقية | مقارنة بصور حقيقية للقصّتين (مؤجل) |
| تغيير لون القماش بفلتر Hue | يغيّر الجلد والخلفية ويعطي لونًا غير حقيقي | صورة حقيقية لكل لون |
| «آخر قطعة»، عدد المشترين، عدّاد المشاهدات بدون بيانات | يكسر الثقة، وده عكس فكرة الـVIP | المخزون الحقيقي بعد الباك إند فقط |
| نسبة ثقة في المقاس («M مناسب لك 98٪») | لا يوجد نموذج أو بيانات تبررها | «ليه المقاس ده؟» بالنطاقات وحالة «بين مقاسين» |
| تقييمات أو آراء عملاء مكتوبة من عندنا | غير حقيقية | تقييمات حقيقية بمراجعة (مؤجل) |
| سحب إجباري للسكرول في كل صفحة | يعطل القراءة والاختيار | مشهد تمرير واحد في الرئيسية فقط |
| ستارة افتتاح طويلة كل زيارة | تأخير مزعج | انتقال دخول قصير ≤ 600ms مرة واحدة |
| مؤشر ماوس مخصص يغطي المنتج | يحجب القطعة | المؤشر العادي |
| أثر صور يلاحق المؤشر | مؤثر استعراضي بلا قرار | «المدار» كتوقيع واحد |
| فيديوهات ثقيلة متعددة أعلى الصفحة، وصوت تلقائي | أداء سيئ وإزعاج | فيديو ارتداء قصير بدون صوت (مؤجل) |
| وظيفة مهمة تشتغل بالـHover فقط | لا تعمل باللمس ولا الكيبورد | ضغط/تركيز لكل تفاعل |
| صفحة جديدة لكل اختيار صغير | قطع الرحلة | لوحات جانبية داخل نفس الصفحة |
| عكس الصور لتناسب RTL | يقلب الأزرار واتجاه الإغلاق | صور بتكوين محايد الاتجاه |
| توليد الشعار أو شعارات الدفع بالذكاء الاصطناعي | هوية وعلامات تجارية | شعار فيكتور يدوي + شعارات رسمية |
| وصف خامات أو منشأ غير مؤكد («صوف بكر إيطالي»، «كشمير») | ادعاء تجاري غير موثق | الوصف من بطاقة خامة معتمدة فقط |

## 2. يتشال من الواجهة الحالية عند إعادة البناء

موجود فعلًا في الكود الآن، ويتعارض مع التوجه الجديد:

| العنصر | المكان | القرار |
|---|---|---|
| ستارة الافتتاح «MADAR / مدار» | `src/components/Home.tsx` (`motion-curtain`) | تُشال، أو تتحول لانتقال قصير مرة واحدة |
| أثر المؤشر | `src/useMadarEffects.ts` + قسم `motion-trail` | يُشال |
| قائمة «Motion Playground» | `src/components/Home.tsx` (`motion-guide`) | تُشال من رحلة الشراء؛ تنتقل لصفحة تجارب لو حبيت تحتفظ بيها |
| العمود المرن متعدد الإيقاع | قسم `motion-elastic` | يُشال |
| الشريط المتحرك | `Marquee` في الرئيسية | اختياري: يبقى بإيقاف واضح أو يُشال (نميل للشيل) |
| أسعار «قبل الخصم» (1890، 2490) | `src/data.ts` | تتشال من الكود وتيجي من أسعار التخفيض في WooCommerce. مصدرها متجر المرجع، ومحتاجة مراجعتك قبل الإطلاق |
| أسماء منتجات الرئيسية المختلفة عن الكتالوج | `src/data.ts` | توحيد الاسم من الباك إند |
| المنتجات والصفحات التجريبية من ووردبريس | الكتالوج + `Hello world` و`Sample Page` | تختفي من التجربة التجارية، مع تحويلات للروابط |

## 3. مؤجل — بشرط

| الفكرة | التصنيف | الشرط اللي يفتحها | ملاحظات |
|---|---|---|---|
| مقارنة لونين للقطعة نفسها جنبًا إلى جنب | موافق، مؤجل | صور حقيقية لكل لون بنفس الزاوية | الكود جاهز أول ما تتوفر الصور |
| لون الصورة مقابل لون القماش (إضاءتان) | موافق، مؤجل | صورتان حقيقيتان بإضاءتين + تنبيه أن الشاشة لا تضمن اللون | — |
| مقارنة Regular وRelaxed | موافق، مؤجل | تصوير القصّتين على نفس الموديل + قياسات | — |
| مقارنة S وM برسم أبعاد | موافق، مؤجل | قياسات فعلية لكل مقاس ولكل منتج | الرسم فيكتور يتولد من البيانات |
| معلومات الموديل (الطول والمقاس المرتدى) | موافق، مؤجل | بيانات تصوير حقيقية | ممنوع مع صور مولدة |
| عدسة ماكرو حقيقية للخامة | موافق، مؤجل | ماكرو حقيقي عالي الدقة | العدسة الحالية في الخطة تشتغل ضمن دقة الصورة |
| فيديو ارتداء «مشي / جلوس / تفاصيل» | موافق، مؤجل | فيديو 6–10 ثوانٍ، 1080×1620 أو 1080×1920، MP4 H.264 بدون صوت + Poster | نبدأ بقطعة واحدة |
| دوران 360 | موافق، مؤجل | مثلًا 36 إطارًا كل 10°، كاميرا وإضاءة ثابتة، 1200×1800 على الأقل | لقطعة بطلة واحدة أولًا |
| عارض 3D | موافق، مؤجل | GLB/GLTF محسّن بخاماته وحقوقه | بديل لـ360، مش الاتنين معًا |
| تقييمات وصور عملاء | موافق، مؤجل (المرحلة 5) | باك إند + مراجعة محتوى + حماية من الإساءة | — |
| تصويت عملاء / رأي صديق حقيقي | مؤجل | باك إند وروابط مشاركة | بديل مؤقت: «بطاقة الإطلالة» للمشاركة |
| شات مباشر | مؤجل | خدمة مراسلة وفريق متاح | بديل معتمد: «سؤال لفريق مدار» بالإيميل |
| مساعد AI حقيقي | مؤجل | خدمة ومفاتيح آمنة وضوابط بيانات | مختار الأسلوب الحالي بقواعد معلنة |
| تجربة افتراضية على صورة العميل/الكاميرا | مؤجل جدًا | تقنية متخصصة + موافقة وخصوصية + اختبار أجهزة | لا يضمن المقاس |
| تحليلات واختبارات A/B | مؤجل | موافقة التتبع وسياسة خصوصية معتمدة | لا ندّعي زيادة مبيعات من شكل الواجهة |
| موعد تنسيق خاص | جديد، مشروط | الخدمة موجودة فعلًا (مكان، وفريق، ومواعيد) | صورته V01 في الخطة |
| معاينة مبكرة للأعضاء | جديد، مشروط | إصدارات حقيقية تنزل على مراحل | صورته V02 في الخطة |
| الدفع الحقيقي | معتمد، معلّق | اختيار السوق والعملة ومزود الدفع والشحن والسياسات | المرحلة 3 من الباك إند |
| أحذية وإكسسوارات حقيقية في الإطلالات | مؤجل | منتجات حقيقية | في الصور الحالية تظهر كـ«إكسسوار تنسيق» بدون علامة تجارية |

## 4. المنتجات التجريبية الستة — برومبتات اختيارية

القرار المفترض: **تُخفى**. لو قررت تحتفظ بيها كعرض توضيحي، دي برومبتاتها، وكل واحدة صورة أمامية واحدة. المقاس 1600×2400 للملابس و1600×1600 للإكسسوارات، PNG شفاف. الملفات الحالية بطاقات نصية في `public/images/madar-source/`.

| الملف الجديد | الملف الحالي |
|---|---|
| `demo-tee-front.png` | `2d49b8bc06-test-product-tshirt.png` |
| `demo-jeans-front.png` | `8299179828-test-product-jeans.png` |
| `demo-hoodie-front.png` | `63a3740926-test-product-hoodie.png` |
| `demo-bracelet-front.png` | `85ee7d776c-test-product-bracelet.png` |
| `demo-wallet-front.png` | `5137cd6756-test-product-wallet.png` |
| `demo-sunglasses-front.png` | `e0ca6527ad-test-product-sunglasses.png` |

```text
Create an original unbranded DEMO product image for Madar.
Product: an adult white short-sleeve crewneck T-shirt, plain front, no printed graphics.
View: straight-on full front on an invisible mannequin, 1600 x 2400 px, centered with 8–10 percent margins, genuine transparent PNG background, no shadow, no hanger.
Soft even studio light, true color, matte fabric. No text, logos, labels or watermark.
```

```text
Create an original unbranded DEMO product image for Madar.
Product: adult straight-leg medium-indigo jeans with classic five-pocket construction, no distressing, no leather or brand patch.
View: straight-on full front, laid as if on an invisible form, 1600 x 2400 px, centered with 8–10 percent margins, genuine transparent PNG background, no shadow.
Soft even studio light, true color. No text, logos, labels or watermark.
```

```text
Create an original unbranded DEMO product image for Madar.
Product: an adult warm-grey pullover hoodie with a kangaroo pocket and ribbed cuffs and hem, plain front.
View: straight-on full front on an invisible mannequin, 1600 x 2400 px, centered with 8–10 percent margins, genuine transparent PNG background, no shadow, no hanger.
Soft even studio light, true color, matte fabric. No text, logos, labels or watermark.
```

```text
Create an original unbranded DEMO product image for Madar.
Product: a minimal dark-brown leather-look wrist bracelet with a plain brushed metal clasp; no claims about leather grade.
View: three-quarter studio product shot, 1600 x 1600 px, object centered with generous margins, genuine transparent PNG background, very soft contact shadow only if the tool cannot avoid it.
Soft studio light. No text, logos, engravings or watermark.
```

```text
Create an original unbranded DEMO product image for Madar.
Product: a slim dark-brown leather-look cardholder with simple visible card slots; no capacity or material-certification claims.
View: front three-quarter studio product shot, 1600 x 1600 px, centered with generous margins, genuine transparent PNG background.
Soft studio light. No text, logos, embossing or watermark.
```

```text
Create an original unbranded DEMO product image for Madar.
Product: classic black rounded-rectangular sunglasses with smoke-tinted lenses; no UV, polarization or optical-performance claims.
View: straight-on front with temples open, 1600 x 1600 px, centered with generous margins, genuine transparent PNG background.
Soft studio light with gentle, controlled reflections. No text, logos, hinge engraving or watermark.
```

## 5. قرارات لسه معلّقة عندك

1. تأكيد أن المنتجات العشرة حقيقية، وأسمائها وألوانها النهائية (مثلًا: الكنزة كريمي ولا «ترابي»؟).
2. قطع التنسيق الثلاث (بنطلونان + تشينو أطفال): منتجات حقيقية ولا قطع تنسيق غير معروضة للبيع؟
3. السوق والعملة ومزود الدفع ومزود الإيميل والشحن.
4. وجود خدمتي موعد التنسيق والمعاينة المبكرة فعلًا.
5. الاحتفاظ بالشريط المتحرك أو شيله.
