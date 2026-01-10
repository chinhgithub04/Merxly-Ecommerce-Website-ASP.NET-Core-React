import type { Response } from '../types/api/common';
import type {
  CreateStoreDto,
  DetailStoreDto,
  UpdateStoreDto,
  StoreListItemDto,
  AdminStoreDetailDto,
  ApproveStoreDto,
  RejectStoreDto,
} from '../types/models/store';
import apiClient from './apiClient';

export const createStore = async (
  dto: CreateStoreDto
): Promise<Response<DetailStoreDto>> => {
  const response = await apiClient.post<Response<DetailStoreDto>>(
    '/stores',
    dto
  );
  return response.data;
};

export const getMyStore = async (): Promise<Response<DetailStoreDto>> => {
  const response = await apiClient.get<Response<DetailStoreDto>>(
    '/stores/my-store'
  );
  return response.data;
};

export const updateMyStore = async (
  dto: UpdateStoreDto
): Promise<Response<DetailStoreDto>> => {
  const response = await apiClient.patch<Response<DetailStoreDto>>(
    '/stores/my-store',
    dto
  );
  return response.data;
};

// Admin Store Management
export const getAllStores = async (): Promise<Response<StoreListItemDto[]>> => {
  const response = await apiClient.get<Response<StoreListItemDto[]>>(
    '/stores/admin/all'
  );
  return response.data;
};

export const getAdminStoreDetail = async (
  storeId: string
): Promise<Response<AdminStoreDetailDto>> => {
  const response = await apiClient.get<Response<AdminStoreDetailDto>>(
    `/stores/admin/${storeId}`
  );
  return response.data;
};

export const approveStore = async (
  storeId: string,
  dto: ApproveStoreDto
): Promise<Response<AdminStoreDetailDto>> => {
  const response = await apiClient.post<Response<AdminStoreDetailDto>>(
    `/stores/admin/${storeId}/approve`,
    dto
  );
  return response.data;
};

export const rejectStore = async (
  storeId: string,
  dto: RejectStoreDto
): Promise<Response<AdminStoreDetailDto>> => {
  const response = await apiClient.post<Response<AdminStoreDetailDto>>(
    `/stores/admin/${storeId}/reject`,
    dto
  );
  return response.data;
};
