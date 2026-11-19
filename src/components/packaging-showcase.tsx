'use client';

import Link from 'next/link';
import { useEffect, useRef, useState, type PointerEvent } from 'react';
import { ArrowRight, ArrowUpRight, Box, RotateCcw, RotateCw, X } from 'lucide-react';
import { formatMoney } from '@/lib/money';
import { packagingColors, packagingDesigns } from '@/lib/packaging';
import type { Packaging, Product } from '@/lib/types';
import { allowMotion, editorialEase, gsap, useGSAP } from './motion';
import type { OrbitalPose } from './orbital-scene';
import { PackagingPhoto } from './packaging-photo';
import './orbital-showcase.css';

type Studio = Awaited<ReturnType<typeof import('./orbital-scene')['mountOrbitalScene']>>;

const initial: OrbitalPose = {
  angle: -.13, turn: 0, camera: 1.13, blush: 0,
  navyLid: 0, navyToys: 0, pinkLid: 0, pinkToys: 0,
};

function EditionImage({ color, product }: { color: Packaging; product?: Product }) {
  return product?.image_url && product.image_url !== packagingDesigns[color].image
    ? <img src={product.image_url} alt={product.name} width={1440} height={960} loading="lazy" decoding="async" />
    : <PackagingPhoto color={color} />;
}

function BoxStudio({ catalog }: { catalog: (Product | undefined)[] }) {
  const host = useRef<HTMLDivElement>(null);
  const studio = useRef<Studio | null>(null);
  const animation = useRef<gsap.core.Timeline | null>(null);
  const pose = useRef<OrbitalPose>({ ...initial });
  const drag = useRef<{ id: number; x: number } | null>(null);
  const [status, setStatus] = useState<'loading' | 'ready' | 'unavailable'>('loading');
  const [selected, setSelected] = useState(0);
  const [opened, setOpened] = useState(false);

  useEffect(() => {
    const element = host.current;
    if (!element) return;
    const abort = new AbortController();
    const preference = matchMedia(allowMotion);
    const settle = () => { if (!preference.matches) animation.current?.progress(1).kill(); };
    const fail = () => {
      if (abort.signal.aborted) return;
      abort.abort();
      clearTimeout(timeout);
      animation.current?.kill();
      studio.current?.dispose();
      studio.current = null;
      setStatus('unavailable');
    };
    const timeout = setTimeout(fail, 15000);
    preference.addEventListener('change', settle);
    void import('./orbital-scene').then(async ({ mountOrbitalScene }) => {
      if (abort.signal.aborted) return;
      const view = await mountOrbitalScene(element, abort.signal, fail);
      if (abort.signal.aborted) { view.dispose(); return; }
      clearTimeout(timeout);
      studio.current = view;
      view.draw(pose.current, true);
      setStatus('ready');
    }).catch(fail);
    return () => {
      clearTimeout(timeout);
      preference.removeEventListener('change', settle);
      abort.abort();
      animation.current?.kill();
      studio.current?.dispose();
      studio.current = null;
    };
  }, []);

  const play = (target: Partial<OrbitalPose>, toys?: Partial<OrbitalPose>, closing = false) => {
    animation.current?.kill();
    if (!matchMedia(allowMotion).matches) {
      Object.assign(pose.current, target, toys);
      studio.current?.draw(pose.current);
      return;
    }
    const timeline = gsap.timeline({
      defaults: { ease: 'power2.inOut', duration: .46 },
      onUpdate: () => studio.current?.draw(pose.current),
    });
    animation.current = timeline;
    timeline.to(pose.current, target, closing && toys ? .12 : 0);
    if (toys) timeline.to(pose.current, toys, closing ? 0 : .21);
  };

  const choose = (index: number) => {
    if (index === selected) return;
    setSelected(index);
    setOpened(false);
    play({ ...initial, angle: index === 0 ? initial.angle : Math.PI - initial.angle, blush: index });
  };
  const toggleLid = () => {
    setOpened(!opened);
    const value = opened ? 0 : 1;
    const lid = selected === 0 ? 'navyLid' : 'pinkLid';
    const toys = selected === 0 ? 'navyToys' : 'pinkToys';
    play({ [lid]: value }, { [toys]: value }, opened);
  };
  const rotate = (direction: number) => play({ turn: pose.current.turn + direction * Math.PI / 5 });
  const beginDrag = (event: PointerEvent<HTMLDivElement>) => {
    if (status !== 'ready' || event.button !== 0 || !event.isPrimary) return;
    animation.current?.progress(1).kill();
    drag.current = { id: event.pointerId, x: event.clientX };
    event.currentTarget.setPointerCapture(event.pointerId);
  };
  const moveDrag = (event: PointerEvent<HTMLDivElement>) => {
    if (drag.current?.id !== event.pointerId) return;
    pose.current.turn += (event.clientX - drag.current.x) * .012;
    drag.current.x = event.clientX;
    studio.current?.draw(pose.current);
  };

  const color = packagingColors[selected];
  const product = catalog[selected];
  return (
    <div className="box-studio" id="box-studio" data-color={color} data-status={status}>
      <div className="box-studio-view" aria-hidden="true">
        {status !== 'ready' && <EditionImage color={color} product={product} />}
        <div ref={host} className="box-studio-canvas" onPointerDown={beginDrag} onPointerMove={moveDrag}
          onLostPointerCapture={() => { drag.current = null; }} />
      </div>
      <div className="box-studio-controls">
        <div className="box-studio-variants" role="group" aria-label="შეფუთვის არჩევა">
          {packagingColors.map((variant, index) => (
            <button type="button" key={variant} aria-pressed={selected === index} disabled={status !== 'ready'}
              onClick={() => choose(index)}>
              <span className={'edition-swatch edition-swatch-' + variant} aria-hidden="true" />
              {packagingDesigns[variant].title}
            </button>
          ))}
        </div>
        <div className="box-studio-actions" role="group" aria-label="3D ყუთის მართვა">
          <button type="button" aria-label="მარცხნივ შემობრუნება" disabled={status !== 'ready'} onClick={() => rotate(-1)}>
            <RotateCcw size={19} aria-hidden="true" />
          </button>
          <button type="button" aria-label="მარჯვნივ შემობრუნება" disabled={status !== 'ready'} onClick={() => rotate(1)}>
            <RotateCw size={19} aria-hidden="true" />
          </button>
          <button type="button" aria-pressed={opened} disabled={status !== 'ready'} onClick={toggleLid}>
            {opened ? 'ყუთის დახურვა' : 'ყუთის გახსნა'}
          </button>
        </div>
        <p className="box-studio-note" role="status">
          {status === 'loading' ? '3D ყუთი იტვირთება…' : status === 'unavailable'
            ? '3D ხედი ვერ ჩაიტვირთა. ყუთების ფოტოები ქვემოთ დაგხვდება.'
            : opened ? 'ნაჩვენები სათამაშოები მაგალითებია. ყუთების შიგთავსი შეიძლება განსხვავდებოდეს.' : ''}
        </p>
      </div>
    </div>
  );
}

