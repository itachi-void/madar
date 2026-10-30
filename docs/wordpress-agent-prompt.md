# مدار — برومبتات الـAgent بتاع ووردبريس

**الموقع `http://madar.local` فاضي، فالبرومبت المعتمد دلوقتي هو 1-ب، وهو آخر قسم قبل البرومبت 2.**
البرومبت 1 و1-أ اتحفظوا كسجل بس: الأول لمتجر موجود فيه المنتجات، والتاني فحص مؤقت. البرومبت 2 بعد ما الصور تخلص، والبرومبت 3 بعد ما نقرر الاستضافة والدفع.

قبل البرومبت 1-ب:

1. نزّل الملف `/downloads/madar-headless.zip` من رابط المعاينة **من جديد**، لأن لازم يكون الإصدار 1.1.0.
2. حطه في مكان ثابت على جهازك، مثلًا سطح المكتب.
3. في أول البرومبت، بدّل `PLUGIN_ZIP` بالمسار الكامل للملف في المكانين.

---

## البرومبت 1 — متجر موجود فيه منتجات مدار (سجل بس، متبعتوش)

````text
إنت هتشتغل على موقع ووردبريس محلي على تطبيق Local اسمه «مدار». نفّذ الخطوات دي بالترتيب وبالحرف.
ممنوع تعمل أي حاجة مش مكتوبة هنا. لو نتيجة أي خطوة اختلفت عن «المطلوب»: وقّف فورًا، متحاولش تصلّح، وابعت التقرير بالنتيجة الفعلية.

مسار ملف الإضافة: PLUGIN_ZIP

ممنوعات (متعملهاش أبدًا):
1. متمسحش أي منتج أو طلب أو مستخدم أو صفحة أو صورة.
2. متغيرش اسم أو سعر أو مخزون أو مقاسات أي منتج.
3. متثبتش أي إضافة غير madar-headless (لا WPML، لا JWT، لا ACF، لا بوابات دفع، لا كاش، لا أمان).
4. متغيرش الثيم، ولا wp-config.php، ولا إعدادات الدفع أو الشحن أو الضرائب أو العملة.
5. متعدلش أي ملف جوه إضافة madar-headless. لو ظهر خطأ، انسخه حرفيًا وحطه في التقرير.
6. متكتبش Storefront URL، ومتفعلش «Redirect WordPress pages».
7. متشغلش أي أمر فيه --force.
8. متعملش طلبات (orders) تجريبية.

مكان تنفيذ الأوامر:
من تطبيق Local اختار موقع مدار ← Open site shell. كل أوامر wp تتنفذ هناك، وإنت واقف في فولدر app/public.
قبل أي حاجة نفّذ: wp option get siteurl — لازم يطلع رابط الموقع. لو طلع خطأ: وقّف.

الخطوة 1 — معلومات البيئة:
wp option get siteurl
wp core version
php -v
wp plugin list --fields=name,status,version
wp option get permalink_structure
المطلوب: woocommerce حالته active، وPHP إصداره 8.0 أو أعلى. لو أي واحد منهم مش متحقق: وقّف.

الخطوة 2 — نسخة احتياطية (إجباري قبل أي تغيير):
wp db export madar-backup-before-headless.sql
المطلوب: رسالة Success، والملف madar-backup-before-headless.sql موجود جوه app/public. لو فشل: وقّف.

الخطوة 3 — الروابط:
لو نتيجة wp option get permalink_structure في الخطوة 1 كانت فاضية تمامًا، نفّذ:
wp rewrite structure '/%postname%/'
wp rewrite flush
لو كان فيها أي قيمة: سيبها زي ما هي، ومتنفذش الأمرين دول.

الخطوة 4 — تثبيت الإضافة:
wp plugin install "PLUGIN_ZIP" --activate
wp plugin list --name=madar-headless --fields=name,status,version
المطلوب: madar-headless   active   1.0.0
لو ظهرت رسالة إن الفولدر موجود قبل كده (Destination folder already exists): وقّف، ومتستخدمش --force.

الخطوة 5 — فحص قبل التهيئة (مش بيغيّر حاجة):
wp madar status
wp madar seed --dry-run
المطلوب في نتيجة seed --dry-run، الثلاثة مع بعض:
أ) بالظبط 10 سطور فيها كلمة link، بـ SKU من MDR-DEMO-1 لحد MDR-DEMO-10.
ب) مفيش ولا سطر فيه كلمة missing.
ج) السطور اللي فيها would create هي بس: 3 منتجات (trouser-charcoal و trouser-stone و kids-chino-navy)، و5 سطور madar_material، و4 سطور madar_look. يعني 12 سطر would create بالظبط.
لو أي شرط من الثلاثة مش متحقق: وقّف وابعت التقرير.

