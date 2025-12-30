import { useState } from 'react';
import { PencilIcon } from '@heroicons/react/24/outline';
import type { CustomerAddressDto } from '../../types/models/address';
import { AddressModal } from '../addresses/AddressModal';
import { useAddresses } from '../../hooks/useAddresses';

interface ShippingSectionProps {
  selectedAddress: CustomerAddressDto | null;
  onSelectAddress: (address: CustomerAddressDto) => void;
}

export const ShippingSection = ({
  selectedAddress,
  onSelectAddress,
}: ShippingSectionProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSelectingAddress, setIsSelectingAddress] = useState(false);
  const { addresses, createAddress } = useAddresses();

  const handleSaveAddress = async (data: any) => {
    const response = await createAddress(data);
    if (response.data) {
      onSelectAddress(response.data);
      setIsModalOpen(false);
      setIsSelectingAddress(false);
    }
  };

  return (
    <div className='bg-white border border-neutral-200 rounded-lg p-6'>
      <div className='flex items-center justify-between mb-4'>
        <h2 className='text-lg font-semibold text-neutral-900'>
          Shipping Information
        </h2>
        {selectedAddress && !isSelectingAddress && (
          <button
            onClick={() => setIsSelectingAddress(true)}
            className='cursor-pointer flex items-center gap-2 text-sm text-primary-600 hover:text-primary-700 font-medium'
          >
            <PencilIcon className='h-4 w-4' />
            Change
          </button>
        )}
      </div>

      {!selectedAddress && !isSelectingAddress ? (
        <div className='text-center py-6'>
          <p className='text-sm text-neutral-600 mb-4'>
            No address found. Please add a shipping address.
          </p>
          <button
            onClick={() => setIsModalOpen(true)}
            className='cursor-pointer px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors'
          >
            Add Address
          </button>
        </div>
      ) : isSelectingAddress ? (
        <div className='space-y-3'>
          {addresses.map((address) => (
            <div
              key={address.id}
              onClick={() => {
                onSelectAddress(address);
                setIsSelectingAddress(false);
              }}
              className={`cursor-pointer p-4 border rounded-lg transition-colors ${
                selectedAddress?.id === address.id
                  ? 'border-primary-600 bg-primary-50'
                  : 'border-neutral-200 hover:border-primary-300'
              }`}
            >
              <div className='flex items-start justify-between'>
                <div>
                  <p className='font-medium text-neutral-900'>
                    {address.fullName}
                  </p>
                  <p className='text-sm text-neutral-600 mt-1'>
                    {address.phoneNumber}
                  </p>
                  <p className='text-sm text-neutral-600 mt-1'>
                    {address.fullAddress}
                  </p>
                </div>
                {address.isDefault && (
                  <span className='text-xs bg-primary-100 text-primary-700 px-2 py-1 rounded'>
                    Default
                  </span>
                )}
              </div>
            </div>
          ))}
          <button
            onClick={() => setIsModalOpen(true)}
            className='cursor-pointer w-full px-4 py-3 border-2 border-dashed border-neutral-300 rounded-lg text-neutral-600 hover:border-primary-400 hover:text-primary-600 transition-colors'
          >
            + Add New Address
          </button>
        </div>
      ) : (
        <div className='p-4 bg-neutral-50 rounded-lg'>
          <p className='font-medium text-neutral-900'>
            {selectedAddress?.fullName}
          </p>
          <p className='text-sm text-neutral-600 mt-1'>
            {selectedAddress?.phoneNumber}
          </p>
          <p className='text-sm text-neutral-600 mt-1'>
            {selectedAddress?.fullAddress}
          </p>
        </div>
      )}

      <AddressModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSaveAddress}
      />
    </div>
  );
};
