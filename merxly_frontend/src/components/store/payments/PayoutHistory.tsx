import {
  CheckCircleIcon,
  ClockIcon,
  XCircleIcon,
} from '@heroicons/react/24/outline';

interface Payout {
  id: string;
  amount: number;
  status: 'completed' | 'pending' | 'failed';
  date: string;
  method: string;
  transactionId: string;
}

interface PayoutHistoryProps {
  payouts: Payout[];
}

const statusConfig = {
  completed: {
    label: 'Completed',
    icon: CheckCircleIcon,
    bgColor: 'bg-success-100',
    textColor: 'text-success-700',
    iconColor: 'text-success-600',
  },
  pending: {
    label: 'Pending',
    icon: ClockIcon,
    bgColor: 'bg-yellow-100',
    textColor: 'text-yellow-700',
    iconColor: 'text-yellow-600',
  },
  failed: {
    label: 'Failed',
    icon: XCircleIcon,
    bgColor: 'bg-error-100',
    textColor: 'text-error-700',
    iconColor: 'text-error-600',
  },
};

export const PayoutHistory = ({ payouts }: PayoutHistoryProps) => {
  return (
    <div className='bg-white rounded-lg border border-neutral-200'>
      <div className='p-6 border-b border-neutral-200'>
        <h2 className='text-lg font-semibold text-neutral-900'>
          Payout History
        </h2>
        <p className='text-sm text-neutral-600 mt-1'>
          Track your recent payouts and transactions
        </p>
      </div>

      <div className='overflow-x-auto'>
        <table className='w-full'>
          <thead className='bg-neutral-50 border-b border-neutral-200'>
            <tr>
              <th className='px-6 py-3 text-left text-xs font-medium text-neutral-600 uppercase tracking-wider'>
                Date
              </th>
              <th className='px-6 py-3 text-left text-xs font-medium text-neutral-600 uppercase tracking-wider'>
                Amount
              </th>
              <th className='px-6 py-3 text-left text-xs font-medium text-neutral-600 uppercase tracking-wider'>
                Method
              </th>
              <th className='px-6 py-3 text-left text-xs font-medium text-neutral-600 uppercase tracking-wider'>
                Transaction ID
              </th>
              <th className='px-6 py-3 text-left text-xs font-medium text-neutral-600 uppercase tracking-wider'>
                Status
              </th>
            </tr>
          </thead>
          <tbody className='divide-y divide-neutral-200'>
            {payouts.map((payout) => {
              const config = statusConfig[payout.status];
              const StatusIcon = config.icon;

              return (
                <tr key={payout.id} className='hover:bg-neutral-50'>
                  <td className='px-6 py-4 whitespace-nowrap text-sm text-neutral-900'>
                    {new Date(payout.date).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                    })}
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap text-sm font-semibold text-neutral-900'>
                    ${payout.amount.toLocaleString()}
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap text-sm text-neutral-700'>
                    {payout.method}
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap text-sm text-neutral-600 font-mono'>
                    {payout.transactionId}
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap'>
                    <span
                      className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${config.bgColor} ${config.textColor}`}
                    >
                      <StatusIcon
                        className={`h-4 w-4 mr-1 ${config.iconColor}`}
                      />
                      {config.label}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {payouts.length === 0 && (
        <div className='p-12 text-center'>
          <p className='text-neutral-500'>No payout history available</p>
        </div>
      )}
    </div>
  );
};
