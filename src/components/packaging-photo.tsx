import { packagingDesigns } from '@/lib/packaging';
import type { Packaging, Product } from '@/lib/types';

export function PackagingPhoto({ color, loading = 'lazy', detail = false }: {
  color: Packaging; loading?: 'lazy' | 'eager'; detail?: boolean;
}) {
  const design = packagingDesigns[color];
  const [width, height] = detail ? design.detailSize : [1440, 960];
  return (
    <picture>
      <source media="(max-width: 740px)" srcSet={detail ? design.detailCompact : design.compact} />
      <img src={detail ? design.detail : design.image} alt={design.alt} width={width} height={height} loading={loading} decoding="async" />
    </picture>
  );
}

export function ProductThumbnail({ product, decorative = false }: { product: Product; decorative?: boolean }) {
  const design = product.packaging ? packagingDesigns[product.packaging] : undefined;
  const official = design?.image === product.image_url;
  return <img src={official ? design.compact : product.image_url}
    alt={decorative ? '' : official ? design.alt : product.name} width={100} height={67} loading="lazy" decoding="async" />;
}
