import type { Response } from '../types/api/common';
import type {
  CheckoutRequestDto,
  CheckoutResponseDto,
} from '../types/models/order';
import apiClient from './apiClient';

export const processCheckout = async (
  dto: CheckoutRequestDto
): Promise<Response<CheckoutResponseDto>> => {
  const response = await apiClient.post<Response<CheckoutResponseDto>>(
    '/checkout',
    dto
  );
  return response.data;
};
