# Database foundation

Apply `202611160001_foundation.sql` and `202611160002_order_foundation.sql` in order from `supabase/migrations`.

Tables: admin_users, products, store_settings, orders, order_items, inventory_adjustments, payments, payment_events, shipments and admin_audit_logs. Products include ordered gallery URLs. Orders preserve item name/price snapshots and delivery details. Payment and fulfillment states are separate. Integer minor currency units are used throughout. Payment event identifiers and order idempotency keys are unique.

RLS allows anonymous reads only of published products and public store settings. Admin membership is read-only to the signed-in owner and can be granted only out-of-band by a trusted database operator. No public order/customer access exists. Admins may read orders; fulfillment mutations use an authenticated, row-locked state-transition function. Payment mutations are not exposed to admins. Product/stock/settings/order writes are audited without duplicating customer addresses in audit logs. Product deletion preserves historic order snapshots.

The product-media Storage bucket is public for reads and admin-only for writes. Upload endpoint accepts PNG/JPEG/WebP and re-encodes the image. Use official product photography only.

The second migration adds product packaging, explicit Data API grants, and three service-role-only functions. `reserve_order` locks inventory in product ID order and persists a pending order and price snapshots. `release_order_reservation` releases an eligible reservation once. `guest_order_status` returns an allowlist of order fields using the SHA-256 digest of an opaque token. The app can read that projection when the server-only key is configured.

Both migrations ran in local PostgreSQL. Hosted Supabase roles, concurrent client connections, Storage and Auth still need acceptance tests. The payment adapter must verify settlement before committing held stock or releasing it after a failure. Expiration, shipment operations and refunds remain deferred.
