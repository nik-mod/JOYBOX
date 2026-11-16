import type { Metadata } from 'next';
import { getProducts } from '@/lib/catalog';
import { Catalog } from '@/components/products';
export const metadata: Metadata = { title: 'სიურპრიზის ყუთები' };
export default async function ShopPage() { return <main className="page-shell container" id="main"><div className="page-header"><span className="eyebrow">JOYBOX კოლექცია</span><h1>რომელ სიურპრიზს აირჩევ?</h1><p>ერთი ყუთი, უამრავი აღმოჩენა. გაეცანი კოლექციას და შეარჩიე შენი პატარასთვის შესაფერისი სიურპრიზი.</p></div><Catalog products={await getProducts()} /></main>; }
