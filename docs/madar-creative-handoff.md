# مدار — باكدج المراجع والصور والبرومبتات

هذا تسليم إبداعي وتجهيز أصول، وليس تنفيذًا جديدًا لتفاعلات المنتجات أو تعديلًا للكتالوج. لم نغيّر الواجهة أو نفعّل باك إند أو دفعًا حقيقيًا.

## 1. إزاي تستخدم الباكدج؟

- **مراجع المواقع R01–R50:** نستعير منها مبادئ العرض، لا الصور أو الشعارات أو التصميم بحذافيره. المطلوب من كل مرجع موضح أدناه.
- **مراجع صور مدار:** النسخ الموجودة فعلًا في المشروع مرفقة داخل `01-current-image-references/`، مع لوحة معاينة مجمّعة. اسم الملف لا يثبت نوع القطعة؛ راجع عمود «الموجود بصريًا».
- **المرفقات الأربع:** موجودة دون تعديل داخل `02-received-coat-concepts/`. هذه مواد مستلمة/تصورية، وليست إثباتًا لمواصفات المعطف الحقيقي.
- **برومبتات الإنتاج:** في القسم 7. هناك فرق بين تعديل صورة منتج موجود، وتصميم منتج تجريبي من الصفر.
- **البيانات:** املأ `product-data-to-confirm.csv` واترك أي معلومة غير معروفة فارغة؛ لا تخمّنها من الصورة.
- **حالة كل منتج:** موجودة أيضًا بشكل منظم في `image-audit.json` و`image-audit.csv` داخل الباكدج.

الملفات المرجعية المرفقة متاحة في المشروع؛ وجودها هنا لا يثبت حقوق النشر أو موافقة العارضين. تأكيد صلاحية الاستخدام التجاري مطلوب قبل النشر التجاري. لا توجد كلمات مرور أو بيانات اتصال خاصة داخل الباكدج.

## 2. مراجعة الصور الأربع المستلمة

فُحصت الملفات نفسها، وليس معاينتها المصغرة فقط:

| المرفق | المواصفات الفعلية | القرار |
|---|---|---|
| `coat_front_isolated.png` — المرفق الذي يبدأ بـ`a1f48db4` | PNG RGBA، 1600×2400، يحتوي شفافية فعلية؛ نطاق Alpha من 0 إلى 255 | مناسب لاختبار العزل والتكوين، لكن ليس نسخة منتج مطابقة معتمدة. توزيع الأزرار/اتجاه الإغلاق الظاهر مختلف عن مرجع الموديل؛ لا ننشره كتوثيق دقيق قبل المطابقة |
| `coat_back_isolated.png` — المرفق الذي يبدأ بـ`57d9cf84` | PNG RGBA، 1600×2400، يحتوي شفافية فعلية | تصوّر للظهر فقط. المرجعان الأصليان لا يُظهران الظهر، لذلك الخياطة الخلفية والفتحة غير موثقتين |
| `coat_detail_collar_shoulder.jpg` — المرفق الذي يبدأ بـ`6740f232` | JPEG RGB، 1600×1600 | صالح كبروفة بصرية للياقة والكتف، لا إثبات للخياطة أو البطانة أو تركيب الخامة |
| `coat_detail_pocket_buttons.jpg` — المرفق الذي يبدأ بـ`18f62728` | JPEG RGB، 1600×1600 | صالح كبروفة بصرية للجيب والزر. يحتاج مطابقة موضع الجيب وشكل الزر واللون مع القطعة المعتمدة |

**لا تحتاج تعيد إرسال هذه الملفات لمجرد المقاس أو الشفافية؛ المواصفات التقنية المطلوبة متحققة.** سبب أي إعادة هو مطابقة التصميم، وليس نقص الدقة.

### المرجعان الأصليان للمعطف

داخل `01-current-image-references/madar-source/`:

1. `c2b7bf2834-madar-m-coat-brown.jpg` — 1200×1800، الموديل ماسك الياقة. نأخذ منه اللون النسبي، شكل الياقة، انسياب القطعة وتنسيقها.
2. `1661d9cba5-madar-m-coat-brown-2.jpg` — 1200×1800، اليدان في الجيب. أوضح للأزرار الثلاثة الظاهرة وتوزيعها والأمام المفتوح وطول القطعة النسبي.

كلاهما أمام/ثلاثة أرباع، **ولا واحد منهما مرجع خلفي**. الصورة الثانية ليست لونًا ثانيًا ولا قصّة ثانية. لا يمكن استخراج ظهر حقيقي أو قياسات بالسنتيمتر منهما.

### قراران واضحان للمعطف

- **مطابقة منتج حقيقي:** نحتفظ بصور الموديل كمرجع، ونطلب تصوير أمام مستقيم/ظهر/تفاصيل لنفس القطعة. يمكن تنفيذ التنظيف والعزل؛ لا نخترع الأجزاء المحجوبة.
- **منتج تجريبي جديد بالكامل:** نستخدم طقم صور متسقًا مولدًا من الصفر، ونصنّفه «تصوّر تجريبي». لا نمزج أمامًا من تصميم وظهرًا أو تفاصيل من تصميم مختلف.

## 3. كل منتج: المرجع، المطلوب منه، وقرار الصور

الأسماء والمعرفات أدناه مأخوذة من `src/content/catalog.json`. المنتجات غير الموسومة «تجريبي» ليست بالضرورة منتجات تجارية مؤكدة.

