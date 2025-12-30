import type { OrderStatus, PaymentStatus } from '../enums';

// Checkout DTOs
export interface CheckoutItemDto {
  productVariantId: string;
  quantity: number;
}

export interface CheckoutRequestDto {
  items: CheckoutItemDto[];
  shippingAddressId: string;
  paymentMethodId?: string | null;
  storeNotes?: Record<string, string> | null; // key: storeId, value: notes
}

export interface CheckoutResponseDto {
  order: OrderDto;
  clientSecret: string;
}

// Order DTOs
export interface OrderDto {
  id: string;
  orderNumber: string;
  totalAmount: number;
  createdAt: string;
  updatedAt: string | null;
  userId: string;
  shippingAddressId: string;
  shippingAddress: ShippingAddressDto;
  subOrders: SubOrderDto[];
  payment: PaymentDto | null;
}

export interface SubOrderDto {
  id: string;
  subOrderNumber: string;
  status: OrderStatus;
  subTotal: number;
  tax: number | null;
  shippingCost: number | null;
  totalAmount: number;
  carrier: string | null;
  trackingNumber: string | null;
  notes: string | null;
  createdAt: string;
  updatedAt: string | null;
  completedAt: string | null;
  orderId: string;
  storeId: string;
  storeName: string;
  orderItems: OrderItemDto[];
}

export interface OrderItemDto {
  id: string;
  subOrderId: string;
  productVariantId: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  storeId: string;
  productVariantSummary: ProductVariantSummaryDto;
}

export interface ProductVariantSummaryDto {
  productName: string;
  productImagePublicId: string | null;
  selectedAttributes: Record<string, string>;
}

export interface ShippingAddressDto {
  fullName: string;
  addressLine: string;
  cityName: string;
  wardName: string;
  postalCode: string;
  phoneNumber: string | null;
  fullAddress: string;
}

export interface PaymentDto {
  id: string;
  paymentIntentId: string;
  amount: number;
  currency: string;
  totalCommission: number;
  status: PaymentStatus;
  stripeCustomerId: string;
  paymentMethodId: string | null;
  orderId: string;
  createdAt: string;
  updatedAt: string | null;
}
