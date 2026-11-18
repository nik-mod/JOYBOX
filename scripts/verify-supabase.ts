import { createClient } from '@supabase/supabase-js';

async function main() {
const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
if (!url || !key) throw new Error('Supply the project URL and publishable key through an environment file.');
const client = createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });
let failures = 0;
for (const table of ['products', 'store_settings']) {
  const { count, error } = await client.from(table).select('*', { count: 'exact', head: true });
  console.log(`${table}: ${error ? 'FAIL: ' + error.code : `readable (${count} public rows)`}`);
  if (error) failures++;
}
// No customer records are fetched or printed. Permission denial or zero visible
// rows is expected; this alone cannot prove RLS on populated tables.
for (const table of ['orders', 'order_items', 'admin_users', 'payments']) {
  const { count, error, status } = await client.from(table).select('*', { count: 'exact', head: true });
  const denied = status === 401 || status === 403 || error?.code === '42501';
  const hidden = !error && count === 0;
  console.log(`${table}: ${denied ? 'anonymous access denied' : hidden ? 'zero anonymous rows (policy inspection still required)' : 'FAIL: unexpected access result'}`);
  if (!denied && !hidden) failures++;
}
const { error } = await client.rpc('guest_order_status', { token_digest: '0'.repeat(64) });
console.log(`guest_order_status: ${error?.code === '42501' ? 'anonymous execution denied' : 'FAIL: expected permission denial'}`);
if (error?.code !== '42501') failures++;
process.exitCode = failures ? 1 : 0;
}
main().catch(error => { console.error(error instanceof Error ? error.message : "Setup failed"); process.exitCode = 1; });
