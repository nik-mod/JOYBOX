import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { getProduct, getSettings } from '@/lib/catalog';
import { storefrontMetadata } from '@/lib/metadata';
import { formatMoney } from '@/lib/money';
import { PackagingLabel, ProductGallery, ProductPurchase } from '@/components/products';
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const product = await getProduct((await params).slug);
  if (!product) return { title: 'ყუთი ვერ მოიძებნა', robots: { index: false, follow: false } };
  return storefrontMetadata(`/shop/${product.slug}`, product.name, product.short_description);
}

async function ProductStructuredData({ product }: { product: NonNullable<Awaited<ReturnType<typeof getProduct>>> }) {
  const domain = process.env.NEXT_PUBLIC_SITE_URL;
  if (!domain) return null;
  const settings = await getSettings();
  const url = new URL(`/shop/${product.slug}`, domain).href;
  const data = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.short_description,
    image: new URL(product.image_url, domain).href,
    url,
    brand: { '@type': 'Brand', name: 'JOYBOX' },
    ...(settings.checkout_enabled && {
      offers: { '@type': 'Offer', url, priceCurrency: 'GEL', price: (product.price_minor / 100).toFixed(2),
        availability: `https://schema.org/${product.stock > 0 ? 'InStock' : 'OutOfStock'}` },
    }),
  };
  return <script type="application/ld+json" dangerouslySetInnerHTML={{
    __html: JSON.stringify(data).replace(/</g, '\\u003c'),
  }} />;
}
export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const product = await getProduct((await params).slug);
  if (!product) notFound();

  return (
    <main className="page-shell container product-edition" id="main">
      <ProductStructuredData product={product} />
      <nav className="breadcrumbs" aria-label="გვერდის მდებარეობა">
        <Link href="/">მთავარი</Link><ChevronRight size={12} />
        <Link href="/shop">ყუთები</Link><ChevronRight size={12} /><span>{product.name}</span>
      </nav>
      <div className="product-detail">
        <ProductGallery product={product} />
        <div className="product-copy">
          <h1>{product.name.replace(/^ჯოიბოქსი\s*—\s*/, '')}</h1>
          <div className="product-edition-price">
            <span className="detail-price">{formatMoney(product.price_minor)}</span>
            <span>{product.stock > 0 ? 'მარაგშია' : 'ამოწურულია'}</span>
          </div>
          <p>{product.short_description}</p>
          <dl className="product-essential-facts">
            {product.age_label && <div><dt>რეკომენდებული ასაკი</dt><dd>{product.age_label}</dd></div>}
            {product.dimensions && <div><dt>ყუთის ზომა</dt><dd>{product.dimensions}</dd></div>}
          </dl>
          <ProductPurchase product={product} />
          <div className="product-facts">
            {product.packaging && <p><strong>შეფუთვის ფერი:</strong> <PackagingLabel packaging={product.packaging} /></p>}
            {product.safety_info && <p>თამაშამდე შეამოწმე თითოეული ნივთის ასაკობრივი ნიშნული და უსაფრთხოების მითითებები.</p>}
          </div>
          <div className="faq-list product-disclosures">
            <details><summary>რა დაგხვდება ყუთში?</summary><div className="disclosure-body"><p>{product.description}</p>
              {product.categories.length > 0 && <p><strong>შესაძლო კატეგორიები:</strong> {product.categories.join(', ')}</p>}</div></details>
            {product.safety_info && <details><summary>უსაფრთხოება და გამოყენება</summary><div className="disclosure-body"><p>{product.safety_info}</p></div></details>}
          </div>
          <nav className="product-policy-links" aria-label="შეკვეთის პირობები">
            <Link className="text-link" href="/delivery">მიწოდების პირობები</Link>
            <Link className="text-link" href="/returns">დაბრუნების პირობები</Link>
          </nav>
        </div>
      </div>
    </main>
  );
}
