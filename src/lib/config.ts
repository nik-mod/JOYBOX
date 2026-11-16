import 'server-only';
export const hasSupabase = () => Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY);
// A future provider integration must replace this capability gate only after verification tests pass.
export const paymentsAvailable = () => false;
