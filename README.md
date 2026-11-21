# MyWonderBox

Georgian mystery-box storefront built with Next.js, React, TypeScript, Tailwind and GSAP. The catalog uses the approved blue and pink MyWonderBox packs and the site runs in pre-launch mode.

```sh
npm ci
npm run dev
```

Open [localhost:3000](http://localhost:3000) to preview the two launch editions. `/admin` shows a setup state until Supabase is configured. Connected environments use the published catalog in Supabase. Orders remain closed during pre-launch.

```sh
npm run test
npm run typecheck
npm run build
```

The two launch editions keep their original database slugs and product IDs. The old product URLs redirect to `/shop/mywonderbox-blue` and `/shop/mywonderbox-pink`. For existing Supabase rows, `npx tsx scripts/prepare-catalog-rebrand-sql.ts` prints a reviewable, data-only update using `NEXT_PUBLIC_SITE_URL`. It updates the two launch editions’ names and photos while preserving inventory and prices. For an empty catalog, use the existing `scripts/prepare-catalog-sql.ts` import workflow with confirmed stock counts.

Read [milestones](docs/MILESTONES.md), [architecture](docs/ARCHITECTURE.md), [deployment](docs/DEPLOYMENT.md), [testing](docs/TESTING.md) and [deferred payment integration](docs/PAYMENT_INTEGRATION.md). Copy `.env.example` to `.env.local` when credentials become available. Never commit secrets.
