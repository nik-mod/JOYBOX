import Link from 'next/link';
import { BoxMark } from '@/components/brand';
export default function NotFound() { return <main id="main" className="page-shell container"><div className="empty-state"><BoxMark /><span className="eyebrow">404</span><h2>ეს გვერდი ვერ მოიძებნა</h2><p>შესაძლოა ბმული შეიცვალა. სიურპრიზები მთავარ გვერდზე გელოდება.</p><Link className="button button-yellow" href="/">მთავარ გვერდზე დაბრუნება</Link></div></main>; }
