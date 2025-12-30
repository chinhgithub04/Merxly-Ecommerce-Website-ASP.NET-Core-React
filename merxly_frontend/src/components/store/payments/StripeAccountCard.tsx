import { useState } from 'react';
import {
  CheckCircleIcon,
  ExclamationTriangleIcon,
  ArrowPathIcon,
} from '@heroicons/react/24/outline';
import { Modal } from '../../ui/Modal';

interface StripeAccountCardProps {
  isConnected: boolean;
  accountId?: string;
  email?: string;
  commissionRate: number;
  accountStatus?: string | null;
  isLoading?: boolean;
  onConnect: (email: string, country: string, businessType: string) => void;
  onContinueOnboarding: () => void;
  onRefreshStatus: () => void;
  onDisconnect: () => void;
  isConnecting?: boolean;
  isContinuingOnboarding?: boolean;
  isRefreshing?: boolean;
  isDisconnecting?: boolean;
}

export const StripeAccountCard = ({
  isConnected,
  accountId,
  email,
  commissionRate,
  accountStatus,
  isLoading = false,
  onConnect,
  onContinueOnboarding,
  onRefreshStatus,
  onDisconnect,
  isConnecting = false,
  isContinuingOnboarding = false,
  isRefreshing = false,
  isDisconnecting = false,
}: StripeAccountCardProps) => {
  const [isConnectModalOpen, setIsConnectModalOpen] = useState(false);
  const [isDisconnectModalOpen, setIsDisconnectModalOpen] = useState(false);
  const [connectEmail, setConnectEmail] = useState('');
  const [country, setCountry] = useState('US');
  const [businessType, setBusinessType] = useState('individual');

  const handleConnect = () => {
    onConnect(connectEmail, country, businessType);
    setIsConnectModalOpen(false);
    setConnectEmail('');
  };

  const handleDisconnect = () => {
    onDisconnect();
    setIsDisconnectModalOpen(false);
  };

  const getStatusColor = () => {
    if (!accountStatus) return 'bg-neutral-100 text-neutral-700';
    switch (accountStatus.toLowerCase()) {
      case 'complete':
        return 'bg-success-100 text-success-700';
      case 'pending':
        return 'bg-yellow-100 text-yellow-700';
      case 'restricted':
        return 'bg-error-100 text-error-700';
      default:
        return 'bg-neutral-100 text-neutral-700';
    }
  };

  const getStatusIcon = () => {
    if (!accountStatus || accountStatus.toLowerCase() === 'pending') {
      return <ExclamationTriangleIcon className='h-4 w-4' />;
    }
    if (accountStatus.toLowerCase() === 'complete') {
      return <CheckCircleIcon className='h-4 w-4' />;
    }
    return <ExclamationTriangleIcon className='h-4 w-4' />;
  };

  if (isLoading) {
    return (
      <div className='bg-white rounded-lg border border-neutral-200 p-6'>
        <div className='animate-pulse space-y-4'>
          <div className='h-8 bg-neutral-200 rounded w-1/3'></div>
          <div className='h-24 bg-neutral-200 rounded'></div>
        </div>
      </div>
    );
  }
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
          <div
            className={`flex items-center gap-2 px-3 py-1 rounded-full ${getStatusColor()}`}
          >
            {getStatusIcon()}
            <span className='text-sm font-medium capitalize'>
              {accountStatus || 'Connected'}
            </span>
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
              <span className='text-sm text-neutral-600'>Commission Rate</span>
              <span className='text-sm font-semibold text-neutral-900'>
                {commissionRate}%
              </span>
            </div>
          </div>

          <div className='flex gap-3'>
            {accountStatus?.toLowerCase() !== 'complete' ? (
              <>
                <button
                  onClick={onRefreshStatus}
                  disabled={isRefreshing}
                  className='cursor-pointer flex-1 flex items-center justify-center gap-2 px-4 py-2 border border-neutral-300 rounded-lg text-neutral-700 hover:bg-neutral-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed'
                >
                  {isRefreshing ? (
                    <div className='h-5 w-5 border-2 border-neutral-300 border-t-neutral-600 rounded-full animate-spin' />
                  ) : (
                    <>
                      <ArrowPathIcon className='h-5 w-5' />
                      Refresh Status
                    </>
                  )}
                </button>
                <button
                  onClick={onContinueOnboarding}
                  disabled={isContinuingOnboarding}
                  className='cursor-pointer flex-1 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed'
                >
                  {isContinuingOnboarding
                    ? 'Loading...'
                    : 'Complete Onboarding'}
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={onContinueOnboarding}
                  disabled={isContinuingOnboarding}
                  className='cursor-pointer flex-1 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed'
                >
                  {isContinuingOnboarding
                    ? 'Loading...'
                    : 'Manage Stripe Account'}
                </button>
                <button
                  onClick={() => setIsDisconnectModalOpen(true)}
                  disabled={isDisconnecting}
                  className='cursor-pointer flex-1 px-4 py-2 border border-error-600 text-error-600 rounded-lg hover:bg-error-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed'
                >
                  Disconnect Account
                </button>
              </>
            )}
          </div>

          {accountStatus?.toLowerCase() !== 'complete' && (
            <div className='p-4 bg-yellow-50 border border-yellow-200 rounded-lg'>
              <p className='text-sm text-yellow-800'>
                <span className='font-semibold'>Action Required:</span> Your
                account setup is incomplete. Please complete the onboarding
                process to receive payouts.
              </p>
            </div>
          )}

          {accountStatus?.toLowerCase() === 'complete' && (
            <div className='p-4 bg-blue-50 border border-blue-200 rounded-lg'>
              <p className='text-sm text-blue-800'>
                <span className='font-semibold'>Note:</span> Payouts are
                processed automatically every 2 business days. Commission fees
                are deducted before payout.
              </p>
            </div>
          )}
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

          <button
            onClick={() => setIsConnectModalOpen(true)}
            disabled={isConnecting}
            className='cursor-pointer w-full px-4 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed'
          >
            {isConnecting ? 'Connecting...' : 'Connect Stripe Account'}
          </button>

          <p className='text-xs text-neutral-500 text-center'>
            By connecting, you agree to Stripe's terms of service and our
            payment processing agreement.
          </p>
        </div>
      )}

      {/* Connect Modal */}
      <Modal
        isOpen={isConnectModalOpen}
        onClose={() => setIsConnectModalOpen(false)}
        onDone={handleConnect}
        title='Connect Stripe Account'
        doneLabel='Connect'
        doneDisabled={!connectEmail.trim()}
      >
        <div className='space-y-4'>
          <div>
            <label
              htmlFor='email'
              className='block text-sm font-medium text-neutral-700 mb-1'
            >
              Email Address
            </label>
            <input
              type='email'
              id='email'
              value={connectEmail}
              onChange={(e) => setConnectEmail(e.target.value)}
              className='w-full px-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent'
              placeholder='your-store@example.com'
              required
            />
          </div>

          <div>
            <label
              htmlFor='country'
              className='block text-sm font-medium text-neutral-700 mb-1'
            >
              Country
            </label>
            <select
              id='country'
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              className='cursor-pointer w-full px-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent'
            >
              <option value='US'>United States</option>
              <option value='GB'>United Kingdom</option>
              <option value='CA'>Canada</option>
              <option value='AU'>Australia</option>
            </select>
          </div>

          <div>
            <label
              htmlFor='businessType'
              className='block text-sm font-medium text-neutral-700 mb-1'
            >
              Business Type
            </label>
            <select
              id='businessType'
              value={businessType}
              onChange={(e) => setBusinessType(e.target.value)}
              className='cursor-pointer w-full px-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent'
            >
              <option value='individual'>Individual</option>
              <option value='company'>Company</option>
            </select>
          </div>

          <div className='p-3 bg-blue-50 border border-blue-200 rounded-lg'>
            <p className='text-sm text-blue-800'>
              You will be redirected to Stripe to complete the account setup
              process.
            </p>
          </div>
        </div>
      </Modal>

      {/* Disconnect Confirmation Modal */}
      <Modal
        isOpen={isDisconnectModalOpen}
        onClose={() => setIsDisconnectModalOpen(false)}
        onDone={handleDisconnect}
        title='Disconnect Stripe Account'
        doneLabel='Disconnect'
        cancelLabel='Cancel'
      >
        <div className='space-y-4'>
          <div className='p-4 bg-error-50 border border-error-200 rounded-lg'>
            <p className='text-sm text-error-800'>
              <span className='font-semibold'>Warning:</span> Disconnecting your
              Stripe account will prevent you from receiving payouts. You can
              reconnect at any time.
            </p>
          </div>
          <p className='text-sm text-neutral-700'>
            Are you sure you want to disconnect your Stripe account?
          </p>
        </div>
      </Modal>
    </div>
  );
};
