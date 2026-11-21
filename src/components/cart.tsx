'use client';

import Link from 'next/link';
import { Minus, Plus, ArrowRight, Trash2 } from 'lucide-react';
import { formatMoney } from '@/lib/money';
import { packagingColors, packagingDesigns, productHref } from '@/lib/packaging';
import { useCart } from './cart-context';
import { BoxMark } from './brand';
import { PackagingPhoto, ProductThumbnail } from './packaging-photo';

export function Cart({ freeDelivery }: { freeDelivery: boolean }) {
  const { lines, ready, update, remove } = useCart();
  const subtotal = lines.reduce((sum, line) => sum + line.product.price_minor * line.quantity, 0);
  if (!ready) return <div role="status" className="notice">კალათა იტვირთება…</div>;

  if (!lines.length) return (
    <div className="empty-state empty-discovery">
      <div className="empty-boxes">
        {packagingColors.map(color => (
          <Link key={color} href={`/shop?packaging=${color}`}>
            <PackagingPhoto color={color} />
            <span>{packagingDesigns[color].title} <ArrowRight size={15} aria-hidden="true" /></span>
          </Link>
        ))}
      </div>
      <h2>შენი კალათა ჯერ ცარიელია</h2>
      <p>სიხარული ერთი არჩევანით იწყება. დაათვალიერე ყუთები და იპოვე შენი სიურპრიზი.</p>
      <Link className="button button-yellow" href="/shop">ყუთების დათვალიერება <ArrowRight size={19} /></Link>
    </div>
  );

  return (
    <div className="cart-layout">
      <div>
        {lines.map(({ product, quantity }) => (
          <article className="cart-line" key={product.id}>
            <Link className="cart-line-img" href={productHref(product.slug)} aria-label={product.name}>
              {product.image_url ? <ProductThumbnail product={product} decorative /> : <BoxMark />}
            </Link>
            <div>
              <Link href={productHref(product.slug)}><h2>{product.name}</h2></Link>
              <p>{formatMoney(product.price_minor)}</p>
              <div className="cart-line-actions">
                <div className="quantity-control">
                  <button type="button" aria-label={`${product.name}: რაოდენობის შემცირება`} disabled={quantity <= 1}
                    onClick={() => update(product.id, quantity - 1)}><Minus size={14} /></button>
                  <span>{quantity}</span>
                  <button type="button" aria-label={`${product.name}: რაოდენობის გაზრდა`} disabled={quantity >= product.stock || quantity >= 99}
                    onClick={() => update(product.id, quantity + 1)}><Plus size={14} /></button>
                </div>
                <button type="button" className="remove-button" onClick={() => remove(product.id)}><Trash2 size={13} /> წაშლა</button>
              </div>
            </div>
            <strong>{formatMoney(product.price_minor * quantity)}</strong>
          </article>
        ))}
      </div>
      <aside className="cart-total">
        <h2>შეკვეთის შეჯამება</h2>
        <div className="summary-row"><span>ყუთების ღირებულება</span><span>{formatMoney(subtotal)}</span></div>
        <div className="summary-row"><span>მიწოდება</span><span>{freeDelivery ? 'უფასო' : 'მისამართის მიხედვით'}</span></div>
        <div className="summary-row total"><span>{freeDelivery ? 'სულ' : 'შუალედური ჯამი'}</span><span>{formatMoney(subtotal)}</span></div>
        {!freeDelivery && <p>მიწოდების ღირებულება და საბოლოო თანხა გამოჩნდება მისამართის არჩევის შემდეგ.</p>}
        <Link className="button button-yellow" href="/checkout">შეკვეთის გაფორმება <ArrowRight size={18} /></Link>
        <Link className="text-link" style={{ marginTop: 20 }} href="/shop">შოპინგის გაგრძელება</Link>
      </aside>
    </div>
  );
}
