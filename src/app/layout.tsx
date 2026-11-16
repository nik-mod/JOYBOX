import type { Metadata, Viewport } from 'next';
import { CartProvider } from '@/components/cart-context';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import './globals.css';
export const metadata: Metadata = { metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'), title: { default: 'ჯოიბოქსი — პატარა ყუთი, დიდი სიხარული', template: '%s | JOYBOX' }, description: 'აღმოაჩინე ჯოიბოქსი — სათამაშოებით, თამაშებითა და შემოქმედებითი აღმოჩენებით სავსე სიურპრიზის ყუთები ბავშვებისთვის.', icons: { icon: [{ url: '/favicon.ico' }, { url: '/favicon.svg', type: 'image/svg+xml' }], apple: '/apple-touch-icon.png' }, manifest: '/site.webmanifest', openGraph: { title: 'ჯოიბოქსი — პატარა ყუთი, დიდი სიხარული', description: 'სიურპრიზი, რომელიც ღიმილით იწყება.', locale: 'ka_GE', type: 'website', images: [{ url: '/opengraph-image.png', width: 1200, height: 630 }] }, twitter: { card: 'summary_large_image', images: ['/opengraph-image.png'] } };
export const viewport: Viewport = { themeColor: '#102D57' };
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) { return <html lang="ka"><body><CartProvider><Header />{children}<Footer /></CartProvider></body></html>; }
