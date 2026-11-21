import type { Metadata } from 'next';

export const brandName = 'MyWonderBox';
export const siteTitle = `${brandName} | სიურპრიზის ყუთები ბავშვებისთვის`;
export const siteDescription = `${brandName} — სიურპრიზებითა და სათამაშოებით სავსე ყუთები ბავშვებისთვის. პატარა ყუთი, დიდი სიხარული.`;
export const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ? new URL(process.env.NEXT_PUBLIC_SITE_URL) : undefined;

type PreviewImage = { url: string; width?: number; height?: number; alt?: string };
const defaultPreview: PreviewImage = {
  url: '/opengraph-image.png',
  width: 1200,
  height: 630,
  alt: 'MyWonderBox-ის ლურჯი და ვარდისფერი სიურპრიზის ყუთები',
};

export function storefrontMetadata(
  path: string | undefined,
  title: string,
  description: string,
  image = defaultPreview,
): Metadata {
  const brandedTitle = title.startsWith(brandName);
  const socialTitle = brandedTitle ? title : `${title} | ${brandName}`;
  return {
    title: brandedTitle ? { absolute: title } : title,
    description,
    alternates: siteUrl && path ? { canonical: path } : undefined,
    openGraph: {
      title: socialTitle,
      description,
      type: 'website',
      locale: 'ka_GE',
      siteName: brandName,
      url: siteUrl ? path : undefined,
      images: [image],
    },
    twitter: {
      card: 'summary_large_image',
      title: socialTitle,
      description,
      images: [{ url: image.url, alt: image.alt }],
    },
  };
}
