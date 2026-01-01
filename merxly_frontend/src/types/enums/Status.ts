export const OrderStatus = {
  Pending: 0,
  Confirmed: 1,
  Processing: 2,
  Delivering: 3,
  Shipped: 4,
  Completed: 5,
  Cancelled: 6,
  Refunded: 7,
  Failed: 8,
} as const;

export type OrderStatus = (typeof OrderStatus)[keyof typeof OrderStatus];

export const PaymentStatus = {
  Pending: 0,
  Processing: 1,
  Succeeded: 2,
  Failed: 3,
  Cancelled: 4,
  Refunded: 5,
  PartiallyRefunded: 6,
} as const;

export type PaymentStatus = (typeof PaymentStatus)[keyof typeof PaymentStatus];
