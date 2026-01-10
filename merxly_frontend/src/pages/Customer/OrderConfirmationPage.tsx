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
      navigate('/');
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
    <div className='px-20 py-12 min-h-[60vh] flex items-center justify-center'>
      <div className='max-w-md w-full bg-white border border-neutral-200 rounded-lg p-8 text-center'>
        {/* Success Icon */}
        <div className='flex justify-center mb-6'>
          <div className='w-20 h-20 bg-green-100 rounded-full flex items-center justify-center'>
            <CheckCircleIcon className='w-12 h-12 text-green-600' />
          </div>
        </div>

        {/* Success Message */}
        <h1 className='text-2xl font-bold text-neutral-900 mb-3'>
          Order Placed Successfully!
        </h1>
        <p className='text-neutral-600 mb-2'>
          Thank you for your purchase. Your order has been confirmed.
        </p>
        <p className='text-sm text-neutral-500 mb-8'>
          Order Number:{' '}
          <span className='font-semibold text-neutral-900'>
            {order.orderNumber}
          </span>
        </p>

        {/* Action Buttons */}
        <div className='space-y-3'>
          <button
            onClick={handleViewOrder}
            className='w-full px-6 py-3 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 transition-colors cursor-pointer'
          >
            View Order
          </button>
          <button
            onClick={handleKeepShopping}
            className='w-full px-6 py-3 border border-neutral-300 text-neutral-700 rounded-lg font-medium hover:bg-neutral-50 transition-colors cursor-pointer'
          >
            Keep Shopping
          </button>
        </div>
      </div>
    </div>
  );
};
