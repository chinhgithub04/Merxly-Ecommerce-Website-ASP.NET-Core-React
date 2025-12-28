import type { Response } from '../types/api/common';
import type {
  CustomerAddressDto,
  CreateCustomerAddressDto,
  UpdateCustomerAddressDto,
  CityDto,
  WardDto,
} from '../types/models/address';
import apiClient from './apiClient';
import axios from 'axios';

const PROVINCE_API_BASE = 'https://provinces.open-api.vn/api/v2';

// Customer Address APIs
export const getCustomerAddresses = async (): Promise<
  Response<CustomerAddressDto[]>
> => {
  const response = await apiClient.get<Response<CustomerAddressDto[]>>(
    '/customer/addresses'
  );
  return response.data;
};

export const getCustomerAddressById = async (
  addressId: string
): Promise<Response<CustomerAddressDto>> => {
  const response = await apiClient.get<Response<CustomerAddressDto>>(
    `/customer/addresses/${addressId}`
  );
  return response.data;
};

export const createCustomerAddress = async (
  dto: CreateCustomerAddressDto
): Promise<Response<CustomerAddressDto>> => {
  const response = await apiClient.post<Response<CustomerAddressDto>>(
    '/customer/addresses',
    dto
  );
  return response.data;
};

export const updateCustomerAddress = async (
  addressId: string,
  dto: UpdateCustomerAddressDto
): Promise<Response<CustomerAddressDto>> => {
  const response = await apiClient.patch<Response<CustomerAddressDto>>(
    `/customer/addresses/${addressId}`,
    dto
  );
  return response.data;
};

export const deleteCustomerAddress = async (
  addressId: string
): Promise<Response<void>> => {
  const response = await apiClient.delete<Response<void>>(
    `/customer/addresses/${addressId}`
  );
  return response.data;
};

// Province/City APIs
export const getAllCities = async (): Promise<CityDto[]> => {
  const response = await axios.get<CityDto[]>(`${PROVINCE_API_BASE}/p/`);
  return response.data;
};

export const getCityByCode = async (code: number): Promise<CityDto> => {
  const response = await axios.get<CityDto>(`${PROVINCE_API_BASE}/p/${code}`);
  return response.data;
};

export const searchCities = async (search: string): Promise<CityDto[]> => {
  if (!search.trim()) {
    return getAllCities();
  }
  const response = await axios.get<CityDto[]>(
    `${PROVINCE_API_BASE}/p/?search=${search}`
  );
  return response.data;
};

// Ward APIs
export const getWardsByCity = async (cityCode: number): Promise<WardDto[]> => {
  const response = await axios.get<WardDto[]>(
    `${PROVINCE_API_BASE}/w/?province=${cityCode}`
  );
  return response.data;
};

export const getWardByCode = async (code: number): Promise<WardDto> => {
  const response = await axios.get<WardDto>(`${PROVINCE_API_BASE}/w/${code}`);
  return response.data;
};

export const searchWards = async (
  search: string,
  cityCode?: number
): Promise<WardDto[]> => {
  let url = `${PROVINCE_API_BASE}/w/?search=${search}`;
  if (cityCode) {
    url += `&province=${cityCode}`;
  }
  const response = await axios.get<WardDto[]>(url);
  return response.data;
};
