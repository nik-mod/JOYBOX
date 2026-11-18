'use client';

import Link from 'next/link';
import { useRef, useState } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { PackagingPhoto } from './packaging-photo';
import { gsap, useGSAP } from './motion';

/** A real product choice, with the photography and destination kept in sync. */
export function EditionPreview() {
  const [selected, setSelected] = useState(0);
  const root = useRef<HTMLDivElement>(null);
  const mounted = useRef(false);
  const editions = [
    { color: 'navy-yellow' as const, name: 'ბიჭებისთვის', slug: 'joybox-navy' },
    { color: 'pink-berry' as const, name: 'გოგონებისთვის', slug: 'joybox-berry' },
  ];
  useGSAP(() => {
    if (!mounted.current) { mounted.current = true; return; }
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    gsap.fromTo('.edition-preview-photo', { x: 20, opacity: .5 }, {
      x: 0, opacity: 1, duration: .55, ease: 'power3.out', clearProps: 'transform,opacity',
    });
  }, { scope: root, dependencies: [selected], revertOnUpdate: true });
  return <div className="edition-preview" ref={root} data-edition={selected}>
    <div className="edition-preview-tabs" role="group" aria-label="ყუთის არჩევა">
      {editions.map((edition, index) => <button key={edition.color} type="button" aria-pressed={selected === index}
        onClick={() => setSelected(index)}><span className={`edition-dot edition-dot-${index}`} />{edition.name}</button>)}
    </div>
    <Link className="edition-preview-photo" href={`/shop/${editions[selected].slug}`} aria-label={`ყუთი ${editions[selected].name}`}>
      <PackagingPhoto color={editions[selected].color} loading="eager" />
    </Link>
    <div className="edition-preview-caption"><span>4–10 წლის ბავშვებისთვის</span><Link href={`/shop/${editions[selected].slug}`}>გაიცანი ყუთი <ArrowUpRight size={18}/></Link></div>
  </div>;
}
