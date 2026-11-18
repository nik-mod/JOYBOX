import type { RefObject } from 'react';
import { useHeroMotion } from './hero-motion';
import { gsap, useGSAP, wideMotion } from './motion';

export function useHomeMotion(root: RefObject<HTMLElement | null>) {
  useHeroMotion(root);
  useGSAP(() => {
    if (!root.current) return;
    const media = gsap.matchMedia(root.current);
    media.add(wideMotion, () => {
      const sequence = gsap.timeline({ defaults: { ease: 'none' },
        scrollTrigger: { trigger: '.story-edition', start: 'top bottom', end: 'bottom top', scrub: .65 },
      });
      sequence.fromTo('.story-box-navy', { y: 24 }, { y: -20, duration: 1 }, 0)
        .fromTo('.story-box-berry', { y: -18 }, { y: 20, duration: 1 }, 0);
      gsap.fromTo('.why-edition', { '--section-reveal': 0 }, { '--section-reveal': 1, ease: 'none',
        scrollTrigger: { trigger: '.why-edition', start: 'top 85%', end: 'top 35%', scrub: .5 },
      });
    });
    return () => media.revert();
  }, { scope: root });
}
