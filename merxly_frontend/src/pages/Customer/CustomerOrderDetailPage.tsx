import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { OrderStatus } from '../../types/enums/Status';
import {
  useCustomerOrderDetail,
  useUpdateCustomerSubOrderStatus,
} from '../../hooks/useCustomerOrders';
import { useSubOrderReviewStatus } from '../../hooks/useReviews';
import { CustomerOrderDetailHeader } from '../../components/customer/orders/detail/CustomerOrderDetailHeader';
import { OrderBasicInfo } from '../../components/store/orders/detail/OrderBasicInfo';
import { CustomerOrderProgressBar } from '../../components/customer/orders/detail/CustomerOrderProgressBar';
import { CustomerOrderActionButtons } from '../../components/customer/orders/detail/CustomerOrderActionButtons';
import { OrderActivityTimeline } from '../../components/store/orders/detail/OrderActivityTimeline';
import { CustomerOrderStoreInfo } from '../../components/customer/orders/detail/CustomerOrderStoreInfo';
import { CustomerOrderShippingInfo } from '../../components/customer/orders/detail/CustomerOrderShippingInfo';
import { CustomerOrderItemsTable } from '../../components/customer/orders/detail/CustomerOrderItemsTable';
import { OrderSummarySection } from '../../components/store/orders/detail/OrderSummarySection';
import { OrderNotesSection } from '../../components/store/orders/detail/OrderNotesSection';
import { ReviewModal } from '../../components/customer/reviews/ReviewModal';

