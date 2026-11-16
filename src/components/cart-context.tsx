'use client';
import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import type { Product } from '@/lib/types';

type Line = { product: Product; quantity: number };
type CartValue = { lines: Line[]; count: number; ready: boolean; add: (product: Product, quantity?: number) => void; update: (id: string, quantity: number) => void; remove: (id: string) => void; clear: () => void; notice: string };
const CartContext = createContext<CartValue | null>(null);
function isStoredLine(value: unknown): value is Line {
  if (!value || typeof value !== 'object') return false;
  const item = value as Partial<Line>; const product = item.product;
  return Boolean(product && typeof product.id === 'string' && product.id.length <= 100 && typeof product.slug === 'string' && /^[a-z0-9-]+$/.test(product.slug) && typeof product.name === 'string' && product.name.length <= 200 && typeof product.image_url === 'string' && (!product.image_url || product.image_url.startsWith('/') || product.image_url.startsWith('https://')) && Number.isSafeInteger(product.stock) && product.stock >= 0 && Number.isSafeInteger(product.price_minor) && product.price_minor >= 0 && product.price_minor <= 100_000_000 && Number.isSafeInteger(item.quantity) && item.quantity! > 0 && item.quantity! <= 99);
}
export function CartProvider({ children }: { children: ReactNode }) {
  const [lines, setLines] = useState<Line[]>([]); const [ready, setReady] = useState(false); const [notice, setNotice] = useState('');
  useEffect(() => { try { const parsed: unknown = JSON.parse(localStorage.getItem('joybox-cart-v1') || '[]'); if (Array.isArray(parsed)) { const unique = new Map<string, Line>(); for (const line of parsed.filter(isStoredLine).slice(0, 100)) unique.set(line.product.id, line); setLines([...unique.values()]); } } catch { /* corrupted or unavailable browser storage starts with a clean cart */ } setReady(true); }, []);
  useEffect(() => { if (ready) { try { localStorage.setItem('joybox-cart-v1', JSON.stringify(lines)); } catch { /* Cart remains available for this visit. */ } } }, [lines, ready]);
  function add(product: Product, quantity = 1) { if (product.stock < 1 || !Number.isSafeInteger(quantity) || quantity < 1) return; setLines(current => { const old = current.find(line => line.product.id === product.id); return old ? current.map(line => line.product.id === product.id ? { product, quantity: Math.min(product.stock, 99, line.quantity + quantity) } : line) : [...current, { product, quantity: Math.min(product.stock, 99, quantity) }]; }); setNotice(`${product.name} დაემატა კალათაში`); }
  function update(id: string, quantity: number) { setLines(current => quantity < 1 ? current.filter(line => line.product.id !== id) : current.map(line => line.product.id === id ? { ...line, quantity: Math.min(99, line.product.stock, quantity) } : line)); }
  return <CartContext.Provider value={{ lines, ready, count: lines.reduce((sum, line) => sum + line.quantity, 0), add, update, remove: id => setLines(current => current.filter(line => line.product.id !== id)), clear: () => setLines([]), notice }}>{children}<span className="sr-only" role="status" aria-live="polite">{notice}</span></CartContext.Provider>;
}
export function useCart() { const context = useContext(CartContext); if (!context) throw new Error('CartProvider required'); return context; }
