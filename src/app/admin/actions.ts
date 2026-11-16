'use server';
import {redirect} from 'next/navigation';
import {revalidatePath} from 'next/cache';
import {requireAdmin} from '@/lib/admin';
import {createSessionClient} from '@/lib/supabase';
import {productSchema,settingsSchema} from '@/lib/validation';
import {z} from 'zod';
import sharp from 'sharp';

export async function signIn(form:FormData) {
  const email=String(form.get('email')??'').trim();const password=String(form.get('password')??'');
  if(!z.email().safeParse(email).success || password.length<8 || password.length>128) redirect('/admin/login?state=invalid');
  const client=await createSessionClient();
  if(!client) redirect('/admin/login?state=setup');
  const {error}=await client.auth.signInWithPassword({email,password});
  if(error) redirect('/admin/login?state=invalid');
  await requireAdmin();
  redirect('/admin');
}
export async function signOut(){const client=await createSessionClient();await client?.auth.signOut();redirect('/admin/login');}
export async function saveProduct(form:FormData){
  const {client}=await requireAdmin();
  const parsed=productSchema.safeParse({...Object.fromEntries(form.entries()),published:form.get('published')==='on'});
  if(!parsed.success) redirect('/admin/products?state=invalid');
  const rawId=form.get('id');
  if(rawId && !z.uuid().safeParse(rawId).success) redirect('/admin/products?state=invalid');
  const value={...parsed.data,images:[parsed.data.image_url]};
  const result=rawId ? await client.from('products').update(value).eq('id',String(rawId)) : await client.from('products').insert(value);
  if(result.error) redirect('/admin/products?state=error');
  revalidatePath('/','layout');redirect('/admin/products?state=saved');
}
export async function archiveProduct(form:FormData){
  const {client}=await requireAdmin();const id=z.uuid().safeParse(form.get('id'));
  if(!id.success)redirect('/admin/products?state=invalid');
  const {error}=await client.from('products').update({published:false}).eq('id',id.data);
  if(error)redirect('/admin/products?state=error');
  revalidatePath('/','layout');redirect('/admin/products?state=saved');
}
export async function uploadImage(form:FormData){
  const {client,user}=await requireAdmin();const file=form.get('image');
  if(!(file instanceof File) || file.size===0 || file.size>5*1024*1024 || !['image/png','image/jpeg','image/webp'].includes(file.type))redirect('/admin/products?state=image-invalid');
  let buffer:Buffer;
  try{buffer=await sharp(Buffer.from(await file.arrayBuffer()),{limitInputPixels:25000000}).rotate().resize({width:1800,height:1800,fit:'inside',withoutEnlargement:true}).webp({quality:86}).toBuffer();}
  catch{redirect('/admin/products?state=image-invalid');}
  const path=`${user.id}/${crypto.randomUUID()}.webp`;
  const {error}=await client.storage.from('product-media').upload(path,buffer,{contentType:'image/webp',upsert:false});
  if(error)redirect('/admin/products?state=error');
  const {data}=client.storage.from('product-media').getPublicUrl(path);
  redirect(`/admin/products?uploaded=${encodeURIComponent(data.publicUrl)}`);
}
export async function saveSettings(form:FormData){
  const {client}=await requireAdmin();let input:unknown;
  try{input={contact_email:String(form.get('contact_email')??''),contact_phone:String(form.get('contact_phone')??''),delivery_zones:JSON.parse(String(form.get('delivery_zones')??'[]')),policies:Object.fromEntries(['delivery','returns','privacy','terms'].map(key=>[key,String(form.get(key)??'')]))};}
  catch{redirect('/admin/settings?state=invalid');}
  const parsed=settingsSchema.safeParse(input);if(!parsed.success)redirect('/admin/settings?state=invalid');
  const {error}=await client.from('store_settings').upsert({id:1,...parsed.data,checkout_enabled:false});
  if(error)redirect('/admin/settings?state=error');
  revalidatePath('/','layout');redirect('/admin/settings?state=saved');
}
export async function updateOrder(form:FormData){
  const {client}=await requireAdmin();const id=z.uuid().safeParse(form.get('id'));
  const status=z.enum(['confirmed','preparing','shipped','delivered','cancelled']).safeParse(form.get('status'));
  if(!id.success || !status.success)redirect('/admin/orders?state=invalid');
  const {error}=await client.rpc('transition_order',{order_id:id.data,next_status:status.data});
  if(error)redirect('/admin/orders?state=transition');
  revalidatePath('/admin');redirect('/admin/orders?state=saved');
}
