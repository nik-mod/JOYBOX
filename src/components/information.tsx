import Link from 'next/link';
import { ArrowRight, ArrowUpRight, Truck, RotateCcw, LockKeyhole, BookOpen } from 'lucide-react';
import { getSettings } from '@/lib/catalog';
import { CollectionInvitation } from './collection-invitation';
import { plannedDelivery } from '@/lib/preview-copy';
import './editorial-pages.css';

const policies = {
  delivery: { label: 'მიწოდება', icon: Truck, heading: 'უფასო მიწოდება საქართველოს მასშტაბით', question: 'faq-delivery' },
  returns: { label: 'დაბრუნება', icon: RotateCcw, heading: 'დაბრუნების პირობები მზადდება', question: 'faq-returns' },
  privacy: { label: 'კონფიდენციალურობა', icon: LockKeyhole, heading: 'კონფიდენციალურობის ინფორმაცია მზადდება', question: 'faq-account' },
  terms: { label: 'წესები და პირობები', icon: BookOpen, heading: 'შეკვეთის პირობები მზადდება', question: 'faq-ordering' },
} as const;

export async function PolicyPage({ policy, title, intro }: { policy: keyof typeof policies; title: string; intro: string }) {
  const settings = await getSettings();
  const content = policy === 'delivery' ? plannedDelivery : settings.policies[policy];
  const { icon: Icon, heading, question } = policies[policy];
  const paragraphs = content?.split(/\n\s*\n/).filter(paragraph => paragraph.trim());

  return (
    <main className="page-shell container information-edition information-reading" id="main">
      <header className={`page-header policy-hero policy-hero-${policy}`}>
        <div><h1>{title}</h1><p>{intro}</p></div>
        <Icon className="policy-symbol" size={112} strokeWidth={1.15} aria-hidden="true" />
      </header>
      <div className="information-layout">
        <aside className="information-aside">
          <nav aria-label="ინფორმაცია შეძენამდე">
            {Object.entries(policies).map(([key, entry]) => (
              <Link key={key} href={`/${key}`} aria-current={policy === key ? 'page' : undefined}>
                {entry.label}<ArrowUpRight size={15} aria-hidden="true" />
              </Link>
            ))}
            <Link href="/contact">კონტაქტი<ArrowUpRight size={15} aria-hidden="true" /></Link>
          </nav>
        </aside>
        <article className="prose policy-content">
          <h2>{paragraphs?.length && policy !== 'delivery' ? policies[policy].label : heading}</h2>
          {paragraphs?.length ? paragraphs.map((paragraph, index) => <p key={index}>{paragraph}</p>) :
            <p>დამტკიცებული პირობები გამოქვეყნდება შეკვეთების მიღების დაწყებამდე.</p>}
          <div className="policy-next-links">
            <Link className="text-link" href={`/faq#${question}`}>კითხვები და პასუხები <ArrowRight size={18} aria-hidden="true" /></Link>
            <Link className="text-link" href="/contact">დაგვიკავშირდი <ArrowUpRight size={18} aria-hidden="true" /></Link>
          </div>
        </article>
      </div>
      <CollectionInvitation />
    </main>
  );
}
