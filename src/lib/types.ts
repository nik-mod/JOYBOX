export type Packaging = 'navy-yellow' | 'pink-berry';
export type Product = {
  id: string; slug: string; name: string; description: string; short_description: string;
  price_minor: number; age_label: string; image_url: string; images: string[];
  categories: string[]; dimensions: string; safety_info: string; stock: number; published: boolean;
  packaging?: Packaging | null;
};
export type DeliveryZone = { id: string; name: string; price_minor: number };
export type StoreSettings = { contact_email: string; contact_phone: string; delivery_zones: DeliveryZone[]; policies: Record<string, string>; checkout_enabled: boolean };
export type PaymentStatus = 'pending' | 'processing' | 'paid' | 'failed' | 'cancelled' | 'refunded';
export type FulfillmentStatus = 'pending' | 'confirmed' | 'preparing' | 'shipped' | 'delivered' | 'cancelled';
export type PublicOrder = { order_number: string; payment_status: PaymentStatus; fulfillment_status: FulfillmentStatus; total_minor: number; items: {name: string; quantity: number; unit_price_minor: number}[]; created_at: string };
