import Link from 'next/link';
import { ArrowUpRight, Mail } from 'lucide-react';
import { ContactPhone } from '@/components/contact-phone';
import { getSettings } from '@/lib/catalog';
import { storefrontMetadata } from '@/lib/metadata';
import { ordersOpeningLater } from '@/lib/preview-copy';
import '@/components/editorial-pages.css';

export const metadata = storefrontMetadata('/contact', 'კონტაქტი', 'დაგვიკავშირდი MyWonderBox-ის ყუთების, კატალოგისა და დაგეგმილი მიწოდების შესახებ.');

export default async function ContactPage() {
  const { contact_email } = await getSettings();
  return <main className="page-shell container contact-edition contact-guide" id="main">
    <div className="contact-lead">
      <header className="page-header">
        <h1>დაგვიკავშირდი</h1>
        <p>ყუთებზე ან დაგეგმილ მიწოდებაზე კითხვა გაქვს? დაგვირეკე.</p>
        <ContactPhone />
        {contact_email && <a className="contact-email text-link" href={`mailto:${contact_email}`}>
          <Mail size={19} aria-hidden="true" /> {contact_email}
        </a>}
      </header>
      <div className="contact-still contact-paired-photo">
        <picture>
          <source media="(max-width: 740px)" srcSet="/brand/mywonderbox/duo-compact.webp" />
          <img src="/brand/mywonderbox/duo.webp" width={1774} height={887} fetchPriority="high" decoding="async"
            alt="MyWonderBox-ის ლურჯი და ვარდისფერი სიურპრიზის ყუთები გვერდიგვერდ" />
        </picture>
      </div>
    </div>
    <div className="contact-guide-body">
      <section aria-labelledby="contact-ordering">
        <h2 id="contact-ordering">როდის შევძლებ შეკვეთას?</h2>
        <p>{ordersOpeningLater}</p>
        <Link className="text-link" href="/faq#faq-ordering">შეკვეთის შესახებ <ArrowUpRight size={18} aria-hidden="true" /></Link>
      </section>
      <nav className="contact-guides" aria-label="დახმარების თემები">
        <Link href="/shop"><span>ყუთის არჩევა<small>ასაკი, შეფუთვა და დეტალები</small></span><ArrowUpRight size={21} aria-hidden="true" /></Link>
        <Link href="/delivery"><span>მიწოდება<small>ზონები და პირობები</small></span><ArrowUpRight size={21} aria-hidden="true" /></Link>
        <Link href="/faq"><span>ხშირად დასმული კითხვები<small>ყუთები, შეკვეთა და მიწოდება</small></span><ArrowUpRight size={21} aria-hidden="true" /></Link>
      </nav>
    </div>
  </main>;
}
