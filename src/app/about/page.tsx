import { storefrontMetadata } from '@/lib/metadata';
import Link from 'next/link';
import { ArrowUpRight, Gift, ScanEye, ShieldCheck } from 'lucide-react';
import { EditionPreview } from '@/components/edition-preview';
export const metadata = storefrontMetadata('/about', 'ჩვენ შესახებ', 'გაიცანი ჯოიბოქსი — ქართული სიურპრიზის ყუთები ბავშვებისთვის.');
export default function AboutPage() {
 return <main className="page-shell container about-edition" id="main">
  <section className="about-lead">
   <div className="about-lead-copy"><h1>პატარა ყუთი.<br/><em>დიდი სიხარული.</em></h1><p>ყველაზე ლამაზი წამი — სანამ გახსნი.</p><Link className="button button-yellow" href="/shop">აირჩიე სიურპრიზი <ArrowUpRight size={19}/></Link></div>
   <EditionPreview />
  </section>
  <section className="about-manifesto"><h2>საჩუქარი, რომელიც<br/>აღმოჩენით იწყება.</h2><p>ჯოიბოქსი ქართული სიურპრიზის ყუთების ბრენდია ბავშვებისთვის. გვჯერა თამაშის, ფანტაზიისა და იმ განსაკუთრებული მოლოდინის, როცა ჯერ არ იცი, რა გელოდება.</p></section>
  <section className="about-principles">
   <article><Gift/><h3>სიურპრიზი შიგნით.</h3><p>ყუთის ზუსტი შიგთავსი გახსნამდე სიურპრიზად რჩება. ვიზუალები საილუსტრაციოა.</p></article>
   <article><ScanEye/><h3>მარტივი არჩევანი.</h3><p>ყუთი ბიჭებისთვის ან გოგონებისთვის — ორივე 29,90 ₾. რეკომენდებული ასაკი: 4–10 წელი.</p></article>
   <article><ShieldCheck/><h3>მნიშვნელოვანი დეტალები.</h3><p>არჩევამდე გაეცანი უსაფრთხოების მითითებებს. თამაშამდე შეამოწმე თითოეული ნივთის ასაკობრივი ნიშნული.</p></article>
  </section>
  <section className="about-closing"><img src="/brand/box-berry.webp" width="900" height="600" loading="lazy" alt="ჯოიბოქსის ყუთი გოგონებისთვის"/><div><h2>მზად ხარ<br/>აღმოჩენისთვის?</h2><Link className="text-link" href="/shop">აღმოაჩინე ყუთები <ArrowUpRight size={20}/></Link></div></section>
 </main>;
}
