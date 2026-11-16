import Link from 'next/link';

export function Brand({ large = false }: { large?: boolean }) {
  return <Link href="/" className={`brand ${large ? 'brand-large' : ''}`} aria-label="ჯოიბოქსი — მთავარი"><img src="/brand/joybox-approved.png" alt="ჯოიბოქსი" width="1672" height="941" /></Link>;
}

export function BoxMark({ className = '' }: { className?: string }) {
  return <svg className={className} viewBox="0 0 100 100" fill="none" aria-hidden="true"><path d="m19 37 31-14 31 14v42L50 92 19 79Z" fill="#FFC920" stroke="currentColor" strokeWidth="3" strokeLinejoin="round"/><path d="m19 37 31 13 31-13M50 50v42" stroke="currentColor" strokeWidth="3"/><path d="m19 37-9-16 31-11 9 13 9-13 31 11-9 16-22 10-9-24-9 24Z" fill="#FFD851" stroke="currentColor" strokeWidth="3" strokeLinejoin="round"/><path d="M60 62c3 11 10 10 14-4" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round"/></svg>;
}