export const CustomerOrderDetailPage = () => {
  const { subOrderId } = useParams<{ subOrderId: string }>();
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const queryClient = useQueryClient();

  const { data: order, isLoading, error } = useCustomerOrderDetail(subOrderId!);
  const { mutate: updateStatus, isPending: isUpdating } =
    useUpdateCustomerSubOrderStatus();
  const { data: reviewStatus } = useSubOrderReviewStatus(subOrderId);

  const handleStatusUpdate = (newStatus: OrderStatus, notes?: string) => {
    if (!subOrderId) return;

    updateStatus(
      { subOrderId, dto: { status: newStatus, notes } },
      {
        onSuccess: () => {
          alert('Order status updated successfully');
          // Invalidate review status to fetch new data when order becomes Completed
          queryClient.invalidateQueries({
            queryKey: ['subOrderReviewStatus', subOrderId],
          });
        },
        onError: (error: Error) => {
          alert(error.message || 'Failed to update order status');
        },
      }
    );
  };

  // Loading state
  if (isLoading) {
    return (
      <div className='space-y-6'>
        <CustomerOrderDetailHeader
          subOrderId={subOrderId}
          canLeaveReview={false}
          isWithinReviewWindow={false}
        />
        <div className='bg-white rounded-xl shadow-sm border border-neutral-200 p-6'>
          <div className='flex items-center justify-center py-12'>
            <div className='text-center'>
              <div className='inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600'></div>
              <p className='mt-4 text-neutral-600'>Loading order details...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !order) {
    return (
      <div className='space-y-6'>
        <CustomerOrderDetailHeader
          subOrderId={subOrderId}
          canLeaveReview={false}
          isWithinReviewWindow={false}
        />
        <div className='bg-white rounded-xl shadow-sm border border-neutral-200 p-6'>
          <div className='text-center py-12'>
            <div className='mx-auto h-12 w-12 text-red-400'>
              <svg
                className='h-12 w-12'
                fill='none'
                viewBox='0 0 24 24'
                stroke='currentColor'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z'
                />
              </svg>
            </div>
            <h3 className='mt-4 text-lg font-medium text-neutral-900'>
              Order not found
            </h3>
            <p className='mt-2 text-neutral-600'>
              {error?.message ||
                'The order you are looking for does not exist.'}
            </p>
            <button
              onClick={() => window.history.back()}
              className='mt-6 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700'
            >
              Go Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  const totalItems = order.orderItems.reduce(
    (sum, item) => sum + item.quantity,
    0
  );

  return (
    <div className='space-y-6'>
      {/* Header */}
      <CustomerOrderDetailHeader
        subOrderId={subOrderId}
        onReviewClick={() => setIsReviewModalOpen(true)}
        canLeaveReview={reviewStatus?.data?.canLeaveReview}
        isWithinReviewWindow={reviewStatus?.data?.isWithinReviewWindow}
      />

      {/* Main Content Wrapper */}
      <div className='bg-white rounded-xl shadow-sm border border-neutral-200'>
        <div className='p-6 space-y-8'>
          {/* Basic Info */}
          <OrderBasicInfo
            subOrderNumber={order.subOrderNumber}
            totalItems={totalItems}
            createdAt={order.createdAt}
          />

          {/* Progress Bar (5 steps) */}
          <div className='border-t border-neutral-200 pt-6'>
            <CustomerOrderProgressBar status={order.status} />
          </div>

          {/* Action Buttons */}
          <div className='pt-6'>
            <CustomerOrderActionButtons
              status={order.status}
              isUpdating={isUpdating}
              onStatusUpdate={handleStatusUpdate}
            />
          </div>

          {/* Activity Timeline */}
          <div className='border-t border-neutral-200 pt-6'>
            <OrderActivityTimeline statusHistory={order.statusHistory} />
          </div>

          {/* Shipping Address & Store Information */}
          <div className='border-t border-neutral-200 pt-6 grid grid-cols-1 md:grid-cols-2 gap-6'>
            <CustomerOrderShippingInfo
              fullName={order.customerFullName}
              fullAddress={order.shippingFullAddress}
              postalCode={order.shippingPostalCode}
              phoneNumber={order.shippingPhoneNumber}
              email={order.customerEmail}
            />
            <CustomerOrderStoreInfo
              storeName={order.storeName}
              storeLogoImagePublicId={order.storeLogoImagePublicId}
              storeBannerImagePublicId={order.storeBannerImagePublicId}
              storeEmail={order.storeEmail}
              storePhoneNumber={order.storePhoneNumber}
              storeFullAddress={order.storeFullAddress}
              storePostalCode={order.storePostalCode}
            />
          </div>

          {/* Order Items (without SKU) */}
          <div className='border-t border-neutral-200 pt-6'>
            <CustomerOrderItemsTable items={order.orderItems} />
          </div>

          {/* Order Summary */}
          <div className='border-t border-neutral-200 pt-6'>
            <OrderSummarySection
              subTotal={order.subTotal}
              shippingCost={order.shippingCost}
              totalAmount={order.totalAmount}
            />
          </div>

          {/* Order Notes */}
          {order.notes && (
            <div className='border-t border-neutral-200 pt-6'>
              <OrderNotesSection notes={order.notes} />
            </div>
          )}

          {/* Tracking Information */}
          {(order.carrier || order.trackingNumber) && (
            <div className='border-t border-neutral-200 pt-6'>
              <div className='space-y-4'>
                <h3 className='text-lg font-semibold text-neutral-900'>
                  Tracking Information
                </h3>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                  {order.carrier && (
                    <div>
                      <p className='text-sm text-neutral-500'>Carrier</p>
                      <p className='font-medium text-neutral-900'>
                        {order.carrier}
                      </p>
                    </div>
                  )}
                  {order.trackingNumber && (
                    <div>
                      <p className='text-sm text-neutral-500'>
                        Tracking Number
                      </p>
                      <p className='font-medium text-neutral-900 font-mono'>
                        {order.trackingNumber}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Review Modal */}
      {reviewStatus?.data && (
        <ReviewModal
          isOpen={isReviewModalOpen}
          onClose={() => setIsReviewModalOpen(false)}
          reviewStatus={reviewStatus.data}
        />
      )}
    </div>
  );
};
