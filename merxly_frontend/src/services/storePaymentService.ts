import type { Response } from '../types/api/common';
import type {
  StorePaymentAccountDto,
  CreateConnectAccountDto,
  ConnectAccountLinkDto,
  CreateAccountLinkRequestDto,
  ConnectAccountStatusDto,
} from '../types/models/storePayment';
import apiClient from './apiClient';

/**
 * Get the store's payment account information
 */
export const getStorePaymentAccount = async (): Promise<
  Response<StorePaymentAccountDto>
> => {
  const response = await apiClient.get<Response<StorePaymentAccountDto>>(
    '/store/payment/account'
  );
  return response.data;
};

/**
 * Create a Stripe Connect account for the store
 */
export const createConnectAccount = async (
  dto: CreateConnectAccountDto
): Promise<Response<StorePaymentAccountDto>> => {
  const response = await apiClient.post<Response<StorePaymentAccountDto>>(
    '/store/payment/account',
    dto
  );
  return response.data;
};

/**
 * Create an account link for Stripe Connect onboarding or updates
 */
export const createAccountLink = async (
  dto: CreateAccountLinkRequestDto
): Promise<Response<ConnectAccountLinkDto>> => {
  const response = await apiClient.post<Response<ConnectAccountLinkDto>>(
    '/store/payment/account/link',
    dto
  );
  return response.data;
};

/**
 * Get the current status of the store's Stripe Connect account
 */
export const getConnectAccountStatus = async (): Promise<
  Response<ConnectAccountStatusDto>
> => {
  const response = await apiClient.get<Response<ConnectAccountStatusDto>>(
    '/store/payment/account/status'
  );
  return response.data;
};

/**
 * Refresh the store's Stripe Connect account status from Stripe
 */
export const refreshConnectAccountStatus = async (): Promise<
  Response<ConnectAccountStatusDto>
> => {
  const response = await apiClient.post<Response<ConnectAccountStatusDto>>(
    '/store/payment/account/status/refresh'
  );
  return response.data;
};

/**
 * Disconnect (delete) the store's Stripe Connect account
 */
export const disconnectConnectAccount = async (): Promise<void> => {
  await apiClient.delete('/store/payment/account');
};
