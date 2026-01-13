import apiClient from './apiClient';
import type {
  StoreTransferDto,
  StoreTransferDetailDto,
  StoreTransferFilterDto,
} from '../types/models/storeTransaction';
import type { Response, PagedResponse } from '../types/api/common';

export const getStoreTransactions = async (
  filters?: StoreTransferFilterDto
): Promise<Response<PagedResponse<StoreTransferDto>>> => {
  const response = await apiClient.get<
    Response<PagedResponse<StoreTransferDto>>
  >('/store/transactions', { params: filters });
  return response.data;
};

export const getStoreTransactionById = async (
  transferId: string
): Promise<Response<StoreTransferDetailDto>> => {
  const response = await apiClient.get<Response<StoreTransferDetailDto>>(
    `/store/transactions/${transferId}`
  );
  return response.data;
};
