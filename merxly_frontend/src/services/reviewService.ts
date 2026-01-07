import apiClient from './apiClient';
import type { Response } from '../types/api/common';
import type {
  CreateReviewDto,
  ReviewDto,
  SubOrderReviewStatusDto,
} from '../types/models/review';

/**
 * Get review status for a SubOrder including all OrderItems and their reviews
 * @param subOrderId - The SubOrder ID
 * @returns SubOrderReviewStatusDto with review status and all order items
 */
export const getSubOrderReviewStatus = async (
  subOrderId: string
): Promise<Response<SubOrderReviewStatusDto>> => {
  const response = await apiClient.get<Response<SubOrderReviewStatusDto>>(
    `/Reviews/sub-order/${subOrderId}/status`
  );
  return response.data;
};

/**
 * Create a review for an order item
 * @param dto - CreateReviewDto with rating, comment, and optional media
 * @returns Created ReviewDto
 */
export const createReview = async (
  dto: CreateReviewDto
): Promise<Response<ReviewDto>> => {
  const response = await apiClient.post<Response<ReviewDto>>('/Reviews', dto);
  return response.data;
};
