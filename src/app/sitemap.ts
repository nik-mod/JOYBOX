import type { MetadataRoute } from 'next';
import { getProducts } from '@/lib/catalog';
import { productHref } from '@/lib/packaging';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const site = process.env.NEXT_PUBLIC_SITE_URL;
  if (!site) return [];
  const products = await getProducts();
  const pages = ['', '/shop', '/about', '/how-it-works', '/faq', '/contact', '/delivery', '/returns', '/privacy', '/terms'];
  return [...pages, ...products.map(product => productHref(product.slug))].map(path => ({
    url: new URL(path || '/', site).href, changeFrequency: 'weekly', priority: path === '' ? 1 : .7,
  }));
}
