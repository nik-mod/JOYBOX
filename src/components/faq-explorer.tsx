'use client';
import { useRef, useState } from 'react';
import { Search, ArrowUpRight, X } from 'lucide-react';
import Link from 'next/link';
const topics = ['ყველა კითხვა', 'ყუთების შესახებ', 'შეკვეთა და მიწოდება'];
export function FAQExplorer({ questions }: { questions: string[][] }) {
  const [query, setQuery] = useState('');
  const [topic, setTopic] = useState(0);
  const input = useRef<HTMLInputElement>(null);
  const visible = questions.filter((row, index) => (!topic || (topic === 1 ? index < 3 : index >= 3)) && row.join(' ').toLocaleLowerCase('ka').includes(query.trim().toLocaleLowerCase('ka')));
  return <div className="faq-explorer">
    <div className="faq-search"><Search size={19} aria-hidden="true"/><input ref={input} type="search" value={query} onChange={event => setQuery(event.target.value)} placeholder="მოძებნე კითხვა" aria-label="მოძებნე კითხვა"/>
      {query && <button type="button" aria-label="ძიების გასუფთავება" onClick={() => { setQuery(''); input.current?.focus(); }}><X size={18}/></button>}
    </div>
    <div className="faq-topics" role="group" aria-label="კითხვების თემა">{topics.map((label,index) => <button type="button" key={label} aria-pressed={topic === index} onClick={() => setTopic(index)}>{label}</button>)}</div>
    <p className="faq-result-count" role="status">{visible.length} კითხვა</p>
    <div className="faq-list prose">{visible.map(([question,answer]) => <details key={question}><summary>{question}</summary><p>{answer}</p></details>)}</div>
    {!visible.length && <div className="faq-no-results"><p>კითხვა ვერ მოიძებნა. სცადე სხვა სიტყვა ან თემა.</p><button type="button" className="text-link" onClick={() => {setQuery('');setTopic(0);input.current?.focus();}}>ყველა კითხვის ნახვა <ArrowUpRight size={17}/></button></div>}
    <div className="faq-help"><span>სხვა კითხვა გაქვს?</span><Link href="/contact">საკონტაქტო ინფორმაცია <ArrowUpRight size={18}/></Link></div>
  </div>;
}
