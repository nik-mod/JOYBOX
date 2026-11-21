import Link from 'next/link';
import { Brand } from './brand';
import { FooterMotion } from './footer-motion';
import { getSettings } from '@/lib/catalog';
import { previewPhone } from '@/lib/preview-copy';

export async function Footer() {
  const settings = await getSettings().catch(() => null);
  return (
    <FooterMotion>
      <div className="footer-edition container">
        <div className="footer-brand"><Brand large /><p>სიურპრიზის ყუთები ბავშვებისთვის.</p></div>
        <nav className="footer-links" aria-label="აღმოაჩინე MyWonderBox">
          <h3>აღმოაჩინე</h3>
          <Link href="/shop">ჩვენი ყუთები</Link>
          <Link href="/how-it-works">როგორ მუშაობს?</Link>
          <Link href="/about">ჩვენ შესახებ</Link>
        </nav>
        <nav className="footer-links" aria-label="დახმარება">
          <h3>დაგეხმარებით</h3>
          <Link href="/faq">კითხვები და პასუხები</Link>
          <Link href="/delivery">მიწოდება</Link>
          <Link href="/returns">დაბრუნება</Link>
          <Link href="/contact">კონტაქტი</Link>
          <a href={previewPhone.href}>{previewPhone.label}</a>
          {settings?.contact_email && <a href={`mailto:${settings.contact_email}`}>{settings.contact_email}</a>}
        </nav>
      </div>
      <div className="footer-bottom container">
        <span>© {new Date().getFullYear()} MyWonderBox</span>
        <span className="footer-legal">
          <Link href="/privacy">კონფიდენციალურობა</Link>
          <Link href="/terms">წესები და პირობები</Link>
        </span>
      </div>
    </FooterMotion>
  );
}
