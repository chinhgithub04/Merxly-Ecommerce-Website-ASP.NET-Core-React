import { XMarkIcon } from '@heroicons/react/24/outline';

interface OrderItem {
  id: string;
  productName: string;
  variantDetails: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

interface OrderDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: {
    orderNumber: string;
    customerName: string;
    customerEmail: string;
    status: string;
    totalAmount: number;
    subTotal: number;
    tax?: number;
    shippingCost?: number;
    createdAt: string;
    shippedAt?: string;
    deliveredAt?: string;
    carrier?: string;
    shippingAddress: {
      street: string;
      city: string;
      state: string;
      zipCode: string;
      country: string;
    };
    items: OrderItem[];
    notes?: string;
  };
}

const statusColors: Record<string, string> = {
  Pending: 'bg-yellow-100 text-yellow-700',
  Confirmed: 'bg-blue-100 text-blue-700',
  Processing: 'bg-indigo-100 text-indigo-700',
  Shipped: 'bg-purple-100 text-purple-700',
  Delivered: 'bg-green-100 text-green-700',
  Cancelled: 'bg-red-100 text-red-700',
};

export const OrderDetailsModal = ({
  isOpen,
  onClose,
  order,
}: OrderDetailsModalProps) => {
  if (!isOpen) return null;

  return (
    <div className='fixed inset-0 bg-black/50 bg-opacity-50 flex items-center justify-center z-50 p-4'>
      <div className='bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto'>
        {/* Header */}
        <div className='sticky top-0 bg-white border-b border-neutral-200 p-6 flex items-center justify-between'>
          <div>
            <h2 className='text-2xl font-bold text-neutral-900'>
              Order Details
            </h2>
            <p className='text-sm text-neutral-600 mt-1'>{order.orderNumber}</p>
          </div>
          <button
            onClick={onClose}
            className='p-2 hover:bg-neutral-100 rounded-lg transition-colors'
          >
            <XMarkIcon className='h-6 w-6 text-neutral-600' />
          </button>
        </div>

        <div className='p-6 space-y-6'>
          {/* Status and Date */}
          <div className='flex items-center justify-between'>
            <span
              className={`px-4 py-2 rounded-full text-sm font-medium ${
                statusColors[order.status]
              }`}
            >
              {order.status}
            </span>
            <span className='text-sm text-neutral-600'>
              Ordered on {new Date(order.createdAt).toLocaleDateString()}
            </span>
          </div>

          {/* Customer Information */}
          <div className='bg-neutral-50 rounded-lg p-4'>
            <h3 className='text-lg font-semibold text-neutral-900 mb-3'>
              Customer Information
            </h3>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              <div>
                <p className='text-sm text-neutral-600'>Name</p>
                <p className='text-sm font-medium text-neutral-900'>
                  {order.customerName}
                </p>
              </div>
              <div>
                <p className='text-sm text-neutral-600'>Email</p>
                <p className='text-sm font-medium text-neutral-900'>
                  {order.customerEmail}
                </p>
              </div>
            </div>
          </div>

          {/* Shipping Address */}
          <div className='bg-neutral-50 rounded-lg p-4'>
            <h3 className='text-lg font-semibold text-neutral-900 mb-3'>
              Shipping Address
            </h3>
            <p className='text-sm text-neutral-700'>
              {order.shippingAddress.street}
              <br />
              {order.shippingAddress.city}, {order.shippingAddress.state}{' '}
              {order.shippingAddress.zipCode}
              <br />
              {order.shippingAddress.country}
            </p>
          </div>

          {/* Shipping Information */}
          {order.carrier && (
            <div className='bg-neutral-50 rounded-lg p-4'>
              <h3 className='text-lg font-semibold text-neutral-900 mb-3'>
                Shipping Information
              </h3>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                <div>
                  <p className='text-sm text-neutral-600'>Carrier</p>
                  <p className='text-sm font-medium text-neutral-900'>
                    {order.carrier}
                  </p>
                </div>
                {order.shippedAt && (
                  <div>
                    <p className='text-sm text-neutral-600'>Shipped At</p>
                    <p className='text-sm font-medium text-neutral-900'>
                      {new Date(order.shippedAt).toLocaleDateString()}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Order Items */}
          <div>
            <h3 className='text-lg font-semibold text-neutral-900 mb-3'>
              Order Items
            </h3>
            <div className='border border-neutral-200 rounded-lg overflow-hidden'>
              <table className='w-full'>
                <thead className='bg-neutral-50 border-b border-neutral-200'>
                  <tr>
                    <th className='text-left py-3 px-4 text-sm font-semibold text-neutral-700'>
                      Product
                    </th>
                    <th className='text-center py-3 px-4 text-sm font-semibold text-neutral-700'>
                      Quantity
                    </th>
                    <th className='text-right py-3 px-4 text-sm font-semibold text-neutral-700'>
                      Unit Price
                    </th>
                    <th className='text-right py-3 px-4 text-sm font-semibold text-neutral-700'>
                      Total
                    </th>
                  </tr>
                </thead>
                <tbody className='divide-y divide-neutral-200'>
                  {order.items.map((item) => (
                    <tr key={item.id}>
                      <td className='py-3 px-4'>
                        <p className='text-sm font-medium text-neutral-900'>
                          {item.productName}
                        </p>
                        <p className='text-xs text-neutral-500'>
                          {item.variantDetails}
                        </p>
                      </td>
                      <td className='py-3 px-4 text-center text-sm text-neutral-700'>
                        {item.quantity}
                      </td>
                      <td className='py-3 px-4 text-right text-sm text-neutral-700'>
                        ${item.unitPrice.toFixed(2)}
                      </td>
                      <td className='py-3 px-4 text-right text-sm font-semibold text-neutral-900'>
                        ${item.totalPrice.toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Order Summary */}
          <div className='bg-neutral-50 rounded-lg p-4'>
            <h3 className='text-lg font-semibold text-neutral-900 mb-3'>
              Order Summary
            </h3>
            <div className='space-y-2'>
              <div className='flex justify-between text-sm'>
                <span className='text-neutral-600'>Subtotal</span>
                <span className='text-neutral-900'>
                  ${order.subTotal.toFixed(2)}
                </span>
              </div>
              {order.tax !== undefined && order.tax > 0 && (
                <div className='flex justify-between text-sm'>
                  <span className='text-neutral-600'>Tax</span>
                  <span className='text-neutral-900'>
                    ${order.tax.toFixed(2)}
                  </span>
                </div>
              )}
              {order.shippingCost !== undefined && order.shippingCost > 0 && (
                <div className='flex justify-between text-sm'>
                  <span className='text-neutral-600'>Shipping</span>
                  <span className='text-neutral-900'>
                    ${order.shippingCost.toFixed(2)}
                  </span>
                </div>
              )}
              <div className='flex justify-between text-base font-bold pt-2 border-t border-neutral-300'>
                <span className='text-neutral-900'>Total</span>
                <span className='text-neutral-900'>
                  ${order.totalAmount.toFixed(2)}
                </span>
              </div>
            </div>
          </div>

          {/* Notes */}
          {order.notes && (
            <div className='bg-neutral-50 rounded-lg p-4'>
              <h3 className='text-lg font-semibold text-neutral-900 mb-3'>
                Notes
              </h3>
              <p className='text-sm text-neutral-700'>{order.notes}</p>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className='sticky bottom-0 bg-white border-t border-neutral-200 p-6 flex justify-end gap-3'>
          <button
            onClick={onClose}
            className='px-4 py-2 border border-neutral-300 rounded-lg text-neutral-700 hover:bg-neutral-50 transition-colors'
          >
            Close
          </button>
          <button className='px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors'>
            Print Invoice
          </button>
        </div>
      </div>
    </div>
  );
};
