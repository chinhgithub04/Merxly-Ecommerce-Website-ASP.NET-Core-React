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
      date: date.toLocaleDateString('vi-VN', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      }),
      time: date.toLocaleTimeString('vi-VN', {
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
    <div className='flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-warning-50 p-4 md:p-6 lg:p-8 border border-warning-300'>
      <div>
        <h2 className='text-base md:text-lg font-semibold text-neutral-900'>
          #{subOrderNumber}
        </h2>
        <div className='flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 mt-2 text-sm text-neutral-600'>
          <p>
            {totalItems} {totalItems === 1 ? 'product' : 'products'}
          </p>
          <span className='hidden sm:inline'>•</span>
          <p>
            Order Placed in {date} at {time}
          </p>
        </div>
      </div>
      <h1 className='text-xl md:text-2xl font-bold text-primary-600'>
        {totalAmount !== undefined ? formatCurrency(totalAmount) : ''}
      </h1>
    </div>
  );
};
