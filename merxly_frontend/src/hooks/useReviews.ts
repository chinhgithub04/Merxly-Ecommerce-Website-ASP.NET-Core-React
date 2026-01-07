import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  createReview,
  getSubOrderReviewStatus,
} from '../services/reviewService';
import type { CreateReviewDto } from '../types/models/review';

/**
 * Hook to get review status for a SubOrder
 * @param subOrderId - The SubOrder ID
 */
export const useSubOrderReviewStatus = (subOrderId: string | undefined) => {
  return useQuery({
    queryKey: ['subOrderReviewStatus', subOrderId],
    queryFn: () => getSubOrderReviewStatus(subOrderId!),
    enabled: !!subOrderId,
  });
};

/**
 * Hook to create a review for an order item
 */
export const useCreateReview = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (dto: CreateReviewDto) => createReview(dto),
    onSuccess: () => {
      // Invalidate the review status query to refresh the UI
      queryClient.invalidateQueries({
        queryKey: ['subOrderReviewStatus'],
      });

      // Also invalidate customer order detail to refresh order items
      queryClient.invalidateQueries({
        queryKey: ['customerOrder'],
      });
    },
  });
};
