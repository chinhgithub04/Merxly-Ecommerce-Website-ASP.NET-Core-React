import {
  ShieldCheckIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  ClockIcon,
} from '@heroicons/react/24/outline';

interface StoreVerificationCardProps {
  isVerified: boolean;
  isActive: boolean;
}

export const StoreVerificationCard = ({
  isVerified,
  isActive,
}: StoreVerificationCardProps) => {
  return (
    <div className='bg-white rounded-lg border border-neutral-200'>
      <div className='p-6 border-b border-neutral-200'>
        <div className='flex items-center gap-3'>
          <div className='p-2 bg-primary-50 rounded-lg'>
            <ShieldCheckIcon className='h-6 w-6 text-primary-600' />
          </div>
          <div>
            <h2 className='text-lg font-semibold text-neutral-900'>
              Store Status & Verification
            </h2>
            <p className='text-sm text-neutral-600'>
              Your store's operational status
            </p>
          </div>
        </div>
      </div>

      <div className='p-6 space-y-6'>
        {/* Store Active Status */}
        <div className='flex items-start gap-4 p-4 bg-neutral-50 rounded-lg'>
          <div>
            {isActive ? (
              <div className='p-2 bg-success-100 rounded-full'>
                <CheckCircleIcon className='h-6 w-6 text-success-600' />
              </div>
            ) : (
              <div className='p-2 bg-error-100 rounded-full'>
                <ExclamationTriangleIcon className='h-6 w-6 text-error-600' />
              </div>
            )}
          </div>
          <div className='flex-1'>
            <h3 className='text-base font-semibold text-neutral-900 mb-1'>
              Store Status: {isActive ? 'Active' : 'Inactive'}
            </h3>
            {isActive ? (
              <p className='text-sm text-neutral-600 mb-3'>
                Your store is currently active and visible to customers. You can
                receive orders and process sales.
              </p>
            ) : (
              <p className='text-sm text-neutral-600 mb-3'>
                Your store is currently inactive. Customers cannot see your
                store or place orders. Activate your store to start selling.
              </p>
            )}
            <button
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-error-600 text-white hover:bg-error-700'
                  : 'bg-success-600 text-white hover:bg-success-700'
              }`}
            >
              {isActive ? 'Deactivate Store' : 'Activate Store'}
            </button>
          </div>
        </div>

        {/* Verification Status */}
        <div className='flex items-start gap-4 p-4 bg-neutral-50 rounded-lg'>
          <div>
            {isVerified ? (
              <div className='p-2 bg-success-100 rounded-full'>
                <CheckCircleIcon className='h-6 w-6 text-success-600' />
              </div>
            ) : (
              <div className='p-2 bg-yellow-100 rounded-full'>
                <ClockIcon className='h-6 w-6 text-yellow-600' />
              </div>
            )}
          </div>
          <div className='flex-1'>
            <h3 className='text-base font-semibold text-neutral-900 mb-1'>
              Verification: {isVerified ? 'Verified' : 'Pending'}
            </h3>
            {isVerified ? (
              <div>
                <p className='text-sm text-neutral-600 mb-2'>
                  Your store has been verified by our team. Verified stores
                  enjoy:
                </p>
                <ul className='text-sm text-neutral-600 space-y-1 ml-4 list-disc'>
                  <li>Verified badge on store page</li>
                  <li>Higher visibility in search results</li>
                  <li>Increased customer trust</li>
                  <li>Access to premium features</li>
                </ul>
              </div>
            ) : (
              <div>
                <p className='text-sm text-neutral-600 mb-3'>
                  Your store verification is currently pending review. Our team
                  is reviewing your store information and will notify you once
                  approved.
                </p>
                <div className='p-3 bg-yellow-50 border border-yellow-200 rounded-lg'>
                  <p className='text-sm text-yellow-800'>
                    <span className='font-semibold'>
                      Required for verification:
                    </span>
                  </p>
                  <ul className='text-sm text-yellow-700 mt-2 space-y-1 ml-4 list-disc'>
                    <li>Complete store information</li>
                    <li>Valid business documentation</li>
                    <li>Connected payment account</li>
                    <li>Store address verification</li>
                  </ul>
                </div>
                <button className='mt-3 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors text-sm font-medium'>
                  Request Verification
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Additional Info */}
        <div className='p-4 bg-blue-50 border border-blue-200 rounded-lg'>
          <p className='text-sm text-blue-800'>
            <span className='font-semibold'>Need help?</span> If you have
            questions about store status or verification, please contact our
            support team.
          </p>
        </div>
      </div>
    </div>
  );
};
