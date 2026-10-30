# Madar frontend release checklist

This is a static React/Vite **frontend demonstration**, not a functioning store.
No deployment, domain change, backend migration, or payment setup is performed
by these files.

## Verify

Use the repository's commands:

```sh
node --test src/app/routes.test.mjs
pnpm exec tsc --noEmit
pnpm build
CHROMIUM_EXECUTABLE_PATH=/usr/bin/chromium pnpm test:ui
```

The browser suite uses the already-running Make preview on port 3000. Set
`MADAR_TEST_URL` to test another existing preview; it does not start a server.
For other machines, run `pnpm exec playwright install chromium` and omit the
system executable override.

## Prepare static output

`pnpm build` writes `dist/`. Deploy that directory, not `src/` or the repository.
The app currently targets a domain root (`/`); subpath deployments need explicit
router/asset-base changes and have not been validated.
Language prefixes (`/sa/`, `/en/`, `/fr/`, `/es/`) are application routes at that
domain root, not separate asset/deployment bases.

Once the real public origin is known:

```sh
SITE_URL=https://your-real-domain.example pnpm prepare:release
```

Replace the example with the actual HTTPS origin; do not use the protected
WordPress reference domain or embed Basic Auth credentials. This command writes
`dist/sitemap.xml` using captured public routes plus approved-for-display authored
pages and writes `dist/robots.txt`. It excludes cart, checkout, account, and the
unapproved policy draft and rejects origins
with credentials, query strings, fragments, or subpaths. Re-run it after each
build, because a build replaces `dist/`.
The sitemap includes all five language variants with language alternatives.
Private-route exclusions also apply under every language prefix.

### Crawling and sharing

Keep **search indexing disabled during preview**. `.figma/make/site.json`
currently sets `robots.index` to `false`; the release preparation command
preserves that setting. The private/demo/search/error pages also receive
route-level `noindex`.

Before enabling public indexing:

- Decide whether to keep the store demo public, or connect real commerce later.
- Configure the production domain and verify sitemap URLs on that domain.
- Add static prerendering or SSR if reliable per-route social previews,
  non-JavaScript crawling, or real HTTP 404 responses are required. Client-side
  metadata is useful, but is not equivalent to prerendered SEO.
- Review the user-requested original about/help/size-guide/style-finder copy.
  These are authored additions, not pages recovered from the source. The size
  tables must remain traceable to the captured product guide.
- Confirm business identity, contact details, shipping areas/fees/times, returns,
  refunds, payment processing, and production privacy behavior before approving
  the policy draft. It remains excluded from indexing/sitemaps in the meantime.
- Recheck any source contact numbers and commercial promises before launch.
  The copy is reproduced from the reference and is not a verified live service.
- Review regional copy with native readers. The Saudi edition is not a Saudi
  trading setup: reference amounts remain EGP, and Saudi pricing, VAT, shipping,
  contact details and legal policies need owner approval. See
  `docs/multilingual.md`; do not silently relabel EGP amounts as SAR or euros.

## Hosting

`public/_redirects` provides Netlify-style SPA fallback for direct deep links.
`public/_headers` supplies Netlify-style MIME-sniffing/referrer/permissions
headers and long-lived caching for hashed bundles, with one-week caching for
non-hashed fonts/images. Other hosts may ignore these files: configure equivalent
rules in their dashboard. Do not add `X-Frame-Options: DENY` or `frame-ancestors
'none'` to the embedded Make preview.

On a generic static host:

1. Serve actual files first.
2. Fall back non-file routes to `/index.html`.
3. Keep `index.html` revalidated/no-cache across releases.
4. Cache `/assets/*` as immutable; these filenames are content-hashed.
5. Do not rewrite missing JS/CSS/font/image files to HTML.
6. Verify an Arabic product URL, `/shop/`, `/my-account/`, and `/checkout/`
   by opening them directly and refreshing.

The SPA fallback returns HTTP 200 even for the in-app unavailable page.
Configure a true server/edge 404 or prerendered route inventory when that is
needed; a client-only 404 screen does not change the HTTP status.

## Manual acceptance

- Check 320/390 px phones, 768 px tablets, and 1440 px desktop, including RTL
  numbers, long labels, keyboard focus, and zoom.
- Test mouse image hovers and scroll scenes; test reduced-motion mode separately.
- Test empty/full cart, quantity/remove, favorite/unfavorite, and search with no
  results.
- Test checkout validation, review/edit, simulated card decline/retry, COD, and
  the preview confirmation. Reloading intentionally clears session demo state.
- Confirm forms never submit and **never enter real passwords or card data**.
- Check direct links, Back/Forward, hash anchors, unavailable-source pages, and a
  failed lazy-chunk request (the retry screen should be usable).

Automated checks do not certify pixel-perfect parity, Core Web Vitals, WCAG AA
compliance, or real-device browser compatibility. Re-run visual/performance/
accessibility audits on the chosen production host before launch.
