import { StoreTransferStatus } from '../enums';
import type { PaginationQuery } from '../api/common';

export interface StoreTransferDto {
  id: string;
  stripeTransferId: string | null;
  amount: number;
  commission: number;
  status: StoreTransferStatus;
  subOrderNumber: string;
  subOrderId: string;
  createdAt: string;
  transferredAt: string | null;
}

export interface StoreTransferDetailDto {
  id: string;
  stripeTransferId: string | null;
  amount: number;
  commission: number;
  status: StoreTransferStatus;
  failureMessage: string | null;
  createdAt: string;
  updatedAt: string | null;
  transferredAt: string | null;
  subOrderId: string;
  subOrderNumber: string;
  subOrderTotal: number;
  paymentId: string;
  paymentIntentId: string;
  currency: string;
}

export interface StoreTransferFilterDto extends PaginationQuery {
  status?: StoreTransferStatus;
  searchTerm?: string;
  fromDate?: string;
  toDate?: string;
  minAmount?: number;
  maxAmount?: number;
}
