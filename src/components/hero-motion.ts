import type { RefObject } from 'react';
import { allowMotion, gsap, ScrollTrigger, useGSAP, wideMotion } from './motion';

export function useHeroMotion(root: RefObject<HTMLElement | null>) {
  useGSAP(() => {
    const hero = root.current?.querySelector<HTMLElement>('.hero-cinema');
    if (!hero) return;
    const media = gsap.matchMedia();
    media.add(allowMotion, () => {
      const photo = hero.querySelector('.hero-photo');
      const atTop = window.scrollY < 120;
      const entrance = gsap.timeline({ defaults: { ease: 'power3.out' } });
      if (atTop) {
        entrance.fromTo('.hero-title-reveal', { yPercent: 105 }, { yPercent: 0, duration: .95, stagger: .12, clearProps: 'transform' }, .08)
          .fromTo('.hero-copy > p', { y: 12, opacity: .1 }, { y: 0, opacity: 1, duration: .75, clearProps: 'transform,opacity' }, .38)
          .fromTo('.hero-action', { y: 12, opacity: .25 }, { y: 0, opacity: 1, duration: .7, clearProps: 'transform,opacity' }, .52);
        entrance.fromTo('.hero-editions', { clipPath: 'inset(0 100% 0 0)' }, { clipPath: 'inset(0 0% 0 0)', duration: .75, clearProps: 'clipPath' }, .72);
      }
      // Separate transform layers: photograph breathes, lens follows scroll,
      // inner image follows pointer. No competing writes to one transform.
      const camera = gsap.timeline({ repeat: -1, yoyo: true, defaults: { ease: 'sine.inOut' } })
        .fromTo(photo, { scale: 1.012 }, { scale: 1.045, duration: 10 });
      let visible = hero.getBoundingClientRect().bottom > 0;
      let manualPaused = hero.querySelector('button[aria-pressed="true"]') !== null;
      const sync = () => camera.paused(manualPaused || !visible || document.hidden);
      const visibility = ScrollTrigger.create({ trigger: hero, start: 'top bottom', end: 'bottom top', onToggle: self => { visible = self.isActive; sync(); } });
      const toggle = (event: Event) => { manualPaused = (event as CustomEvent<boolean>).detail; sync(); };
      hero.addEventListener('joybox:hero-motion', toggle);
      document.addEventListener('visibilitychange', sync);
      sync();
      gsap.timeline({ defaults: { ease: 'none' }, scrollTrigger: { id: 'joybox-hero-camera', trigger: hero, start: 'top top', end: 'bottom top', scrub: .65 } })
        .to('.hero-lens', { scale: 1.075, yPercent: 2, duration: 1 }, 0)
        .to('.hero-copy', { y: -32, duration: 1 }, 0)
        .to('.hero-shutter', { scaleY: 1, duration: .55 }, .45);
      return () => {
        hero.removeEventListener('joybox:hero-motion', toggle);
        document.removeEventListener('visibilitychange', sync);
        visibility.kill();
        camera.kill();
      };
    });
    media.add(wideMotion, () => {
      const image = hero.querySelector('.hero-photo img');
      const x = gsap.quickTo(image, 'x', { duration: 1.1, ease: 'power3.out' });
      const y = gsap.quickTo(image, 'y', { duration: 1.1, ease: 'power3.out' });
      const light = hero.querySelector('.hero-light');
      const lightX = gsap.quickTo(light, 'x', { duration: 1.3, ease: 'power3.out' });
      const lightY = gsap.quickTo(light, 'y', { duration: 1.3, ease: 'power3.out' });
      const move = (event: PointerEvent) => {
        if (hero.querySelector('button[aria-pressed="true"]')) return;
        const bounds = hero.getBoundingClientRect();
        const across = (event.clientX - bounds.left) / bounds.width - .5;
        const down = (event.clientY - bounds.top) / bounds.height - .5;
        x(across * 22); y(down * 12);
        lightX(across * 80); lightY(down * 35);
      };
      const reset = () => { x(0); y(0); lightX(0); lightY(0); };
      hero.addEventListener('pointermove', move);
      hero.addEventListener('pointerleave', reset);
      hero.addEventListener('joybox:hero-motion', reset);
      return () => {
        hero.removeEventListener('pointermove', move);
        hero.removeEventListener('pointerleave', reset);
        hero.removeEventListener('joybox:hero-motion', reset);
      };
    });
    return () => media.revert();
  }, { scope: root });
}
