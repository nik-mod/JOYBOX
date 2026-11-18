'use client';

import Link from 'next/link';
import { useRef, useState } from 'react';
import { ArrowDown, ArrowRight, ArrowUpRight, PackageCheck, Gift, Puzzle, Pause, Play } from 'lucide-react';
import type { Product } from '@/lib/types';
import { HowFilm } from './how-film';
import { PackagingShowcase } from './packaging-showcase';
import { useHomeMotion } from './home-motion';
import './home-cinema.css';

export function Home({ products }: { products: Product[] }) {
  const root = useRef<HTMLElement>(null);
  const [heroPaused, setHeroPaused] = useState(false);
  useHomeMotion(root);

  return (
    <main id="main" ref={root} className="home-v2">
      <section className="hero hero-cinema">
        <div className="hero-lens" aria-hidden="true"><picture className="hero-photo">
          <source media="(max-width: 850px)" srcSet="/brand/hero-compact.webp" />
          <img src="/brand/hero-concept.webp" width={1672} height={941}
            alt="ღია მუყაოს ყუთი სათამაშოებით, თბილად განათებულ ოთახში" fetchPriority="high" />
        </picture></div>
        <div className="hero-light" aria-hidden="true" />
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
              <Link className="hero-chapter-link" href="/#how"><ArrowDown size={16} aria-hidden="true" /> როგორ მუშაობს?</Link>
            </div>
            <nav className="hero-editions" aria-label="აირჩიე ჯოიბოქსი">
              <Link href="/shop?packaging=navy-yellow"><span className="edition-dot edition-dot-0"/>ბიჭებისთვის <ArrowUpRight size={17}/></Link>
              <Link href="/shop?packaging=pink-berry"><span className="edition-dot edition-dot-1"/>გოგონებისთვის <ArrowUpRight size={17}/></Link>
            </nav>
          </div>
        </div>
        <button className="hero-motion-toggle" type="button" aria-pressed={heroPaused} onClick={event => {
          const next = !heroPaused;
          setHeroPaused(next);
          event.currentTarget.closest('.hero')?.dispatchEvent(new CustomEvent('joybox:hero-motion', { detail: next }));
        }}>
          {heroPaused ? <Play size={13} /> : <Pause size={13} />}
          {heroPaused ? 'ანიმაციის ჩართვა' : 'ანიმაციის შეჩერება'}
        </button>
        <span className="concept-caption">ბრენდის კონცეპტუალური ვიზუალი</span>
        <div className="hero-shutter" aria-hidden="true" />
      </section>

      <HowFilm />

      <PackagingShowcase products={products} />

      <section className="brand-story story-edition" id="unboxing">
        <div className="container story-edition-grid">
          <div className="story-edition-copy">
            <h2>სიურპრიზი<br />ყუთშია.</h2>
            <p>ყუთის ზუსტი შიგთავსი სიურპრიზად რჩება. არჩევამდე გაიგებ რეკომენდებულ ასაკს, ნივთების ზოგად კატეგორიებსა და უსაფრთხოების ინფორმაციას.</p>
            <Link href="/about" className="text-link">ჯოიბოქსის შესახებ <ArrowUpRight size={19} /></Link>
          </div>
          <div className="story-packaging">
            <img className="story-box story-box-navy" src="/brand/box-navy.webp" alt="ყუთი ბიჭებისთვის" width={900} height={600} loading="lazy" />
            <img className="story-box story-box-berry" src="/brand/box-berry.webp" alt="ყუთი გოგონებისთვის" width={900} height={600} loading="lazy" />
            <span className="story-packaging-caption">კოლექცია / 4–10 წელი</span>
          </div>
          <div className="story-facts"><span><b>01</b> აირჩიე შენი ყუთი</span><span><b>02</b> მოემზადე აღმოჩენისთვის</span><span><b>03</b> გახსენი სიურპრიზი</span></div>
        </div>
      </section>

      <section className="why-section why-edition container" aria-labelledby="why-joybox">
        <div className="section-heading"><h2 id="why-joybox">რატომ ჯოიბოქსი?</h2><p>პატარა დეტალები, რომლებიც აღმოჩენას განსაკუთრებულს ხდის.</p><span className="why-age">4–10 <small>წლის ბავშვებისთვის</small></span></div>
        <ul>
          <li><PackageCheck /><div><h3>ასაკისთვის შესაფერისი არჩევანი</h3><p>რეკომენდებული ასაკი და უსაფრთხოების ინფორმაცია თითოეული ყუთის გვერდზეა.</p><Link href="/shop" className="benefit-link">შეარჩიე ყუთი <ArrowUpRight size={18}/></Link></div></li>
          <li><Puzzle /><div><h3>თამაშის ახალი იდეები</h3><p>სათამაშოები, თამაშები და შემოქმედებითი ნივთები ერთ ყუთში.</p><Link href="/faq" className="benefit-link">გაიგე მეტი შიგთავსზე <ArrowUpRight size={18}/></Link></div></li>
          <li><Gift /><div><h3>სიურპრიზი საჩუქრად</h3><p>შენ ირჩევ ყუთს. აღმოჩენის სიხარული იმას რჩება, ვინც გახსნის.</p><Link href="/how-it-works" className="benefit-link">როგორ მუშაობს? <ArrowUpRight size={18}/></Link></div></li>
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
          <details><summary>შეკვეთისთვის ანგარიში მჭირდება?</summary><p>შეკვეთის გაფორმება ანგარიშის შექმნის გარეშე იქნება შესაძლებელი. მიმდინარე ხელმისაწვდომობა კატალოგში ჩანს.</p></details>
        </div>
      </section>

      <section className="home-final final-edition">
        <div className="container">
          <h2>პატარა ყუთი.<br />დიდი სიხარული.</h2>
          <Link className="button button-navy" href="/shop">ჯოიბოქსის ყუთები <ArrowRight size={20} /></Link>
        </div>
      </section>
    </main>
  );
}
