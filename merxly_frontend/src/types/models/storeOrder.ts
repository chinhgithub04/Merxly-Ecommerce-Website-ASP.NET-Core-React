import type { PaginationQuery } from '../api/common';
import type { OrderStatus } from '../enums/Status';

export interface StoreSubOrderDto {
  id: string;
  orderNumber: string;
  customerFullName: string;
  customerEmail: string;
  status: OrderStatus;
  totalItems: number;
  totalAmount: number;
  createdAt: string;
  updatedAt?: string;
}

export interface StoreSubOrderFilterDto extends PaginationQuery {
  status?: OrderStatus;
  searchTerm?: string;
  fromDate?: string;
  toDate?: string;
}