الخطوة 6 — التهيئة:
wp madar seed
المطلوب: آخر سطر Success: Seed complete.
wp madar hide-demo --dry-run
المطلوب: كل السطور SKU بتاعها بيبدأ بـ TEST- (6 سطور)، وكل واحد would draft أو skip. لو ظهر أي SKU تاني: وقّف.
wp madar hide-demo
المطلوب: Success: Demo products handled.

الخطوة 7 — الاختبار الشامل:
wp madar selftest
المطلوب: آخر سطر Success: All required checks passed.
طبيعي يظهر WARN في: Product images (الصور لسه مش جاهزة)، وPayment methods، وShipping zones (لسه قرار صاحب المشروع)، وممكن في HTTP request to the REST API. الـWARN مش مشكلة، متصلحوش.
لو ظهر أي FAIL: وقّف وابعت التقرير.

الخطوة 8 — تأكيد شكلي (من غير أي تعديل):
افتح في المتصفح رابط الموقع وبعده /wp-admin وسجّل دخول. اتأكد إن:
- لوحة التحكم بتفتح عادي.
- فيه قائمة جديدة اسمها Madar، وجواها Settings وLooks وMaterials وStock alerts وConcierge questions.
- في Products، المنتجات الحقيقية لسه منشورة، والـ6 منتجات التجريبية بقت Draft.
متدوسش Save في أي صفحة.

التقرير — ابعته بالشكل ده بالظبط:
1) siteurl:
2) WordPress / WooCommerce / PHP:
3) Backup: Success أو Fail + اسم الملف
4) Permalinks قبل / بعد:
5) Plugin: (نتيجة wp plugin list --name=madar-headless)
6) wp madar status: (الجدول كامل)
7) wp madar seed --dry-run: (الجدول كامل)
8) wp madar seed: (الجدول كامل)
9) wp madar hide-demo: (الجدول كامل)
10) wp madar selftest: (الجدول كامل)
11) wp-admin بيفتح؟ قائمة Madar ظاهرة؟ عدد المنتجات المنشورة؟
12) أي خطأ أو تحذير ظهر في أي خطوة: (انسخه حرفيًا)

متعملش أي حاجة بعد التقرير. الخطوات الجاية هتيجي في برومبت منفصل.
````

---

## البرومبت 1-أ — تشخيص (قراءة بس) لما الخطوة 1 توقف بسبب WooCommerce

البرومبت ده اتعمل بعد ما الـagent وقف في الخطوة 1، لأن موقع `http://madar.local` مكانش فيه WooCommerce مفعّل.

````text
تمام إنك وقفت. المرة دي هتعمل فحص قراءة بس: كل الأوامر دي بتقرأ ومبتغيّرش حاجة.
نفس الممنوعات بتوع المرة اللي فاتت. ممنوع كمان تفعّل أو تثبّت أي إضافة، حتى woocommerce. وممنوع تصلّح تحذير php_imagick.dll، لأنه مش مؤثر.
نفّذ من نفس المكان: Local ← موقع مدار ← Open site shell ← app/public.
لو أي أمر طلع خطأ: انسخ الخطأ حرفيًا وكمّل الأمر اللي بعده. متوقفش، ومتحاولش تصلّح.

1) wp plugin list --fields=name,status,version
2) wp option get active_plugins --format=json
3) wp eval "print_r(scandir(WP_PLUGIN_DIR));"
4) wp db prefix
5) wp db query "SELECT post_status, COUNT(*) FROM wp_posts WHERE post_type='product' GROUP BY post_status"
6) wp db query "SELECT meta_value FROM wp_postmeta WHERE meta_key='_sku' AND (meta_value LIKE 'MDR-%' OR meta_value LIKE 'TEST-%')"
7) wp theme list --fields=name,status
8) wp eval "print_r(array_map('basename', glob(getenv('USERPROFILE') . '/Local Sites/*', GLOB_ONLYDIR)));"
9) wp eval "print_r(glob(getenv('USERPROFILE') . '/Local Sites/*/app/public/wp-content/plugins/woocommerce', GLOB_ONLYDIR));"
10) من تطبيق Local نفسه (من غير أوامر): اكتب أسماء كل المواقع اللي في القائمة على الشمال، وجنب كل موقع الدومين بتاعه (مثلًا madar.local)، وحالته Running أو Stopped، ولو فيه Live Link شغال ورابطه.

