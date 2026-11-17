# Milestone status

The owner narrowed the current work to UI and independent foundation on 2026-11-16. Real photography, Supabase and payment provider setup are deferred by the owner.

| Milestone | Current scope | Acceptance / remaining dependency |
|---|---|---|
| M01 Foundation | Next.js, strict TypeScript, Tailwind, contracts, migration and docs | Build/type checks; database migration awaits a project |
| M02 Homepage / identity | Approved logo, original conceptual hero, how-it-works, planned formats, footer, Georgian routes | Desktop/mobile visual QA; official product photographs later |
| M03 Motion | Scoped GSAP entrances and reversible desktop scroll, reduced motion | Browser check; no genuine 3D assets supplied |
| M04 Catalog UI | Dynamic catalog adapter, product detail, sorting/filtering/empty states | Real database catalog acceptance deferred |
| M05 Cart / guest checkout UI | Persistent cart, quantity/removal, totals, validation, unavailability message | No test purchase possible; payment/order integration deferred |
| M06 Administration foundation | Admin access gate, product/media/settings forms, order overview/status operations | Live auth/RLS/storage integration tests deferred |
| M07 Supporting pages | About/contact/FAQ/delivery/returns/privacy/terms/order unavailable states | Approved legal/contact/operational content deferred |
| M08 QA / deployment | Local build, automated validation and browser QA | Production deployment, live payments, database tests and launch signoff deferred |

Current UI scope completed and visually approved by the independent review. Production build, typecheck, 11 automated tests, 39 route/viewport checks and narrow-mobile refinements pass. See TESTING.md for the detailed evidence.

Do not equate UI completion with commercial launch readiness. See TESTING.md for checks actually executed and DECISIONS.md for external dependencies.