| ID / بادئة الملفات الجديدة | اسم الكتالوج | المرجع الحالي داخل `madar-source/` | الموجود بصريًا / المطلوب منه | القرار |
|---|---|---|---|---|
| 141 / `coat-camel` | معطف صوف بلون الجمل | `c2b7bf2834-madar-m-coat-brown.jpg` + `1661d9cba5-madar-m-coat-brown-2.jpg` | معطف جملي على موديل؛ مرجع اللون والشكل والأمام فقط | الاحتفاظ بمرجعي الموديل. الأربع المستلمة بروفة؛ إعادة المطابقة عند الحاجة. ظهر حقيقي غير متوفر |
| 98 / `suit-black` | طقم بدلة سادة | `62e5f3ed58-madar-m-suit-chair.jpg` | بدلة داكنة على موديل؛ نأخذ منها طريقة الارتداء والتصوير الرسمي | نطلب صور طقم البدلة نفسه أمام/خلف/تفاصيل. البديل `b98900834a-madar-m-black-coat.jpg` لا يُفترض زاوية مؤكدة للطقم نفسه. الرئيسية تستخدم بدلة كحلية مختلفة |
| 86 / `knit-cream` | بلوفر تريكو بدرجات ترابي | `94807ab5ca-madar-f-sweaters.jpg` + `b6eae29d9c-madar-f-stack.jpg` | كنزة فاتحة بياقة عالية؛ مرجع الشكل والملمس المرئي، وليس نسبة كشمير/صوف | نحتفظ بالصورتين كمرجع بصري، ونضيف العزل والظهر وتفاصيل التريكو |
| 93 / `coat-black` | معطف طويل أسود | `b98900834a-madar-m-black-coat.jpg` | الصورة تبدو بدلة/جاكيت رسمي، وليست توثيقًا لمعطف طويل | نعيد الصور من الصفر كتصوّر لمعطف، أو نستخدم تصويرًا حقيقيًا بعد تأكيد المنتج. البديل الحالي صورة بدلة أيضًا |
| 128 / `overshirt` | أوفرشيرت قطن مبروم | `ce640db2e5-madar-m-white-wall.jpg` | موديل بكنزة سوداء، وليس أوفرشيرت | مرجع إضاءة ووضعية فقط؛ نحتاج صور أوفرشيرت جديدة. البديل الحالي كنزة فاتحة مختلفة |
| 118 / `shirt-striped` | قميص مقلّم بقصّة واسعة | `f4844d09e6-madar-m-stripe.jpg` | كنزة سوداء بلا تقليم قميص ظاهر | نعيد الصورة كقميص مقلّم؛ الصورة الحالية ليست مرجع تصميم للقميص |
| 111 / `kids-sweatshirt-striped` | سويتشيرت أطفال بخطوط | `7c50bcdf3e-madar-k-arms.jpg` | طفل بملابس خارجية سوداء، وليس السويتشيرت الموصوف | نحتاج سويتشيرت جديد. البديل `4fe9ae7e6c-madar-k-stripe.jpg` جاكيت أصفر، وليس لونًا ثانيًا للسويتشيرت |
| 105 / `kids-tee-striped` | تيشيرت أطفال مقلّم فاتح | `c550b0b972-madar-k-curly.jpg` | طفل بملابس خارجية سوداء، وليس تيشيرتًا مقلّمًا | نحتاج صور تيشيرت جديدة؛ نستخدم الأصل كمرجع مزاج/إضاءة فقط |
| 134 / `kids-shirt-brown` | قميص أطفال بني | `a2be49d61d-madar-k-brown-shirt.jpg` | طفل بجاكيت مبطّن أصفر، وليس قميصًا بنيًا | نعيد الصور كقميص بني؛ لا نعيد تلوين الجاكيت ونسميه قميصًا |
| 123 / `kids-polo-striped` | بولو أطفال مقلّم | `4fe9ae7e6c-madar-k-stripe.jpg` | جاكيت مبطّن أصفر، وليس بولو | نحتاج بولو جديدًا. البديل الحالي ملابس خارجية سوداء |
| 24 / `demo-tee` | تيشيرت قطني أساسي – تجريبي | `2d49b8bc06-test-product-tshirt.png` | بطاقة نصية 600×600؛ ليست صورة منتج | اختياري: توليد تصور تيشيرت أساسي، مع بقاء الوسم التجريبي |
| 42 / `demo-jeans` | بنطال جينز كاجوال – تجريبي | `8299179828-test-product-jeans.png` | بطاقة نصية 600×600 | اختياري: تصور جينز، وليس أصلًا يمكن قصّه أو تحسينه إلى صورة حقيقية |
| 43 / `demo-hoodie` | سترة هودي شتوية – تجريبي | `63a3740926-test-product-hoodie.png` | بطاقة نصية 600×600 | اختياري: تصور هودي |
| 33 / `demo-bracelet` | سوار معصم جلدي – تجريبي | `85ee7d776c-test-product-bracelet.png` | بطاقة نصية 600×600 | اختياري: تصور سوار، دون ادعاء نوع جلد |
| 45 / `demo-wallet` | محفظة بطاقات جلدية – تجريبي | `5137cd6756-test-product-wallet.png` | بطاقة نصية 600×600 | اختياري: تصور محفظة، دون اختراع سعة بطاقات موثقة |
| 44 / `demo-sunglasses` | نظارة شمسية كلاسيكية – تجريبي | `e0ca6527ad-test-product-sunglasses.png` | بطاقة نصية 600×600 | اختياري: تصور نظارة، دون ادعاء UV/استقطاب |

### صور الرئيسية والحملة: ما الذي نأخذه منها؟

هذه مراجع موجودة أيضًا داخل `01-current-image-references/`:

