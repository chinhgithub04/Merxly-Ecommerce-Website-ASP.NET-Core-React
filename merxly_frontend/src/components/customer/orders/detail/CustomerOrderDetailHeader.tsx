import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import { useNavigate } from 'react-router-dom';

export const CustomerOrderDetailHeader = () => {
  const navigate = useNavigate();

  return (
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
  );
};
