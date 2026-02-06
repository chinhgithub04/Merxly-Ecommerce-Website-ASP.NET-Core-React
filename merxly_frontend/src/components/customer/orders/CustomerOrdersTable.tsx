import { useNavigate } from 'react-router-dom';
import { EyeIcon } from '@heroicons/react/24/outline';
import { OrderStatus } from '../../../types/enums/Status';

export interface CustomerOrder {
  id: string;
  subOrderNumber: string;
  status: OrderStatus;
  totalAmount: number;
  itemCount: number;
  createdAt: string;
}

interface CustomerOrdersTableProps {
  orders: CustomerOrder[];
}

const getStatusDisplay = (
  status: OrderStatus,
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

export const CustomerOrdersTable = ({ orders }: CustomerOrdersTableProps) => {
  const navigate = useNavigate();

  const handleViewOrder = (orderId: string) => {
    navigate(`/user-account/order-history/${orderId}`);
  };

  return (
    <div className='md:bg-white md:border md:border-neutral-200 overflow-hidden mt-4 md:mt-0'>
      {/* Desktop Table View */}
      <div className='hidden md:block overflow-x-auto'>
        <table className='w-full'>
          <thead className='bg-neutral-50 border-b border-neutral-200'>
            <tr>
              <th className='text-left py-3 px-4 text-sm font-semibold text-neutral-700'>
                Order Number
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
                    {order.subOrderNumber}
                  </span>
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
                      onClick={() => handleViewOrder(order.id)}
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

      {/* Mobile Card View */}
      <div className='md:hidden divide-y divide-neutral-200'>
        {orders.map((order) => (
          <div
            key={order.id}
            className='p-4 hover:bg-neutral-50 transition-colors border border-neutral-200 rounded-lg bg-white mb-4'
          >
            <div className='flex items-start justify-between mb-3'>
              <div className='flex-1'>
                <span className='text-sm font-semibold text-neutral-900 block mb-1'>
                  {order.subOrderNumber}
                </span>
                <span
                  className={`px-2.5 py-1 rounded-full text-xs font-medium inline-block ${
                    getStatusDisplay(order.status).color
                  }`}
                >
                  {getStatusDisplay(order.status).label}
                </span>
              </div>
              <button
                onClick={() => handleViewOrder(order.id)}
                className='cursor-pointer p-2 text-neutral-600 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors'
                title='View Details'
              >
                <EyeIcon className='h-5 w-5' />
              </button>
            </div>
            <div className='space-y-2'>
              <div className='flex justify-between items-center'>
                <span className='text-xs text-neutral-600'>Items:</span>
                <span className='text-sm text-neutral-900'>
                  {order.itemCount} items
                </span>
              </div>
              <div className='flex justify-between items-center'>
                <span className='text-xs text-neutral-600'>Total:</span>
                <span className='text-sm font-semibold text-neutral-900'>
                  ₫{order.totalAmount.toLocaleString()}
                </span>
              </div>
              <div className='flex justify-between items-center'>
                <span className='text-xs text-neutral-600'>Date:</span>
                <span className='text-sm text-neutral-700'>
                  {new Date(order.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {orders.length === 0 && (
        <div className='text-center py-12'>
          <p className='text-neutral-500'>No orders found</p>
        </div>
      )}
    </div>
  );
};