| المرجع | المطلوب منه | القرار |
|---|---|---|
| `coat-camel.jpg` و`coat-camel-alt.jpg` | نفس اتجاه تصوير المعطف الجملي على موديل | نحتفظ بهما كمرجع ارتداء؛ ليستا أمام/خلف |
| `suit-navy.jpg` و`suit-navy-alt.jpg` | بدلة كحلية في سياق مدينة، مرجع حملة رسمية | لا نربطهما تلقائيًا بطقم البدلة الداكنة ID 98. إما اعتماد كحلي كتصوّر جديد متكامل، أو توحيد العرض مع الطقم المعتمد |
| `knit-cream.jpg` و`knit-cream-alt.jpg` | الإضاءة والكنزة الفاتحة والياقة العالية | مرجع بصري جيد؛ كلمة «كشمير» تحتاج إثباتًا مستقلًا |
| `kids-adventure.jpg` و`kids-adventure-alt.jpg` | جاكيت أطفال أصفر في حديقة؛ مرجع المزاج فقط | لا يُستخدمان لسويتشيرت مخطط ID 111. نعيد صور البطاقة بما يطابق المنتج المختار |
| `city-edit.jpg` | سياق مدينة وملابس خارجية، وليس إثبات معطف ID 93 | يمكن إبقاؤه تحريريًا إذا تأكدت الحقوق؛ لا يُستخدم كصورة اختلاف لون أو منتج بعينه |
| `story-wardrobe.jpg` | تنظيم خزانة وألوان دافئة | يمكن إبقاؤه تحريريًا؛ لا يقدم دليلًا على مخزون المتجر أو ورشته |
| `madar-source/0bda28db66-f-shoes.jpg` | لوحة تنسيق بني/ترابي | مرجع تنسيق فقط؛ الحذاء ليس منتجًا مؤكدًا في الكتالوج |

**لم نغيّر الربط الخاطئ في التطبيق في هذه المهمة.** هذه الملاحظات تحدد ما يجب إصلاحه عند مرحلة تنفيذ تجربة المنتجات.

## 4. المطلوب تسليمه مرة واحدة

### A — البداية: تجربة المعطف فقط

| الملف المطلوب | المقاس/الصيغة | الاستخدام | الحالة |
|---|---|---|---|
| `coat-camel-front.png` | 1600×2400، PNG شفاف فعليًا | مشهد القطعة المعزولة/الأمام/لوحة التنسيق | نسخة مستلمة تقنيًا؛ تحتاج اعتماد التصميم أو إعادة مطابقة الأصل |
| `coat-camel-back.png` | 1600×2400، PNG شفاف | التبديل بين الأمام والخلف | نسخة مستلمة تصورية؛ صورة ظهر حقيقية مطلوبة لو أردنا دقة تجارية |
| `coat-camel-collar.jpg` | 1600×1600، sRGB | نقطة تفاصيل الياقة | مستلمة كبروفة، تحتاج مطابقة |
| `coat-camel-pocket-buttons.jpg` | 1600×1600، sRGB | نقطة تفاصيل الجيب والزر | مستلمة كبروفة، تحتاج مطابقة |

**لا توجد صورة خامسة إجبارية للبدء:** يمكن الاستفادة من صورة الموديل الحالية كمرجع ارتداء. لو اعتمدنا معطفًا جديد التصميم بالكامل، نحتاج `coat-camel-on-model.jpg` جديدًا ومتطابقًا بدل خلط تصميمين.

### B — تعميم التجربة على المنتجات العشرة غير الموسومة تجريبيًا

لكل بادئة من جدول القسم 3:

1. `<prefix>-front.png` — 1600×2400، شفاف، أمام مستقيم.
2. `<prefix>-back.png` — 1600×2400، شفاف، ظهر مستقيم.
3. `<prefix>-detail-01.jpg` — 1600×1600، تفصيل أول.
4. `<prefix>-detail-02.jpg` — 1600×1600، تفصيل ثانٍ.
5. `<prefix>-on-model.jpg` — 1600×2400، نفس القطعة على موديل.

للمعطف الجملي نحتفظ باسمي `collar` و`pocket-buttons` بدل `detail-01/02`.

| بادئة | التفصيل الأول | التفصيل الثاني |
|---|---|---|
| `coat-camel` | الياقة والكتف | الجيب والأزرار |
| `suit-black` | الياقة والزر الأمامي | نسيج القماش/تشطيب الكم |
| `knit-cream` | الياقة العالية والتريكو | الكُفّة والحافة السفلية |
| `coat-black` | الياقة والكتف | الجيب والإغلاق |
| `overshirt` | الياقة والإغلاق الأمامي | الجيب والكُفّة |
| `shirt-striped` | الياقة واتجاه الخطوط | الكُفّة والعروة |
| `kids-sweatshirt-striped` | الياقة والخطوط | الكُفّة والحافة |
| `kids-tee-striped` | الياقة والخطوط | خياطة الكم والحافة |
| `kids-shirt-brown` | الياقة والأزرار | الكُفّة والجيب إن وُجد فعلًا |
| `kids-polo-striped` | ياقة البولو وفتحة الأزرار | نسيج القماش والخطوط |

إجمالي نظام التسليم الكامل هو **50 موضع صورة لعشرة منتجات**، وليس طلب 50 صورة جديدة قبل أن نبدأ. يمكن الاحتفاظ بأي صورة حالية تتطابق مع القطعة المعتمدة وحقوق استخدامها. الستة التجريبية خارج هذا العدد، واختيارية.

### C — حملة جديدة اختيارية، وليست بديلًا لصور المنتج

- `campaign-men-desktop.jpg` — 2400×1600.
- `campaign-men-mobile.jpg` — 1600×2400.
- `campaign-kids-desktop.jpg` — 2400×1600.
- `campaign-kids-mobile.jpg` — 1600×2400.

