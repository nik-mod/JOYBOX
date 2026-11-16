import { getSettings } from '@/lib/catalog';
import { Checkout } from '@/components/checkout';
export const metadata = { title: 'შეკვეთის გაფორმება' };
export default async function CheckoutPage() { return <main className="page-shell container" id="main"><div className="page-header"><span className="eyebrow">მარტივად, ანგარიშის გარეშე</span><h1>შეკვეთის გაფორმება</h1></div><Checkout settings={await getSettings()} /></main>; }
