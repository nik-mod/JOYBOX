import 'server-only';
import { redirect } from 'next/navigation';
import { createSessionClient } from './supabase';
export async function requireAdmin() {
  const client=await createSessionClient();
  if(!client) redirect('/admin/login?state=setup');
  const {data:{user}}=await client.auth.getUser();
  if(!user) redirect('/admin/login');
  const {data,error}=await client.from('admin_users').select('user_id').eq('user_id',user.id).maybeSingle();
  if(error || !data) redirect('/admin/login?state=denied');
  return {client,user};
}