التكوين الأفقي يترك نحو 40% مساحة هادئة على اليسار للنص العربي، مع بقاء إمكانية تحريك النص بحسب اللغة. نسخة الموبايل تُكوَّن من جديد لتترك مساحة أعلى الصورة؛ لا نكتفي بقص الوجه/القطعة من نسخة الديسكتوب. لا نضع نصًا داخل الصورة، فتخدم اللغات الخمس.

### D — مواد للتفاعلات المتقدمة فقط، مؤجلة

- **ألوان:** صورة أمام/خلف للقطعة نفسها لكل لون فعلي + اسم اللون + صورته/كوده المعتمد. لا توجد ألوان ثانية مؤكدة حاليًا. لا نستخدم تغيير Hue لصناعة اختلاف تجاري.
- **قصّات:** صور متطابقة الزاوية لمقارنة قصّتين فعليتين، مع قياسات كل واحدة. لا نمدد صورة واحدة لنمثل Regular/Relaxed.
- **لوحة تنسيق:** قصاصات أمامية شفافة للقطع المؤكدة المختارة، متسقة في الإضاءة. تبدأ كلوحة منفصلة لا تركيب واقعي على الجسم.
- **فيديو ارتداء:** 6–10 ثوانٍ، 1080×1620 أو 1080×1920، MP4 H.264، بلا صوت مطلوب، مع Poster. مشي/لفّة خفيفة على نفس القطعة. الأهداف الحجمية تُضبط بعد فحص الجودة.
- **360:** 36 إطارًا مثلًا بزوايا 10 درجات، كاميرا/إضاءة/مقاس ثابت، كل إطار 1200×1800 على الأقل. هذا اقتراح بداية لا ضمانًا كافيًا لكل حركة. صورتا أمام/خلف لا تصنعان 360 موثوقًا.
- **3D بديل عن تسلسل 360:** GLB/GLTF محسن مع خاماته وحقوقه؛ لا نطلب 3D و36 صورة معًا في البداية.

هذه المواد ليست شرطًا لتطوير الاختيارات والتكبير ونقاط التفاصيل والمقارنة الأمامية.

## 5. مواصفات موحدة تمنع إعادة الشغل

- الأبعاد المذكورة هي أبعاد التسليم، وليست طلب تكبير ضبابي لصورة صغيرة.
- PNG المعزول يحتوي قناة Alpha فعلية، وليس خلفية بيضاء أو مربعات شفافية مرسومة.
- أمام/خلف القطعة على نفس الـCanvas ونفس مقياس العرض، مع محاذاة مركز القطعة والحافة السفلية وهامش نحو 8–10%.
- لا نُقص أطراف الأكمام أو الحافة، ولا نضيف ظلًا أرضيًا مدمجًا في النسخة الشفافة.
- تفاصيل الأزرار والخطوط والخياطة واللون ثابتة في كل صور المنتج الواحد؛ لا صور متشابهة شكليًا لمنتجين مختلفين.
- sRGB، بلا Watermark أو نص أو لوجو مولد. الهوية والنصوص تُضاف في الواجهة.
- لا نسب خامات ولا قياسات ولا أسعار ولا ادعاءات حماية تُستنتج من صورة أو برومبت.
- نحتفظ بالماستر؛ توليد WebP/AVIF والأحجام المتجاوبة مهمة التنفيذ، وليس مطلوبًا منك تسليم كل الصيغ.
- الصور المولدة تُوسم في بيان التسليم كتصورات، ولا يُدّعى أنها صور قياس أو توثيق منتج حقيقي.
- لصور الأطفال الحقيقية: موافقة ولي الأمر وحقوق استخدام واضحة، دون إرسال معلومات الطفل الشخصية.

## 6. بيانات نحتاجها مع الصور، مرة واحدة

ملف `product-data-to-confirm.csv` يتضمن الصفوف الستة عشر، بهذه الحقول:

`product_id, catalog_name, proposed_asset_prefix, asset_mode, confirmed_product_name, approved_color_name, color_reference, available_sizes, fit, composition_verified, care_verified, model_height_cm, worn_size, size_chart_filename, image_rights_confirmed, notes`

- `asset_mode`: اكتب `real-product` أو `generated-concept` أو `unconfirmed`.
- `confirmed_product_name`: خصوصًا المنتجات التي لا تطابق صورها عناوينها.
- اللون والمقاس والقصّة الفعلية؛ لا نعتبر صورتين تلقائيًا خيارين للون.
- تركيب الخامة وتعليمات العناية فقط من بطاقة/مصدر معتمد، لا من عنوان تسويقي.
- طول الموديل والمقاس المرتدى فقط لو معلومات حقيقية موثقة، لا لو الصورة مولدة.
- ملف قياسات منفصل للقطعة والمقاس. أعمدته المقترحة: `product_id, color, size, measurement_type, unit, chest_width_flat, waist_width_flat, shoulder_width, sleeve_length, body_length, trouser_waist_flat, inseam, notes`.
- حدد هل القياس **قياس جسم** أم **قطعة مفرودة**؛ لا نخلط نصف عرض الصدر مع محيط الجسم. القياسات غير المناسبة لنوع القطعة تظل فارغة.
- جدول الأطفال يحتاج أيضًا نطاق الطول إذا كان موثقًا. العمر وحده لا يضمن الملاءمة.

دليل المقاسات الموجود في المشروع عام ومنقول من صفحة منتج؛ ليس قياسات مؤكدة لكل المنتجات. لا نستخدمه لإيهام العميل بنتيجة مقاس مضمونة.

## 7. البرومبتات

البرومبتات بالإنجليزية لسهولة نقلها لأدوات الصور. لا تشترط أداة بعينها، ولا تضمن مطابقة تجارية تلقائية. كل ناتج يحتاج مراجعة اتساق.

### P1 — تعديل أمام المعطف مع الالتزام بالأصل

