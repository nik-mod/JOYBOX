import 'server-only';
import { cache } from 'react';
import { createPublicClient } from './supabase';
import { paymentsAvailable } from './config';
import type { Product, StoreSettings, PublicOrder } from './types';

export const getProducts = cache(async (): Promise<Product[]> => {
  const client = createPublicClient();
  if (!client) return [];
  const { data, error } = await client.from('products').select('*').eq('published', true).order('sort_order');
  if (error) throw new Error('პროდუქტების ჩატვირთვა ვერ მოხერხდა. სცადეთ ხელახლა.');
  return (data ?? []) as Product[];
});
export const getProduct = cache(async (slug: string): Promise<Product | null> => {
  const client = createPublicClient();
  if (!client) return null;
  const {data,error} = await client.from('products').select('*').eq('published', true).eq('slug', slug).maybeSingle();
  if (error) throw new Error('პროდუქტის ჩატვირთვა ვერ მოხერხდა.');
  return data as Product | null;
});
export const getSettings = cache(async (): Promise<StoreSettings> => {
  const initial: StoreSettings = {contact_email:'',contact_phone:'',delivery_zones:[],policies:{},checkout_enabled:false};
  const client = createPublicClient();
  if (!client) return initial;
  const {data,error} = await client.from('store_settings').select('contact_email,contact_phone,delivery_zones,policies,checkout_enabled').eq('id',1).maybeSingle();
  if (error) throw new Error('მაღაზიის ინფორმაციის ჩატვირთვა ვერ მოხერხდა.');
  return data ? {...initial,...data,checkout_enabled:Boolean(data.checkout_enabled && paymentsAvailable())} : initial;
});
export async function getOrderByToken(_token: string): Promise<PublicOrder | null> {
  // No orders can be placed until a payment provider and scoped order-token verification exist.
  return null;
}
