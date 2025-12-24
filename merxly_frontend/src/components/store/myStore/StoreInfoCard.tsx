import {
  BuildingStorefrontIcon,
  CheckCircleIcon,
  XCircleIcon,
} from '@heroicons/react/24/outline';

interface StoreInfoCardProps {
  storeName: string;
  description?: string;
  email: string;
  phoneNumber: string;
  website?: string;
  isActive: boolean;
  isVerified: boolean;
  commissionRate: number;
  onEdit: () => void;
}

export const StoreInfoCard = ({
  storeName,
  description,
  email,
  phoneNumber,
  website,
  isActive,
  isVerified,
  commissionRate,
  onEdit,
}: StoreInfoCardProps) => {
  return (
    <div className='bg-white rounded-lg border border-neutral-200'>
      <div className='p-6 border-b border-neutral-200'>
        <div className='flex items-center justify-between'>
          <div className='flex items-center gap-3'>
            <div className='p-2 bg-primary-50 rounded-lg'>
              <BuildingStorefrontIcon className='h-6 w-6 text-primary-600' />
            </div>
            <div>
              <h2 className='text-lg font-semibold text-neutral-900'>
                Store Information
              </h2>
              <p className='text-sm text-neutral-600'>
                Basic details about your store
              </p>
            </div>
          </div>
          <button
            onClick={onEdit}
            className='px-4 py-2 border border-neutral-300 rounded-lg text-neutral-700 hover:bg-neutral-50 transition-colors'
          >
            Edit
          </button>
        </div>
      </div>

      <div className='p-6 space-y-6'>
        {/* Store Name */}
        <div>
          <label className='block text-sm font-medium text-neutral-600 mb-1'>
            Store Name
          </label>
          <p className='text-base font-semibold text-neutral-900'>
            {storeName}
          </p>
        </div>

        {/* Description */}
        {description && (
          <div>
            <label className='block text-sm font-medium text-neutral-600 mb-1'>
              Description
            </label>
            <p className='text-base text-neutral-900'>{description}</p>
          </div>
        )}

        {/* Contact Information */}
        <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
          <div>
            <label className='block text-sm font-medium text-neutral-600 mb-1'>
              Email
            </label>
            <p className='text-base text-neutral-900'>{email}</p>
          </div>

          <div>
            <label className='block text-sm font-medium text-neutral-600 mb-1'>
              Phone Number
            </label>
            <p className='text-base text-neutral-900'>{phoneNumber}</p>
          </div>
        </div>

        {/* Website */}
        {website && (
          <div>
            <label className='block text-sm font-medium text-neutral-600 mb-1'>
              Website
            </label>
            <a
              href={website}
              target='_blank'
              rel='noopener noreferrer'
              className='text-base text-primary-600 hover:text-primary-700 hover:underline'
            >
              {website}
            </a>
          </div>
        )}

        {/* Status and Commission */}
        <div className='grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 border-t border-neutral-200'>
          <div>
            <label className='block text-sm font-medium text-neutral-600 mb-2'>
              Store Status
            </label>
            <div className='flex items-center gap-2'>
              {isActive ? (
                <>
                  <CheckCircleIcon className='h-5 w-5 text-success-600' />
                  <span className='text-sm font-medium text-success-700'>
                    Active
                  </span>
                </>
              ) : (
                <>
                  <XCircleIcon className='h-5 w-5 text-error-600' />
                  <span className='text-sm font-medium text-error-700'>
                    Inactive
                  </span>
                </>
              )}
            </div>
          </div>

          <div>
            <label className='block text-sm font-medium text-neutral-600 mb-2'>
              Verification
            </label>
            <div className='flex items-center gap-2'>
              {isVerified ? (
                <>
                  <CheckCircleIcon className='h-5 w-5 text-success-600' />
                  <span className='text-sm font-medium text-success-700'>
                    Verified
                  </span>
                </>
              ) : (
                <>
                  <XCircleIcon className='h-5 w-5 text-yellow-600' />
                  <span className='text-sm font-medium text-yellow-700'>
                    Pending
                  </span>
                </>
              )}
            </div>
          </div>

          <div>
            <label className='block text-sm font-medium text-neutral-600 mb-2'>
              Commission Rate
            </label>
            <p className='text-base font-semibold text-neutral-900'>
              {commissionRate}%
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
