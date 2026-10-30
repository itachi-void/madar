# Madar Headless (WordPress plugin)

WordPress + WooCommerce is the back office (products, stock, orders, payments, customers, emails).
The React storefront talks to it over two APIs:

- `madar/v1` — this plugin: storefront-ready catalog, looks, materials, accounts, wardrobe, stock alerts, concierge.
- `wc/store/v1` — WooCommerce Store API: cart and checkout. No API keys are used in the browser.

Requirements: WordPress 6.4+, WooCommerce 8.0+, PHP 8.0+, pretty permalinks.

## Install

New, empty site:

```sh
wp plugin install woocommerce --activate
wp plugin install /path/to/madar-headless.zip --activate
wp madar setup-store
wp madar seed --publish-new
wp madar selftest
```

Existing WooCommerce store with the Madar SKUs:

```sh
wp plugin install /path/to/madar-headless.zip --activate
wp madar status
wp madar seed --dry-run
wp madar seed
wp madar hide-demo
```

## WP-CLI

| Command | What it does |
|---|---|
| `wp madar status` | Versions, permalinks, linked products, looks, materials, gateways, origins. |
| `wp madar setup-store [--dry-run]` | New stores only: site title, Cairo timezone, Egypt store location, EGP and its number format, skips the WooCommerce wizard, enables cash on delivery **for testing**. Prints before → after. |
| `wp madar seed [--dry-run] [--force] [--publish-new]` | Links `data/seed.json` to products **by SKU**. Never changes names, prices, stock or variations of existing products. Fills Madar fields only when empty (unless `--force`). Missing sale products are created with the reference store's slug, Arabic description, sizes, regular/sale prices and per-size stock status — as **drafts**, or **published** with `--publish-new`. The 3 styling pieces are created hidden, priceless and not for sale. Creates categories, looks and materials. Safe to repeat. |
| `wp madar hide-demo [--dry-run]` | Moves the 6 `TEST-*` demo products to draft. Deletes nothing. |
| `wp madar import-images --dir=<outputs> [--dry-run] [--real-photos]` | Imports the image-brief `outputs/` folder (`products/<key>/`, `lookbook/`, `materials/`). Sets role images, featured image and gallery. Skips missing files. Never duplicates a file. Images are flagged as generated concepts unless `--real-photos`. |
| `wp madar selftest` | PASS / FAIL / WARN table for the whole installation, including a temporary customer that is deleted at the end. No orders are created. |
| `wp madar flush-cache` | Clears the API cache (it also clears itself on every product/look/material save). |

`scripts/build-wordpress-seed.py` in the storefront repository regenerates `data/seed.json` from the storefront data.

## Options (Madar → Settings)

| Option | Default | Use |
|---|---|---|
| `madar_frontend_url` | empty | Storefront origin. Used for reset-password, order-confirmation and stock-alert links, and always allowed for CORS. |
| `madar_allowed_origins` | `http://localhost:5173`, `http://localhost:4173` | Extra storefront origins, one per line. |
| `madar_headless_redirect` | `no` | Redirect WordPress front-end pages to the storefront. Admin, REST, login, `wc-api` and `wc-ajax` are never redirected. |
| `madar_concierge_email` | empty → admin email | Inbox for concierge questions. |
| `madar_token_days` | 30 | Sign-in length. |

## Authentication

`POST /auth/login` or `/auth/register` returns `{ token, expires_at, user }`.
Send `X-Madar-Token: <token>` on every request that needs the customer, **including Store API cart and checkout requests**, so the order is attached to the account.
Only a keyed hash is stored. Logout and password reset revoke tokens. An invalid or expired token returns `401 madar_invalid_token` — drop it and continue as a guest.

## Cart and checkout (Store API)

