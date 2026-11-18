import type { Packaging } from './types';

export const packagingDesigns = {
  'navy-yellow': {
    title: 'ყუთი ბიჭებისთვის',
    label: 'მუქი ლურჯი და ყვითელი',
    image: '/brand/box-navy.webp',
    compact: '/brand/box-navy-compact.webp',
  },
  'pink-berry': {
    title: 'ყუთი გოგონებისთვის',
    label: 'ვარდისფერი და კენკრისფერი',
    image: '/brand/box-berry.webp',
    compact: '/brand/box-berry-compact.webp',
  },
} satisfies Record<Packaging, { title: string; label: string; image: string; compact: string }>;

export const packagingColors = Object.keys(packagingDesigns) as Packaging[];

export function readPackaging(value: unknown): Packaging | '' {
  return value === 'navy-yellow' || value === 'pink-berry' ? value : '';
}
