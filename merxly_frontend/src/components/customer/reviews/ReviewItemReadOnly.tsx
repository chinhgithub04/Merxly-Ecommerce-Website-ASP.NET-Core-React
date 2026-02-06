import { RatingInput } from './RatingInput';
import {
  getProductImageUrl,
  getMediaUrl,
} from '../../../utils/cloudinaryHelpers';
import type { OrderItemReviewStatusDto } from '../../../types/models/review';

interface ReviewItemReadOnlyProps {
  orderItem: OrderItemReviewStatusDto;
}

export const ReviewItemReadOnly = ({ orderItem }: ReviewItemReadOnlyProps) => {
  if (!orderItem.existingReview) return null;

  const review = orderItem.existingReview;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const dateStr = date.toLocaleDateString('vi-VN', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
    const timeStr = date.toLocaleTimeString('vi-VN', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
    return `${dateStr} at ${timeStr}`;
  };

  return (
    <div className='border border-neutral-200 rounded-lg p-3 md:p-4 space-y-3 md:space-y-4 bg-neutral-50'>
      {/* Product Info */}
      <div className='flex items-start gap-3 md:gap-4'>
        {orderItem.mainMediaPublicId && (
          <img
            src={getProductImageUrl(orderItem.mainMediaPublicId, 'card')}
            alt={orderItem.productVariantName}
            className='w-14 h-14 md:w-16 md:h-16 rounded-lg object-contain shrink-0'
          />
        )}
        <div className='flex-1 min-w-0'>
          <h3 className='font-medium text-neutral-900 text-sm md:text-base wrap-break-word'>
            {orderItem.productVariantName}
          </h3>
          <div className='mt-1 flex flex-col md:flex-row md:items-center gap-1 md:gap-2'>
            <RatingInput
              value={review.rating}
              onChange={() => {}}
              readOnly
              size='sm'
            />
            <span className='text-xs md:text-sm text-neutral-500 md:whitespace-nowrap'>
              {formatDate(review.createdAt)}
            </span>
          </div>
        </div>
      </div>

      {/* Comment */}
      {review.comment && (
        <div className='space-y-1'>
          <p className='text-xs md:text-sm text-neutral-700 wrap-break-word'>
            {review.comment}
          </p>
        </div>
      )}

      {/* Media */}
      {review.medias && review.medias.length > 0 && (
        <div className='grid grid-cols-3 sm:grid-cols-4 gap-2'>
          {review.medias.map((media) => (
            <div
              key={media.id}
              className='aspect-square rounded-lg overflow-hidden bg-neutral-100 border border-neutral-200'
            >
              <img
                src={getMediaUrl(media.mediaPublicId, media.mediaType, 'card')}
                alt='Review media'
                className='w-full h-full object-cover'
              />
            </div>
          ))}
        </div>
      )}

      {/* Seller Reply */}
      {review.sellerReply && (
        <div className='bg-white border border-neutral-200 rounded-lg p-3 md:p-4 space-y-1'>
          <div className='text-xs font-medium text-neutral-500'>
            Store Response
          </div>
          <p className='text-xs md:text-sm text-neutral-700'>
            {review.sellerReply}
          </p>
        </div>
      )}
    </div>
  );
};
