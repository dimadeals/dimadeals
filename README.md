# DIMA Deals

Premium digital marketplace for Tunisia — games, streaming subscriptions, courses
and software. Dark-first storefront with Vercel serverless API and Redis.

## Storefront design

The storefront was rebuilt as a dark gaming marketplace rather than a generic
template:

- Deep charcoal surfaces, one controlled pink accent, restrained cyan/yellow.
- Space Grotesk headings and Inter UI text; consistent spacing and type scale.
- Compact header with dropdown navigation, search, cart, language and theme.
- Editorial hero with real product artwork, category navigation and product grids.
- Product cards with media, category, rating, price/discount and a clear action.
- Detailed product pages with breadcrumbs, gallery, pricing and assurance points.
- Consistent cart, checkout, confirmation, search, browse, support and legal pages.
- Dark and light themes; English, French and Arabic direction support.
- Responsive layouts for desktop, laptop, tablet and phone.

The visual system lives in [style.css](style.css); storefront behaviour lives in
[js/](js/) and the shared API runtime in [api/redis.js](api/redis.js).

## Multilingual support (EN / FR / AR)

All three languages share one runtime, [js/i18n.js](js/i18n.js), loaded by both
the storefront and the admin dashboard. It provides:

- Central EN/FR/AR dictionaries keyed by the English source message, with
  interpolation (`{name}`, `{count}`), missing-key fallback to English, and
  `data-i18n` / `data-i18n-placeholder` support.
- Runtime DOM translation for static HTML plus a `MutationObserver` for
  dynamically rendered tables, modals, toasts and product cards.
- Product name/description translations keyed by product ID. Products without a
  translation fall back to their stored English data, so existing Redis records
  and newly created admin products are never broken.
- `localStorage.language` persistence, English as the first-visit default,
  `document.documentElement.lang` / `dir` updates, and live re-rendering of
  product grids, product detail, search, cart, checkout and confirmation.
- Arabic typography (Cairo) and mirrored navigation, directional icons, forms,
  headers, footers and admin layout. Prices, currency codes, IDs, emails,
  phone numbers and brand names stay readable and are not translated.
- Language selectors in the desktop header, the mobile navigation, the compact
  checkout/confirmation headers and the admin login/dashboard.

Translations live entirely in `js/i18n.js`; no backend schema or API contract
was changed. Elements holding user/product data can opt out with
`data-i18n-skip`.

## Quick start (no Redis required)

```bash
npm run dev
```

> On Windows, if PowerShell blocks `npm.ps1`, use `npm.cmd run dev` or
> `node dev-server.js` instead.

Then open:

- Storefront: http://127.0.0.1:3000
- Admin dashboard: http://127.0.0.1:3000/admin
- Local demo admin key: `dev-admin-key` (printed in the terminal)

The dev server runs the real `api/*.js` handlers with a Vercel-compatible
`req`/`res` shim. When `REDIS_URL` is not set it uses an in-memory store that is
seeded with the starter catalog, so the full shop, cart, checkout, order
confirmation, and admin dashboard work out of the box. Local in-memory data
(orders, product edits, messages) resets when the server stops.

> **Consolidated layout:** all shared backend runtime code — Redis client,
> in-memory fallback, admin auth, and the starter catalog — lives in
> [api/redis.js](api/redis.js). Shared frontend translation data lives in
> [js/i18n.js](js/i18n.js). There are no test scripts, screenshots, or build
> artifacts in the project; the only added runtime files are
> [dev-server.js](dev-server.js), [js/i18n.js](js/i18n.js), [README.md](README.md),
> and [.gitignore](.gitignore).

## Production deployment (Vercel)

1. Push the repository to GitHub and import it into Vercel.
2. Create a Redis database (Upstash, Redis Labs, or Vercel KV) and copy its
   connection string.
3. Add these environment variables in **Project → Settings → Environment
   Variables**:

   | Variable | Required | Purpose |
   | --- | --- | --- |
   | `REDIS_URL` | yes | Redis connection string. The API refuses to fall back to ephemeral memory in production. |
   | `ADMIN_KEY` | yes | Long random secret used by the admin dashboard and every write endpoint. |
   | `AUTO_SEED` | no | Defaults to `true`. Seeds the starter catalog once into an empty store. Set to `false` to manage the catalog only from the admin panel. |
   | `ADMIN_ORIGIN` | no | CORS allow-list for admin/write APIs (only needed for a cross-origin dashboard). |
   | `FRONTEND_ORIGIN` | no | CORS allow-list for the public checkout API (same-origin needs nothing). |

4. Deploy. The first request to `/api/products`, `/api/categories`, or
   `/api/checkout` seeds the catalog if the Redis store is empty.

> Set `AUTO_SEED=false` **before** the first deploy if you want a completely
> empty store. Automatic seeding only runs when there are zero products and the
> one-time `catalog:seeded:v1` marker is absent.

## Admin dashboard

Open `/admin` and sign in with `ADMIN_KEY`.

- **Overview** — totals, revenue (cancelled orders excluded), recent orders.
- **Orders** — loads the full history across API pages, search, status filter,
  sort, status updates, delete, CSV export.
- **Categories** — create main categories, add/rename/move subcategories.
  Renaming or moving a subcategory updates its products. Deleting a subcategory
  that still has products is refused so the catalog cannot be orphaned.
- **Products** — create/edit/delete products, stock, badges, images, main
  categories. Custom main categories are supported.
- **Messages** — contact-form submissions, stored one key per message.

## Project layout

```
index.html, browse.html, product.html, cart.html, checkout.html,
confirmation.html, search.html, admin.html    # pages
about.html, contact.html, faq.html, help.html, privacy.html, terms.html
style.css                                     # single stylesheet
js/                                           # storefront ES modules
  main.js       boot + page wiring
  api.js        product loading/normalisation
  products.js   catalog helpers, categories, sorting
  ui.js         product cards, browse, product detail
  i18n.js       EN/FR/AR dictionaries, product translations, RTL runtime
  search.js     suggestions, search page, filters
  cart.js       cart, checkout, confirmation
  utils.js      toasts, escaping, skeletons, debounce
api/                                          # Vercel serverless functions
  products.js, categories.js, checkout.js, orders.js, messages.js, health.js
  redis.js      Redis client + local in-memory fallback + admin auth
                + starter catalog (single shared module)
dev-server.js                                 # zero-dependency local server
```

## Routes

Pretty URLs are handled by `vercel.json` in production and by `dev-server.js`
locally: `/`, `/browse`, `/product?id=1`, `/cart`, `/checkout`, `/confirmation`,
`/search?q=netflix`, `/admin`.

Product pages use `?id=<productId>` so they can be linked, refreshed, and shared.

## Notes

- Checkout always recomputes prices and totals from stored products; client
  prices are ignored. Quantities are clamped/validated server-side.
- Orders are permanent Redis keys. Revenue excludes cancelled orders.
- Public order lookup is by unguessable order ID and returns only
  customer-facing fields (no IP/user-agent).
- All admin write endpoints require `Authorization: <ADMIN_KEY>` and compare it
  in constant time. Without `ADMIN_KEY` every write endpoint fails closed.
- Existing Redis products that point at older high-resolution image variants are
  transparently mapped to the compressed assets that ship in this repository
  ([js/api.js](js/api.js)), so older catalog records keep working.
- Optional syntax check: `node --check dev-server.js` (repeat for any JS file).
