import {
  ClipboardDocumentListIcon,
  ShoppingCartIcon,
  CalendarDaysIcon,
} from '@heroicons/react/24/outline';

interface OrderBasicInfoProps {
  subOrderNumber: string;
  totalItems: number;
  createdAt: string;
  totalAmount?: number;
}

export const OrderBasicInfo = ({
  subOrderNumber,
  totalItems,
  createdAt,
  totalAmount,
}: OrderBasicInfoProps) => {
  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return {
      date: date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      }),
      time: date.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
      }),
    };
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(amount);
  };

  const { date, time } = formatDateTime(createdAt);

  return (
    <div className='flex items-center justify-between bg-warning-50 p-8 border border-warning-300'>
      <div>
        <h2 className='text-lg font-semibold text-neutral-900'>
          #{subOrderNumber}
        </h2>
        <div className='flex items-center gap-2 mt-2 text-neutral-600'>
          <p>
            {totalItems} {totalItems === 1 ? 'product' : 'products'}
          </p>
          <span>•</span>
          <p>
            Order Placed in {date} at {time}
          </p>
        </div>
      </div>
      <h1 className='text-2xl font-bold text-primary-600'>
        {totalAmount !== undefined ? formatCurrency(totalAmount) : ''}
      </h1>
    </div>
  );
};
