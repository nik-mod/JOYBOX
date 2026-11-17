# JOYBOX project audit

Scope covers the existing App Router project and the approved master brief. Classifications distinguish inspected code, verified local behavior, and operations requiring external systems.

| Feature | As found | Evidence or gap |
| --- | --- | --- |
| Next.js, TypeScript, Tailwind, app routing | Complete and working | Production build and type check pass. No lint script or configuration was present. |
| Georgian public routes, FAQ, contact, delivery, legal pages, loading, error and 404 | Partially implemented | Routes and fallback UI exist. Approved contact, delivery and legal content is missing. |
| Homepage, approved logo, fonts, favicon, manifest and social image | Complete and working | Existing identity and assets are present. Header background and responsive visual rhythm needed refinement. |
| Catalog, product detail, gallery, prices, age, stock, filters | Partially implemented | Code reads published Supabase products. Genuine catalog data and photography are blocked by external inputs. Packaging was missing. |
| Cart and local persistence | Complete and working locally | Existing add, quantity and removal paths. Database stock remains authoritative at order creation. |
| Guest checkout | Partially implemented | Registration-free form exists. Phone formatting differed from server acceptance, request limit buffered an unbounded body, checkout stays closed. |
| Transactional order creation and guest order lookup | Missing | Tables existed without a reservation entry point. Guest lookup always returned null. |
| Admin authentication and authorization | Blocked by external service | Routes and actions check Auth and membership. Setup route is locally reachable. Live role and session behavior requires Supabase. |
| Product, stock, settings and order administration | Partially implemented | Stale edits could overwrite stock, edits replaced gallery, order detail omitted purchased items. |
| Payment integration, webhooks, refunds and notifications | Blocked by external service | No provider or sandbox. Endpoints refuse transaction activity. |
| Database RLS and storage | Partially implemented | Migration and policies exist. Grants, order access scope and local execution were missing. Hosted Storage enforcement requires real Supabase. |
| Responsive, accessible UI | Partially implemented | Prior screenshots and narrow-device fixes exist. Six-width review was pending. |
| SEO | Partially implemented | Georgian language, titles, favicon, social metadata and configurable sitemap exist. Canonical URLs, product markup and per-page descriptions needed review. |
| GSAP and ScrollTrigger | Complete and working for existing 2D motion | The previous homepage uses scrubbed image movement. Scroll-scrubbed video was missing. |
| Launch operations | Blocked by external inputs | Provider, live data, policies, fulfillment details, domain and service verification remain outstanding. |

Phase 1 introduced a service-role-only reservation, release and redacted token lookup. Pending orders snapshot database prices and delivery, and inventory holds roll back on errors. Admin edits preserve galleries and guard against stale versions. The hosted payment route remains closed.

Verification at the phase 1 gate: production build, strict type check and 12 tests pass. The PostgreSQL test runs both SQL migrations against in-memory PostgreSQL with minimal local equivalents of the Supabase Auth and Storage schemas. It verifies role boundaries, rollback, database pricing, retry and conflict behavior, token redaction and idempotent release. It does not connect to a hosted Supabase project or exercise concurrent database connections.