التقرير: اكتب رقم كل أمر، وتحته نتيجته كاملة زي ما ظهرت. ولو الأمر 4 طلع بادئة غير wp_، اكتب ده بوضوح في الآخر.
متعملش أي حاجة تانية بعد التقرير.
````

---

## البرومبت 1-ب — موقع فاضي: بناء المتجر من الصفر (ابعته دلوقتي)

````text
إنت هتشتغل على موقع ووردبريس محلي فاضي على تطبيق Local اسمه «مدار» (http://madar.local). هتبني المتجر من الصفر.
نفّذ الخطوات بالترتيب وبالحرف. ممنوع تعمل أي حاجة مش مكتوبة هنا. لو نتيجة خطوة اختلفت عن «المطلوب»: وقّف فورًا، متحاولش تصلّح، وابعت التقرير.

مسار ملف الإضافة: PLUGIN_ZIP

المسموح تثبيته بس (ومن غيرهم ممنوع):
- إضافة woocommerce من مكتبة ووردبريس الرسمية، بالأمر المكتوب في الخطوة 4.
- حزم اللغة العربية لووردبريس وwoocommerce، بالأوامر المكتوبة في الخطوة 5.
- إضافة madar-headless من الملف اللي في المسار فوق.

ممنوعات:
1. متثبتش أي إضافة أو ثيم تاني (لا WPML، لا JWT، لا ACF، لا بوابات دفع، لا شحن، لا كاش، لا أمان، لا SMTP).
2. متعدلش wp-config.php، ومتعدلش أي ملف جوه أي إضافة. لو ظهر خطأ، انسخه حرفيًا في التقرير.
3. متضيفش منتجات أو صفحات أو صور بإيدك، ومتغيرش أي حاجة الأوامر عملتها.
4. متعملش أي إعداد في WooCommerce غير اللي الأوامر بتعمله: لا شحن، لا ضرائب، لا بوابات دفع.
5. متشغلش أي أمر فيه --force.
6. متكتبش Storefront URL، ومتفعلش «Redirect WordPress pages».
7. متعملش طلبات (orders) تجريبية.
8. متصلحش تحذير php_imagick.dll، لأنه مش مؤثر.

مكان تنفيذ الأوامر: من تطبيق Local ← موقع مدار ← Open site shell، وإنت واقف في فولدر app/public.

الخطوة 1 — البيئة:
wp option get siteurl
wp core version
php -v
wp plugin list --fields=name,status,version
wp option get permalink_structure
المطلوب: siteurl هو http://madar.local، وإصدار WordPress 6.4 أو أعلى، وPHP 8.0 أو أعلى. لو أي واحد منهم مش متحقق: وقّف.

الخطوة 2 — نسخة احتياطية:
wp db export madar-backup-before-store.sql
المطلوب: رسالة Success، والملف موجود جوه app/public. لو فشل: وقّف.

الخطوة 3 — الروابط:
لو نتيجة permalink_structure في الخطوة 1 كانت فاضية تمامًا، نفّذ:
wp rewrite structure "/%postname%/"
wp rewrite flush
لو فيها أي قيمة (زي /%postname%/): متنفذش حاجة في الخطوة دي.

الخطوة 4 — WooCommerce:
wp plugin install woocommerce --activate
wp plugin list --name=woocommerce --fields=name,status,version
المطلوب: woocommerce حالته active، وإصداره 8.0 أو أعلى. لو لأ: وقّف.

الخطوة 5 — العربي:
wp language core install ar --activate
wp language plugin install woocommerce ar
المطلوب: Success للأمرين. لو واحد منهم فشل: انسخ الخطأ في التقرير، وكمّل عادي. الخطوة دي بس مسموح فيها تكمّل بعد الخطأ.

الخطوة 6 — إضافة مدار:
wp plugin install "PLUGIN_ZIP" --activate
wp plugin list --name=madar-headless --fields=name,status,version
المطلوب: madar-headless   active   1.1.0
لو الإصدار 1.0.0: وقّف، وقول إن الملف قديم ومحتاج يتنزل من جديد. ولو ظهر Destination folder already exists: وقّف، ومتستخدمش --force.

الخطوة 7 — إعدادات المتجر الأساسية:
wp madar setup-store --dry-run
المطلوب: جدول فيه 11 سطر، كل سطر فيه would set أو skip، ومفيش Error.
wp madar setup-store
المطلوب: Success: Store basics applied. Cash on delivery is enabled for testing only.

الخطوة 8 — المنتجات والإطلالات والخامات:
wp madar seed --dry-run
المطلوب، الأربعة مع بعض:
أ) بالظبط 24 سطر فيهم would create: سطرين category (men و kids)، و13 منتج، و5 سطور madar_material، و4 سطور madar_look.
ب) سطر واحد فيه would save (size charts).
ج) مفيش ولا سطر فيه missing.
د) مفيش ولا سطر فيه link.
لو أي شرط مش متحقق: وقّف وابعت التقرير.
wp madar seed --publish-new
المطلوب: آخر سطر Success: Seed complete.

