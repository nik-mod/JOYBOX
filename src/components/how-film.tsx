'use client';

import { useRef } from 'react';
import { gsap, ScrollTrigger, useGSAP, allowMotion } from './motion';
import { howSteps } from './how-content';

const cinema = '(min-width: 960px) and (min-height: 680px) and (pointer: fine) and ' + allowMotion;
const motionStill = '(max-width: 959px), (max-height: 679px), (pointer: coarse), (prefers-reduced-motion: reduce)';
const frameRate = 24;

const stepCuts = [.3, .6] as const;

// Times are measured in the 5.5s studio edit. The lid starts rising after 3.25s.
const beats = [
  { progress: stepCuts[0], time: 1.92 },
  { progress: stepCuts[1], time: 3.25 },
  { progress: .95, time: 5.5 },
  { progress: 1, time: 5.5 },
];
const openMask = 'inset(0% 0% 0% 0%)';

export function HowFilm() {
  const stageRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  useGSAP(() => {
    const stage = stageRef.current;
    const video = videoRef.current;
    if (!stage || !video) return;
    const media = gsap.matchMedia(stage);

    media.add(cinema, context => {
      if ((navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData) return;
      let trigger: ScrollTrigger | undefined;
      let timeline: gsap.core.Timeline | undefined;
      let targetFrame = 0;
      let requestedFrame = 0;
      let retryFrame = 0;
      let failed = false;
      let near = false;
      let loading = false;
      let timeout: ReturnType<typeof setTimeout> | undefined;

      const seekLatest = () => {
        // ScrollTrigger already updates on the animation tick. Only send one
        // seek at a time and discard intermediate targets while it decodes.
        if (failed || retryFrame || video.seeking || requestedFrame === targetFrame) return;
        requestedFrame = targetFrame;
        // Seek just inside the frame to avoid rounding down at a sample boundary.
        try {
          clearTimeout(timeout);
          video.currentTime = (requestedFrame + .125) / frameRate;
          timeout = setTimeout(() => { if (video.seeking) onError(); }, 2500);
        } catch { onError(); }
      };
      const onSeeked = () => {
        clearTimeout(timeout);
        // Leave the media event before requesting another frame for WebKit.
        if (failed || retryFrame || requestedFrame === targetFrame) return;
        retryFrame = requestAnimationFrame(() => {
          retryFrame = 0;
          seekLatest();
        });
      };

      const install = context.add('installHowFilm', () => {
        const rows = Array.from(stage.querySelectorAll('.how-film-step'));
        const lastFrame = Math.max(0, Math.round(video.duration * frameRate) - 1);
        const playhead = { frame: 0 };
        timeline = gsap.timeline({
          paused: true,
          defaults: { ease: 'none' },
          onUpdate() {
            targetFrame = Math.min(lastFrame, Math.round(playhead.frame));
            const progress = this.progress();
            const beat = progress >= stepCuts[1] ? '3' : progress >= stepCuts[0] ? '2' : '1';
            if (stage.dataset.beat !== beat) stage.dataset.beat = beat;
            seekLatest();
          },
        });

        timeline.set(rows[0], { clipPath: openMask }, 0);
        timeline.set(rows.slice(1), { clipPath: 'inset(100% 0% 0% 0%)', y: 14 }, 0);
        let previous = 0;
        for (const { progress, time } of beats) {
          timeline.to(playhead, { frame: Math.min(time * frameRate, lastFrame), duration: progress - previous }, previous);
          previous = progress;
        }
        for (const [index, cut] of stepCuts.entries()) {
          timeline.to(rows[index], { clipPath: 'inset(0% 0% 100% 0%)', y: -10, duration: .034 }, cut - .034)
            .to(rows[index + 1], { clipPath: openMask, y: 0, duration: .045 }, cut);
        }

        // A late network response must not pin a scene the visitor has already entered.
        const hasSectionAnchor = ['#how', '#collection', '#unboxing'].includes(window.location.hash);
        const canPin = !hasSectionAnchor && stage.getBoundingClientRect().top > 24;
        stage.dataset.scrub = canPin ? 'pinned' : 'inline';
        stage.dataset.beat = '1';
        trigger = ScrollTrigger.create({
          id: 'joybox-how-film',
          trigger: stage,
          animation: timeline,
          start: canPin ? 'top top' : 'top top+=24',
          end: canPin ? () => '+=' + Math.round(gsap.utils.clamp(940, 1500, window.innerHeight * 1.38)) : 'center 12%',
          pin: canPin,
          scrub: .28,
          anticipatePin: canPin ? 1 : 0,
        });
      });

      const ready = () => {
        if (failed || trigger || !Number.isFinite(video.duration) || video.duration < 1) return;
        if (video.readyState < HTMLMediaElement.HAVE_CURRENT_DATA) return;
        clearTimeout(timeout);
        stage.dataset.frame = 'ready';
        install();
      };
      const onError = () => {
        if (failed) return;
        failed = true;
        stage.dataset.frame = 'error';
        clearTimeout(timeout);
        cancelAnimationFrame(retryFrame);
        video.removeAttribute('src');
        video.load();
        const anchored = trigger?.isActive;
        const before = stage.getBoundingClientRect().top;
        trigger?.kill(); timeline?.revert();
        delete stage.dataset.scrub;
        delete stage.dataset.beat;
        ScrollTrigger.refresh();
        if (anchored) window.scrollBy({ top: stage.getBoundingClientRect().top - before, behavior: 'instant' });
      };
      const load = () => {
        if (!near || loading || failed || window.scrollY < 24) return;
        loading = true;
        observer.disconnect();
        window.removeEventListener('scroll', load);
        video.preload = 'auto';
        video.src = '/brand/joybox-unboxing.mp4?v=2';
        video.load();
        timeout = setTimeout(() => { if (!trigger) onError(); }, 15000);
      };
      const observer = new IntersectionObserver(entries => {
        near = entries.some(entry => entry.isIntersecting);
        load();
      }, { rootMargin: '1000px 0px' });

      video.addEventListener('loadeddata', ready);
      video.addEventListener('canplay', ready);
      video.addEventListener('seeked', onSeeked);
      video.addEventListener('error', onError);
      window.addEventListener('scroll', load, { passive: true });
      observer.observe(stage);

      return () => {
        observer.disconnect();
        window.removeEventListener('scroll', load);
        clearTimeout(timeout);
        cancelAnimationFrame(retryFrame);
        trigger?.kill();
        timeline?.revert();
        video.removeEventListener('loadeddata', ready);
        video.removeEventListener('canplay', ready);
        video.removeEventListener('seeked', onSeeked);
        video.removeEventListener('error', onError);
        delete stage.dataset.frame;
        delete stage.dataset.scrub;
        delete stage.dataset.beat;
        video.removeAttribute('src');
        video.load();
      };
    });
    return () => media.revert();
  }, { scope: stageRef });

  return (
    <section className="how-chapter" id="how" aria-labelledby="how-title">
      <div className="how-film-stage" ref={stageRef}>
        <h2 id="how-title" className="how-chapter-title">როგორ მუშაობს?</h2>
        <figure className="how-film-visual">
          <div className="how-film-plate">
            <picture>
              <source media={motionStill} srcSet="/brand/joybox-unboxing-open.webp" />
              <img src="/brand/joybox-unboxing-start.webp" width={1280} height={720} loading="lazy"
                alt="ლურჯ-ყვითელი ჯოიბოქსის ყუთი კრემისფერ ფონზე" />
            </picture>
            <video ref={videoRef} muted playsInline preload="none" aria-hidden="true" />
          </div>
        </figure>
        <ol className="how-film-steps">
          {howSteps.map(({ title, description }, index) => (
            <li className="how-film-step" key={title}>
              <span className="how-film-number" aria-hidden="true">0{index + 1}</span>
              <div>
                <h3>{title}</h3>
                <p>{description}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
