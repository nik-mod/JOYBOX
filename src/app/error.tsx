'use client';
export default function ErrorPage({ retry }: { error: unknown; retry: () => void }) { return <main id="main" className="page-shell container"><div className="empty-state"><h2>გვერდი ვერ ჩაიტვირთა</h2><p>დროებითი შეფერხებაა. გთხოვ, სცადე ხელახლა.</p><button className="button button-yellow" onClick={retry}>ხელახლა ცდა</button></div></main>; }
