import { useNavigate } from 'react-router-dom';
import {
  ShoppingBagIcon,
  ClockIcon,
  CheckCircleIcon,
} from '@heroicons/react/24/solid';
import { useUserProfile } from '../../hooks/useUserProfile';
import { getProductImageUrl } from '../../utils/cloudinaryHelpers';

export const AccountInfoSection = () => {
  const navigate = useNavigate();
  const { data, isLoading } = useUserProfile();

  if (isLoading) {
    return (
      <div>
        <div className='bg-white border-t border-x border-neutral-200 rounded-t-lg px-6 py-4'>
          <h2 className='text-xl font-semibold text-neutral-900'>
            Account Information
          </h2>
        </div>
        <div className='bg-white border border-neutral-200 rounded-b-lg p-6'>
          <div className='flex items-center justify-center py-20'>
            <p className='text-neutral-500'>Loading account information...</p>
          </div>
        </div>
      </div>
    );
  }

  const profile = data?.data;

  if (!profile) {
    return (
      <div>
        <div className='bg-white border-t border-x border-neutral-200 rounded-t-lg px-6 py-4'>
          <h2 className='text-xl font-semibold text-neutral-900'>
            Account Information
          </h2>
        </div>
        <div className='bg-white border border-neutral-200 rounded-b-lg p-6'>
          <div className='flex items-center justify-center py-20'>
            <p className='text-red-500'>Failed to load account information</p>
          </div>
        </div>
      </div>
    );
  }

  const getAvatarContent = () => {
    if (profile.avatarPublicId) {
      return (
        <img
          src={getProductImageUrl(profile.avatarPublicId, 'logo')}
          alt={`${profile.firstName} ${profile.lastName}`}
          className='w-full h-full object-cover'
        />
      );
    }

    // Fallback to first letter of first name
    return (
      <div className='w-full h-full flex items-center justify-center bg-primary-100 text-primary-600 text-4xl font-semibold'>
        {profile.firstName?.charAt(0)?.toUpperCase() || 'U'}
      </div>
    );
  };

  return (
    <div>
      {/* Header */}
      <div className='bg-white border-t border-x border-neutral-200 rounded-t-lg px-4 md:px-6 py-3 md:py-4'>
        <h2 className='text-lg md:text-xl font-semibold text-neutral-900'>
          Account Information
        </h2>
      </div>

      {/* Body */}
      <div className='bg-white border border-neutral-200 rounded-b-lg p-4 md:p-6'>
        <div className='flex flex-col lg:flex-row gap-6 md:gap-8'>
          {/* Left side - User Information */}
          <div className='flex-1'>
            <div className='flex flex-col sm:flex-row gap-4 md:gap-6 mb-6 md:mb-8'>
              {/* Avatar */}
              <div className='shrink-0 flex justify-center sm:justify-start'>
                <div className='w-20 h-20 md:w-28 md:h-28 rounded-full overflow-hidden border-4 border-neutral-200 shadow-md'>
                  {getAvatarContent()}
                </div>
              </div>

              {/* User Name and Status */}
              <div className='flex flex-col justify-center text-center sm:text-left'>
                <h3 className='text-xl md:text-2xl lg:text-3xl font-bold text-neutral-900 mb-2 md:mb-3'>
                  {profile.firstName} {profile.lastName}
                </h3>
                {profile.isActive ? (
                  <span className='inline-flex self-center md:self-start w-fit px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800 border border-green-200'>
                    Active
                  </span>
                ) : (
                  <span className='inline-flex self-center md:self-start w-fit px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800 border border-red-200'>
                    Inactive
                  </span>
                )}
              </div>
            </div>

            {/* Contact Information */}
            <div className='space-y-3 md:space-y-4 mb-6 md:mb-8'>
              <div className='flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3'>
                <span className='text-xs md:text-sm font-semibold text-neutral-700 sm:w-32'>
                  Email:
                </span>
                <span className='text-xs md:text-sm text-neutral-900 break-all'>
                  {profile.email}
                </span>
              </div>

              <div className='flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3'>
                <span className='text-xs md:text-sm font-semibold text-neutral-700 sm:w-32'>
                  Phone Number:
                </span>
                <span className='text-xs md:text-sm text-neutral-900'>
                  {profile.phoneNumber || 'Not provided'}
                </span>
              </div>
            </div>

            {/* Edit Button */}
            <button
              onClick={() => navigate('/user-account/profile')}
              className='cursor-pointer text-primary-500 flex items-center justify-center gap-2 border-3 border-primary-300 px-4 md:px-6 py-2 md:py-3 text-sm md:text-base font-bold hover:border-primary-500 transition-colors shadow-md w-full sm:w-auto'
            >
              <span className='uppercase'>Edit Account</span>
            </button>
          </div>

          {/* Right side - Order Statistics */}
          <div className='w-full lg:w-80 grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-1 gap-3 md:gap-4'>
            {/* Total Orders */}
            <div className='bg-blue-50 rounded-lg p-3 md:p-4 border border-blue-100'>
              <div className='flex items-center gap-2 md:gap-3'>
                <div className='w-10 h-10 md:w-12 md:h-12 bg-white rounded-lg flex items-center justify-center shrink-0'>
                  <ShoppingBagIcon className='h-5 w-5 md:h-6 md:w-6 text-blue-600' />
                </div>
                <div className='flex-1'>
                  <p className='text-xl md:text-2xl font-bold text-blue-900'>
                    {profile.totalOrders}
                  </p>
                  <p className='text-xs md:text-sm text-blue-700 font-medium'>
                    Total Orders
                  </p>
                </div>
              </div>
            </div>

            {/* In Process */}
            <div className='bg-amber-50 rounded-lg p-3 md:p-4 border border-amber-100'>
              <div className='flex items-center gap-2 md:gap-3'>
                <div className='w-10 h-10 md:w-12 md:h-12 bg-white rounded-lg flex items-center justify-center shrink-0'>
                  <ClockIcon className='h-5 w-5 md:h-6 md:w-6 text-amber-600' />
                </div>
                <div className='flex-1'>
                  <p className='text-xl md:text-2xl font-bold text-amber-900'>
                    {profile.pendingOrders}
                  </p>
                  <p className='text-xs md:text-sm text-amber-700 font-medium'>
                    In Process
                  </p>
                </div>
              </div>
            </div>

            {/* Completed Orders */}
            <div className='bg-green-50 rounded-lg p-3 md:p-4 border border-green-100'>
              <div className='flex items-center gap-2 md:gap-3'>
                <div className='w-10 h-10 md:w-12 md:h-12 bg-white rounded-lg flex items-center justify-center shrink-0'>
                  <CheckCircleIcon className='h-5 w-5 md:h-6 md:w-6 text-green-600' />
                </div>
                <div className='flex-1'>
                  <p className='text-xl md:text-2xl font-bold text-green-900'>
                    {profile.completedOrders}
                  </p>
                  <p className='text-xs md:text-sm text-green-700 font-medium'>
                    Completed Orders
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
