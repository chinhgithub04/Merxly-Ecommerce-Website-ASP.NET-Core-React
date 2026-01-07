import { MediaType } from '../enums/MediaType';

export interface CreateReviewMediaDto {
  mediaPublicId: string;
  displayOrder: number;
  mediaType: MediaType;
}

export interface CreateReviewDto {
  orderItemId: string;
  rating: number; // 1-5
  comment?: string;
  medias?: CreateReviewMediaDto[];
}

export interface ReviewMediaDto {
  id: string;
  mediaPublicId: string;
  displayOrder: number;
  mediaType: MediaType;
}

export interface ReviewDto {
  id: string;
  rating: number;
  comment?: string;
  sellerReply?: string;
  createdAt: string;
  sellerRepliedAt?: string;
  userId: string;
  userName: string;
  userAvatarPublicId?: string;
  productId: string;
  productVariantSelected: string; // e.g., "Size: M, Color: Red"
  medias: ReviewMediaDto[];
}

export interface OrderItemReviewStatusDto {
  orderItemId: string;
  productId: string;
  productVariantId: string;
  productVariantName: string;
  mainMediaPublicId?: string;
  hasBeenReviewed: boolean;
  existingReview?: ReviewDto;
}

export interface SubOrderReviewStatusDto {
  subOrderId: string;
  subOrderNumber: string;
  completedAt: string;
  isWithinReviewWindow: boolean;
  daysRemainingToReview: number;
  canLeaveReview: boolean; // True if at least one item can be reviewed
  orderItems: OrderItemReviewStatusDto[];
}

// Query parameters for filtering reviews
export interface ReviewQueryParameters {
  productId?: string;
  storeId?: string;
  rating?: number; // 1-5
  hasMedia?: boolean;
  sortOrder?: 'Ascending' | 'Descending';
  pageNumber?: number;
  pageSize?: number;
}

// Paginated result for reviews
export interface PaginatedReviewsDto {
  items: ReviewDto[];
  totalCount: number;
  pageSize: number;
  pageNumber: number;
  totalPages: number;
}
