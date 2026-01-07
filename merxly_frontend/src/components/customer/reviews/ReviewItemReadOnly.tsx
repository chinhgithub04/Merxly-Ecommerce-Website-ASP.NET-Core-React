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
    const dateStr = date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
    const timeStr = date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
    return `${dateStr} at ${timeStr}`;
  };

  return (
    <div className='border border-neutral-200 rounded-lg p-4 space-y-4 bg-neutral-50'>
      {/* Product Info */}
      <div className='flex items-start gap-4'>
        {orderItem.mainMediaPublicId && (
          <img
            src={getProductImageUrl(orderItem.mainMediaPublicId, 'thumbnail')}
            alt={orderItem.productVariantName}
            className='w-16 h-16 rounded-lg object-cover'
          />
        )}
        <div className='flex-1'>
          <h3 className='font-medium text-neutral-900'>
            {orderItem.productVariantName}
          </h3>
          <div className='mt-1 flex items-center gap-2'>
            <RatingInput value={review.rating} onChange={() => {}} readOnly />
            <span className='text-sm text-neutral-500'>
              {formatDate(review.createdAt)}
            </span>
          </div>
        </div>
      </div>

      {/* Comment */}
      {review.comment && (
        <div className='space-y-1'>
          <p className='text-sm text-neutral-700'>{review.comment}</p>
        </div>
      )}

      {/* Media */}
      {review.medias && review.medias.length > 0 && (
        <div className='grid grid-cols-4 gap-2'>
          {review.medias.map((media) => (
            <div
              key={media.id}
              className='aspect-square rounded-lg overflow-hidden bg-neutral-100 border border-neutral-200'
            >
              <img
                src={getMediaUrl(
                  media.mediaPublicId,
                  media.mediaType,
                  'thumbnail'
                )}
                alt='Review media'
                className='w-full h-full object-cover'
              />
            </div>
          ))}
        </div>
      )}

      {/* Seller Reply */}
      {review.sellerReply && (
        <div className='bg-white border border-neutral-200 rounded-lg p-3 space-y-1'>
          <div className='text-xs font-medium text-neutral-500'>
            Store Response
          </div>
          <p className='text-sm text-neutral-700'>{review.sellerReply}</p>
        </div>
      )}
    </div>
  );
};
