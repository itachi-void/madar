# مدار — Madar | Headless Luxury E-commerce Storefront

**مدار (Madar)** هو متجر إلكتروني فاخر للأزياء الرجالية وملابس الأطفال، مبني بهندسة برمجية حديثة ومنفصلة (**Headless Architecture**):
- **الواجهة الأمامية (Storefront):** مبنية باستخدام React 19 + Vite + Tailwind CSS لتوفير تجربة مستخدم فائقة السرعة، أنيميشن سلس، ودعم كامل للغتين (العربية والإنجليزية) مع التوجيه التلقائي (RTL / LTR).
- **الواجهة الخلفية (Back Office):** ووردبريس (WordPress) مع ووكومرس (WooCommerce) وإضافة `madar-headless` لإدارة المنتجات، المخزون، الطلبات، وبوابات الدفع بأمان تام عبر الـ REST API.

---

## 🌟 الميزات الرئيسية (Key Features)

- **الصفحة الرئيسية الفاخرة (Luxury Landing Page):**
  - قسم هيرو تفاعلي (Editorial Hero) بأناقة هادئة.
  - شريط عبارات متحرك هادئ (Quiet Marquee) مع إمكانية التحكم بالإيقاف والتشغيل وإمكانية الوصول (Accessibility).
  - استوديو المدار لتنسيق الأطقم (Orbit Studio): تدوير القطع ومزج الإطلالات في الوقت الفعلي.
  - دليل الإطلالات (Lookbook) والمجموعات الموسمية.
  - مكتبة الخامات (Material Library) مع استعراض تفاصيل النسيج بدقة.

- **تجربة التسوق والكتالوج (Catalog & Product Experience):**
  - كتالوج سريع وقابل للتصفية والتصنيف (رجال، أطفال).
  - معاينة سريعة للمنتجات (Quickview Modal) دون مغادرة الصفحة.
  - صفحة تفاصيل المنتج (PDP) تتضمن اختيار المقاسات، الألوان، جداول المقاسات، ودليل العناية بالقطعة.

- **إدارة السلة والدفع الآمن (Cart & Secure Checkout):**
  - تفاعل فوري مع WooCommerce Store API (`wc/store/v1`).
  - دعم الدفع عند الاستلام (Cash on Delivery) والبطاقات البنكية.
  - دعم متعدد العملات (الجنيه المصري EGP والريال السعودي SAR).

- **حساب المستخدم والخزانة (Customer Account & Wardrobe):**
  - تسجيل الدخول وإنشاء الحساب برمز آمن بدون تخزين بيانات حساسة في المتصفح.
  - سجل الطلبات، تتبع الشحنات، واستشارات المساعد الشخصي (Concierge).

---

## 🛠 البنية التقنية (Tech Stack)

### Frontend
- **Framework:** React 19 + TypeScript
- **Bundler:** Vite 8
- **Styling:** Tailwind CSS 4 + Custom Design System
- **Routing:** React Router 7
- **Internationalization (i18n):** دعم مخصص للغات (ar, en, sa) واتجاه النصوص (RTL / LTR)

### Backend
- **Core:** WordPress + WooCommerce
- **Plugin:** `wordpress/madar-headless` (يوفر نقاط النهاية `/wp-json/madar/v1/` و `/wp-json/wc/store/v1/`)

---

## 🚀 التشغيل والتطوير المحلي (Getting Started)

### متطلبات التشغيل:
- Node.js (v18+)
- npm أو pnpm

### خطوات تشغيل الفرونت إند:
```bash
# 1. تثبيت الحزم
npm install

# 2. بدء سيرفر التطوير
npm run dev

# 3. بناء نسخة الإنتاج
npm run build
```

---

## 🔒 حماية البيانات والخصوصية (Security & Clean Repository)

- هذا المستودع يحتوي على الكود المصدري البرمجي الخالص (Clean Source Code).
- لا يحتوي على أي مفاتيح سرية (API Keys)، كلمات مرور، أو قواعد بيانات خاصة.
- ملفات البناء المؤقتة، الملحقات الضخمة، وحزم `node_modules` مستثناة بالكامل عبر `.gitignore`.

---

© 2026 **مدار — Madar**. جميع الحقوق محفوظة.
