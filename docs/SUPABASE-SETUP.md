# Supabase setup — current status

Updated 17 November 2026. No further screen control is needed for this workflow.

## Completed and verified

The existing project `cgmakaxsknnnhazrkshy` has the foundation and order tables/functions installed through SQL Editor. Do not rerun SETUP.sql on this database: it is a new-project installer, not an idempotent migration.

Terminal verification with the owner-provided publishable key confirmed public products reads (currently zero rows), store_settings reads (one row), denied anonymous access to orders/order_items/admin_users/payments, and denied execution of guest_order_status. No customer data was fetched. These probes do not replace authenticated admin and transactional integration testing.

## Finish without screen automation

No Supabase CLI executable, management token or server secret is available to this terminal. The publishable key cannot perform administrative writes. Credentials are staged in ignored `.env.supabase.local`; the storefront remains on the approved local catalog until the hosted catalog is populated.

1. Supply actual available counts for each variant and the HTTPS deployment URL serving the existing `/brand/box-navy.webp` and `/brand/box-berry.webp` files. Set NEXT_PUBLIC_SITE_URL, JOYBOX_NAVY_STOCK and JOYBOX_BERRY_STOCK in the ignored `.env.supabase.local`. No temporary cart cap is imported as warehouse inventory.
2. Generate a reviewable SQL import:

```powershell
npx tsx --env-file=.env.supabase.local scripts/prepare-catalog-sql.ts
```

Run the generated `supabase/CATALOG-IMPORT.local.sql` yourself in Supabase SQL Editor. It imports the approved boys/girls names, price 2990 tetri, ages 4–10, safety and contents expectations. Existing products and inventory are preserved. It references the deployed website images; Storage upload is optional. The generator refuses to overwrite an existing generated import.

Alternatively, configure the server-only SUPABASE_SECRET_KEY locally and run:

```powershell
npx tsx --env-file=.env.supabase.local scripts/seed-catalog.ts
```

3. Verify the hosted state:

```powershell
npx tsx --env-file=.env.supabase.local scripts/verify-supabase.ts
```

4. After confirming both hosted products and their HTTPS images load, copy the staged variables to `.env.local` and rebuild/restart the app. Never prefix SUPABASE_SECRET_KEY with NEXT_PUBLIC_. Do not commit environment files or send private keys in chat.
5. Create your admin Auth account yourself, then grant its verified UUID membership:

```sql
insert into public.admin_users (user_id)
values ('REPLACE_WITH_AUTH_USER_UUID')
on conflict do nothing;
```

Sign in at `/admin/login`, verify product edits, inventory changes and non-admin denial. This has not yet been verified on the hosted project. A dashboard login is separate from the website admin account.

## Remaining launch dependencies

Actual stock counts; permanent media/site URL; admin account; server-only secret for order operations; approved delivery zones/rates and seller policies; selected payment provider and sandbox verification. Checkout remains disabled. General safety guidance must be checked against the actual toys and manufacturer labels. No live payment, persistent customer checkout or admin login is claimed as operational.
