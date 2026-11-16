# Database foundation

Migration: `supabase/migrations/202611160001_foundation.sql`.

Tables: admin_users, products, store_settings, orders, order_items, inventory_adjustments, payments, payment_events, shipments and admin_audit_logs. Products include ordered gallery URLs. Orders preserve item name/price snapshots and delivery details. Payment and fulfillment states are separate. Integer minor currency units are used throughout. Payment event identifiers and order idempotency keys are unique.

RLS allows anonymous reads only of published products and public store settings. Admin membership is read-only to the signed-in owner and can be granted only out-of-band by a trusted database operator. No public order/customer access exists. Admins may read orders; fulfillment mutations use an authenticated, row-locked state-transition function. Payment mutations are not exposed to admins. Product/stock/settings/order writes are audited without duplicating customer addresses in audit logs. Product deletion preserves historic order snapshots.

The product-media Storage bucket is public for reads and admin-only for writes. Upload endpoint accepts PNG/JPEG/WebP and re-encodes the image. Use official product photography only.

The migration has not been applied to a live project. Transactional reservations, expiration jobs, provider verification, token-scoped guest order access, shipment operations and refund processing belong to the deferred commerce integration milestone. The schema alone does not make commerce operational.
