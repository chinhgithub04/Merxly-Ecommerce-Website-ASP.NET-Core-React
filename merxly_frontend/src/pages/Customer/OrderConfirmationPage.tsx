import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { CheckCircleIcon } from '@heroicons/react/24/outline';
import type { OrderDto } from '../../types/models/order';

export const OrderConfirmationPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const order = location.state?.order as OrderDto | undefined;

  // Redirect if no order data
  useEffect(() => {
    if (!order) {
      navigate('/', { replace: true });
    }
  }, [order, navigate]);

  if (!order) {
    return null;
  }

  const handleKeepShopping = () => {
    navigate('/');
  };

  const handleViewOrder = () => {
    // Navigate to the first sub-order detail page
    if (order.subOrders && order.subOrders.length > 0) {
      navigate(`/user-account/order-history/${order.subOrders[0].id}`);
    } else {
      navigate('/user-account/order-history');
    }
  };

  return (
    <div className='px-4 md:px-8 lg:px-20 py-6 md:py-12 min-h-[60vh] flex items-center justify-center'>
      <div className='max-w-md w-full bg-white border border-neutral-200 rounded-lg p-6 md:p-8 text-center'>
        {/* Success Icon */}
        <div className='flex justify-center mb-4 md:mb-6'>
          <div className='w-16 h-16 md:w-20 md:h-20 bg-green-100 rounded-full flex items-center justify-center'>
            <CheckCircleIcon className='w-10 h-10 md:w-12 md:h-12 text-green-600' />
          </div>
        </div>

        {/* Success Message */}
        <h1 className='text-xl md:text-2xl font-bold text-neutral-900 mb-2 md:mb-3'>
          Order Placed Successfully!
        </h1>
        <p className='text-sm md:text-base text-neutral-600 mb-2'>
          Thank you for your purchase. Your order has been confirmed.
        </p>
        <p className='text-xs md:text-sm text-neutral-500 mb-6 md:mb-8'>
          Order Number:{' '}
          <span className='font-semibold text-neutral-900'>
            {order.orderNumber}
          </span>
        </p>

        {/* Action Buttons */}
        <div className='space-y-2 md:space-y-3'>
          <button
            onClick={handleViewOrder}
            className='w-full px-4 md:px-6 py-2.5 md:py-3 text-sm md:text-base bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 transition-colors cursor-pointer'
          >
            View Order
          </button>
          <button
            onClick={handleKeepShopping}
            className='w-full px-4 md:px-6 py-2.5 md:py-3 text-sm md:text-base border border-neutral-300 text-neutral-700 rounded-lg font-medium hover:bg-neutral-50 transition-colors cursor-pointer'
          >
            Keep Shopping
          </button>
        </div>
      </div>
    </div>
  );
};