export function PackagingShowcase({ products }: { products: Product[] }) {
  const root = useRef<HTMLElement>(null);
  const [studioOpen, setStudioOpen] = useState(false);
  const catalog = packagingColors.map(color => products.find(item => item.published && item.packaging === color));

  useGSAP(() => {
    const element = root.current;
    if (!element) return;
    const media = gsap.matchMedia(element);
    media.add(allowMotion, () => {
      for (const photo of element.querySelectorAll('.edition-image img')) {
        gsap.fromTo(photo, { scale: .98 }, {
          scale: 1, duration: .72, ease: editorialEase, clearProps: 'transform',
          scrollTrigger: { trigger: photo, start: 'top 88%', once: true },
        });
      }
    });
    return () => media.revert();
  }, { scope: root });

  return (
    <section className="edition-showcase" id="collection" ref={root} aria-labelledby="collection-title">
      <div className="container">
        <div className="collection-intro">
          <h2 id="collection-title">რომელი ყუთი გინდა გახსნა?</h2>
          <div className="collection-actions">
            <button className="collection-studio-toggle" type="button" aria-expanded={studioOpen} aria-controls="box-studio"
              onClick={() => setStudioOpen(open => !open)}>
              {studioOpen ? <X size={19} aria-hidden="true" /> : <Box size={19} aria-hidden="true" />}
              {studioOpen ? '3D ხედის დახურვა' : 'ყუთების ნახვა 3D-ში'}
            </button>
            <Link href="/shop" className="edition-catalog-link">ყველა ყუთი <ArrowUpRight size={18} aria-hidden="true" /></Link>
          </div>
        </div>
        {studioOpen ? <BoxStudio catalog={catalog} /> : <div id="box-studio" hidden />}
        <div className="collection-editions">
          {packagingColors.map((color, index) => {
            const product = catalog[index];
            const href = product ? `/shop/${product.slug}` : `/shop?packaging=${color}`;
            return (
              <article className="collection-edition" data-color={color} key={color}>
                <Link href={href} className="edition-image" aria-label={'ყუთი ' + packagingDesigns[color].title}>
                  <EditionImage color={color} product={product} />
                </Link>
                <div className="collection-edition-copy">
                  <h3>ყუთი {packagingDesigns[color].title}</h3>
                  {product && <p>{formatMoney(product.price_minor)}</p>}
                  <Link href={href} className="edition-action">გაიცანი ყუთი <ArrowRight size={18} aria-hidden="true" /></Link>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
