'use client';

import { useRef, type ReactNode } from 'react';
import { allowMotion, editorialEase, gsap, useGSAP } from './motion';

export function FooterMotion({ children }: { children: ReactNode }) {
  const footer = useRef<HTMLElement>(null);

  useGSAP(() => {
    const element = footer.current;
    const brand = element?.querySelector('.footer-brand');
    if (!element || !brand) return;
    const media = gsap.matchMedia();
    media.add(allowMotion, () => {
      gsap.from(brand, {
        y: 12, duration: .65, ease: editorialEase, clearProps: 'transform',
        scrollTrigger: { trigger: element, start: 'top 93%', once: true },
      });
    });
    return () => media.revert();
  }, { scope: footer });

  return <footer className="site-footer" ref={footer}>{children}</footer>;
}
