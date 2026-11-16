# Payment integration — deferred by owner

No payment provider has been selected. No merchant credentials exist. `paymentsAvailable()` is deliberately false. Checkout returns a Georgian unavailable response; webhook callbacks return 503. No simulated success route exists, and query-string success claims never change an order.

Before enabling: choose a GEL-capable hosted Georgian payment provider, review its official API and webhook verification documentation, add server-only credentials, and implement checkout and verification as provider-specific code. Do not place raw card entry in this app.

Required sequence: validate cart/customer and supported delivery zone; calculate totals from current database rows; atomically lock/reserve stock and insert an idempotent pending order; initiate hosted payment with a stable request key; persist the provider reference; redirect to the provider. Verify signatures and independently validate merchant, order reference, currency and exact amount before marking paid. Handle duplicate and out-of-order events, abandoned sessions, stock release and refunds. A success redirect is only a UI signal.

Add durable rate limiting, reservation expiry jobs, opaque order access tokens and a redacted operational event log. Integration tests must cover concurrent stock requests, duplicate callbacks, amount mismatches, expired reservations and every failure state. Confirm delivery rates and approved policies before launch. The user explicitly deferred this work until credentials/provider are available.
