# Architecture

Next.js App Router, React, strict TypeScript and Tailwind CSS. The public storefront is Georgian, with guest-only shopping; no customer registration routes exist. GSAP and ScrollTrigger are scoped to client presentation components. Images in `public` are local and self-contained.

`src/lib/catalog.ts` is the server-only catalog boundary. Without Supabase configuration it returns an empty catalog and unconfigured store settings. A configured database error is surfaced rather than disguised as an empty catalog. Public products are read using the publishable key under RLS. No service-role credential is required for the current UI milestone.

Admin server actions validate every mutation and verify the signed-in user using Supabase `auth.getUser()` followed by an `admin_users` membership query. A signed-in non-admin has no access. RLS also protects the tables. Media upload is validated, pixel-limited and re-encoded to WebP; SVG uploads are rejected. The admin setup page is shown until Supabase is available. Real account/database workflows require integration testing after setup.

Cart state is browser-local and contains presentation snapshots. Checkout currently validates bounded request bodies and refuses orders with HTTP 503. The database has a service-only transaction for repricing, reserving stock and saving pending orders, plus a redacted token-scoped status projection. The future provider adapter connects these boundaries after signature validation, settlement, cancellation and expiry behavior are verified.

Current implementation references: [Next.js setup](https://nextjs.org/docs/app/getting-started/installation), [Supabase SSR](https://supabase.com/docs/guides/auth/server-side/creating-a-client?framework=nextjs), [GSAP React](https://gsap.com/resources/React/).
