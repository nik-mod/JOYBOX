import type { MetadataRoute } from 'next';
import { getProducts } from '@/lib/catalog';
export default async function sitemap(): Promise<MetadataRoute.Sitemap> { const site = process.env.NEXT_PUBLIC_SITE_URL; if (!site) return []; const products = await getProducts(); return ['','/shop','/about','/how-it-works','/faq','/contact','/delivery','/returns','/privacy','/terms',...products.map(p => `/shop/${p.slug}`)].map(path => ({ url: `${site}${path}`, changeFrequency: 'weekly' as const, priority: path === '' ? 1 : .7 })); }
