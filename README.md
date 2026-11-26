# DIMA Deals

Premium digital subscriptions store for Tunisia — static storefront + Vercel
serverless API + Redis.

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
  search.js     suggestions, search page, filters
  cart.js       cart, checkout, confirmation
  utils.js      toasts, escaping, skeletons, debounce
api/                                          # Vercel serverless functions
  products.js, categories.js, checkout.js, orders.js, messages.js, health.js
  redis.js      Redis client + local in-memory fallback
  memory-store.js
  seed.js       starter catalog + one-time seeding
  auth.js       constant-time admin auth
dev-server.js                                 # zero-dependency local server
```

## Routes

Pretty URLs are handled by `vercel.json` in production and by `dev-server.js`
locally: `/`, `/browse`, `/product?id=1`, `/cart`, `/checkout`, `/confirmation`,
`/search?q=netflix`, `/admin`.

Product pages use `?id=<productId>` so they can be linked, refreshed, and shared.

## Checks

```bash
npm run check       # node --check on every JS module + JSON validation
npm install          # installs redis (production) and playwright-core (dev tests)
npm run test:e2e     # storefront + cart + checkout + admin smoke test (needs Edge)
npm run test:admin   # custom category / product create-delete workflow
npm run test:pages   # legal pages, contact form, FAQ, theme, language
```

The browser tests use the locally installed Microsoft Edge
(`C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe` by default).
Override the path with `EDGE_PATH` and the site with `BASE_URL`.

## Notes

- Checkout always recomputes prices and totals from stored products; client
  prices are ignored. Quantities are clamped/validated server-side.
- Orders are permanent Redis keys. Revenue excludes cancelled orders.
- Public order lookup is by unguessable order ID and returns only
  customer-facing fields (no IP/user-agent).
- All admin write endpoints require `Authorization: <ADMIN_KEY>` and compare it
  in constant time. Without `ADMIN_KEY` every write endpoint fails closed.
