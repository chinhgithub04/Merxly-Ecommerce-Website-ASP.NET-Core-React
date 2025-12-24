import { MapPinIcon } from '@heroicons/react/24/outline';

interface StoreLocation {
  id: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  stateProvince: string;
  postalCode: string;
  createdAt: string;
}

interface LocationCardProps {
  location: StoreLocation;
  onEdit: () => void;
}

export const LocationCard = ({ location, onEdit }: LocationCardProps) => {
  return (
    <div className='bg-white rounded-lg border border-neutral-200 p-6'>
      <div className='flex items-start justify-between mb-4'>
        <div className='flex items-center gap-3'>
          <div className='p-2 bg-primary-50 rounded-lg'>
            <MapPinIcon className='h-6 w-6 text-primary-600' />
          </div>
          <div>
            <h3 className='text-lg font-semibold text-neutral-900'>
              Store Address
            </h3>
          </div>
        </div>
      </div>

      <div className='space-y-2 mb-4'>
        <p className='text-sm text-neutral-700'>{location.addressLine1}</p>
        {location.addressLine2 && (
          <p className='text-sm text-neutral-700'>{location.addressLine2}</p>
        )}
        <p className='text-sm text-neutral-700'>
          {location.city}, {location.stateProvince} {location.postalCode}
        </p>
      </div>

      <div className='flex items-center gap-2 pt-4 border-t border-neutral-200'>
        <button
          onClick={onEdit}
          className='text-sm font-medium text-primary-600 hover:text-primary-700'
        >
          Edit Address
        </button>
      </div>
    </div>
  );
};
