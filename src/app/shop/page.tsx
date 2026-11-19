import Link from 'next/link';
import { Suspense } from 'react';
import { ChevronLeft } from 'lucide-react';
import { connection } from 'next/server';
import { getProducts } from '@/lib/catalog';
import { ShopExperience } from '@/components/shop-experience';
import { storefrontMetadata } from '@/lib/metadata';
import { ordersOpeningLater } from '@/lib/preview-copy';
import './shop.css';

export const metadata = storefrontMetadata(
  '/shop', 'სიურპრიზის ყუთები', 'დაათვალიერე ჯოიბოქსის კოლექცია და გაეცანი ფასებს, შეფუთვის ფერებსა და რეკომენდებულ ასაკს.',
);
async function ShopCatalog() {
  await connection();
  return <ShopExperience products={await getProducts()} />;
}

function ShopCatalogLoading() {
  return (
    <div className="shop-loading" role="status">
      <span className="sr-only">კატალოგი იტვირთება…</span>
      <div className="shop-loading-controls" aria-hidden="true" />
      <div className="shop-loading-grid" aria-hidden="true"><div /><div /></div>
    </div>
  );
}

export default function ShopPage() {
  return (
    <main className="page-shell container shop-editions" id="main">
      <header className="commerce-heading">
        <Link href="/" className="commerce-back"><ChevronLeft size={16} aria-hidden="true" /> მთავარი</Link>
        <h1>რომელ სიურპრიზს აირჩევ?</h1>
        <p>{ordersOpeningLater}</p>
      </header>
      <Suspense fallback={<ShopCatalogLoading />}><ShopCatalog /></Suspense>
    </main>
  );
}
