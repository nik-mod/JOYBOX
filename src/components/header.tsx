'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, ShoppingBag, X, ArrowUpRight } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { Brand } from './brand';
import { useCart } from './cart-context';
import { gsap, useGSAP } from './motion';
const links = [['/', 'მთავარი'], ['/shop', 'ყუთები'], ['/how-it-works', 'როგორ მუშაობს?'], ['/about', 'ჩვენ შესახებ']];
export function Header() {
  const path = usePathname(); const { count } = useCart(); const dialog = useRef<HTMLDialogElement>(null); const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { contextSafe } = useGSAP(() => {
    if (!menuOpen || !dialog.current || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    gsap.fromTo(dialog.current, { opacity: 0, y: -12 }, { opacity: 1, y: 0, duration: .32, ease: 'power3.out', clearProps: 'opacity,transform' });
    gsap.fromTo(dialog.current.querySelectorAll('nav a'), { y: 12 }, { y: 0, stagger: .035, duration: .38, ease: 'power3.out', clearProps: 'transform' });
  }, { dependencies: [menuOpen], revertOnUpdate: true });
  const closeMenu = contextSafe(() => {
    if (!dialog.current) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) { dialog.current.close(); return; }
    gsap.to(dialog.current, { opacity: 0, y: -8, duration: .2, ease: 'power2.in', overwrite: true, onComplete: () => dialog.current?.close() });
  });
  useEffect(() => { const update = () => setScrolled(window.scrollY > 30); update(); window.addEventListener('scroll', update, { passive: true }); return () => window.removeEventListener('scroll', update); }, []);
  useEffect(() => { dialog.current?.close(); }, [path]);
  useEffect(() => {
    const desktop = window.matchMedia('(min-width: 851px)');
    const closeOnDesktop = () => { if (desktop.matches) dialog.current?.close(); };
    desktop.addEventListener('change', closeOnDesktop);
    return () => desktop.removeEventListener('change', closeOnDesktop);
  }, []);

  return (
    <>
      <a className="skip-link" href="#main">შინაარსზე გადასვლა</a>
      <header className={`site-header ${path === '/' ? 'on-hero' : 'solid'} ${scrolled ? 'is-scrolled' : ''}`}>
        <div className="header-inner">
          <Brand />
          <nav className="desktop-nav" aria-label="მთავარი ნავიგაცია">
            {links.map(([href, label]) => (
              <Link href={href} key={href} className={(href === '/' ? path === href : path.startsWith(href)) ? 'active' : ''}
                aria-current={(href === '/' ? path === href : path.startsWith(href)) ? 'page' : undefined}>{label}</Link>
            ))}
          </nav>
          <div className="header-actions">
            <Link className="cart-link" href="/cart" aria-label={`კალათა, ${count} ნივთი`}>
              <ShoppingBag size={25} strokeWidth={1.7} /><span className="cart-count">{count}</span>
            </Link>
            <button className="icon-button menu-toggle" type="button" aria-label="მენიუს გახსნა"
              aria-controls="mobile-navigation" aria-expanded={menuOpen} onClick={() => {
                dialog.current?.showModal();
                setMenuOpen(true);
              }}><Menu /></button>
          </div>
        </div>
      </header>
      <dialog id="mobile-navigation" ref={dialog} className="mobile-menu" aria-label="მენიუ"
        onCancel={event => { event.preventDefault(); closeMenu(); }}
        onClose={() => setMenuOpen(false)}>
        <div className="mobile-menu-top">
          <Brand />
          <button className="icon-button" type="button" aria-label="მენიუს დახურვა"
            onClick={closeMenu}><X /></button>
        </div>
        <nav aria-label="მობილური ნავიგაცია">
          {links.map(([href, label]) => (
            <Link key={href} href={href} aria-current={path === href ? 'page' : undefined}
              onClick={() => dialog.current?.close()}>{label}<ArrowUpRight size={23} /></Link>
          ))}
        </nav>
        <div className="mobile-menu-help"><Link href="/faq" onClick={() => dialog.current?.close()}>კითხვები და პასუხები</Link><Link href="/contact" onClick={() => dialog.current?.close()}>კონტაქტი</Link></div>
      </dialog>
    </>
  );
}
