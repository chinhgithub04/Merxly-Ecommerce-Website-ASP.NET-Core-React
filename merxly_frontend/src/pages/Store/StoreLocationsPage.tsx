import { useState } from 'react';
import { MapPinIcon, PlusIcon } from '@heroicons/react/24/outline';
import { LocationCard } from '../../components/store/locations/LocationCard';
import { AddLocationModal } from '../../components/store/locations/AddLocationModal';

interface StoreLocation {
  id: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  stateProvince: string;
  postalCode: string;
  createdAt: string;
}

// Mock store address (null = no address set yet)
const mockStoreAddress: StoreLocation | null = {
  id: '1',
  addressLine1: '123 Commerce Street',
  addressLine2: 'Building A, Suite 200',
  city: 'New York',
  stateProvince: 'NY',
  postalCode: '10001',
  createdAt: '2024-01-15T10:00:00',
};

export const StoreLocationsPage = () => {
  const [storeAddress, setStoreAddress] = useState<StoreLocation | null>(
    mockStoreAddress
  );
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSaveAddress = (data: any) => {
    if (storeAddress) {
      // Update existing address
      setStoreAddress({
        ...storeAddress,
        ...data,
      });
    } else {
      // Create new address
      setStoreAddress({
        id: '1',
        ...data,
        createdAt: new Date().toISOString(),
      });
    }
  };

  const handleEditAddress = () => {
    setIsModalOpen(true);
  };

  return (
    <div className='space-y-6'>
      {/* Page Header */}
      <div className='flex items-center justify-between'>
        <div className='flex items-center gap-3'>
          <div className='p-2 bg-primary-50 rounded-lg'>
            <MapPinIcon className='h-6 w-6 text-primary-600' />
          </div>
          <div>
            <h1 className='text-3xl font-bold text-neutral-900'>
              Store Location
            </h1>
            <p className='text-sm text-neutral-600'>
              Manage your store's physical address
            </p>
          </div>
        </div>
      </div>

      {/* Info Card */}
      <div className='bg-blue-50 border border-blue-200 rounded-lg p-4'>
        <div className='flex items-start gap-3'>
          <div className='flex-shrink-0'>
            <svg
              className='h-5 w-5 text-blue-600'
              fill='none'
              viewBox='0 0 24 24'
              stroke='currentColor'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
              />
            </svg>
          </div>
          <div>
            <h3 className='text-sm font-semibold text-blue-900 mb-1'>
              About Store Address
            </h3>
            <p className='text-sm text-blue-800'>
              This is your store's physical location. It will be used for
              shipping, returns, and displayed to customers.
            </p>
          </div>
        </div>
      </div>

      {/* Store Address */}
      {storeAddress ? (
        <div className='max-w-2xl'>
          <LocationCard location={storeAddress} onEdit={handleEditAddress} />
        </div>
      ) : (
        <div className='bg-white rounded-lg border border-neutral-200 p-12 text-center max-w-2xl'>
          <MapPinIcon className='h-12 w-12 text-neutral-400 mx-auto mb-4' />
          <h3 className='text-lg font-semibold text-neutral-900 mb-2'>
            No address set
          </h3>
          <p className='text-neutral-600 mb-6'>
            Add your store's physical address to get started
          </p>
          <button
            onClick={() => setIsModalOpen(true)}
            className='inline-flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors'
          >
            <PlusIcon className='h-5 w-5' />
            Add Address
          </button>
        </div>
      )}

      {/* Add/Edit Address Modal */}
      <AddLocationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSaveAddress}
        initialData={storeAddress || undefined}
        isEdit={!!storeAddress}
      />
    </div>
  );
};