أرفق صورتي الموديل الأصليتين، لا صورة الظهر المتولد. استخدم هذا فقط لو الأداة تدعم تعديلًا مرجعيًا؛ الأجزاء التي لا تظهر تحتاج صورة إضافية لا تخمينًا:

```text
REFERENCE-FAITHFUL PRODUCT EDIT, NOT A REDESIGN.
Use the attached two original model photographs as the only authority for the camel coat. Preserve the visible garment construction, camel color, notched lapel shape, diagonal shoulder seams, pocket openings, relative length, and the three visible dark front buttons in their original placement and closure direction. Do not mirror the garment.
Create a straight-on, full-length front product cutout with an invisible mannequin presentation, centered on a 1600 x 2400 canvas, with approximately 8–10 percent clear margins.
Remove the person and background only where the garment can be reconstructed from the supplied evidence. Do not invent concealed construction, lining, extra buttons, pockets, or a rear view. If faithful reconstruction requires hidden details, identify the missing reference rather than presenting invented details as fact.
Output a PNG with a genuine transparent alpha channel. No white matte, checkerboard pattern, floor shadow, hanger, visible mannequin, text, logo, or watermark. Treat any reconstructed result as an unapproved concept until checked against the actual garment.
```

**ظهر مطابق:** لا يوجد برومبت يعوض غياب مرجع ظهر حقيقي. بعد تصويره، استخدم نفس تعليمات الحفظ والعزل واستبدل عبارة front بـback وارفق المرجع الخلفي.

### P2 — معطف جديد من الصفر، بديل متسق للطقم كله

هذا قرار تصميم تجريبي، وليس استنتاجًا لمواصفات القطعة الأصلية:

```text
Create ONE original, unbranded menswear product concept for a quiet contemporary label named Madar; do not imitate any existing brand campaign.
Design a camel, knee-length, single-breasted men's coat with notched lapels, raglan-style shoulder seams, exactly three dark round front buttons, two slanted welt pockets, plain sleeve cuffs, no belt and no visible branding. Keep the material appearance matte and softly textured without assigning a fiber composition.
First produce a straight-on full front view as the design master, using an invisible mannequin presentation and a genuine transparent background, 1600 x 2400 pixels, centered with 8–10 percent margins.
Once this front design is approved, use that approved image as the identity reference for every subsequent view. Create the back view with one center seam and one center vent as explicit CONCEPT design choices, not as claims about an existing real coat. Produce a collar-and-shoulder detail and a pocket-and-button detail, each 1600 x 1600, plus an optional full-length on-model photograph, 1600 x 2400.
Generate each deliverable as a separate image, not a collage. Maintain exactly the same button style and placement, lapels, pockets, fabric appearance and camel tone throughout. No text, logos, watermarks, invented technical claims or additional colorways. These are generated concept visuals, not documentation of a manufactured garment.
```

لو هنختار التصميم المعزول المستلم نفسه بدل الأصل، اجعل **أمامه المعتمد** صورة الهوية لهذا البرومبت، واحذف أي وصف يخالفه؛ أعد باقي الصور لتطابقه. لا تطلب تعديل الأزرار عشوائيًا في كل لقطة.

### P3 — قالب إنتاج بقية المنتجات

استخدم وصف المنتج من P4–P12 بدل `[PRODUCT DESCRIPTION]`. في الجولة الأولى أنتج الأمام فقط واعتمده؛ بعد ذلك أرفقه كمرجع الهوية لكل زاوية أخرى. لا تستخدم الصور الحالية الخاطئة كمرجع تصميم للقطعة.

```text
Create an original unbranded apparel PRODUCT CONCEPT for Madar.
Product: [PRODUCT DESCRIPTION].
This is a new demo design, not a recreation or proof of a real commercial product. Choose one coherent construction and keep it fixed after the front master is approved. Do not infer material composition, measurements, availability or performance claims.
DELIVERABLE: [VIEW].
For front/back product cutouts: invisible mannequin presentation, full garment, genuine transparent alpha, 1600 x 2400, centered with consistent scale and 8–10 percent margins.
For detail images: 1600 x 1600, believable visible construction taken from the approved product master, neutral soft studio lighting.
For on-model images: 1600 x 2400, age-appropriate styling, relaxed natural pose, full garment visible, warm neutral studio setting, same approved garment and color. Do not add height or worn-size claims to a generated model.
Use the attached APPROVED MASTER, if supplied, as the identity source. Preserve the exact silhouette, seams, closures, patterns and colors across all views.
One separate image per deliverable. No grids, labels, watermark, brand logo, extra colorways, plastic fabric, distorted limbs or unsupported technical claims.
```

قيم `[VIEW]`: `straight-on front`، `straight-on back`، `detail: ...` من جدول القسم 4، أو `on-model`.

### P4–P12 — الوصف الخاص بكل منتج جديد

هذه اقتراحات تصميم للنسخة التجريبية، لا بيانات مؤكدة عن بضائع مدار:

