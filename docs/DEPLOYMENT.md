# Local development and future deployment

Node 20.9 or later is required by the installed Next.js generation. This workspace was prepared with Node 24.21.0. Run `npm ci`, `npm run dev`, then visit http://localhost:3000. `npm run build` creates the Vercel-compatible application; `npm start` serves it. Dependencies are pinned and committed through package-lock.json.

No Supabase setup is necessary to preview the complete public UI. Catalog, contacts and delivery zones remain empty and ordering remains unavailable.

Later: create a Supabase project; run the migration; create an administrator using Supabase Auth; insert that user's id into `public.admin_users` using the SQL editor/service administrator. Disable public sign-up in Supabase Auth. Set `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` in `.env.local` or the deployment environment. Never paste private/service keys into source or public variables. Set the production `NEXT_PUBLIC_SITE_URL` and correct Auth site URL/redirect allowlist.

Create and publish real products through `/admin`. Add confirmed contact details, shipping zones and reviewed policies. Connect a payment provider in a later milestone before enabling checkout. Configure provider webhook URLs, durable rate limiting, backups and monitoring; verify the deployed environment end to end.

The current scope is local UI development in the supplied Next.js repository. No hosted site or production store has been registered or deployed.
