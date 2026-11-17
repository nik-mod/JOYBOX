'use client';

import { useRef } from 'react';
import { MousePointer2, Truck } from 'lucide-react';
import { BoxMark } from './brand';
import { allowMotion, editorialEase, gsap, useGSAP } from './motion';
import { howSteps } from './how-content';

const stepArt = [<MousePointer2 size={39} strokeWidth={1.5} />, <Truck size={42} strokeWidth={1.5} />, <BoxMark />];

export function HowSteps() {
  const list = useRef<HTMLOListElement>(null);

  useGSAP(() => {
    const element = list.current;
    if (!element) return;
    const media = gsap.matchMedia();
    media.add({ allowed: allowMotion, stacked: '(max-width: 850px)' }, ({ conditions }) => {
      if (!conditions?.allowed) return;
      // Run per row on stacked layouts so each step meets the reader as they reach it.
      const rows = Array.from(element.querySelectorAll('.how-step'));
      const groups = conditions.stacked
        ? rows.map(row => [row])
        : [rows];
      for (const group of groups) {
        const timeline = gsap.timeline({
          defaults: { ease: editorialEase, clearProps: 'transform,opacity' },
          scrollTrigger: { trigger: group[0], start: 'top 86%', once: true },
        });
        timeline.from(group.map(row => row.querySelector('.step-art')), {
          scale: .83, x: -12, opacity: .62, duration: .68, stagger: .15,
        }, 0);
        timeline.from(group.map(row => row.querySelector('.step-copy')), {
          x: 14, y: 7, opacity: .72, duration: .56, stagger: .15,
        }, .08);
      }
    });
    return () => media.revert();
  }, { scope: list });

  return (
    <ol className="how-steps" ref={list}>
      {howSteps.map(({ title, description }, index) => (
        <li className="how-step" key={title}>
          <div className="step-art" aria-hidden="true">{stepArt[index]}</div>
          <div className="step-copy"><span className="step-number">0{index + 1}</span><h3>{title}</h3><p>{description}</p></div>
        </li>
      ))}
    </ol>
  );
}
