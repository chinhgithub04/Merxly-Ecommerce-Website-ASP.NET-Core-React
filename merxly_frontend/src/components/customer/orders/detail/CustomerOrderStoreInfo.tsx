import {
  BuildingStorefrontIcon,
  MapPinIcon,
  PhoneIcon,
  EnvelopeIcon,
} from '@heroicons/react/24/outline';
import { getProductImageUrl } from '../../../../utils/cloudinaryHelpers';

interface CustomerOrderStoreInfoProps {
  storeName: string;
  storeLogoImagePublicId?: string;
  storeBannerImagePublicId?: string;
  storeEmail: string;
  storePhoneNumber: string;
  storeFullAddress: string;
  storePostalCode?: string;
}

export const CustomerOrderStoreInfo = ({
  storeName,
  storeLogoImagePublicId,
  storeBannerImagePublicId,
  storeEmail,
  storePhoneNumber,
  storeFullAddress,
  storePostalCode,
}: CustomerOrderStoreInfoProps) => {
  return (
    <div className='space-y-4'>
      <h3 className='text-lg font-semibold text-neutral-900'>
        Store Information
      </h3>
      <div className='space-y-3'>
        {/* Store Banner & Logo */}
        <div className='relative h-32'>
          {/* Banner */}
          {storeBannerImagePublicId ? (
            <img
              src={getProductImageUrl(storeBannerImagePublicId, 'banner')}
              alt={`${storeName} banner`}
              className='w-full h-32 object-cover rounded-lg'
            />
          ) : (
            <div className='w-full h-32 bg-gradient-to-r from-primary-50 to-primary-100 rounded-lg' />
          )}

          {/* Dark overlay */}
          <div className='absolute inset-0 bg-black/50 rounded-lg' />

          {/* Logo and Store Information overlapping banner */}
          <div className='absolute inset-0 p-4 flex items-center gap-4'>
            {/* Circle Logo */}
            {storeLogoImagePublicId ? (
              <img
                src={getProductImageUrl(storeLogoImagePublicId, 'logo')}
                alt={storeName}
                className='w-20 h-20 object-cover rounded-full border-4 border-white shadow-lg flex-shrink-0'
              />
            ) : (
              <div className='w-20 h-20 bg-white rounded-full border-4 border-white shadow-lg flex items-center justify-center flex-shrink-0'>
                <BuildingStorefrontIcon className='h-10 w-10 text-neutral-600' />
              </div>
            )}

            {/* Store Details */}
            <div className='flex-1 space-y-1'>
              <p className='font-semibold text-lg text-white drop-shadow-lg'>
                {storeName}
              </p>
              <div className='flex items-center gap-2 text-sm text-white drop-shadow-md'>
                <MapPinIcon className='h-4 w-4 flex-shrink-0' />
                <span>
                  {storeFullAddress}, {storePostalCode}
                </span>
              </div>
              <div className='flex items-center gap-2 text-sm text-white drop-shadow-md'>
                <PhoneIcon className='h-4 w-4 flex-shrink-0' />
                <span>{storePhoneNumber}</span>
              </div>
              <div className='flex items-center gap-2 text-sm text-white drop-shadow-md'>
                <EnvelopeIcon className='h-4 w-4 flex-shrink-0' />
                <span>{storeEmail}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
