import { useState } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { ReviewItemForm } from './ReviewItemForm';
import { ReviewItemReadOnly } from './ReviewItemReadOnly';
import { useCreateReview } from '../../../hooks/useReviews';
import type {
  SubOrderReviewStatusDto,
  CreateReviewMediaDto,
} from '../../../types/models/review';

interface ReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  reviewStatus: SubOrderReviewStatusDto;
}

export const ReviewModal = ({
  isOpen,
  onClose,
  reviewStatus,
}: ReviewModalProps) => {
  const { mutate: createReview, isPending: isSubmitting } = useCreateReview();
  const [submittedItems, setSubmittedItems] = useState<Set<string>>(new Set());

  const handleReviewSubmit = (
    orderItemId: string,
    data: {
      rating: number;
      comment: string;
      medias: CreateReviewMediaDto[];
    }
  ) => {
    createReview(
      {
        orderItemId,
        rating: data.rating,
        comment: data.comment || undefined,
        medias: data.medias.length > 0 ? data.medias : undefined,
      },
      {
        onSuccess: () => {
          setSubmittedItems((prev) => new Set(prev).add(orderItemId));
          alert('Review submitted successfully!');
        },
        onError: (error: Error) => {
          alert(error.message || 'Failed to submit review');
        },
      }
    );
  };

  if (!isOpen) return null;

  const unreviewedItems = reviewStatus.orderItems.filter(
    (item) => !item.hasBeenReviewed && !submittedItems.has(item.orderItemId)
  );
  const reviewedItems = reviewStatus.orderItems.filter(
    (item) => item.hasBeenReviewed || submittedItems.has(item.orderItemId)
  );

  const allItemsReviewed = unreviewedItems.length === 0;

  return (
    <div className='fixed inset-0 z-50 overflow-y-auto'>
      {/* Overlay */}
      <div
        className='fixed inset-0 bg-black/50 transition-opacity'
        onClick={onClose}
      />

      {/* Modal Container */}
      <div className='relative min-h-full flex items-center justify-center p-4'>
        <div
          className='bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] flex flex-col pointer-events-auto'
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className='flex items-center justify-between px-6 py-4 border-b border-neutral-200'>
            <div>
              <h2 className='text-lg font-semibold text-neutral-900'>
                {reviewStatus.canLeaveReview
                  ? 'Leave a Rating'
                  : 'Your Reviews'}
              </h2>
            </div>
            <button
              type='button'
              onClick={onClose}
              className='cursor-pointer p-1.5 text-neutral-400 hover:text-neutral-600 hover:bg-neutral-100 rounded-md transition-colors'
            >
              <XMarkIcon className='w-5 h-5' />
            </button>
          </div>

          {/* Body */}
          <div className='flex-1 overflow-y-auto px-6 py-4 space-y-6'>
            {/* Unreviewed Items */}
            {unreviewedItems.length > 0 && (
              <div className='space-y-4'>
                <h3 className='font-medium text-neutral-900'>
                  Rate Your Items ({unreviewedItems.length})
                </h3>
                {unreviewedItems.map((item) => (
                  <ReviewItemForm
                    key={item.orderItemId}
                    orderItem={item}
                    onSubmit={(data) =>
                      handleReviewSubmit(item.orderItemId, data)
                    }
                    isSubmitting={isSubmitting}
                  />
                ))}
              </div>
            )}

            {/* Reviewed Items */}
            {reviewedItems.length > 0 && (
              <div className='space-y-4'>
                <h3 className='font-medium text-neutral-900'>
                  {unreviewedItems.length > 0
                    ? 'Already Reviewed'
                    : `Your Reviews (${reviewedItems.length})`}
                </h3>
                {reviewedItems.map((item) => (
                  <ReviewItemReadOnly key={item.orderItemId} orderItem={item} />
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          {allItemsReviewed && (
            <div className='flex items-center justify-end gap-3 px-6 py-4 border-t border-neutral-200'>
              <button
                type='button'
                onClick={onClose}
                className='cursor-pointer px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium'
              >
                Close
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
