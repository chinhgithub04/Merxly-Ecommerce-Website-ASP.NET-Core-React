import { RatingInput } from '../reviews/RatingInput';
import {
  getMediaUrl,
  getProductImageUrl,
} from '../../../utils/cloudinaryHelpers';
import type { ReviewDto } from '../../../types/models/review';

interface ProductReviewItemProps {
  review: ReviewDto;
}

export const ProductReviewItem = ({ review }: ProductReviewItemProps) => {
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
    <div className='border-b border-neutral-200 py-4 md:py-6 last:border-b-0'>
      {/* Header - User & Rating */}
      <div className='flex flex-col md:flex-row md:items-start md:justify-between mb-3 gap-2'>
        <div className='flex items-center gap-3'>
          {review.userAvatarPublicId ? (
            <img
              src={getProductImageUrl(review.userAvatarPublicId, 'thumbnail')}
              alt={review.userName || 'User'}
              className='w-8 h-8 md:w-10 md:h-10 rounded-full object-cover'
            />
          ) : (
            <div className='w-8 h-8 md:w-10 md:h-10 bg-primary-100 rounded-full flex items-center justify-center text-primary-600 font-semibold text-sm'>
              {review.userName?.charAt(0).toUpperCase() || 'U'}
            </div>
          )}
          <div>
            <p className='text-sm md:text-base font-medium text-neutral-900'>
              {review.userName || 'Anonymous'}
            </p>
            <p className='text-xs md:text-sm text-neutral-500'>
              {formatDate(review.createdAt)}
            </p>
          </div>
        </div>
        <RatingInput
          value={review.rating}
          onChange={() => {}}
          readOnly
          size='sm'
        />
      </div>

      {/* Variant Info */}
      {review.productVariantSelected && (
        <div className='mb-3'>
          <span className='text-sm text-orange-600'>
            <span className='font-medium'>{review.productVariantSelected}</span>
          </span>
        </div>
      )}

      {/* Comment */}
      {review.comment && (
        <p className='text-sm md:text-base text-neutral-900 mb-3'>
          {review.comment}
        </p>
      )}

      {/* Media */}
      {review.medias && review.medias.length > 0 && (
        <div className='flex gap-2 mb-3 flex-wrap'>
          {review.medias.map((media) => (
            <div
              key={media.id}
              className='w-20 h-20 md:w-24 md:h-24 rounded-lg overflow-hidden bg-neutral-100 border border-neutral-200'
            >
              <img
                src={getMediaUrl(media.mediaPublicId, media.mediaType, 'card')}
                alt='Review media'
                className='w-full h-full object-contain'
              />
            </div>
          ))}
        </div>
      )}

      {/* Seller Reply */}
      {review.sellerReply && (
        <div className='bg-neutral-50 border border-neutral-200 rounded-lg p-3 md:p-4 mt-3'>
          <div className='flex items-start gap-2 md:gap-3'>
            <div className='w-6 h-6 md:w-8 md:h-8 bg-primary-600 rounded-full flex items-center justify-center text-white font-semibold text-xs md:text-sm'>
              S
            </div>
            <div className='flex-1'>
              <p className='text-xs md:text-sm font-medium text-neutral-900 mb-1'>
                Store Response
              </p>
              <p className='text-xs md:text-sm text-neutral-700'>
                {review.sellerReply}
              </p>
              {review.sellerRepliedAt && (
                <p className='text-xs text-neutral-500 mt-2'>
                  {formatDate(review.sellerRepliedAt)}
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
