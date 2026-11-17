import type { RefObject } from 'react';
import { allowMotion, editorialEase, gsap, useGSAP, wideMotion } from './motion';

export function useHomeMotion(root: RefObject<HTMLElement | null>) {
  useGSAP(() => {
    const page = root.current;
    if (!page) return;
    const media = gsap.matchMedia(page);

    media.add(allowMotion, () => {
      // Keep the whole headline readable during the entrance and leave both links in place.
      if (window.scrollY < 120) {
        gsap.timeline({ defaults: { ease: editorialEase, clearProps: 'transform,opacity' } })
          .from('.hero-title-line', { y: 9, opacity: .86, stagger: .065, duration: .58 })
          .from('.hero-copy > p', { y: 5, duration: .48 }, .13)
          .from('.hero-action', { y: 4, duration: .43 }, .18);
      }

      gsap.from('.story-edition-copy > *', {
        y: 16, opacity: .78, stagger: .09, duration: .65, ease: editorialEase,
        clearProps: 'transform,opacity',
        scrollTrigger: { trigger: '.story-edition-copy', start: 'top 86%', once: true },
      });

      gsap.from('.why-section li > svg', {
        y: 10, scale: .75, opacity: .55, stagger: .12, duration: .6, ease: editorialEase,
        clearProps: 'transform,opacity',
        scrollTrigger: { trigger: '.why-section ul', start: 'top 86%', once: true },
      });
      gsap.from('.faq-home .faq-list', {
        x: 18, duration: .7, ease: editorialEase, clearProps: 'transform',
        scrollTrigger: { trigger: '.faq-home .faq-list', start: 'top 89%', once: true },
      });

      const closing = gsap.timeline({
        defaults: { ease: editorialEase, clearProps: 'transform,opacity' },
        scrollTrigger: { trigger: '.home-final', start: 'top 92%', once: true },
      });
      closing.from('.home-final h2', { x: -22, duration: .7 })
        .from('.home-final .button', { y: 10, duration: .5 }, .15);
    });

    media.add(wideMotion, () => {
      gsap.timeline({
        defaults: { ease: 'none' },
        scrollTrigger: {
          id: 'joybox-hero-camera',
          trigger: '.hero',
          start: 'top top',
          end: 'bottom top',
          scrub: .45,
        },
      })
        .to('.hero-photo', { scale: 1.045, xPercent: -.45, yPercent: 1.15, duration: 1 }, 0)
        .to('.hero-copy', { y: -12, duration: 1 }, 0)
        .to('.hero-shutter', { scaleY: 1, duration: .62 }, .38);

      gsap.fromTo('.story-logo', { scale: .94, y: 16 }, {
        scale: 1, y: 0, ease: 'none',
        scrollTrigger: { trigger: '.story-edition', start: 'top 88%', end: 'center 55%', scrub: .4 },
      });
    });

    return () => media.revert();
  }, { scope: root });
}
