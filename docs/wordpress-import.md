# Madar public-page import

The existing React homepage is preserved. An additional **37 public pages**
were captured from the WordPress site's HTML and XML sitemaps and connected
through React Router's browser/data router.

## Route inventory

The complete source-status inventory is in
`src/content/route-manifest.json`. Page metadata is in
`src/content/pages.json`; sanitized page markup is in `src/content/pages/`
and loaded lazily per route. The 16-product index is in
`src/content/catalog.json`.

Route families:

- `/shop/`
- `/product-category/men/`, `/product-category/kids/`,
  `/product-category/clothing/`, `/product-category/accessories/`
- `/product/:original-arabic-slug/` (16 actual, explicitly registered routes)
- `/color/black/`, `/color/brown/`, `/color/white/`
- `/size/s/`, `/size/m/`, `/size/l/`, `/size/xl/`
- `/lookbook/`, `/journal/`
- `/cart/`, `/my-account/`, `/my-account/lost-password/`
- `/sample-page/`, `/hello-world/`, `/category/uncategorized/`, `/author/admin/`

The source's empty `/checkout/` redirected to `/cart/`; the frontend now
deliberately provides a **demo checkout** instead of copying that redirect.
The source returned 404
for `/about/`, `/help/`, `/policies/`, `/size-guide/`, `/style-finder/`, and
`/?page_id=3`. That original source-status history is preserved unchanged.
At the user's subsequent request, the five named paths now have **original
authored frontend content**, not invented source captures; `/?page_id=3`
redirects to `/policies/#privacy`. Other unknown page IDs remain unavailable.

## Original content for previously missing pages

`src/content/authored-pages.json` keeps authored titles/descriptions and draft
status separate from `pages.json` and the original source manifest.

- `/about/`: original brand philosophy and links to the real men's/kids'
  collections. No invented founders, dates, factories, certifications, or company
  achievements.
- `/help/`: grouped native-disclosure FAQs covering sizing, product browsing,
  temporary favorites/cart, preview accounts/payment, care, and unconfirmed
  shipping/support details.
- `/size-guide/`: men's and kids' tables copied exactly from the existing
  product guide into `src/content/size-guide.json`. The page identifies its source
  and warns that the tables are illustrative, not product-specific measurements
  or proof of size availability. The original product drawers are unchanged.
- `/policies/`: prominently marked **draft/unapproved**. Describes actual preview
  behavior and lists operational/legal decisions still needed; does not invent
  fees, shipping times, refund deadlines, support details, or an approved policy.
  It stays `noindex` and is excluded from release sitemaps independently of the
  global preview indexing setting.
- `/style-finder/`: three in-memory questions (audience, occasion, palette) produce
  editorial suggestions from existing non-test products. Results respect the
  chosen audience, support edit/restart and existing session favorites, and never
  claim to determine size, invent variants, confirm stock, or use AI/a backend.

The new copy is labeled as original content for the new site. Existing local
photography, Madar typography/palette, and local interface primitives are reused.
No CMS, stored preferences, tracking, or submission endpoint was added.

## Language editions

Four additional frontend editions now cover the same complete route inventory:
Saudi Arabic (`/sa/`), English (`/en/`), French (`/fr/`), and Spanish (`/es/`).
Egyptian Arabic remains at `/`. They share source assets, product IDs and session
state, with local static translations, correct RTL/LTR layouts, and an equivalent-
page language selector. See `docs/multilingual.md` for implementation, coverage,
the intentionally unchanged EGP reference pricing, and unapproved regional
shipping/tax/policy limits.

## Frontend behavior

- Header/footer and homepage product links use actual local routes.
- Browser Back/Forward and direct deep links are supported.
- Source CSS, RTL layouts, image hovers, reveal motion, size drawers,
  product swatches, gallery thumbnails/lightbox, and keyboard-accessible tabs
  are reproduced without running WordPress scripts.
- Shop search and price ordering operate on the captured products. Date
  ordering uses product IDs; live sales/rating data is not connected.
- The homepage quick-view drawer and in-memory favorites/cart work during the
  current app session. Refreshing clears that state. Empty-cart and empty-favorite
  states have explicit shopping actions.
- `/checkout/` has delivery validation, payment-method selection, review/edit,
  a simulated pending state, card success/refusal controls, and retry. It accepts
  **no card credentials**. The total is the captured product subtotal only;
  shipping, tax, stock checks, and gateway fees are not calculated or invented.
