import type { Response } from '../types/api/common';
import type {
  StoreAddressDto,
  CreateStoreAddressDto,
  UpdateStoreAddressDto,
} from '../types/models/storeAddress';
import apiClient from './apiClient';

// Store Address APIs
export const getStoreAddress = async (): Promise<Response<StoreAddressDto>> => {
  const response = await apiClient.get<Response<StoreAddressDto>>(
    '/store/address'
  );
  return response.data;
};

export const createStoreAddress = async (
  dto: CreateStoreAddressDto
): Promise<Response<StoreAddressDto>> => {
  const response = await apiClient.post<Response<StoreAddressDto>>(
    '/store/address',
    dto
  );
  return response.data;
};

export const updateStoreAddress = async (
  dto: UpdateStoreAddressDto
): Promise<Response<StoreAddressDto>> => {
  const response = await apiClient.patch<Response<StoreAddressDto>>(
    '/store/address',
    dto
  );
  return response.data;
};
