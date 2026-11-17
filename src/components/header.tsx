'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, ShoppingBag, X, ArrowUpRight } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { Brand } from './brand';
import { useCart } from './cart-context';
const links = [['/', 'მთავარი'], ['/shop', 'ყუთები'], ['/how-it-works', 'როგორ მუშაობს?'], ['/about', 'ჩვენ შესახებ']];
export function Header() {
  const path = usePathname(); const { count } = useCart(); const dialog = useRef<HTMLDialogElement>(null); const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
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
                aria-current={path === href ? 'page' : undefined}>{label}</Link>
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
        onClose={() => setMenuOpen(false)}>
        <div className="mobile-menu-top">
          <Brand />
          <button className="icon-button" type="button" aria-label="მენიუს დახურვა"
            onClick={() => dialog.current?.close()}><X /></button>
        </div>
        <nav aria-label="მობილური ნავიგაცია">
          {links.map(([href, label]) => (
            <Link key={href} href={href} aria-current={path === href ? 'page' : undefined}
              onClick={() => dialog.current?.close()}>{label}<ArrowUpRight size={23} /></Link>
          ))}
        </nav>
        <Link className="text-link" href="/faq" onClick={() => dialog.current?.close()}>ხშირად დასმული კითხვები</Link>
      </dialog>
    </>
  );
}
