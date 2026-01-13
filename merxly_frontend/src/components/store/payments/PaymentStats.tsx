import {
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
} from '@heroicons/react/24/outline';

interface PaymentStatsProps {
  totalEarnings: number;
  pendingPayout: number;
  commissionPaid: number;
  availableBalance: number;
  isLoading?: boolean;
}

export const PaymentStats = ({
  totalEarnings,
  pendingPayout,
  commissionPaid,
  availableBalance,
  isLoading,
}: PaymentStatsProps) => {
  const formatCurrency = (amount: number) => {
    return amount.toLocaleString('vi-VN') + ' ₫';
  };

  if (isLoading) {
    return (
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className='bg-white rounded-lg border border-neutral-200 p-6 animate-pulse'
          >
            <div className='h-4 bg-neutral-200 rounded w-24 mb-4'></div>
            <div className='h-8 bg-neutral-200 rounded w-32 mb-2'></div>
            <div className='h-3 bg-neutral-200 rounded w-28'></div>
          </div>
        ))}
      </div>
    );
  }
  return (
    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
      <div className='bg-white rounded-lg border border-neutral-200 p-6'>
        <div className='flex items-center justify-between mb-2'>
          <p className='text-sm text-neutral-600'>Total Earnings</p>
          <div className='flex items-center text-xs text-success-600'>
            <ArrowTrendingUpIcon className='h-4 w-4 mr-1' />
            <span>12.5%</span>
          </div>
        </div>
        <p className='text-3xl font-bold text-neutral-900'>
          {formatCurrency(totalEarnings)}
        </p>
        <p className='text-xs text-neutral-500 mt-1'>All time revenue</p>
      </div>

      <div className='bg-white rounded-lg border border-neutral-200 p-6'>
        <div className='flex items-center justify-between mb-2'>
          <p className='text-sm text-neutral-600'>Pending Payout</p>
          <div className='px-2 py-1 bg-yellow-100 text-yellow-700 text-xs font-medium rounded'>
            Pending
          </div>
        </div>
        <p className='text-3xl font-bold text-neutral-900'>
          {formatCurrency(pendingPayout)}
        </p>
        <p className='text-xs text-neutral-500 mt-1'>
          Processing next business day
        </p>
      </div>

      <div className='bg-white rounded-lg border border-neutral-200 p-6'>
        <div className='flex items-center justify-between mb-2'>
          <p className='text-sm text-neutral-600'>Commission Paid</p>
          <div className='flex items-center text-xs text-error-600'>
            <ArrowTrendingDownIcon className='h-4 w-4 mr-1' />
            <span>8.5%</span>
          </div>
        </div>
        <p className='text-3xl font-bold text-neutral-900'>
          {formatCurrency(commissionPaid)}
        </p>
        <p className='text-xs text-neutral-500 mt-1'>Platform fees</p>
      </div>

      <div className='bg-white rounded-lg border border-neutral-200 p-6'>
        <div className='flex items-center justify-between mb-2'>
          <p className='text-sm text-neutral-600'>Available Balance</p>
          <div className='px-2 py-1 bg-success-100 text-success-700 text-xs font-medium rounded'>
            Available
          </div>
        </div>
        <p className='text-3xl font-bold text-neutral-900'>
          {formatCurrency(availableBalance)}
        </p>
        <p className='text-xs text-neutral-500 mt-1'>Ready for withdrawal</p>
      </div>
    </div>
  );
};
