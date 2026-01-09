import { ArrowLeftIcon, PlusIcon, StarIcon } from '@heroicons/react/24/outline';
import { useNavigate } from 'react-router-dom';

interface CustomerOrderDetailHeaderProps {
  subOrderId?: string;
  onReviewClick?: () => void;
  canLeaveReview?: boolean;
  isWithinReviewWindow?: boolean;
}

export const CustomerOrderDetailHeader = ({
  subOrderId,
  onReviewClick,
  canLeaveReview,
  isWithinReviewWindow,
}: CustomerOrderDetailHeaderProps) => {
  const navigate = useNavigate();

  const showReviewButton = subOrderId && isWithinReviewWindow;

  return (
    <div className='flex bg-white border border-neutral-200 rounded-t-lg px-6 py-3 items-center justify-between gap-4'>
      <div className='flex items-center gap-4'>
        <button
          onClick={() => navigate('/user-account/order-history')}
          className='cursor-pointer p-2 rounded-lg hover:bg-neutral-100 transition-colors'
          aria-label='Back to order history'
        >
          <ArrowLeftIcon className='h-5 w-5 text-neutral-600' />
        </button>
        <h2 className='text-xl font-semibold text-neutral-900'>
          Order Details
        </h2>
      </div>

      {showReviewButton && (
        <button
          onClick={onReviewClick}
          className='cursor-pointer flex items-center gap-2 text-primary-600 font-medium hover:text-primary-700 transition-colors'
        >
          {canLeaveReview ? (
            <PlusIcon className='h-5 w-5' />
          ) : (
            <StarIcon className='h-5 w-5' />
          )}
          <span>{canLeaveReview ? 'Leave a Rating' : 'See your Review'}</span>
        </button>
      )}
    </div>
  );
};
