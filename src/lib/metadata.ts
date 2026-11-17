import type { Metadata } from 'next';

export function storefrontMetadata(path: string, title: string, description: string): Metadata {
  const hasDomain = Boolean(process.env.NEXT_PUBLIC_SITE_URL);
  return {
    title,
    description,
    alternates: hasDomain ? { canonical: path } : undefined,
    openGraph: {
      title,
      description,
      type: 'website',
      locale: 'ka_GE',
      url: hasDomain ? path : undefined,
      images: [{ url: '/opengraph-image.png', width: 1200, height: 630, alt: 'ჯოიბოქსი' }],
    },
  };
}
