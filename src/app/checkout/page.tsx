import { getSettings } from '@/lib/catalog';
import { Checkout } from '@/components/checkout';
import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';

export const metadata = { title: 'შეკვეთის გაფორმება', robots: { index: false, follow: false } };

export default async function CheckoutPage() {
  return (
    <main className="page-shell container commerce-flow" id="main">
      <header className="commerce-heading">
        <Link className="commerce-back" href="/cart"><ChevronLeft size={16} /> კალათა</Link>
        <h1>შეკვეთის გაფორმება</h1>
        <p>შეკვეთა ანგარიშის შექმნის გარეშე.</p>
      </header>
      <Checkout settings={await getSettings()} />
    </main>
  );
}
