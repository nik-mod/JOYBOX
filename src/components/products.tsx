'use client';
import Link from 'next/link';
import { useRef, useState } from 'react';
import { ArrowRight, Minus, Plus, Check, Package } from 'lucide-react';
import type { Product } from '@/lib/types';
import { formatMoney } from '@/lib/money';
import { packagingDesigns } from '@/lib/packaging';
import { useCart } from './cart-context';
import { BoxMark } from './brand';
import { PackagingPhoto } from './packaging-photo';
import { allowMotion, editorialEase, gsap, ScrollTrigger, useGSAP, wideMotion } from './motion';

export function ProductGrid({ products }: { products: Product[] }) {
  const { add, lines } = useCart();
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
        gsap.fromTo(image, { yPercent: -1 }, {
          yPercent: 1, ease: 'none',
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
                {product.packaging && product.image_url === packagingDesigns[product.packaging].image
                  ? <PackagingPhoto color={product.packaging} />
                  : <img src={product.image_url} alt={product.name} width="600" height="400" loading="lazy" decoding="async" />}
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
          <button type="button" className="button button-yellow" disabled={product.stock < 1 || lines.some(line => line.product.id === product.id && line.quantity >= product.stock)}
            onClick={() => add(product)}>
            {product.stock < 1 ? 'ამოწურულია' : lines.some(line => line.product.id === product.id) ? 'კალათაშია' : 'კალათაში დამატება'}
            {lines.some(line => line.product.id === product.id) ? <Check size={17} aria-hidden="true" /> : <Plus size={17} aria-hidden="true" />}
          </button>
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
  const { add, lines } = useCart(); const [quantity, setQuantity] = useState(1);
  const inCart = lines.find(line => line.product.id === product.id)?.quantity ?? 0;
  const remaining = Math.max(0, Math.min(product.stock, 99) - inCart);
  const selected = Math.min(quantity, remaining || 1);
  return <div className="product-purchase"><div className="purchase-row"><div className="quantity-control"><button type="button" aria-label="რაოდენობის შემცირება" disabled={selected <= 1 || !remaining} onClick={() => setQuantity(selected - 1)}><Minus size={15} /></button><span aria-live="polite">{selected}</span><button type="button" aria-label="რაოდენობის გაზრდა" disabled={selected >= remaining} onClick={() => setQuantity(selected + 1)}><Plus size={15} /></button></div><button type="button" className="button button-yellow" disabled={!remaining} onClick={() => add(product, selected)}>{product.stock < 1 ? 'ამოწურულია' : inCart && !remaining ? 'კალათაშია' : 'კალათაში დამატება'}{inCart ? <Check size={19} /> : <Plus size={19} />}</button></div><div className="purchase-feedback" aria-live="polite">{inCart > 0 && <Link className="text-link" href="/cart">კალათის ნახვა <ArrowRight size={17} /></Link>}</div></div>;
}
export function ProductGallery({ product }: { product: Product }) {
  const images = Array.from(new Set([product.image_url, ...product.images].filter(Boolean)));
  const [selected, setSelected] = useState(images[0]);
  return (
    <div className="product-gallery">
      <div className="main-product-image">
        {selected ? product.packaging && selected === packagingDesigns[product.packaging].image
          ? <PackagingPhoto color={product.packaging} loading="eager" />
          : <img key={selected} src={selected} alt={product.name} width="900" height="600" />
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
