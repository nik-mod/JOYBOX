import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';
import { connection } from 'next/server';
import { getProducts } from '@/lib/catalog';
import { ShopExperience } from '@/components/shop-experience';
import { storefrontMetadata } from '@/lib/metadata';
import './shop.css';

export const metadata = storefrontMetadata(
  '/shop', 'სიურპრიზის ყუთები', 'დაათვალიერე ჯოიბოქსის კოლექცია და გაეცანი ფასებს, შეფუთვის ფერებსა და რეკომენდებულ ასაკს.',
);
export default async function ShopPage() {
  await connection();
  const products = await getProducts();
  return (
    <main className="page-shell container shop-editions" id="main">
      <header className="commerce-heading">
        <Link href="/" className="commerce-back"><ChevronLeft size={16} aria-hidden="true" /> მთავარი</Link>
        <h1>რომელ სიურპრიზს აირჩევ?</h1>
      </header>
      <ShopExperience products={products} />
    </main>
  );
}
