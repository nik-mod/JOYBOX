# JOYBOX production readiness audit

17 November 2026

**Launch verdict: hold commerce launch.** The application builds and the public prelaunch experience is verified locally. Real orders require a connected Supabase project, a genuine catalog, approved operating information and a payment provider whose hosted checkout and callbacks have passed sandbox tests.

Final checks passed: `npm run build`, `npm run typecheck`, and 13 tests from `npm run test`. `npm audit` reported zero known vulnerabilities. The project has no configured lint command.

## Verified behavior

- The production build served 16 route states at 360, 390, 768, 1024, 1440 and 1920 pixels. All 96 checks passed for width, Georgian language, loaded images and browser errors. Desktop and mobile captures were reviewed during refinement. The mobile dialog closes on Escape and restores focus.
- An isolated PostgREST fixture exercised the populated catalog through the actual homepage, shop, product, cart and checkout routes. Verified price sorting, color and stock filters, imagery and age guidance, out-of-stock controls, adding items, quantity limits, reload persistence, removal and blocked guest checkout. The final run reported zero browser errors. This fixture is outside the repository. The public preview uses the unconfigured catalog.
- In local PostgreSQL, both migrations ran. Tests verified public product visibility, denial of anonymous order reads and reservation calls, non-admin row isolation, authorized admin order reads, database-derived pricing, rollback, idempotent retries and release, and a token-scoped projection without contact or address data. Unpaid fulfillment confirmation and unsafe cancellation were rejected.
- The app refuses valid checkout requests with HTTP 503 and rejects cross-origin, oversize and malformed submissions. Access to protected admin routes requires a session and membership. Admin setup and signed-out redirects were tested separately from hosted Supabase Auth.
- The repository contains a static unboxing visual. Forward and reverse seeks, pause on scroll stop, rapid jumps, resize, navigation cleanup, reduced motion and media failure passed with the isolated MP4 fixture. See [the unboxing report](UNBOXING-VIDEO.md).

## Defects corrected

- Fixed browser/server currency hydration by formatting integer GEL values consistently. Fixed same-origin validation when Next constructs a route URL from an internal bind address. Aligned familiar Georgian phone formatting with server validation.
- Limited checkout requests by streamed byte count. Added an explicit no-referrer, private no-store policy for guest order pages and their API. Disabled guest contact inputs while checkout is unavailable.
- Prevented concurrent product edits from silently replacing stock, preserved existing gallery images and added order line items to the admin order view.
- Fixed the 360px privacy-title overflow, increased step-label contrast, and kept the loading fallback tall enough to keep the footer below the initial viewport.

## Performance and accessibility

- Chromium at 390px on localhost with 80 ms emulated latency, 500 kB/s download and 4× CPU throttling recorded an LCP of approximately 0.99 s, cumulative layout shift of 0.022 and a longest observed test interaction of 72 ms. This is a single lab run. It does not establish field Core Web Vitals or an INP percentile. [Core Web Vitals measurement](https://web.dev/articles/vitals)
- The recorded run transferred 195,655 encoded bytes of JavaScript resources and requested no video. The mobile hero used the 68,790-byte WebP. The displayed logo derivative decreased from 194,498 to 81,648 bytes. WOFF2 reduced the two Georgian fonts from about 122 kB combined to 57 kB and both fonts are preloaded. The supplied original logo SHA-256 is unchanged.
- Axe returned zero violations in the tested WCAG A/AA rules across 14 route states at desktop and mobile. This is automated coverage. A manual screen-reader and Safari/device pass remains for launch.

## Search and share metadata

- Georgian document language, public page titles and descriptions, Open Graph metadata and all seven favicon, app icon, manifest and social files are present. A configured-domain fixture verified canonical product URLs, populated product sitemap entries, robots rules and Product JSON-LD. An Offer is emitted only when checkout is enabled. [Google Product structured data](https://developers.google.com/search/docs/appearance/structured-data/product-snippet)
- Cart, checkout, order and admin use noindex and are excluded from the sitemap. The real domain and public metadata still require verification in the deployment environment.

## Security and live acceptance

The public app does not collect card details and cannot create a live order with its current payment gate. Hosted RLS, Auth session handling, Storage, simultaneous database connections, use of private keys on the host, settlement and webhook signatures remain unverified outside local fixtures. Restrict order-token paths from analytics and redact their URLs in operational logs. Configure durable rate limits and reservation reconciliation before enabling checkout.

Obtain the approved catalog, delivery and legal inputs, domain, approved unboxing clip and provider sandbox. Then run authorized admin CRUD and order operations in Supabase and verify success, failure, expiry, refund, duplicate callbacks and reconciliation against the provider. See [remaining tasks](REMAINING-TASKS.md).
