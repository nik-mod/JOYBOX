'use client';

import Link from 'next/link';
import { useRef } from 'react';
import { ArrowDown, ArrowRight, ArrowUpRight, PackageCheck, Gift, Truck } from 'lucide-react';
import type { Product } from '@/lib/types';
import { HowFilm } from './how-film';
import { PackagingShowcase } from './packaging-showcase';
import { useHomeMotion } from './home-motion';
import { ordersOpeningLater, plannedDelivery } from '@/lib/preview-copy';
import './home-cinema.css';

export function Home({ products }: { products: Product[] }) {
  const root = useRef<HTMLElement>(null);
  useHomeMotion(root);

  return (
    <main id="main" ref={root} className="home-v2">
      <div className="hero-bear-track">
      <section className="hero hero-cinema">
        <div className="hero-lens" aria-hidden="true">
          <div className="hero-photo">
            <picture>
              <source media="(max-width: 850px)" srcSet="/brand/hero-teddy/opening-compact.webp" />
              <img src="/brand/hero-teddy/opening.webp" width={1672} height={941} alt="" fetchPriority="high" />
            </picture>
            <canvas className="hero-bear" width={1} height={1} />
          </div>
        </div>
        <div className="hero-exposure" aria-hidden="true" />
        <div className="hero-shade" aria-hidden="true" />
        <div className="hero-content container">
          <div className="hero-copy">
            <h1 className="hero-title">
              <span className="hero-title-line"><span className="hero-title-reveal">პატარა ყუთი.</span></span>{' '}
              <span className="hero-title-line"><span className="hero-title-reveal">დიდი <em>სიხარული.</em></span></span>
            </h1>
            <p>სიურპრიზის ყუთები ბავშვებისთვის, სათამაშოებით, თამაშებითა და შემოქმედებითი აღმოჩენებით.</p>
            <div className="hero-action">
              <Link className="button button-yellow" href="/shop">ყუთების დათვალიერება <ArrowRight size={22} /></Link>
              <Link className="hero-chapter-link" href="/how-it-works"><ArrowDown size={16} aria-hidden="true" /> როგორ მუშაობს?</Link>
            </div>
          </div>
        </div>
        <div className="hero-shutter" aria-hidden="true" />
      </section>
      </div>

      <HowFilm />

      <PackagingShowcase products={products} />

      <section className="brand-story story-edition" id="unboxing">
        <div className="container story-edition-grid">
          <div className="story-edition-copy">
            <h2>პირველი აღმოჩენა.<br /><em>პირველი თამაში.</em></h2>
            <p>ყუთის გახსნა მხოლოდ დასაწყისია. მერე ერთად არჩევთ, რით ითამაშოთ და რას შექმნით.</p>
            <Link href="/about" className="text-link">ჯოიბოქსის შესახებ <ArrowUpRight size={19} /></Link>
          </div>
          <div className="story-photo">
            <img src="/brand/joybox-unboxing-open.webp" width={1280} height={720}
              alt="გახსნილი ლურჯ-ყვითელი ჯოიბოქსი" loading="lazy" decoding="async" />
          </div>
        </div>
      </section>

      <section className="why-section why-edition container" aria-labelledby="why-joybox">
        <div className="section-heading"><Gift size={46} strokeWidth={1.25} aria-hidden="true" /><h2 id="why-joybox">რატომ ჯოიბოქსი?</h2><p>საჩუქარი, რომლის აღმოჩენაც თამაშად იქცევა.</p><span className="why-age">4–10 <small>წლის ბავშვებისთვის</small></span></div>
        <ul>
          <li><PackageCheck /><div><h3>ასაკისთვის შესაფერისი არჩევანი</h3><p>რეკომენდებული ასაკი და უსაფრთხოების ინფორმაცია თითოეული ყუთის გვერდზეა.</p><Link href="/shop" className="benefit-link">შეარჩიე ყუთი <ArrowUpRight size={18}/></Link></div></li>
          <li><Gift /><div><h3>სიურპრიზი საჩუქრად</h3><p>შეარჩიე გაფორმებული ყუთი. შიგთავსი გახსნამდე სიურპრიზად რჩება.</p><Link href="/faq" className="benefit-link">გაიგე მეტი შიგთავსზე <ArrowUpRight size={18}/></Link></div></li>
          <li><Truck /><div><h3>უფასო მიწოდება</h3><p>{plannedDelivery}</p><Link href="/delivery" className="benefit-link">მიწოდების შესახებ <ArrowUpRight size={18}/></Link></div></li>
        </ul>
      </section>

      <section className="faq-home faq-edition container">
        <div className="section-heading">
          <h2>ხშირად დასმული კითხვები</h2>
          <Link href="/faq" className="text-link">ყველა კითხვა <ArrowRight size={19} /></Link>
        </div>
        <div className="faq-list">
          <details><summary>რა არის ჯოიბოქსი?</summary><p>ჯოიბოქსი არის სიურპრიზის ყუთი ბავშვებისთვის, სათამაშოებით, თამაშებითა და შემოქმედებითი ნივთებით.</p></details>
          <details><summary>წინასწარ მეცოდინება, რა არის ყუთში?</summary><p>ზუსტი შიგთავსი სიურპრიზად რჩება. ყუთის აღწერაში ნახავ ნივთების კატეგორიებს, ასაკობრივ რეკომენდაციასა და უსაფრთხოების ინფორმაციას.</p></details>
          <details><summary>როდის შევძლებ შეკვეთას?</summary><p>{ordersOpeningLater}</p></details>
        </div>
      </section>

      <section className="home-final final-edition">
        <div className="container final-composition">
          <div><h2>პატარა ყუთი.<br /><em>დიდი სიხარული.</em></h2>
          <Link className="button button-yellow" href="/shop">ჯოიბოქსის ყუთები <ArrowRight size={20} /></Link></div>
          <img src="/brand/joybox-mark.webp" className="final-brand-art" width={412} height={269} alt="" loading="lazy" />
        </div>
      </section>
    </main>
  );
}
