import { ArrowLeftIcon, StarIcon } from '@heroicons/react/24/outline';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../../ui/Button';

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
    <div className='flex items-center justify-between gap-4'>
      <div className='flex items-center gap-4'>
        <button
          onClick={() => navigate('/dashboard/order-history')}
          className='cursor-pointer p-2 rounded-lg hover:bg-neutral-100 transition-colors'
          aria-label='Back to order history'
        >
          <ArrowLeftIcon className='h-5 w-5 text-neutral-600' />
        </button>
        <h1 className='text-2xl font-bold text-neutral-900'>Order Details</h1>
      </div>

      {showReviewButton && (
        <Button
          variant={canLeaveReview ? 'primary' : 'outline'}
          onClick={onReviewClick}
        >
          <StarIcon className='h-5 w-5 mr-2' />
          {canLeaveReview ? 'Leave a Rating' : 'See your Review'}
        </Button>
      )}
    </div>
  );
};
