import type { RefObject } from 'react';
import { useHeroMotion } from './hero-motion';
import { allowMotion, editorialEase, gsap, useGSAP, wideMotion } from './motion';

export function useHomeMotion(root: RefObject<HTMLElement | null>) {
  useHeroMotion(root);
  useGSAP(() => {
    if (!root.current) return;
    const media = gsap.matchMedia(root.current);
    media.add(allowMotion, () => {
      gsap.fromTo('.story-edition-copy', { y: 18, opacity: .78 }, {
        y: 0, opacity: 1, duration: .68, ease: editorialEase, clearProps: 'transform,opacity',
        scrollTrigger: { trigger: '.story-edition', start: 'top 82%', once: true },
      });
    });
    media.add(wideMotion, () => {
      gsap.fromTo('.why-edition', { '--section-reveal': 0 }, { '--section-reveal': 1, ease: 'none',
        scrollTrigger: { trigger: '.why-edition', start: 'top 85%', end: 'top 35%', scrub: .5 },
      });
    });
    return () => media.revert();
  }, { scope: root });
}
