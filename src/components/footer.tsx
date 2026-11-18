import Link from 'next/link';
import { Brand } from './brand';
import { FooterMotion } from './footer-motion';

export function Footer() {
  return (
    <FooterMotion>
      <div className="footer-edition container">
        <div className="footer-brand"><Brand large /><p>პატარა ყუთი. დიდი სიხარული.</p></div>
        <nav className="footer-links" aria-label="ჯოიბოქსის შესახებ">
          <h3>აღმოაჩინე</h3>
          <Link href="/shop">ჩვენი ყუთები</Link>
          <Link href="/how-it-works">როგორ მუშაობს?</Link>
          <Link href="/about">ჯოიბოქსის შესახებ</Link>
        </nav>
        <nav className="footer-links" aria-label="დახმარება">
          <h3>დაგეხმარებით</h3>
          <Link href="/faq">კითხვები და პასუხები</Link>
          <Link href="/delivery">მიწოდება</Link>
          <Link href="/returns">დაბრუნება</Link>
          <Link href="/contact">კონტაქტი</Link>
        </nav>
      </div>
      <div className="footer-bottom container">
        <span>© {new Date().getFullYear()} JOYBOX</span>
        <span className="footer-legal">
          <Link href="/privacy">კონფიდენციალურობა</Link>
          <Link href="/terms">წესები და პირობები</Link>
        </span>
      </div>
    </FooterMotion>
  );
}
