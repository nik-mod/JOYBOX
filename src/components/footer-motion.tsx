'use client';

import { useRef, type ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import { allowMotion, editorialEase, gsap, useGSAP } from './motion';

export function FooterMotion({ children }: { children: ReactNode }) {
  const footer = useRef<HTMLElement>(null);
  const pathname = usePathname();

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
  }, { scope: footer, dependencies: [pathname], revertOnUpdate: true });

  return <footer className="site-footer" ref={footer}>{children}</footer>;
}
