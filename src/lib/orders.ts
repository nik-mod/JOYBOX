import type { FulfillmentStatus, PaymentStatus } from './types';
const transitions: Record<FulfillmentStatus, FulfillmentStatus[]> = {
  pending:['confirmed','cancelled'],confirmed:['preparing','cancelled'],preparing:['shipped','cancelled'],shipped:['delivered'],delivered:[],cancelled:[],
};
export function canTransition(from: FulfillmentStatus, to: FulfillmentStatus, payment: PaymentStatus) {
  return transitions[from].includes(to) && (to === 'cancelled' || payment === 'paid');
}
