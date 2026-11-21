import { storefrontMetadata } from '@/lib/metadata';
import Link from 'next/link';
import { ArrowUpRight, Gift, ScanEye, ShieldCheck } from 'lucide-react';
import { EditionPreview } from '@/components/edition-preview';
import '@/components/editorial-pages.css';
export const metadata = storefrontMetadata('/about', 'ჩვენ შესახებ', 'გაიცანი MyWonderBox, ქართული სიურპრიზის ყუთების ბრენდი ბავშვებისთვის.');
export default function AboutPage() {
 return <main className="page-shell container about-edition" id="main">
  <section className="about-lead">
   <div className="about-lead-copy"><h1>პატარა ყუთი. <em>დიდი სიხარული.</em></h1><p>ჩემი ვანდერბოქსი ბავშვებისთვის შექმნილი სიურპრიზის ყუთია.</p><Link className="button button-yellow" href="/how-it-works">როგორ მუშაობს? <ArrowUpRight size={19} aria-hidden="true" /></Link></div>
   <EditionPreview />
  </section>
  <section className="about-manifesto"><h2>საჩუქარი, რომელიც აღმოჩენით იწყება.</h2><p>ჩვენ გვჯერა თამაშის, ფანტაზიისა და იმ განსაკუთრებული მოლოდინის, როცა ჯერ არ იცი, რა გელოდება. გვინდა, ყუთის გახსნა თამაშის დასაწყისი იყოს.</p></section>
  <section className="about-principles">
   <article><Gift aria-hidden="true"/><h3>სიურპრიზი შიგნით.</h3><p>ყუთის ზუსტი შიგთავსი გახსნამდე სიურპრიზად რჩება.</p></article>
   <article><ScanEye aria-hidden="true"/><h3>მარტივი არჩევანი.</h3><p>ყუთი ბიჭებისთვის ან გოგონებისთვის. რეკომენდებული ასაკი 4–10 წელია.</p></article>
   <article><ShieldCheck aria-hidden="true"/><h3>მნიშვნელოვანი დეტალები.</h3><p>არჩევამდე გაეცანი უსაფრთხოების მითითებებს. თამაშამდე შეამოწმე თითოეული ნივთის ასაკობრივი ნიშნული.</p></article>
  </section>
  <section className="about-closing">
   <picture className="about-paired-photo">
    <source media="(max-width: 740px)" srcSet="/brand/mywonderbox/lifestyle-compact.webp" />
    <img src="/brand/mywonderbox/lifestyle.webp" width={1536} height={645} loading="lazy" decoding="async"
      alt="MyWonderBox-ის ლურჯი და ვარდისფერი ყუთები სათამაშოებით მოწყობილ ოთახში" />
   </picture>
   <div><h2>მზად ხარ აღმოჩენისთვის?</h2><Link className="text-link" href="/shop">აღმოაჩინე ყუთები <ArrowUpRight size={20} aria-hidden="true" /></Link></div>
  </section>
  <a className="text-link model-credits-link" href="/brand/orbit-models/credits.txt">3D მოდელების წყაროები <ArrowUpRight size={16} aria-hidden="true" /></a>
 </main>;
}
