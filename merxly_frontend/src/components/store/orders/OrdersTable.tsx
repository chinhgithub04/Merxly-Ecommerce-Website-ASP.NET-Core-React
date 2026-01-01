import { EyeIcon } from '@heroicons/react/24/outline';
import { OrderStatus } from '../../../types/enums/Status';

export interface Order {
  id: string;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  status: OrderStatus;
  totalAmount: number;
  itemCount: number;
  createdAt: string;
}

interface OrdersTableProps {
  orders: Order[];
  onViewOrder: (orderId: string) => void;
}

const getStatusDisplay = (
  status: OrderStatus
): { label: string; color: string } => {
  const statusMap: Record<number, { label: string; color: string }> = {
    [OrderStatus.Confirmed]: {
      label: 'Pending',
      color: 'bg-blue-100 text-blue-700',
    },
    [OrderStatus.Processing]: {
      label: 'Processing',
      color: 'bg-indigo-100 text-indigo-700',
    },
    [OrderStatus.Delivering]: {
      label: 'Delivering',
      color: 'bg-yellow-100 text-yellow-700',
    },
    [OrderStatus.Shipped]: {
      label: 'Shipped',
      color: 'bg-purple-100 text-purple-700',
    },
    [OrderStatus.Completed]: {
      label: 'Completed',
      color: 'bg-green-100 text-green-700',
    },
    [OrderStatus.Cancelled]: {
      label: 'Cancelled',
      color: 'bg-red-100 text-red-700',
    },
    [OrderStatus.Refunded]: {
      label: 'Refunded',
      color: 'bg-orange-100 text-orange-700',
    },
    [OrderStatus.Failed]: {
      label: 'Failed',
      color: 'bg-gray-100 text-gray-700',
    },
  };
  return (
    statusMap[status] || {
      label: 'Unknown',
      color: 'bg-gray-100 text-gray-700',
    }
  );
};

export const OrdersTable = ({ orders, onViewOrder }: OrdersTableProps) => {
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
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium inline-block ${
                      getStatusDisplay(order.status).color
                    }`}
                  >
                    {getStatusDisplay(order.status).label}
                  </span>
                </td>
                <td className='py-3 px-4'>
                  <span className='text-sm text-neutral-700'>
                    {order.itemCount} items
                  </span>
                </td>
                <td className='py-3 px-4 text-right'>
                  <span className='text-sm font-semibold text-neutral-900'>
                    ₫{order.totalAmount.toLocaleString()}
                  </span>
                </td>
                <td className='py-3 px-4'>
                  <span className='text-sm text-neutral-700'>
                    {new Date(order.createdAt).toLocaleDateString()}
                  </span>
                </td>
                <td className='py-3 px-4'>
                  <div className='flex items-center justify-center'>
                    <button
                      onClick={() => onViewOrder(order.id)}
                      className='cursor-pointer p-2 text-neutral-600 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors'
                      title='View Details'
                    >
                      <EyeIcon className='h-5 w-5' />
                    </button>
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
