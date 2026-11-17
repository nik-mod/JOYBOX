import { packagingDesigns } from '@/lib/packaging';
import type { Packaging } from '@/lib/types';

export function PackagingPhoto({ color, loading = 'lazy' }: { color: Packaging; loading?: 'lazy' | 'eager' }) {
  const design = packagingDesigns[color];
  return (
    <picture>
      <source media="(max-width: 740px)" srcSet={design.compact} />
      <img src={design.image} alt={design.label + ' ჯოიბოქსის შეფუთვა'} width={1440} height={960} loading={loading} />
    </picture>
  );
}
