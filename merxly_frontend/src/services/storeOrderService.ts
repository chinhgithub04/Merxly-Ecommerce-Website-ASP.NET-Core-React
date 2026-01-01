import apiClient from './apiClient';
import type { Response, PagedResponse } from '../types/api/common';
import type {
  StoreSubOrderDto,
  StoreSubOrderFilterDto,
} from '../types/models/storeOrder';

export const getStoreOrders = async (
  filter: StoreSubOrderFilterDto
): Promise<PagedResponse<StoreSubOrderDto>> => {
  const params = new URLSearchParams();

  if (filter.pageNumber)
    params.append('pageNumber', filter.pageNumber.toString());
  if (filter.pageSize) params.append('pageSize', filter.pageSize.toString());
  if (filter.status !== undefined)
    params.append('status', filter.status.toString());
  if (filter.searchTerm) params.append('searchTerm', filter.searchTerm);
  if (filter.fromDate) params.append('fromDate', filter.fromDate);
  if (filter.toDate) params.append('toDate', filter.toDate);

  const response = await apiClient.get<
    Response<PagedResponse<StoreSubOrderDto>>
  >(`/store/orders?${params.toString()}`);

  if (!response.data.data) {
    throw new Error(response.data.message || 'Failed to fetch store orders');
  }

  return response.data.data;
};