الخطوة 9 — الاختبار الشامل:
wp madar selftest
المطلوب: آخر سطر Success: All required checks passed.
طبيعي يظهر WARN في: Product images (الصور لسه)، وShipping zones (قرار صاحب المشروع)، وممكن في HTTP request to the REST API. الـWARN مش مشكلة، متصلحوش. لو ظهر FAIL: وقّف.

الخطوة 10 — تأكيد شكلي من غير تعديل:
افتح http://madar.local/wp-admin وسجّل دخول. اتأكد إن لوحة التحكم بتفتح، وإن فيه قائمة اسمها Madar. وفي «المنتجات»، اكتب عدد المنتجات المنشورة (المتوقع 13).
متدوسش حفظ في أي صفحة.

التقرير — بالشكل ده بالظبط:
1) siteurl:
2) WordPress / PHP / WooCommerce:
3) Backup: Success أو Fail + اسم الملف
4) Permalinks قبل / بعد:
5) اللغة العربية: نتيجة الأمرين
6) Plugin: (نتيجة wp plugin list --name=madar-headless)
7) setup-store --dry-run: (الجدول كامل)
8) setup-store: (السطر الأخير)
9) seed --dry-run: (الجدول كامل)
10) seed --publish-new: (الجدول كامل)
11) selftest: (الجدول كامل)
12) wp-admin بيفتح؟ قائمة Madar ظاهرة؟ عدد المنتجات المنشورة؟
13) أي خطأ أو تحذير ظهر في أي خطوة: (انسخه حرفيًا)

متعملش أي حاجة بعد التقرير.
````

---

## البرومبت 2 — استيراد الصور (بعد ما الصور تخلص بس)

بدّل `OUTPUTS_DIR` بالمسار الكامل لفولدر `outputs` اللي موديل الصور سلّمه، بنفس الترتيب: `outputs/products/...` و`outputs/lookbook/...` و`outputs/materials/...`.
لو الصور تصوير حقيقي مش مولّدة، قوللي قبل ما تبعت البرومبت، علشان أضيف `--real-photos`.

````text
نفس الممنوعات والمكان بتوع المرة اللي فاتت بالظبط (Local ← Open site shell ← app/public). لو أي نتيجة اختلفت عن المطلوب: وقّف وابعت التقرير.

مسار فولدر الصور: OUTPUTS_DIR

1) wp db export madar-backup-before-images.sql
   المطلوب: Success.
2) wp madar import-images --dir="OUTPUTS_DIR" --dry-run
   المطلوب: مفيش سطر فيه skip. سطور missing مسموحة، بس انسخها في التقرير.
3) wp madar import-images --dir="OUTPUTS_DIR"
   المطلوب: Success: Images imported.
4) wp madar selftest
   المطلوب: Success: All required checks passed. و Product images بقت PASS أو العدد زاد.

التقرير: انسخ الجداول الأربعة كاملة، وأي خطأ ظهر حرفيًا. متعملش أي حاجة تانية.
````

---

## البرومبت 3 — ربط الواجهة (بعد تحديد رابط الواجهة والاستضافة)

هجهزه بالقيم الحقيقية لما نحدد:

- رابط الواجهة النهائي.
- مكان استضافة ووردبريس.
- مزود الدفع والشحن.

فيه هيتظبط `madar_frontend_url` و`madar_allowed_origins`، وبعد كده التحويل. **متبعتوش دلوقتي.**
