import { useState } from 'react';
import { EyeIcon, TruckIcon } from '@heroicons/react/24/outline';

export interface Order {
  id: string;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  status:
    | 'Pending'
    | 'Confirmed'
    | 'Processing'
    | 'Shipped'
    | 'Delivered'
    | 'Cancelled'
    | 'Refunded'
    | 'Failed';
  totalAmount: number;
  itemCount: number;
  createdAt: string;
  shippedAt?: string;
  deliveredAt?: string;
  carrier?: string;
}

interface OrdersTableProps {
  orders: Order[];
  onViewOrder: (orderId: string) => void;
  onUpdateStatus: (orderId: string, status: string) => void;
}

const statusColors = {
  Pending: 'bg-yellow-100 text-yellow-700',
  Confirmed: 'bg-blue-100 text-blue-700',
  Processing: 'bg-indigo-100 text-indigo-700',
  Shipped: 'bg-purple-100 text-purple-700',
  Delivered: 'bg-green-100 text-green-700',
  Cancelled: 'bg-red-100 text-red-700',
  Refunded: 'bg-orange-100 text-orange-700',
  Failed: 'bg-gray-100 text-gray-700',
};

export const OrdersTable = ({
  orders,
  onViewOrder,
  onUpdateStatus,
}: OrdersTableProps) => {
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);

  return (
    <div className='bg-white rounded-lg border border-neutral-200 overflow-hidden'>
      <div className='overflow-x-auto'>
        <table className='w-full'>
          <thead className='bg-neutral-50 border-b border-neutral-200'>
            <tr>
              <th className='text-left py-3 px-4 text-sm font-semibold text-neutral-700'>
                Order Number
              </th>
              <th className='text-left py-3 px-4 text-sm font-semibold text-neutral-700'>
                Customer
              </th>
              <th className='text-left py-3 px-4 text-sm font-semibold text-neutral-700'>
                Status
              </th>
              <th className='text-left py-3 px-4 text-sm font-semibold text-neutral-700'>
                Items
              </th>
              <th className='text-right py-3 px-4 text-sm font-semibold text-neutral-700'>
                Total
              </th>
              <th className='text-left py-3 px-4 text-sm font-semibold text-neutral-700'>
                Date
              </th>
              <th className='text-center py-3 px-4 text-sm font-semibold text-neutral-700'>
                Actions
              </th>
            </tr>
          </thead>
          <tbody className='divide-y divide-neutral-200'>
            {orders.map((order) => (
              <tr
                key={order.id}
                className='hover:bg-neutral-50 transition-colors'
              >
                <td className='py-3 px-4'>
                  <span className='text-sm font-medium text-neutral-900'>
                    {order.orderNumber}
                  </span>
                </td>
                <td className='py-3 px-4'>
                  <div>
                    <p className='text-sm font-medium text-neutral-900'>
                      {order.customerName}
                    </p>
                    <p className='text-xs text-neutral-500'>
                      {order.customerEmail}
                    </p>
                  </div>
                </td>
                <td className='py-3 px-4'>
                  <div className='relative inline-block'>
                    <button
                      onClick={() =>
                        setSelectedOrderId(
                          selectedOrderId === order.id ? null : order.id
                        )
                      }
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        statusColors[order.status]
                      } hover:opacity-80 transition-opacity`}
                    >
                      {order.status}
                    </button>
                    {selectedOrderId === order.id && (
                      <div className='absolute top-full left-0 mt-1 bg-white border border-neutral-200 rounded-lg shadow-lg z-10 min-w-[150px]'>
                        {Object.keys(statusColors).map((status) => (
                          <button
                            key={status}
                            onClick={() => {
                              onUpdateStatus(order.id, status);
                              setSelectedOrderId(null);
                            }}
                            className='w-full text-left px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-50 first:rounded-t-lg last:rounded-b-lg'
                          >
                            {status}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </td>
                <td className='py-3 px-4'>
                  <span className='text-sm text-neutral-700'>
                    {order.itemCount} items
                  </span>
                </td>
                <td className='py-3 px-4 text-right'>
                  <span className='text-sm font-semibold text-neutral-900'>
                    ${order.totalAmount.toFixed(2)}
                  </span>
                </td>
                <td className='py-3 px-4'>
                  <span className='text-sm text-neutral-700'>
                    {new Date(order.createdAt).toLocaleDateString()}
                  </span>
                </td>
                <td className='py-3 px-4'>
                  <div className='flex items-center justify-center gap-2'>
                    <button
                      onClick={() => onViewOrder(order.id)}
                      className='p-2 text-neutral-600 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors'
                      title='View Details'
                    >
                      <EyeIcon className='h-5 w-5' />
                    </button>
                    {(order.status === 'Processing' ||
                      order.status === 'Confirmed') && (
                      <button
                        onClick={() => onUpdateStatus(order.id, 'Shipped')}
                        className='p-2 text-neutral-600 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors'
                        title='Mark as Shipped'
                      >
                        <TruckIcon className='h-5 w-5' />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {orders.length === 0 && (
        <div className='text-center py-12'>
          <p className='text-neutral-500'>No orders found</p>
        </div>
      )}
    </div>
  );
};
