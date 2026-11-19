import { storefrontMetadata } from '@/lib/metadata';
import Link from 'next/link';
import { ArrowUpRight, Gift, ScanEye, ShieldCheck } from 'lucide-react';
import { EditionPreview } from '@/components/edition-preview';
import { PackagingPhoto } from '@/components/packaging-photo';
import '@/components/editorial-pages.css';
export const metadata = storefrontMetadata('/about', 'ჩვენ შესახებ', 'გაიცანი ჯოიბოქსი — ქართული სიურპრიზის ყუთები ბავშვებისთვის.');
export default function AboutPage() {
 return <main className="page-shell container about-edition" id="main">
  <section className="about-lead">
   <div className="about-lead-copy"><h1>პატარა ყუთი. <em>დიდი სიხარული.</em></h1><p>ყველაზე ლამაზი წამი — სანამ გახსნი.</p><Link className="button button-yellow" href="/how-it-works">როგორ მუშაობს? <ArrowUpRight size={19} aria-hidden="true" /></Link></div>
   <EditionPreview />
  </section>
  <section className="about-manifesto"><h2>საჩუქარი, რომელიც აღმოჩენით იწყება.</h2><p>ჯოიბოქსი ქართული სიურპრიზის ყუთების ბრენდია ბავშვებისთვის. გვჯერა თამაშის, ფანტაზიისა და იმ განსაკუთრებული მოლოდინის, როცა ჯერ არ იცი, რა გელოდება.</p></section>
  <section className="about-principles">
   <article><Gift aria-hidden="true"/><h3>სიურპრიზი შიგნით.</h3><p>ყუთის ზუსტი შიგთავსი გახსნამდე სიურპრიზად რჩება.</p></article>
   <article><ScanEye aria-hidden="true"/><h3>მარტივი არჩევანი.</h3><p>ყუთი ბიჭებისთვის ან გოგონებისთვის. რეკომენდებული ასაკი 4–10 წელია.</p></article>
   <article><ShieldCheck aria-hidden="true"/><h3>მნიშვნელოვანი დეტალები.</h3><p>არჩევამდე გაეცანი უსაფრთხოების მითითებებს. თამაშამდე შეამოწმე თითოეული ნივთის ასაკობრივი ნიშნული.</p></article>
  </section>
  <section className="about-closing"><PackagingPhoto color="pink-berry" /><div><h2>მზად ხარ აღმოჩენისთვის?</h2><Link className="text-link" href="/shop">აღმოაჩინე ყუთები <ArrowUpRight size={20} aria-hidden="true" /></Link></div></section>
  <a className="text-link model-credits-link" href="/brand/orbit-models/credits.txt">3D მოდელების წყაროები <ArrowUpRight size={16} aria-hidden="true" /></a>
 </main>;
}
