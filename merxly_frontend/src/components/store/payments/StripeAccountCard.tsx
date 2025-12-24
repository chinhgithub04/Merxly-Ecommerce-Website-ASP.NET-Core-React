import {
  CheckCircleIcon,
  ExclamationTriangleIcon,
  ArrowTopRightOnSquareIcon,
} from '@heroicons/react/24/outline';

interface StripeAccountCardProps {
  isConnected: boolean;
  accountId?: string;
  email?: string;
  commissionRate: number;
}

export const StripeAccountCard = ({
  isConnected,
  accountId,
  email,
  commissionRate,
}: StripeAccountCardProps) => {
  return (
    <div className='bg-white rounded-lg border border-neutral-200 p-6'>
      <div className='flex items-start justify-between mb-4'>
        <div className='flex items-center gap-3'>
          <div className='p-2 bg-primary-50 rounded-lg'>
            <svg
              className='h-6 w-6 text-primary-600'
              fill='currentColor'
              viewBox='0 0 24 24'
            >
              <path d='M13.479 9.883c-1.626-.604-2.512-1.067-2.512-1.803 0-.622.511-1.075 1.423-1.075 1.062 0 1.907.421 2.512.897l.634-2.322c-.547-.361-1.421-.792-2.571-.792v-1.788h-1.79v1.788c-1.675.204-3.008 1.358-3.008 3.083 0 1.931 1.421 2.785 3.395 3.503 1.675.604 2.009 1.195 2.009 1.928 0 .65-.547 1.138-1.519 1.138-1.062 0-2.08-.517-2.797-1.075l-.634 2.322c.738.517 1.86.905 3.008 1.009v1.795h1.79v-1.795c1.675-.204 3.008-1.358 3.008-3.197 0-2.017-1.421-2.956-3.948-3.633z' />
            </svg>
          </div>
          <div>
            <h3 className='text-lg font-semibold text-neutral-900'>
              Payment Account
            </h3>
            <p className='text-sm text-neutral-600'>
              Stripe Connect integration
            </p>
          </div>
        </div>

        {isConnected ? (
          <div className='flex items-center gap-2 px-3 py-1 bg-success-100 text-success-700 rounded-full'>
            <CheckCircleIcon className='h-4 w-4' />
            <span className='text-sm font-medium'>Connected</span>
          </div>
        ) : (
          <div className='flex items-center gap-2 px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full'>
            <ExclamationTriangleIcon className='h-4 w-4' />
            <span className='text-sm font-medium'>Not Connected</span>
          </div>
        )}
      </div>

      {isConnected ? (
        <div className='space-y-4'>
          <div className='p-4 bg-neutral-50 rounded-lg space-y-3'>
            <div className='flex justify-between items-center'>
              <span className='text-sm text-neutral-600'>Account ID</span>
              <span className='text-sm font-mono text-neutral-900'>
                {accountId}
              </span>
            </div>
            <div className='flex justify-between items-center'>
              <span className='text-sm text-neutral-600'>Email</span>
              <span className='text-sm text-neutral-900'>{email}</span>
            </div>
            <div className='flex justify-between items-center'>
              <span className='text-sm text-neutral-600'>Commission Rate</span>
              <span className='text-sm font-semibold text-neutral-900'>
                {commissionRate}%
              </span>
            </div>
          </div>

          <div className='flex gap-3'>
            <button className='flex-1 flex items-center justify-center gap-2 px-4 py-2 border border-neutral-300 rounded-lg text-neutral-700 hover:bg-neutral-50 transition-colors'>
              <ArrowTopRightOnSquareIcon className='h-5 w-5' />
              View Dashboard
            </button>
            <button className='flex-1 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors'>
              Manage Account
            </button>
          </div>

          <div className='p-4 bg-blue-50 border border-blue-200 rounded-lg'>
            <p className='text-sm text-blue-800'>
              <span className='font-semibold'>Note:</span> Payouts are processed
              automatically every 2 business days. Commission fees are deducted
              before payout.
            </p>
          </div>
        </div>
      ) : (
        <div className='space-y-4'>
          <div className='p-4 bg-yellow-50 border border-yellow-200 rounded-lg'>
            <p className='text-sm text-yellow-800 mb-3'>
              <span className='font-semibold'>Action Required:</span> Connect
              your Stripe account to receive payments from your store sales.
            </p>
            <ul className='text-sm text-yellow-700 space-y-1 ml-4 list-disc'>
              <li>Secure and encrypted payment processing</li>
              <li>Automatic payout scheduling</li>
              <li>Comprehensive transaction tracking</li>
              <li>Bank account or debit card transfers</li>
            </ul>
          </div>

          <button className='w-full px-4 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium'>
            Connect Stripe Account
          </button>

          <p className='text-xs text-neutral-500 text-center'>
            By connecting, you agree to Stripe's terms of service and our
            payment processing agreement.
          </p>
        </div>
      )}
    </div>
  );
};
