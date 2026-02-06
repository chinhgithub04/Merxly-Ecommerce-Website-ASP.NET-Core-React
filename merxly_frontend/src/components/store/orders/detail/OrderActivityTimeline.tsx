import {
  ClockIcon,
  CheckCircleIcon,
  CubeIcon,
  TruckIcon,
  HomeIcon,
  XCircleIcon,
  ArrowPathIcon,
  ExclamationCircleIcon,
  UserCircleIcon,
} from '@heroicons/react/24/outline';
import { OrderStatus } from '../../../../types/enums';
import type { OrderStatusHistoryDto } from '../../../../types/models/storeOrder';
import { OrderChangedBy } from '../../../../types/const/OrderChangedBy';

interface OrderActivityTimelineProps {
  statusHistory: OrderStatusHistoryDto[];
}

export const OrderActivityTimeline = ({
  statusHistory,
}: OrderActivityTimelineProps) => {
  // Sort by most recent first
  const sortedHistory = [...statusHistory].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );

  const getStatusIcon = (status: OrderStatus) => {
    switch (status) {
      case OrderStatus.Pending:
        return ClockIcon;
      case OrderStatus.Confirmed:
        return CheckCircleIcon;
      case OrderStatus.Processing:
        return CubeIcon;
      case OrderStatus.Delivering:
        return TruckIcon;
      case OrderStatus.Shipped:
      case OrderStatus.Completed:
        return HomeIcon;
      case OrderStatus.Cancelled:
        return XCircleIcon;
      case OrderStatus.Refunded:
        return ArrowPathIcon;
      case OrderStatus.Failed:
        return ExclamationCircleIcon;
      default:
        return ClockIcon;
    }
  };

  const getStatusLabel = (status: OrderStatus) => {
    switch (status) {
      case OrderStatus.Pending:
        return 'Order Placed';
      case OrderStatus.Confirmed:
        return 'Order Confirmed';
      case OrderStatus.Processing:
        return 'Packaging Started';
      case OrderStatus.Delivering:
        return 'Out for Delivery';
      case OrderStatus.Shipped:
        return 'Shipped to Customer';
      case OrderStatus.Completed:
        return 'Order Completed';
      case OrderStatus.Cancelled:
        return 'Order Cancelled';
      case OrderStatus.Refunded:
        return 'Order Refunded';
      case OrderStatus.Failed:
        return 'Order Failed';
      default:
        return 'Unknown Status';
    }
  };

  const getStatusColor = (status: OrderStatus) => {
    switch (status) {
      case OrderStatus.Pending:
        return 'bg-yellow-100 text-yellow-600';
      case OrderStatus.Confirmed:
        return 'bg-blue-100 text-blue-600';
      case OrderStatus.Processing:
        return 'bg-purple-100 text-purple-600';
      case OrderStatus.Delivering:
        return 'bg-indigo-100 text-indigo-600';
      case OrderStatus.Shipped:
      case OrderStatus.Completed:
        return 'bg-green-100 text-green-600';
      case OrderStatus.Cancelled:
      case OrderStatus.Failed:
        return 'bg-red-100 text-red-600';
      case OrderStatus.Refunded:
        return 'bg-orange-100 text-orange-600';
      default:
        return 'bg-neutral-100 text-neutral-600';
    }
  };

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return {
      date: date.toLocaleDateString('vi-VN', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      }),
      time: date.toLocaleTimeString('vi-VN', {
        hour: '2-digit',
        minute: '2-digit',
      }),
    };
  };

  return (
    <div className='space-y-3 md:space-y-4'>
      <h3 className='text-base md:text-lg font-semibold text-neutral-900'>
        Order Activity
      </h3>
      <div className='relative'>
        {sortedHistory.map((entry, index) => {
          const Icon = getStatusIcon(entry.status);
          const { date, time } = formatDateTime(entry.createdAt);
          const isLast = index === sortedHistory.length - 1;

          return (
            <div
              key={entry.id}
              className='relative flex gap-3 md:gap-4 pb-5 md:pb-6'
            >
              {/* Timeline Line */}
              {!isLast && (
                <div className='absolute left-4 md:left-5 top-9 md:top-10 bottom-0 w-0.5 bg-neutral-200' />
              )}

              {/* Icon */}
              <div
                className={`relative z-10 shrink-0 w-8 h-8 md:w-10 md:h-10 rounded-lg flex items-center justify-center ${getStatusColor(
                  entry.status,
                )}`}
              >
                <Icon className='h-4 w-4 md:h-5 md:w-5' />
              </div>

              {/* Content */}
              <div className='flex-1 min-w-0'>
                <div className='flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-4'>
                  <div>
                    <p className='text-sm md:text-base font-medium text-neutral-900'>
                      {getStatusLabel(entry.status)}
                    </p>
                    {entry.status === OrderStatus.Cancelled && entry.notes && (
                      <p className='mt-1 text-xs md:text-sm text-neutral-600'>
                        {entry.notes}
                      </p>
                    )}
                    {entry.status === OrderStatus.Cancelled &&
                      entry.changedBy && (
                        <div className='mt-1 flex items-center gap-1 text-[11px] md:text-xs text-neutral-500'>
                          <UserCircleIcon className='h-3.5 w-3.5 md:h-4 md:w-4' />
                          <span>
                            Cancelled by:{' '}
                            {entry.changedBy === OrderChangedBy.CUSTOMER
                              ? 'Customer'
                              : entry.changedBy === OrderChangedBy.STORE_OWNER
                                ? 'Store'
                                : 'Admin'}
                          </span>
                        </div>
                      )}
                  </div>
                  <div className='text-left sm:text-right text-xs md:text-sm text-neutral-500 whitespace-nowrap'>
                    <div>{date}</div>
                    <div>{time}</div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
