import type { Metadata, Viewport } from 'next';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { SiteMotion } from '@/components/site-motion';
import { brandName, siteDescription, siteTitle, siteUrl, storefrontMetadata } from '@/lib/metadata';
import './globals.css';
import './storefront.css';
import './refinements.css';
import './art-direction.css';
import './studio.css';
const iconRevision = 'wonder-carton';
export const metadata: Metadata = {
  ...storefrontMetadata(undefined, siteTitle, siteDescription),
  metadataBase: siteUrl ?? new URL('http://localhost:3000'),
  title: { default: siteTitle, template: `%s | ${brandName}` },
  applicationName: brandName,
  icons: {
    icon: [
      { url: `/favicon.ico?v=${iconRevision}` },
      { url: `/favicon.svg?v=${iconRevision}`, type: 'image/svg+xml', sizes: 'any' },
    ],
    apple: { url: `/apple-touch-icon.png?v=${iconRevision}`, sizes: '180x180' },
  },
  manifest: '/site.webmanifest',
};
export const viewport: Viewport = { themeColor: '#082044' };
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ka" data-scroll-behavior="smooth">
      <head>
        <link rel="preload" href="/fonts/noto-georgian-regular.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
        <link rel="preload" href="/fonts/noto-georgian-extrabold.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
        <link rel="preload" href="/fonts/noto-serif-georgian-semibold.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
      </head>
      <body><Header />{children}<SiteMotion /><Footer /></body>
    </html>
  );
}
