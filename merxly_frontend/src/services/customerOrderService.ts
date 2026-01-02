import apiClient from './apiClient';
import type { Response, PagedResponse } from '../types/api/common';
import type {
  CustomerSubOrderDto,
  CustomerSubOrderFilterDto,
  CustomerSubOrderDetailDto,
  UpdateCustomerSubOrderStatusDto,
} from '../types/models/customerOrder';

export const getCustomerOrders = async (
  filter: CustomerSubOrderFilterDto
): Promise<PagedResponse<CustomerSubOrderDto>> => {
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
    Response<PagedResponse<CustomerSubOrderDto>>
  >(`/customer/orders?${params.toString()}`);

  if (!response.data.data) {
    throw new Error(response.data.message || 'Failed to fetch orders');
  }

  return response.data.data;
};

export const getCustomerOrderById = async (
  subOrderId: string
): Promise<CustomerSubOrderDetailDto> => {
  const response = await apiClient.get<Response<CustomerSubOrderDetailDto>>(
    `/customer/orders/${subOrderId}`
  );

  if (!response.data.data) {
    throw new Error(response.data.message || 'Failed to fetch order details');
  }

  return response.data.data;
};

export const updateCustomerSubOrderStatus = async (
  subOrderId: string,
  dto: UpdateCustomerSubOrderStatusDto
): Promise<CustomerSubOrderDetailDto> => {
  const response = await apiClient.patch<Response<CustomerSubOrderDetailDto>>(
    `/customer/orders/${subOrderId}/status`,
    dto
  );

  if (!response.data.data) {
    throw new Error(response.data.message || 'Failed to update order status');
  }

  return response.data.data;
};
