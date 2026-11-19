import type { FulfillmentStatus, PaymentStatus } from './types';

export const paymentLabels: Record<PaymentStatus, string> = {
  pending: 'გადახდის მოლოდინში',
  processing: 'მოწმდება',
  paid: 'გადახდილია',
  failed: 'გადახდა ვერ შესრულდა',
  cancelled: 'გაუქმებულია',
  refunded: 'თანხა დაბრუნებულია',
};

export const deliveryLabels: Record<FulfillmentStatus, string> = {
  pending: 'მოლოდინში',
  confirmed: 'დადასტურებულია',
  preparing: 'მზადდება',
  shipped: 'გაგზავნილია',
  delivered: 'მიწოდებულია',
  cancelled: 'გაუქმებულია',
};
