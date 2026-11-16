# JOYBOX

Georgian mystery-box storefront built with Next.js, React, TypeScript, Tailwind and GSAP. The approved Georgian brand identity is preserved. Current scope is the UI and independent foundation; product photography, Supabase and payments will be connected later.

```sh
npm ci
npm run dev
```

Open [localhost:3000](http://localhost:3000). No credentials are required for the UI preview. `/admin` shows a setup state until Supabase is configured. The catalog remains unpublished and checkout does not take payments.

```sh
npm run test
npm run typecheck
npm run build
```

Read [milestones](docs/MILESTONES.md), [architecture](docs/ARCHITECTURE.md), [deployment](docs/DEPLOYMENT.md), [testing](docs/TESTING.md) and [deferred payment integration](docs/PAYMENT_INTEGRATION.md). Copy `.env.example` to `.env.local` when credentials become available. Never commit secrets.
