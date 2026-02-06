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
    <div className='space-y-3 md:space-y-4'>
      <h3 className='text-base md:text-lg font-semibold text-neutral-900'>
        Store Information
      </h3>
      <div className='space-y-3'>
        {/* Store Banner & Logo */}
        <div className='relative h-24 md:h-32'>
          {/* Banner */}
          {storeBannerImagePublicId ? (
            <img
              src={getProductImageUrl(storeBannerImagePublicId, 'banner')}
              alt={`${storeName} banner`}
              className='w-full h-24 md:h-32 object-cover rounded-lg'
            />
          ) : (
            <div className='w-full h-24 md:h-32 bg-linear-to-r from-primary-50 to-primary-100 rounded-lg' />
          )}

          {/* Dark overlay */}
          <div className='absolute inset-0 bg-black/50 rounded-lg' />

          {/* Logo and Store Information overlapping banner */}
          <div className='absolute inset-0 p-3 md:p-4 flex items-center gap-3 md:gap-4'>
            {/* Circle Logo */}
            {storeLogoImagePublicId ? (
              <img
                src={getProductImageUrl(storeLogoImagePublicId, 'logo')}
                alt={storeName}
                className='w-14 h-14 md:w-20 md:h-20 object-cover rounded-full border-4 border-white shadow-lg shrink-0'
              />
            ) : (
              <div className='w-14 h-14 md:w-20 md:h-20 bg-white rounded-full border-4 border-white shadow-lg flex items-center justify-center shrink-0'>
                <BuildingStorefrontIcon className='h-7 w-7 md:h-10 md:w-10 text-neutral-600' />
              </div>
            )}

            {/* Store Details */}
            <div className='flex-1 space-y-1 min-w-0'>
              <p className='font-semibold text-sm md:text-lg text-white drop-shadow-lg truncate'>
                {storeName}
              </p>
              <div className='flex items-center gap-2 text-[11px] md:text-sm text-white drop-shadow-md'>
                <MapPinIcon className='h-3.5 w-3.5 md:h-4 md:w-4 shrink-0' />
                <span className='truncate'>
                  {storeFullAddress}, {storePostalCode}
                </span>
              </div>
              <div className='flex items-center gap-2 text-[11px] md:text-sm text-white drop-shadow-md'>
                <PhoneIcon className='h-3.5 w-3.5 md:h-4 md:w-4 shrink-0' />
                <span className='truncate'>{storePhoneNumber}</span>
              </div>
              <div className='flex items-center gap-2 text-[11px] md:text-sm text-white drop-shadow-md'>
                <EnvelopeIcon className='h-3.5 w-3.5 md:h-4 md:w-4 shrink-0' />
                <span className='truncate'>{storeEmail}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
