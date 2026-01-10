import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import * as storeService from '../services/storeService';
import type { ApproveStoreDto, RejectStoreDto } from '../types/models/store';

export const useAdminStores = () => {
  return useQuery({
    queryKey: ['adminStores'],
    queryFn: storeService.getAllStores,
  });
};

export const useAdminStoreDetail = (storeId: string | null) => {
  return useQuery({
    queryKey: ['adminStoreDetail', storeId],
    queryFn: () => storeService.getAdminStoreDetail(storeId!),
    enabled: !!storeId,
  });
};

export const useApproveStore = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ storeId, dto }: { storeId: string; dto: ApproveStoreDto }) =>
      storeService.approveStore(storeId, dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminStores'] });
      alert('Store approved successfully');
    },
    onError: (error: any) => {
      const message =
        error.response?.data?.message || 'Failed to approve store';
      alert(message);
    },
  });
};

export const useRejectStore = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ storeId, dto }: { storeId: string; dto: RejectStoreDto }) =>
      storeService.rejectStore(storeId, dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminStores'] });
      alert('Store rejected successfully');
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Failed to reject store';
      alert(message);
    },
  });
};
