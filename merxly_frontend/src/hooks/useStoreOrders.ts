import { useQuery } from '@tanstack/react-query';
import { getStoreOrders } from '../services/storeOrderService';
import type { StoreSubOrderFilterDto } from '../types/models/storeOrder';

export const useStoreOrders = (filter: StoreSubOrderFilterDto) => {
  return useQuery({
    queryKey: ['storeOrders', filter],
    queryFn: () => getStoreOrders(filter),
    staleTime: 30000, // 30 seconds
  });
};
