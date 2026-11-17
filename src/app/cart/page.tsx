import { Cart } from '@/components/cart';
import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';

export const metadata = { title: 'ჩემი კალათა', robots: { index: false, follow: false } };

export default function CartPage() {
  return (
    <main className="page-shell container commerce-flow" id="main">
      <header className="commerce-heading">
        <Link className="commerce-back" href="/shop"><ChevronLeft size={16} /> ყუთები</Link>
        <h1>ჩემი კალათა</h1>
      </header>
      <Cart />
    </main>
  );
}
