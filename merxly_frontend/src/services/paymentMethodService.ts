import type { Response } from '../types/api/common';
import type {
  AddPaymentMethodDto,
  PaymentMethodDto,
} from '../types/models/paymentMethod';
import apiClient from './apiClient';

export const getPaymentMethods = async (): Promise<
  Response<PaymentMethodDto[]>
> => {
  const response = await apiClient.get<Response<PaymentMethodDto[]>>(
    '/payment-methods'
  );
  return response.data;
};
export const createSetupIntent = async (): Promise<Response<string>> => {
  const response = await apiClient.post<Response<string>>(
    '/payment-methods/setup-intent'
  );
  return response.data;
};
export const addPaymentMethod = async (
  dto: AddPaymentMethodDto
): Promise<Response<PaymentMethodDto>> => {
  const response = await apiClient.post<Response<PaymentMethodDto>>(
    '/payment-methods',
    dto
  );
  return response.data;
};

export const setDefaultPaymentMethod = async (
  paymentMethodId: string
): Promise<Response<void>> => {
  const response = await apiClient.patch<Response<void>>(
    `/payment-methods/${paymentMethodId}/set-default`
  );
  return response.data;
};

export const removePaymentMethod = async (
  paymentMethodId: string
): Promise<Response<void>> => {
  const response = await apiClient.delete<Response<void>>(
    `/payment-methods/${paymentMethodId}`
  );
  return response.data;
};
