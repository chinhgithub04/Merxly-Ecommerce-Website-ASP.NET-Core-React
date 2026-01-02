import type { PaginationQuery } from '../api/common';
import type { OrderStatus } from '../enums/Status';

export interface CustomerSubOrderDto {
  id: string;
  subOrderNumber: string;
  storeName: string;
  storeLogoImagePublicId?: string;
  status: OrderStatus;
  totalItems: number;
  totalAmount: number;
  createdAt: string;
  updatedAt?: string;
}

export interface CustomerSubOrderFilterDto extends PaginationQuery {
  status?: OrderStatus;
  searchTerm?: string;
  fromDate?: string;
  toDate?: string;
}

export interface CustomerSubOrderDetailDto {
  id: string;
  subOrderNumber: string;
  status: OrderStatus;
  subTotal: number;
  tax?: number;
  shippingCost?: number;
  totalAmount: number;
  carrier?: string;
  trackingNumber?: string;
  notes?: string;
  storeId: string;
  storeName: string;
  storeLogoImagePublicId?: string;
  storeBannerImagePublicId?: string;
  storeEmail: string;
  storePhoneNumber: string;
  storeFullAddress: string;
  storePostalCode: string;
  shippingFullAddress: string;
  shippingPostalCode: string;
  shippingPhoneNumber?: string;
  customerFullName: string;
  customerEmail: string;
  createdAt: string;
  updatedAt?: string;
  completedAt?: string;
  orderItems: CustomerOrderItemDto[];
  statusHistory: CustomerOrderStatusHistoryDto[];
}

export interface CustomerOrderItemDto {
  id: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  productVariantId?: string;
  productVariantName: string;
  productVariantSKU?: string;
  productVariantMainPublicId?: string;
  selectedAttributes: Record<string, string>;
}

export interface CustomerOrderStatusHistoryDto {
  id: string;
  status: OrderStatus;
  notes?: string;
  createdAt: string;
  changedBy?: string;
}

export interface UpdateCustomerSubOrderStatusDto {
  status: OrderStatus;
  notes?: string;
}
