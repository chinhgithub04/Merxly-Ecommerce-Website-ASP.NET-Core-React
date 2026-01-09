import { useParams, useNavigate } from 'react-router-dom';
import {
  useStoreOrderDetail,
  useUpdateSubOrderStatus,
} from '../../hooks/useStoreOrders';
import { OrderStatus } from '../../types/enums';
import {
  OrderDetailHeader,
  OrderBasicInfo,
  OrderProgressBar,
  OrderActionButtons,
  OrderActivityTimeline,
  OrderCustomerInfo,
  OrderCustomerAddress,
  OrderItemsTable,
  OrderSummarySection,
  OrderNotesSection,
} from '../../components/store/orders/detail';
import { CustomerOrderShippingInfo } from '../../components/customer/orders/detail/CustomerOrderShippingInfo';

export const StoreOrderDetailPage = () => {
  const { subOrderId } = useParams<{ subOrderId: string }>();
  const navigate = useNavigate();

  const { data: order, isLoading, error } = useStoreOrderDetail(subOrderId!);
  const { mutate: updateStatus, isPending: isUpdating } =
    useUpdateSubOrderStatus();

  const handleStatusUpdate = (newStatus: OrderStatus, notes?: string) => {
    if (!subOrderId) return;

    updateStatus(
      { subOrderId, dto: { status: newStatus, notes } },
      {
        onSuccess: () => {
          alert('Order status updated successfully');
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
        <OrderDetailHeader />
        <div className='bg-white rounded-xl shadow-sm border border-neutral-200 p-6'>
          <div className='flex items-center justify-center py-12'>
            <div className='text-center'>
              <div className='animate-spin rounded-full h-10 w-10 border-b-2 border-primary-600 mx-auto'></div>
              <p className='mt-4 text-neutral-500'>Loading order details...</p>
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
        <OrderDetailHeader />
        <div className='bg-white rounded-xl shadow-sm border border-neutral-200 p-6'>
          <div className='text-center py-12'>
            <div className='mx-auto h-12 w-12 text-red-400'>
              <svg
                xmlns='http://www.w3.org/2000/svg'
                fill='none'
                viewBox='0 0 24 24'
                strokeWidth={1.5}
                stroke='currentColor'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  d='M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z'
                />
              </svg>
            </div>
            <h3 className='mt-4 text-lg font-medium text-neutral-900'>
              Order not found
            </h3>
            <p className='mt-2 text-neutral-500'>
              The order you're looking for doesn't exist or you don't have
              permission to view it.
            </p>
            <button
              onClick={() => navigate('/store/orders')}
              className='mt-4 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors'
            >
              Back to Orders
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
      <OrderDetailHeader />

      {/* Main Content Wrapper */}
      <div className='bg-white rounded-xl shadow-sm border border-neutral-200'>
        <div className='p-6 space-y-8'>
          {/* Basic Info */}
          <OrderBasicInfo
            subOrderNumber={order.subOrderNumber}
            totalItems={totalItems}
            createdAt={order.createdAt}
          />

          {/* Progress Bar */}
          <div className='pt-6'>
            <OrderProgressBar status={order.status} />
          </div>

          {/* Action Buttons */}
          <div>
            <OrderActionButtons
              status={order.status}
              isUpdating={isUpdating}
              onStatusUpdate={handleStatusUpdate}
            />
          </div>

          {/* Order Activity Timeline */}
          <div className='border-t border-neutral-200 pt-6'>
            <OrderActivityTimeline statusHistory={order.statusHistory} />
          </div>

          {/* Customer Information & Address */}
          <div className='border-t border-neutral-200 pt-6 grid grid-cols-1 md:grid-cols-2 gap-6'>
            <CustomerOrderShippingInfo
              fullName={order.customerFullName}
              email={order.customerEmail}
              phoneNumber={order.customerPhoneNumber}
              fullAddress={order.customerFullAddress}
              postalCode={order.customerPostalCode}
            />
          </div>

          {/* Order Items Table */}
          <div className='border-t border-neutral-200 pt-6'>
            <OrderItemsTable items={order.orderItems} />
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

          {/* Tracking Information (if available) */}
          {(order.carrier || order.trackingNumber) && (
            <div className='border-t border-neutral-200 pt-6'>
              <h3 className='text-lg font-semibold text-neutral-900 mb-4'>
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
                    <p className='text-sm text-neutral-500'>Tracking Number</p>
                    <p className='font-medium text-neutral-900 font-mono'>
                      {order.trackingNumber}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
