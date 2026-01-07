import { useState } from 'react';
import { RatingInput } from './RatingInput';
import { MediaUpload } from './MediaUpload';
import { getProductImageUrl } from '../../../utils/cloudinaryHelpers';
import type {
  CreateReviewMediaDto,
  OrderItemReviewStatusDto,
} from '../../../types/models/review';

interface ReviewItemFormProps {
  orderItem: OrderItemReviewStatusDto;
  onSubmit: (data: {
    rating: number;
    comment: string;
    medias: CreateReviewMediaDto[];
  }) => void;
  isSubmitting: boolean;
}

export const ReviewItemForm = ({
  orderItem,
  onSubmit,
  isSubmitting,
}: ReviewItemFormProps) => {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [medias, setMedias] = useState<CreateReviewMediaDto[]>([]);

  const handleSubmit = () => {
    if (rating === 0) {
      alert('Please select a rating');
      return;
    }
    onSubmit({ rating, comment, medias });
  };

  return (
    <div className='border border-neutral-200 rounded-lg p-4 space-y-4'>
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
        </div>
      </div>

      {/* Rating */}
      <div className='space-y-2'>
        <label className='block text-sm font-medium text-neutral-700'>
          Rating <span className='text-red-500'>*</span>
        </label>
        <RatingInput value={rating} onChange={setRating} size='lg' />
      </div>

      {/* Comment */}
      <div className='space-y-2'>
        <label className='block text-sm font-medium text-neutral-700'>
          Your Review (Optional)
        </label>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder='Share your experience with this product...'
          maxLength={1000}
          rows={4}
          className='w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none'
        />
        <div className='text-xs text-neutral-500 text-right'>
          {comment.length} / 1000
        </div>
      </div>

      {/* Media Upload */}
      <div className='space-y-2'>
        <label className='block text-sm font-medium text-neutral-700'>
          Photos/Videos (Optional)
        </label>
        <MediaUpload medias={medias} onMediasChange={setMedias} />
      </div>

      {/* Submit Button */}
      <button
        type='button'
        onClick={handleSubmit}
        disabled={isSubmitting || rating === 0}
        className='cursor-pointer w-full py-2 px-4 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium'
      >
        {isSubmitting ? 'Submitting...' : 'Submit Review'}
      </button>
    </div>
  );
};
