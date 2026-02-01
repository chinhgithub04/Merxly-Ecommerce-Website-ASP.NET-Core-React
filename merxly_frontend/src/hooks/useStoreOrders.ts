import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getStoreOrders,
  getStoreOrderById,
  updateSubOrderStatus,
} from '../services/storeOrderService';
import type {
  StoreSubOrderFilterDto,
  UpdateSubOrderStatusDto,
} from '../types/models/storeOrder';

export const useStoreOrders = (filter: StoreSubOrderFilterDto) => {
  return useQuery({
    queryKey: ['storeOrders', filter],
    queryFn: () => getStoreOrders(filter),
    staleTime: 30000, // 30 seconds
  });
};

export const useStoreOrderDetail = (subOrderId: string) => {
  return useQuery({
    queryKey: ['storeOrder', subOrderId],
    queryFn: () => getStoreOrderById(subOrderId),
    enabled: !!subOrderId,
    staleTime: 30000,
  });
};

export const useUpdateSubOrderStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      subOrderId,
      dto,
    }: {
      subOrderId: string;
      dto: UpdateSubOrderStatusDto;
    }) => updateSubOrderStatus(subOrderId, dto),
    onSuccess: (_data, variables) => {
      // Invalidate and refetch
      queryClient.invalidateQueries({
        queryKey: ['storeOrder', variables.subOrderId],
      });
      queryClient.invalidateQueries({ queryKey: ['storeOrders'] });
    },
  });
};