| البرومبت / البادئة | نص `[PRODUCT DESCRIPTION]` |
|---|---|
| P4 / `suit-black` | `An adult men's plain dark charcoal-black two-piece suit: single-breasted two-button jacket with notched lapels and matching straight-leg trousers. No tie or shirt included in product-only cutouts. Show both jacket and trousers in a balanced full-set composition for front and back.` |
| P5 / `knit-cream` | `An adult men's warm cream rib-knit turtleneck sweater with long sleeves, ribbed cuffs and hem, no cable motifs and no logos. Soft matte knit appearance; no cashmere or fiber-composition claim.` |
| P6 / `coat-black` | `An adult men's long matte black single-breasted coat with notched lapels, three front buttons and two welt pockets. Clearly an outer coat reaching near the knee, not a suit blazer.` |
| P7 / `overshirt` | `An adult men's warm taupe overshirt with a pointed shirt collar, button front, two simple chest patch pockets and buttoned long-sleeve cuffs. Subtle woven-looking surface, no knit ribbing; no verified cotton-content claim.` |
| P8 / `shirt-striped` | `An adult men's relaxed long-sleeve shirt in off-white with fine evenly spaced dark vertical stripes, a pointed collar, button front and button cuffs. Keep stripe spacing and alignment consistent in every image. This is a shirt, not a sweater.` |
| P9 / `kids-sweatshirt-striped` | `A children's long-sleeve crewneck sweatshirt with broad muted navy and cream horizontal stripes, ribbed collar, cuffs and hem, no hood, no zipper and no drawstrings. Modest everyday styling, age-appropriate child model only for the optional on-model image.` |
| P10 / `kids-tee-striped` | `A children's light cream short-sleeve crewneck T-shirt with narrow muted blue horizontal stripes, a simple straight hem, no buttons and no hood. Age-appropriate everyday styling.` |
| P11 / `kids-shirt-brown` | `A children's warm medium-brown long-sleeve button-front shirt with a pointed collar, simple cuffs and one plain chest patch pocket. Lightweight woven appearance, not a padded jacket. Age-appropriate everyday styling.` |
| P12 / `kids-polo-striped` | `A children's short-sleeve polo shirt with a plain cream polo collar, a short two-button placket and muted navy-and-cream horizontal stripes. No full-length opening, hood, padding or jacket elements. Age-appropriate everyday styling.` |

للبدلة الكحلية بدل الداكنة: استبدل `dark charcoal-black` بـ`deep navy blue` واستخدم بادئة `suit-navy` **لطقم تصور مستقل ومتسق**؛ لا تقدمه كلون مؤكد لـID 98 دون موافقة وبيانات.

### P13 — الستة التجريبية، اختيارية

استخدم قالب P3 للملابس، ووضع تصوير استوديو منتج مربع 1600×1600 للإكسسوارات. الأوصاف:

| البادئة | الوصف |
|---|---|
| `demo-tee` | `An unbranded adult white short-sleeve crewneck T-shirt, plain front and back, no printed graphics.` |
| `demo-jeans` | `Unbranded adult straight-leg medium-indigo jeans, classic five-pocket construction, no distressing, no visible leather or brand patch.` |
| `demo-hoodie` | `An unbranded adult warm-grey pullover hoodie with a kangaroo pocket and ribbed cuffs, plain front and back.` |
| `demo-bracelet` | `An original unbranded minimal dark-brown leather-look wrist bracelet with a plain metal clasp. Product concept only; no claims about actual leather grade.` |
| `demo-wallet` | `An original unbranded slim dark-brown leather-look cardholder with simple visible card slots. Show closed front, rear and a close detail; no capacity or material-certification claims.` |
| `demo-sunglasses` | `Original unbranded classic black rounded-rectangular sunglasses with smoke-tinted lenses. Show front, folded rear and hinge detail; no UV, polarization or optical-performance claims.` |

لا توجد ضرورة لإنتاج صورها الآن إن كنا سنُخفي منتجات الاختبار لاحقًا. لا يتحول أي منها إلى منتج حقيقي بمجرد توليد صورة.

### P14 — حملة رجال جديدة بدل إعادة استعمال صورة منتج كحملة

أرفق صورة المنتج المعتمد؛ لا تذكر أسماء براندات داخل البرومبت:

```text
Create an original editorial menswear campaign image for Madar.
Use the attached APPROVED GARMENT MASTER as the exact clothing identity; do not redesign the garment. Show an adult male model in a quiet contemporary stone-lined city setting, warm neutral palette, soft overcast daylight, natural posture, believable fabric drape and restrained styling.
Desktop version: 2400 x 1600, place the subject mainly in the right half and reserve roughly 40 percent calm negative space on the left for Arabic website copy. Keep the full approved garment readable.
Generate a separate mobile composition at 1600 x 2400 with calm negative space above the subject; do not merely crop away the garment from the desktop version.
No embedded text, logos, watermark, store signage or performance claims. This is a concept campaign; do not present invented accessories as stocked Madar products.
```

### P15 — حملة أطفال مطابقة للمنتج المختار

```text
Create an original children's everyday clothing campaign concept for Madar using the attached APPROVED CHILDREN'S GARMENT MASTER without changing its construction or colors.
Show an age-appropriate child model in modest everyday styling, a relaxed natural posture, and a softly lit neutral courtyard or garden. The exact approved garment must remain clearly visible; do not replace a striped sweatshirt, shirt or polo with a padded jacket.
Produce separate compositions: desktop 2400 x 1600 with quiet negative space on the left, and mobile 1600 x 2400 with breathing room above. Warm restrained colors, natural expression, no adult styling, no unsafe activity, no visible third-party logos, no text or watermark.
This is a generated editorial concept, not evidence of a real model's age, measurements or garment size.
```

## 8. المراجع الخمسون: المطلوب من كل واحد

هذه خريطة تطبيق مبنية على البحث الموجود، وليست ادعاء مراجعة حية جديدة. حالة الوصول السابقة وحدود التحقق موضحة في `madar-reference-research.md` و`madar-reference-links.json` المرفقين. بعض الروابط قد تُظهر اختيار بلد/كوكيز أو تمنع التصفح الآلي.

رموز المواد المطلوبة:

