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
      let trigger: ScrollTrigger | undefined;
      let pendingSeek = 0;
      let target = 0;
      let failed = false;

      const seekLatest = () => {
        if (failed || video.seeking || pendingSeek) return;
        pendingSeek = requestAnimationFrame(() => {
          pendingSeek = 0;
          if (video.seeking || Math.abs(video.currentTime - target) < 1 / (frameRate * 2)) return;
          video.currentTime = target;
        });
      };

      const install = context.add('installHowFilm', () => {
        const rows = Array.from(stage.querySelectorAll('.how-film-step'));
        const lastFrame = Math.max(0, Math.round(video.duration * frameRate) - 1);
        const playhead = { frame: 0 };
        const timeline = gsap.timeline({
          paused: true,
          defaults: { ease: 'none' },
          onUpdate() {
            target = Math.min(lastFrame, Math.round(playhead.frame)) / frameRate;
            const progress = timeline.progress();
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
          timeline.to(rows[index], { clipPath: 'inset(0% 0% 100% 0%)', y: -14, duration: .04 }, cut - .04)
            .to(rows[index + 1], { clipPath: openMask, y: 0, duration: .055 }, cut);
        }

        // A late network response must not pin a scene the visitor has already entered.
        const canPin = stage.getBoundingClientRect().top > 24;
        stage.dataset.scrub = canPin ? 'pinned' : 'inline';
        stage.dataset.beat = '1';
        trigger = ScrollTrigger.create({
          id: 'joybox-how-film',
          trigger: stage,
          animation: timeline,
          start: canPin ? 'top top' : 'top top+=24',
          end: canPin ? () => '+=' + gsap.utils.clamp(700, 1100, window.innerHeight * 1.03) : 'center 12%',
          pin: canPin,
          scrub: .24,
          anticipatePin: canPin ? 1 : 0,
        });
      });

      const ready = () => {
        if (failed || trigger || !Number.isFinite(video.duration) || video.duration < 1) return;
        if (video.readyState < HTMLMediaElement.HAVE_CURRENT_DATA) return;
        stage.dataset.frame = 'ready';
        install();
      };
      const onError = () => {
        failed = true;
        stage.dataset.frame = 'error';
        if (pendingSeek) cancelAnimationFrame(pendingSeek);
        // Keep existing pin geometry until cleanup if the connection fails during a seek.
      };
      const observer = new IntersectionObserver(entries => {
        if (!entries.some(entry => entry.isIntersecting)) return;
        observer.disconnect();
        video.src = '/brand/joybox-unboxing.mp4';
        video.load();
      }, { rootMargin: '1050px 0px' });

      video.addEventListener('loadeddata', ready);
      video.addEventListener('seeked', seekLatest);
      video.addEventListener('error', onError);
      observer.observe(stage);

      return () => {
        observer.disconnect();
        if (pendingSeek) cancelAnimationFrame(pendingSeek);
        trigger?.kill();
        video.removeEventListener('loadeddata', ready);
        video.removeEventListener('seeked', seekLatest);
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
            <video ref={videoRef} muted playsInline preload="auto" aria-hidden="true" />
          </div>
          <figcaption className="how-film-caption">ბრენდის კონცეპტუალური ვიზუალი</figcaption>
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
