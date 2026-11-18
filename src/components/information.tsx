import Link from 'next/link';
import { ArrowRight, ArrowUpRight, Truck, RotateCcw, LockKeyhole, BookOpen } from 'lucide-react';
import { getSettings } from '@/lib/catalog';
import { CollectionInvitation } from './collection-invitation';
const links = [['delivery','მიწოდება'],['returns','დაბრუნება'],['privacy','კონფიდენციალურობა'],['terms','წესები და პირობები']];
export async function PolicyPage({ policy, title, intro }: { policy: string; title: string; intro: string }) {
  const settings = await getSettings();
  const content = settings.policies[policy];
  const Icon = ({ delivery: Truck, returns: RotateCcw, privacy: LockKeyhole, terms: BookOpen })[policy] ?? BookOpen;
  return <main className="page-shell container information-edition information-reading" id="main">
    <header className={`page-header policy-hero policy-hero-${policy}`}><div><h1>{title}</h1><p>{intro}</p></div><Icon className="policy-symbol" size={112} strokeWidth={1.15} aria-hidden="true"/></header>
    <div className="information-layout">
      <aside className="information-aside"><nav aria-label="ინფორმაცია შეძენამდე">{links.map(([key,label]) => <Link key={key} href={`/${key}`} aria-current={policy === key ? 'page' : undefined}>{label}<ArrowUpRight size={15}/></Link>)}<Link href="/contact">კონტაქტი<ArrowUpRight size={15}/></Link></nav></aside>
      <article className="prose">
        {content ? content.split('\n\n').map((paragraph,index) => <p key={index} style={{whiteSpace:'pre-line'}}>{paragraph}</p>) : <>
          <h2>ინფორმაცია მზადდება</h2>
          <p>დამტკიცებული პირობები გამოქვეყნდება შეკვეთების მიღების დაწყებამდე. ამ ეტაპზე ონლაინ გადახდა ხელმისაწვდომი არ არის.</p>
          <div className="policy-next"><h3>შეძენამდე გადაამოწმე</h3><p>შეკვეთის გაფორმებამდე გაეცანი ამ გვერდზე გამოქვეყნებულ სრულ და განახლებულ პირობებს.</p></div>
        </>}
        <Link className="text-link" href="/faq">კითხვები და პასუხები <ArrowRight size={18}/></Link>
      </article>
    </div>
    <CollectionInvitation />
  </main>;
}
