import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getCustomerOrders,
  getCustomerOrderById,
  updateCustomerSubOrderStatus,
} from '../services/customerOrderService';
import type {
  CustomerSubOrderFilterDto,
  UpdateCustomerSubOrderStatusDto,
} from '../types/models/customerOrder';

export const useCustomerOrders = (filter: CustomerSubOrderFilterDto) => {
  return useQuery({
    queryKey: ['customerOrders', filter],
    queryFn: () => getCustomerOrders(filter),
    staleTime: 30000, // 30 seconds
  });
};

export const useCustomerOrderDetail = (subOrderId: string) => {
  return useQuery({
    queryKey: ['customerOrder', subOrderId],
    queryFn: () => getCustomerOrderById(subOrderId),
    enabled: !!subOrderId,
    staleTime: 30000,
  });
};

export const useUpdateCustomerSubOrderStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      subOrderId,
      dto,
    }: {
      subOrderId: string;
      dto: UpdateCustomerSubOrderStatusDto;
    }) => updateCustomerSubOrderStatus(subOrderId, dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customerOrders'] });
      queryClient.invalidateQueries({ queryKey: ['customerOrder'] });
    },
  });
};
