'use client';
import Link from 'next/link';
import { useRef, useState } from 'react';
import { ArrowRight, Minus, Plus, Check, Package } from 'lucide-react';
import type { Product } from '@/lib/types';
import { formatMoney } from '@/lib/money';
import { packagingDesigns } from '@/lib/packaging';
import { useCart } from './cart-context';
import { BoxMark } from './brand';
import { allowMotion, editorialEase, gsap, ScrollTrigger, useGSAP, wideMotion } from './motion';

export function ProductGrid({ products }: { products: Product[] }) {
  const grid = useRef<HTMLDivElement>(null);
  const listing = products.map(({ id }) => id).join(',');

  useGSAP(() => {
    const element = grid.current;
    if (!element) return;
    const media = gsap.matchMedia();
    media.add(allowMotion, context => {
      const cards = Array.from(element.querySelectorAll('.product-item'));
      const revealCards = context.add('revealCards', (entries: Element[]) => {
        gsap.from(entries, {
          y: 18, opacity: .82, duration: .64, stagger: .09, ease: editorialEase,
          clearProps: 'transform,opacity',
        });
      });
      ScrollTrigger.batch(cards, {
        start: 'top 92%',
        once: true,
        interval: .08,
        batchMax: 3,
        onEnter: entries => revealCards(entries),
      });
    });
    media.add(wideMotion, () => {
      // Keep the scroll work bounded when the shop contains a large catalog.
      const images = Array.from(element.querySelectorAll('.product-image-media')).slice(0, 6);
      for (const image of images) {
        gsap.fromTo(image, { yPercent: -3.5 }, {
          yPercent: 3.5, ease: 'none',
          scrollTrigger: { trigger: image.parentElement, start: 'top bottom', end: 'bottom top', scrub: .35 },
        });
      }
    });
    return () => media.revert();
  }, { scope: grid, dependencies: [listing], revertOnUpdate: true });

  return (
    <div className="product-grid" ref={grid}>
      {products.map(product => (
        <article className="product-item" key={product.id}>
          <Link href={`/shop/${product.slug}`} className="product-image">
            {product.image_url ? (
              <span className="product-image-media">
                <img src={product.image_url} alt={product.name} width="500" height="500" loading="lazy" />
              </span>
            ) : <BoxMark />}
          </Link>
          <Link href={`/shop/${product.slug}`}><h3>{product.name}</h3></Link>
          <div className="product-meta">
            <span>{product.age_label || 'ასაკი იხილე აღწერაში'}</span>
            <span className="product-price">{formatMoney(product.price_minor)}</span>
          </div>
          <p>{product.short_description}</p>
          <PackagingLabel packaging={product.packaging} />
          <Link className="button button-outline" href={`/shop/${product.slug}`}>
            {product.stock > 0 ? 'გაიცანი ყუთი' : 'დროებით ამოწურულია'} <ArrowRight size={17} />
          </Link>
        </article>
      ))}
    </div>
  );
}
export function PackagingLabel({ packaging }: { packaging: Product['packaging'] }) {
  if (!packaging) return null;
  return <span className={`packaging-label ${packaging === 'pink-berry' ? 'berry' : ''}`}>
    {packagingDesigns[packaging].label}
  </span>;
}

export function ProductPurchase({ product }: { product: Product }) {
  const { add } = useCart(); const [quantity, setQuantity] = useState(1); const [added, setAdded] = useState(false);
  return <><div className="purchase-row"><div className="quantity-control"><button aria-label="რაოდენობის შემცირება" disabled={quantity <= 1} onClick={() => setQuantity(q => q - 1)}><Minus size={15} /></button><span aria-live="polite">{quantity}</span><button aria-label="რაოდენობის გაზრდა" disabled={quantity >= product.stock || quantity >= 99} onClick={() => setQuantity(q => q + 1)}><Plus size={15} /></button></div><button className="button button-yellow" disabled={product.stock < 1} onClick={() => { add(product, quantity); setAdded(true); }}>{product.stock < 1 ? 'ამოწურულია' : added ? 'დამატებულია' : 'კალათაში დამატება'}{added ? <Check size={19} /> : <Plus size={19} />}</button></div>{added && <Link className="text-link" style={{ marginTop: 15 }} href="/cart">კალათის ნახვა <ArrowRight size={17} /></Link>}</>;
}
export function ProductGallery({ product }: { product: Product }) {
  const images = Array.from(new Set([product.image_url, ...product.images].filter(Boolean)));
  const [selected, setSelected] = useState(images[0]);
  return (
    <div className="product-gallery">
      <div className="main-product-image">
        {selected ? <img key={selected} src={selected} alt={product.name} width="700" height="700" />
          : <Package size={90} />}
      </div>
      {images.length > 1 && (
        <div className="product-thumbs">
          {images.map((image, index) => (
            <button type="button" key={image} className={selected === image ? 'selected' : ''}
              aria-label={`ფოტო ${index + 1}`} aria-pressed={selected === image} onClick={() => setSelected(image)}>
              <img src={image} alt="" width="75" height="75" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
