'use client';
import Link from 'next/link';
import { RotateCcw } from 'lucide-react';
export default function ErrorPage({ retry }: { error: unknown; retry: () => void }) {
 return <main id="main" className="page-shell container recovery-page"><div><h1>გვერდი ვერ ჩაიტვირთა</h1><p>დროებითი შეფერხებაა. გთხოვ, სცადე ხელახლა.</p><div className="recovery-actions"><button type="button" className="button button-yellow" onClick={retry}>ხელახლა ცდა <RotateCcw size={18}/></button><Link href="/" className="text-link">მთავარი გვერდი</Link></div></div></main>;
}
