# Madar language editions

The original Egyptian Arabic interface remains at `/`. Four complete frontend
editions share the same components, captured pages, catalogue and imagery:

| Edition | Prefix | HTML language | Direction |
| --- | --- | --- | --- |
| Egyptian Arabic | `/` | `ar-EG` | RTL |
| Saudi Arabic | `/sa/` | `ar-SA` | RTL |
| English | `/en/` | `en` | LTR |
| French | `/fr/` | `fr` | LTR |
| Spanish | `/es/` | `es` | LTR |

Each prefix supports the full existing route inventory: home, shop, categories,
all 16 products, colours/sizes, lookbook, journal, captured WordPress sample/blog
pages, authored information pages, account/recovery, cart, checkout and preview
confirmation. Original product slugs and IDs are intentionally preserved after
the prefix rather than inventing new product routes.

## Switching and state

The language/region selector in the header is available on desktop and mobile.
It changes to the equivalent page and preserves query parameters and hash.
The URL is the language preference; no cookie or browser-storage preference is
created. Browser Back/Forward works between editions.

The in-memory bag, favourites, demo-account flag and completed checkout preview
are shared while switching languages. Form drafts and style-finder answers are
view-local and may restart when switching editions. Reloading still clears all
demo application state.

## Content implementation

- `src/i18n/locales.json`: supported editions and route prefixes.
- `src/i18n/locales/{sa,en,fr,es}.json`: matching static message catalogues,
  including full page copy, product names/descriptions, labels, accessibility
  text, validation, empty/error/success states and source editorial/sample text.
- `src/i18n/LocalizedElement.ts`: a React-render-time adapter for shared copy.
  It localizes text and accessible text props while preserving product IDs,
  option values, event handlers, controlled field values and DOM identifiers.
  It does **not** mutate React-owned text nodes after rendering.
- The custom JSX entry points use `/src/i18n` as their Vite source import.
  Keep them out of dependency prebundling: the adapter and route provider must
  consume the same `LocaleContext` instance.
- `src/i18n/html.ts`: localizes the sanitized captured HTML before insertion,
  including text, image alternatives, form captions and internal links.
  It leaves variation values/data and media URLs canonical.
- App navigation hooks work with canonical paths and add the active prefix at
  navigation time. Rendered link destinations are prefixed too, so new tabs and
  direct navigation do not silently fall back to Egyptian Arabic.
- `src/theme/locales.css`: LTR typography/alignment, direction-aware controls,
  responsive language selector and regional notice. Existing locally hosted
  Latin fonts are reused; no remote font or translation service is needed.

`translate="no"` protects user-entered delivery details in the review screen and
the selector's endonyms. All translations are bundled local content, not an
external translation/AI request. Original photographed/embedded image text and
technical identifiers such as SKUs are not rewritten.

When editing canonical copy, add or update its key in all four catalogues.
Keep interpolation tokens (`{0}`, `{1}`, etc.) intact. If a new dynamic phrase
is composed in code, add its template as well as the relevant label fragments.

## Saudi edition: explicit regional limits

The Saudi Arabic edition uses region-appropriate wording, `ar-SA`/RTL,
region/city and mobile labels, and Saudi-format demo phone validation
(`05XXXXXXXX` or `+9665XXXXXXXX`). It does **not** claim a Saudi office, support
number, legal entity, delivery service or approved Saudi commercial policy.

**Captured prices remain Egyptian-pound reference prices (EGP).** No currency
conversion, SAR price list, exchange rate, Saudi VAT or local shipping fee is
invented. The Saudi edition shows this limit prominently, and unapproved local
shipping/returns promises are replaced by pending-approval wording. English,
French and Spanish also retain the EGP currency and localize number formatting;
they are language editions, not assertions of operating in a new country.

All policy pages remain clearly marked drafts and excluded from the sitemap
and route indexing until approved. The whole preview remains `noindex`.

## SEO and release

Titles, descriptions, Open Graph/Twitter copy, canonical URLs, breadcrumbs and
product schema reflect the active edition. Each route has five `hreflang`
alternates. `pnpm prepare:release`, given a real `SITE_URL`, emits all five public
route variants and their language alternatives, excludes private/draft routes,
and applies private-route robots exclusions for every prefix.

The application is still client-rendered. JavaScript-dependent metadata and SPA
fallback responses are not equivalent to prerendered social previews, SSR or
true HTTP 404s. Existing release guidance in `docs/frontend-release.md` still
applies; no deployment or backend was added.

## Verification

```sh
node --test src/app/routes.test.mjs
pnpm exec tsc --noEmit
pnpm build
CHROMIUM_EXECUTABLE_PATH=/usr/bin/chromium pnpm test:ui
```

The locale suite exercises every page in all four editions, checks Arabic
fallback leakage in Latin editions (excluding language endonyms and user text),
validates language/direction/links/canonical/alternates, checks 320/390/768 px
layouts, and covers translated product/cart/checkout/account flows, Saudi phone
input, language switching, retained cart state and unchanged reference prices.
This does not certify region-specific legal compliance or replace a native
editorial/legal review before a commercial launch.
