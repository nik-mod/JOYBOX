import Link from 'next/link';
import { ArrowRight, ArrowLeft } from 'lucide-react';
export default function NotFound() {
 return <main id="main" className="page-shell container recovery-page"><div className="recovery-code" aria-hidden="true">404</div><div><h1>ეს გვერდი ვერ მოიძებნა</h1><p>შესაძლოა ბმული შეიცვალა. შენი სიურპრიზის პოვნას კატალოგში გააგრძელებ.</p><div className="recovery-actions"><Link className="button button-yellow" href="/shop">ყუთების ნახვა <ArrowRight size={19}/></Link><Link className="text-link" href="/"><ArrowLeft size={17}/> მთავარი გვერდი</Link></div></div></main>;
}
