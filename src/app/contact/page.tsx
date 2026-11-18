import { storefrontMetadata } from '@/lib/metadata';
import Link from 'next/link';
import { ArrowUpRight, Mail, Phone } from 'lucide-react';
import { getSettings } from '@/lib/catalog';
import { PackagingPhoto } from '@/components/packaging-photo';
export const metadata = storefrontMetadata('/contact', 'კონტაქტი', 'ჯოიბოქსის საკონტაქტო ინფორმაცია და დახმარება შეკვეთებთან დაკავშირებით.');
export default async function ContactPage() {
  const settings = await getSettings();
  return <main className="page-shell container contact-edition contact-guide" id="main">
    <div className="contact-lead"><header className="page-header"><h1>დაგვიკავშირდი</h1><p>ყუთზე, შეკვეთაზე ან მიწოდებაზე კითხვა გაქვს? აქ დაგეხმარებით.</p></header><div className="contact-still"><PackagingPhoto color="pink-berry" loading="eager"/></div></div>
    <div className="contact-guide-body">
      <section aria-label="საკონტაქტო ინფორმაცია">
        {settings.contact_email || settings.contact_phone ? <div className="contact-options">
          {settings.contact_email && <div className="contact-option"><Mail size={22}/><h2>ელფოსტა</h2><a href={`mailto:${settings.contact_email}`}>{settings.contact_email}</a></div>}
          {settings.contact_phone && <div className="contact-option"><Phone size={22}/><h2>ტელეფონი</h2><a href={`tel:${settings.contact_phone}`}>{settings.contact_phone}</a></div>}
        </div> : <><h2>საკონტაქტო არხები მალე დაემატება.</h2><p>მანამდე ყუთების, ასაკისა და შიგთავსის შესახებ პასუხებს ხშირად დასმულ კითხვებში იპოვი.</p><Link className="text-link" href="/faq">კითხვები და პასუხები <ArrowUpRight size={18}/></Link></>}
      </section>
      <nav className="contact-guides" aria-label="დახმარების თემები">
        <Link href="/shop"><span>ყუთის არჩევა<small>ასაკი, შეფუთვა და დეტალები</small></span><ArrowUpRight size={21}/></Link>
        <Link href="/delivery"><span>მიწოდება<small>ზონები და პირობები</small></span><ArrowUpRight size={21}/></Link>
        <Link href="/returns"><span>დაბრუნება<small>დაბრუნების პირობები</small></span><ArrowUpRight size={21}/></Link>
      </nav>
    </div>
  </main>;
}
