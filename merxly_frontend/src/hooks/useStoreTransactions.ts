import { useQuery } from '@tanstack/react-query';
import {
  getStoreTransactions,
  getStoreTransactionById,
} from '../services/storeTransactionService';
import type { StoreTransferFilterDto } from '../types/models/storeTransaction';

export const useStoreTransactions = (filters?: StoreTransferFilterDto) => {
  return useQuery({
    queryKey: ['store-transactions', filters],
    queryFn: () => getStoreTransactions(filters),
  });
};

export const useStoreTransaction = (transferId: string) => {
  return useQuery({
    queryKey: ['store-transaction', transferId],
    queryFn: () => getStoreTransactionById(transferId),
    enabled: !!transferId,
  });
};