1. `GET /wc/store/v1/cart` → keep the `Cart-Token` response header.
2. Send `Cart-Token` on every cart/checkout call (no nonce is needed with a cart token).
3. `POST /wc/store/v1/cart/add-item` `{ "id": <variation id>, "quantity": 1 }`. Out-of-stock and styling-only pieces are rejected by WooCommerce.
4. `POST /wc/store/v1/checkout` `{ billing_address, shipping_address, payment_method }` with `X-Madar-Lang: eg|sa|en|fr|es`.
   Use `GET /madar/v1/settings` → `countries[CODE].required` and `.states` to build the address form (Egypt requires governorate and postcode).
5. Follow `payment_result.redirect_url`. With `madar_frontend_url` set it points to `{storefront}/{lang}/checkout/order-received/?order=ID&key=KEY`.
6. `GET /madar/v1/orders/confirmation?order=ID&key=KEY`.

## `madar/v1` endpoints

All `GET` endpoints accept `lang=eg|sa|en|fr|es` (default `eg`). Translations fall back to the Egyptian Arabic WordPress fields.

| Method | Route | Notes |
|---|---|---|
| GET | `/settings` | Store name, currency, decimals, locales, enabled payment methods, countries/states/required address fields, default country, size charts, Store API URL. |
| GET | `/products` | `audience=men|kids`, `ids=1,2,3` (keeps order). Published, visible products plus styling pieces. |
| GET | `/products/{id}` | 404 for drafts and hidden products. |
| GET | `/product-by-slug?slug=` | Arabic slugs accepted encoded or decoded. |
| GET | `/looks` | Title, excerpt, audience, occasion, palette, product IDs, main/detail images. |
| GET | `/materials` | Name, story, care, `composition` (null until verified), product IDs, macro image. |
| GET | `/orders/confirmation?order=&key=` | Order summary when the order key matches. |
| POST | `/auth/register` | `email, password (8+), first_name?, last_name?` → 201. `409 madar_account_exists`. |
| POST | `/auth/login` | `login (email or username), password`. Rate limited. |
| POST | `/auth/logout` | Revokes the current token. |
| POST | `/auth/password/lost` | `login, lang?`. Always `{ sent: true }`. Email link goes to `{storefront}/{lang}/my-account/reset-password/?key=&login=`. |
| POST | `/auth/password/reset` | `login (username or email), key, password`. |
| GET/PUT | `/me` | Profile, billing and shipping. PUT accepts `first_name, last_name, billing{}, shipping{}`. |
| GET | `/me/orders` | Last 20 orders with items and timeline (`created`, `paid`, `completed`). |
| GET/PUT | `/me/wardrobe` | `{ items:[{product_id, variation_id?}], looks:[{id?, name, product_ids[]}] }`. Max 200 items, 50 looks, 12 pieces per look. |
| POST | `/stock-alerts` | `email, product_id, variation_id?, lang?, consent:true`. `409 madar_in_stock` if available. Email is sent when the option returns to stock. |
| POST | `/concierge` | `email, question (10–2000), name?, product_id?, lang?, consent:true`. Stored privately and emailed to the concierge inbox with Reply-To. |

Forms have a hidden `website` honeypot field and IP rate limits.

### Product payload

```text
id, slug, path, sku, type, name, short_description, description, categories[], audience,
price { min, max, regular_min, currency, on_sale }, in_stock, purchasable,
images [{ id, role: on_model|front|back|detail_1|detail_2|gallery, src, width, height, srcset, alt, concept }],
attributes [{ key, name, label, variation, options [{ value, label }] }],
variations [{ id, sku, attributes { <attribute key>: value }, price, regular_price, sale_price, in_stock, purchasable, stock_quantity, image }],
madar { styling_only, pairs[], materials[], hotspots [{ id, x, y, view, image_role, label, text }], fit, care, size_chart, model }
```

`model` is only returned when the editor ticks "Verified from a real shoot". `fit` and `care` stay empty until entered.
Hotspot positions in the seed are provisional until the final images are approved.

## Not included on purpose

- Payment gateways, shipping zones, taxes and policies: configure them in WooCommerce once the owner decides.
- Product translations of slugs: storefront URLs keep the original slug after the language prefix.
- Reviews, appointments and early access: not built until the services exist.
