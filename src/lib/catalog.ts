import 'server-only';
import { cache } from 'react';
import { createHash } from 'node:crypto';
import { createOrderClient, createPublicClient } from './supabase';
import { paymentsAvailable } from './config';
import type { Product, StoreSettings, PublicOrder } from './types';
import { launchProducts } from './launch-products';
import { brandCopy } from './brand-copy';
import { catalogProduct, storedProductSlug } from './packaging';

export const getProducts = cache(async (): Promise<Product[]> => {
  const client = createPublicClient();
  if (!client) return launchProducts;
  const { data, error } = await client.from('products').select('*').eq('published', true).order('sort_order');
  if (error) throw new Error('პროდუქტების ჩატვირთვა ვერ მოხერხდა. სცადეთ ხელახლა.');
  return ((data ?? []) as Product[]).map(catalogProduct);
});
export const getProduct = cache(async (slug: string): Promise<Product | null> => {
  const storedSlug = storedProductSlug(slug);
  const client = createPublicClient();
  if (!client) return launchProducts.find(product => product.slug === storedSlug) ?? null;
  const {data,error} = await client.from('products').select('*').eq('published', true).eq('slug', storedSlug).maybeSingle();
  if (error) throw new Error('პროდუქტის ჩატვირთვა ვერ მოხერხდა.');
  return data ? catalogProduct(data as Product) : null;
});
export const getSettings = cache(async (): Promise<StoreSettings> => {
  const initial: StoreSettings = {contact_email:'',contact_phone:'+995579284889',delivery_zones:[{ id: 'georgia', name: 'საქართველო', price_minor: 0 }],policies:{ delivery: 'მიწოდება უფასოა საქართველოს მთელ ტერიტორიაზე.' },checkout_enabled:false};
  const client = createPublicClient();
  if (!client) return initial;
  const {data,error} = await client.from('store_settings').select('contact_email,contact_phone,delivery_zones,policies,checkout_enabled').eq('id',1).maybeSingle();
  if (error) throw new Error('მაღაზიის ინფორმაციის ჩატვირთვა ვერ მოხერხდა.');
  if (!data) return initial;
  const policies = Object.fromEntries(Object.entries(data.policies ?? initial.policies)
    .map(([key, policy]) => [key, brandCopy(policy)]));
  return { ...initial, ...data, policies, checkout_enabled: Boolean(data.checkout_enabled && paymentsAvailable()) };
});
export async function getOrderByToken(token: string): Promise<PublicOrder | null> {
  if (!/^[A-Za-z0-9_-]{43}$/.test(token)) return null;
  const client = createOrderClient();
  if (!client) return null;
  const token_digest = createHash('sha256').update(token).digest('hex');
  const { data, error } = await client.rpc('guest_order_status', { token_digest });
  if (error) throw new Error('შეკვეთის სტატუსი ვერ ჩაიტვირთა.');
  const order = data as PublicOrder | null;
  return order ? { ...order, items: order.items.map(item => ({ ...item, name: brandCopy(item.name) })) } : null;
}