- `/checkout/order-received/` shows an explicitly labeled checkout preview.
  Finishing clears the cart and retains a non-personal summary in React memory
  only. Refreshing clears it. There is no real receipt or order number.
- Account login/registration validate inputs and open an **unprotected demo
  dashboard**, without checking credentials or creating an account. A direct
  "browse demo" action does not require entering credentials.
- Account UI routes include `/my-account/orders/`,
  `/my-account/edit-address/`, `/my-account/edit-account/`, and
  `/my-account/reset-password/`. Recovery has a confirmation state and a manual
  reset-preview link, without pretending to send email. Forms have inline errors,
  password-visibility controls, and explicitly labeled preview confirmations.
- All new account/checkout screens are deliberate UI extensions, **not claims
  that missing/authenticated source pages were captured**.
- Account, delivery, password, subscription, comment, and review values are not
  sent to an application server or put in local/session storage. Use dummy input:
  the app still necessarily holds typed input transiently in component memory.
  The final checkout snapshot excludes name, email, phone, address, and notes.
- There is no authentication, order creation, inventory synchronization,
  payment processing, or private API integration.

## Source handling

Only public page markup and public assets were imported. Scripts, inline event
handlers, server form actions, WordPress runtime directives, hidden nonce fields,
and password values were removed. No credentials are stored in the project.
Images and required WooCommerce style assets are served locally.

`src/theme/wordpress.css` contains captured WordPress/WooCommerce base styles;
`src/theme/madar.css` remains the original app design layer.
`src/theme/routes.css` contains the small route-specific compatibility layer;
`src/theme/commerce.css` extends the same ivory/sand/ink tokens for demo commerce.
`src/components/Interface.tsx` contains the small local form/typography primitives.
Invalid browser-ignored WooCommerce pseudo-element descendant/chained selectors were omitted for
compatibility with Vite's production CSS parser.

## Visual, motion, accessibility, and performance follow-up

- Representative desktop comparisons were made against live home, shop, product,
  account, lookbook, and journal pages. The source mobile home was also captured
  but was covered by its reduced-motion curtain; local mobile layouts were tested
  independently. Source access was intermittent (the shop retry succeeded);
  this is **not a pixel-perfect certification of every
  viewport/scroll position across all 37 pages**.
- Fixed an inherited WordPress block margin caused by the skip link inside the
  site wrapper, which had displaced the header and every page.
- Fixed the opening curtain remaining over the homepage with reduced motion.
  Keyboard menu/search closing returns focus to its trigger; native dialogs trap
  focus and close with Escape; product tabs have arrow/Home/End keyboard controls.
  The moving homepage strip also has a keyboard-accessible pause control.
- Restored the gallery magnifier, hid the variation-reset action until a selection
  exists, retained search while changing sort, and made non-live sales/rating
  ordering explicit rather than claiming real ranking.
- Arabic/Latin Alexandria and Noto Naskh Arabic plus Latin Manrope are self-hosted
  WOFF2 subsets in `public/fonts/`, with their OFL licenses. Critical Arabic
  subsets are preloaded; no runtime Google Fonts request is required.
- Account, checkout, home, and imported page components load in separate chunks.
  Imported HTML remains lazy per route; noncritical imagery uses lazy loading.
- Route titles/descriptions, canonical URLs, Open Graph/Twitter metadata, product
  and breadcrumb JSON-LD update on navigation. Structured data contains no
  invented ratings, live stock, or shipping guarantees.
- Preview-wide `noindex, nofollow` is intentionally retained. Account, cart,
  checkout, search, and unavailable screens stay `noindex` independently.
- Browser history restores scroll positions in memory; new routes start at the
  top and hash links scroll to their target.
- This remains a client-rendered SPA: route metadata requires JavaScript, social
  scrapers may only see the root HTML, and unknown URLs need host support for a
  true HTTP 404. See `docs/frontend-release.md` before public indexing.

## Checks

```sh
node --test src/app/routes.test.mjs
pnpm exec tsc --noEmit
pnpm build
CHROMIUM_EXECUTABLE_PATH=/usr/bin/chromium pnpm test:ui
```

`playwright.config.ts` uses the existing supervised server at port 3000, or
`MADAR_TEST_URL`. It never starts a second server. When a system Chromium is
unavailable, install Playwright Chromium and omit `CHROMIUM_EXECUTABLE_PATH`.
The browser suite covers all 37 captured routes plus the new frontend routes,
desktop/mobile/tablet overflow, shopping interactions, successful/refused demo
checkout, account/recovery states, local fonts, metadata, keyboard behavior,
reduced motion, and the absence of form POSTs.
