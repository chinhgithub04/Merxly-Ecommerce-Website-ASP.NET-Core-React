import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getStorePaymentAccount,
  createConnectAccount,
  createAccountLink,
  getConnectAccountStatus,
  refreshConnectAccountStatus,
  disconnectConnectAccount,
} from '../services/storePaymentService';
import type {
  CreateConnectAccountDto,
  CreateAccountLinkRequestDto,
} from '../types/models/storePayment';

export const useStoreStripeConnect = () => {
  const queryClient = useQueryClient();

  const {
    data: accountData,
    isLoading: isLoadingAccount,
    error: accountError,
  } = useQuery({
    queryKey: ['storePaymentAccount'],
    queryFn: getStorePaymentAccount,
  });

  const {
    data: statusData,
    isLoading: isLoadingStatus,
    error: statusError,
  } = useQuery({
    queryKey: ['connectAccountStatus'],
    queryFn: getConnectAccountStatus,
    enabled: !!accountData?.data?.stripeConnectAccountId,
  });

  const createAccountMutation = useMutation({
    mutationFn: createConnectAccount,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['storePaymentAccount'] });
    },
  });

  const createLinkMutation = useMutation({
    mutationFn: createAccountLink,
  });

  const refreshStatusMutation = useMutation({
    mutationFn: refreshConnectAccountStatus,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['connectAccountStatus'] });
      queryClient.invalidateQueries({ queryKey: ['storePaymentAccount'] });
    },
  });

  const disconnectMutation = useMutation({
    mutationFn: disconnectConnectAccount,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['storePaymentAccount'] });
      queryClient.invalidateQueries({ queryKey: ['connectAccountStatus'] });
    },
  });

  const connectStripe = async (dto: CreateConnectAccountDto) => {
    // Step 1: Create Connect account
    const accountResult = await createAccountMutation.mutateAsync(dto);

    // Step 2: Get onboarding link
    const currentUrl = window.location.origin;
    const linkDto: CreateAccountLinkRequestDto = {
      returnUrl: `${currentUrl}/store/payments?onboarding=success`,
      refreshUrl: `${currentUrl}/store/payments?onboarding=refresh`,
      type: 'account_onboarding',
    };

    const linkResult = await createLinkMutation.mutateAsync(linkDto);

    return {
      account: accountResult.data,
      onboardingUrl: linkResult.data?.accountLinkUrl,
    };
  };

  const continueOnboarding = async () => {
    const currentUrl = window.location.origin;
    const linkDto: CreateAccountLinkRequestDto = {
      returnUrl: `${currentUrl}/store/payments?onboarding=success`,
      refreshUrl: `${currentUrl}/store/payments?onboarding=refresh`,
      type: 'account_onboarding',
    };

    const linkResult = await createLinkMutation.mutateAsync(linkDto);
    return linkResult.data?.accountLinkUrl;
  };

  const refreshStatus = () => refreshStatusMutation.mutateAsync();

  const disconnect = () => disconnectMutation.mutateAsync();

  return {
    account: accountData?.data || null,
    accountStatus: statusData?.data || null,

    isLoading: isLoadingAccount || isLoadingStatus,
    isLoadingAccount,
    isLoadingStatus,

    error: accountError || statusError,
    accountError,
    statusError,

    connectStripe,
    continueOnboarding,
    refreshStatus,
    disconnect,

    isConnecting:
      createAccountMutation.isPending || createLinkMutation.isPending,
    isContinuingOnboarding: createLinkMutation.isPending,
    isRefreshing: refreshStatusMutation.isPending,
    isDisconnecting: disconnectMutation.isPending,
  };
};
