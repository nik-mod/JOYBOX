export function formatMoney(minor: number): string {
  if (!Number.isSafeInteger(minor) || minor < 0) throw new Error('Invalid monetary amount');
  return new Intl.NumberFormat('ka-GE', { style: 'currency', currency: 'GEL', minimumFractionDigits: minor % 100 ? 2 : 0, maximumFractionDigits: 2 }).format(minor / 100);
}
export function calculateTotal(items: {price_minor: number; quantity: number}[], deliveryMinor: number) {
  if (!Number.isSafeInteger(deliveryMinor) || deliveryMinor < 0) throw new Error('Invalid delivery amount');
  let total = deliveryMinor;
  for (const item of items) {
    if (!Number.isSafeInteger(item.price_minor) || item.price_minor < 0 || !Number.isInteger(item.quantity) || item.quantity < 1 || item.quantity > 99) throw new Error('Invalid line item');
    total += item.price_minor * item.quantity;
  }
  if (!Number.isSafeInteger(total)) throw new Error('Total exceeds supported range');
  return total;
}
