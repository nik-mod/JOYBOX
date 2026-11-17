# Payment integration — deferred by owner

No payment provider has been selected. No merchant credentials exist. `paymentsAvailable()` is deliberately false. Checkout returns a Georgian unavailable response; webhook callbacks return 503. No simulated success route exists, and query-string success claims never change an order.

Before enabling: choose a GEL-capable hosted Georgian payment provider, review its official API and webhook verification documentation, add server-only credentials, and implement checkout and verification as provider-specific code. Do not place raw card entry in this app.

The migration provides `reserve_order` to calculate totals from database rows, lock stock and store an idempotent pending order. The adapter should validate with `checkoutSchema` first, hash the canonical request, and pass a SHA-256 digest of a 32-byte base64url guest token. Preserve the same request and token identity across retries. Initiate hosted payment with a stable provider request key, persist the provider reference and redirect to the provider's verified host. Verify signatures and independently validate merchant, order reference, currency and exact amount before completing a payment. Handle duplicate and out-of-order events, abandoned sessions, stock release and refunds. A success redirect is only a UI signal.

Add durable rate limiting, verified settlement and stock commit, reservation expiry jobs and a redacted operational event log. Verify the provider session cannot settle before calling `release_order_reservation`. Integration tests must cover concurrent stock requests, duplicate callbacks, amount mismatches, expired reservations and every failure state. Confirm delivery rates and approved policies before launch.