- **A:** طقم صور المنتج المعتمد: أمام/خلف/تفصيلان/ارتداء.
- **B:** بيانات موثقة: لون/مقاس/قصّة/خامة/عناية/قياسات.
- **C:** صور حملة اختيارية.
- **D:** صور اختلافات فعلية لنفس المنتج.
- **E:** قصاصات قطع تنسيق مؤكدة؛ لوحة تحريرية وليست تركيبًا على الجسم.
- **F:** فيديو/360 اختياري لاحقًا.
- **—:** عمل واجهة/تنظيم؛ لا يحتاج منك تصويرًا جديدًا مخصوصًا لهذا المرجع.

### R01–R25 — الهوية والمتجر

| المرجع | ما نأخذه تحديدًا إلى مدار | المطلوب منك |
|---|---|---|
| R01 [ZARA](https://www.zara.com/) | إيقاع حملة موسمية بصور كبيرة متباعدة؛ لا نقل تعقيد الملاحة | C فقط لو سنعيد الحملة |
| R02 [Massimo Dutti](https://www.massimodutti.com/) | هدوء رجالي وألوان محايدة ومساحات محسوبة | A/C بهوية أصلية |
| R03 [COS](https://www.cos.com/) | شبكة منتجات نظيفة ونسبة صور موحدة وتسلسل نصي واضح | A متسق؛ لا جلسة صور إضافية باسم COS |
| R04 [ARKET](https://www.arket.com/) | تقسيم الأساسيات والكتالوج إلى فئات مفهومة | B لتأكيد التصنيف؛ الباقي — |
| R05 [UNIQLO](https://www.uniqlo.com/) | شرح القصّة والقياس قبل قرار الإضافة | B؛ لا توصية مقاس مضمونة ببيانات ناقصة |
| R06 [H&M](https://www2.hm.com/) | فلاتر الموبايل وحالات الاختيار الواضحة | B لقيم الفلاتر؛ الباقي — |
| R07 [Mango](https://shop.mango.com/) | ربط المنتج بقطع تكمل الإطلالة | E + قائمة تنسيقات معتمدة |
| R08 [Ralph Lauren](https://www.ralphlauren.com/) | فصل عالم الرجال والأطفال داخل قصة واحدة | C اختياري لكل عالم |
| R09 [Lacoste](https://www.lacoste.com/) | اكتشاف القطع من اللون مع اسم مقروء | D إن وُجدت ألوان حقيقية |
| R10 [Tommy Hilfiger](https://global.tommy.com/) | أقسام رجال/أطفال واضحة دون خلط المقاسات | B للتصنيف؛ الباقي — |
| R11 [Calvin Klein](https://www.calvinklein.com/) | وضوح القطعة ونظافة الخلفية وتقليل الزخرفة | A |
| R12 [Hugo Boss](https://www.hugoboss.com/) | عرض البدلة حسب المناسبة مع شرح القصّة | A/B للبدلة |
| R13 [Burberry](https://www.burberry.com/) | تفاصيل قابلة للاكتشاف بالضغط بدل عناوين مبهمة | A للتفاصيل؛ لا نسخ نقوشهم |
| R14 [Louis Vuitton](https://www.louisvuitton.com/) | فصل عالم الحملة عن واجهة الشراء العملية | C اختياري؛ الباقي — |
| R15 [Gucci](https://www.gucci.com/) | تكوين فني واحد مميز للحملة، لا تشتيت المتجر كله | C اختياري، لا حاجة لحملة أخرى منفصلة |
| R16 [Dior](https://www.dior.com/) | لقطة قريبة تشرح التشطيب والخياطة | A/B؛ لا اختراع حرفة أو تصنيع يدوي |
| R17 [Prada](https://www.prada.com/) | توازن الصورة والمساحات والنص القصير | —؛ يستخدم نفس A/C |
| R18 [Loro Piana](https://www.loropiana.com/) | عرض الملمس بدرجات هادئة للمعطف والتريكو | A للتفاصيل؛ B لأي ادعاء خامة |
| R19 [Brunello Cucinelli](https://www.brunellocucinelli.com/) | دفء بصري وسرد تحريري قليل الكلمات | C اختياري؛ لا جلسة إضافية |
| R20 [Zegna](https://www.zegna.com/) | وضوح معلومات القصّة والتفصيل للرجال | B للبدلة والمعطف |
| R21 [Stone Island](https://www.stoneisland.com/) | تقسيم معلومات بناء القطعة إلى خصائص محددة | A/B؛ لا خصائص تقنية غير مؤكدة |
| R22 [Moncler](https://www.moncler.com/) | إظهار التنسيق بالطبقات دون إخفاء المنتج | E؛ صور ارتداء متسقة إن أردنا تركيبًا أدق |
| R23 [Nike](https://www.nike.com/) | عرض القطعة أثناء الحركة بدل وعود عامة | F اختياري |
| R24 [Adidas](https://www.adidas.com/) | حالات اللون والمقاس والمتاح غير المؤكد بوضوح | B/D؛ حالات تجريبية لا مخزون حي |
| R25 [Patagonia](https://www.patagonia.com/) | شرح الاستخدام والعناية والحدود بشفافية | B؛ لا شهادات استدامة مخترعة |

### R26–R50 — المنتج والتفاعل

| المرجع | ما نأخذه تحديدًا إلى مدار | المطلوب منك |
|---|---|---|
| R26 [AETHER](https://aetherapparel.com/products/milton-chore-jacket-forest-green) | مرجع وظيفي أساسي: معرض، اختيار، معلومات موديل، وإطلالة مكملة | A/B/E؛ معلومات الموديل لو حقيقية فقط |
| R27 [Pangaia](https://pangaia.com/) | تنظيم اللون داخل عائلة المنتج | B/D؛ لا ألوان جديدة من عندنا |
| R28 [Asket](https://www.asket.com/) | قرار مقاس هادئ مع فصل القياس عن الصورة | B + رسم قياس نعده من البيانات |
| R29 [Colorful Standard](https://colorfulstandard.com/) | لوحة ألوان مسماة كوسيلة اكتشاف | D؛ لا يكفي HEX تخميني |
| R30 [Rains](https://www.rains.com/) | إبراز سيلويت المعطف على خلفية هادئة | A للمعطف |
| R31 [Finisterre](https://finisterre.com/) | وضع القطعة في سياق استخدام وعناية حقيقي | B/C؛ السياق لا يثبت مقاومة طقس |
| R32 [Vollebak](https://vollebak.com/) | تحويل الماكرو إلى فصل يشرح تفصيلًا واحدًا | A/B؛ لا تحويل ملمس الصورة إلى ادعاء علمي |
| R33 [Satisfy](https://satisfyrunning.com/) | انتقال محسوب بين صورة استوديو وارتداء | A؛ F فقط إن أردنا حركة حقيقية |
| R34 [Norda](https://nordarun.com/) | نقاط بصرية تكشف أجزاء المنتج | A + عناوين موثقة؛ لا حاجة إلى تفجير 3D |
| R35 [On](https://www.on.com/) | جمل قصيرة تربط التفصيل بالاستخدام | B؛ F اختياري |
| R36 [Allbirds](https://www.allbirds.com/) | تبسيط معلومات المادة واللون | B/D؛ لا نقل ادعاءات البيئة |
| R37 [Gentle Monster](https://www.gentlemonster.com/) | لقطة حملة لافتة واحدة، منفصلة عن قرار الشراء | C اختياري؛ الصفحة كانت محدودة الوصول في البحث السابق |
| R38 [Cubitts](https://cubitts.com/) | مقارنة اختيارين بوضوح على مساحة واحدة | D أو A لمنتجين؛ لا مقارنة قصّات مصطنعة |
| R39 [Bellroy](https://bellroy.com/products/lite-tech-kit) | سواتش بصورة المنتج ونقاط توضح الجيب/الخامة | A/D؛ أسماء وصور اختلافات مؤكدة |
| R40 [Peak Design](https://www.peakdesign.com/) | تسوق حسب المناسبة/النشاط بدل قوائم طويلة | B لتصنيفات الاستخدام؛ الباقي — |
| R41 [FREITAG](https://freitag.ch/en_US/products/r204-nan) | لكل اختلاف صورة وبيان مستقلان، لا صورة مشتركة عشوائية | B/D |
| R42 [BAGGU](https://www.baggu.com/) | ربط النقشة واللون داخل عائلة القطعة | D؛ لا اختراع نقوش غير موجودة |
| R43 [VEJA](https://www.veja-store.com/) | معلومات محددة بجانب صور واضحة | A/B؛ لا إضافة أحذية للبيع دون اعتماد |
| R44 [Aesop](https://www.aesop.com/) | فتح المعلومات تدريجيًا دون ازدحام الصفحة | B؛ لا صور جديدة مخصوصة |
| R45 [Apple](https://www.apple.com/iphone/) | فصل تمرير واحد للأمام ثم التفاصيل ثم الارتداء | A؛ F اختياري، لا WebGL لمجرد التشابه |
| R46 [Nothing](https://nothing.tech/) | ترتيب فصول تفاصيل القطعة بدل مؤثرات متفرقة | A/B؛ لا استعارة هوية الإلكترونيات |
| R47 [Teenage Engineering](https://teenage.engineering/) | المنتج المعزول بطلًا للصورة مع واجهة قليلة | A، خصوصًا الأمام الشفاف |
| R48 [Bang & Olufsen](https://www.bang-olufsen.com/) | إضاءة تكشف السطح والتشطيب دون تغيير حقيقة اللون | A/D؛ لا إعادة تلوين مضللة |
| R49 [Cowboy](https://cowboy.com/products/e-bike-cowboy-cruiser) | تسلسل اختيار مختصر وملخص نهائي واضح | B/D؛ لا بيانات جسم أو مواصفات دراجة منسوخة |
| R50 [Porsche](https://www.porsche.com/) | تنظيم مُكوّن الإطلالة: قطعة ثم لون ثم مقاس ثم ملخص | B/E؛ لا محرك سيارات أو 3D مطلوب |

**المراجع التنفيذية الأساسية المقترحة:** R02 وR03 للهوية، R26 لصفحة الملابس، R28 للقياس، R39 للتفاصيل/الألوان، R45 لفصل تمرير واحد، R49–R50 لتنظيم الاختيارات. الباقي مصادر مساعدة، لا خمسون تأثيرًا نضيفها للموقع.

## 9. ترتيب التنفيذ بعد اعتماد المواد

1. حسم هل المعطف مطابق للأصل أم تصوّر جديد، وتوحيد الأربع صور على هذا القرار.
2. تطوير تجربة قطعة واحدة: أمام/خلف بنقرة أو سحب، تكبير ضمن دقة الصورة، نقطتا تفاصيل، اختيارات وملخص واضح. هذا **ليس** دوران 360 أو تجربة افتراضية.
3. تصحيح ربط الصور/الأسماء في الرئيسية والكتالوج بالتدريج، دون اختراع منتجات أو ألوان.
4. تعميم نفس المكونات على الصور المعتمدة لبقية المنتجات.
5. إدخال المقارنة ولوحة التنسيق، ثم فيديو/360 فقط عند توافر موادها.
6. كل النصوص والتفاعلات تدعم المصرية والسعودية والإنجليزية والفرنسية والإسبانية، RTL/LTR واللمس والكيبورد وتقليل الحركة.

الحساب والدفع يظلان تجريبيين. لا نسب خامات أو مخزون أو خصومات أو قياسات أو وعود تجارية جديدة من غير تأكيد.
