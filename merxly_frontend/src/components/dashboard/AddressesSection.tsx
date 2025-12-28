import { useState } from 'react';
import { PlusIcon } from '@heroicons/react/24/outline';
import { useAddresses } from '../../hooks/useAddresses';
import { AddressCard, AddressModal } from '../addresses';
import type {
  CustomerAddressDto,
  CreateCustomerAddressDto,
} from '../../types/models/address';

export const AddressesSection = () => {
  const { addresses, isLoading, createAddress, updateAddress, deleteAddress } =
    useAddresses();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAddress, setEditingAddress] =
    useState<CustomerAddressDto | null>(null);

  const handleAddAddress = () => {
    setEditingAddress(null);
    setIsModalOpen(true);
  };

  const handleEditAddress = (address: CustomerAddressDto) => {
    setEditingAddress(address);
    setIsModalOpen(true);
  };

  const handleSubmit = async (data: CreateCustomerAddressDto) => {
    try {
      if (editingAddress) {
        await updateAddress(editingAddress.id, data);
      } else {
        await createAddress(data);
      }
      setIsModalOpen(false);
      setEditingAddress(null);
    } catch (error) {
      console.error('Failed to save address:', error);
    }
  };

  const handleDeleteAddress = async (id: string) => {
    try {
      await deleteAddress(id);
    } catch (error) {
      console.error('Failed to delete address:', error);
    }
  };

  if (isLoading) {
    return (
      <div>
        <div className='bg-white border-t border-x border-neutral-200 rounded-t-lg px-6 py-4'>
          <h2 className='text-xl font-semibold text-neutral-900'>Addresses</h2>
        </div>
        <div className='bg-white border border-neutral-200 rounded-b-lg p-6'>
          <div className='flex items-center justify-center py-20'>
            <p className='text-neutral-500'>Loading addresses...</p>
          </div>
        </div>
      </div>
    );
  }

  const hasAddresses = addresses.length > 0;

  return (
    <div>
      {/* Header */}
      <div className='bg-white border-t border-x border-neutral-200 rounded-t-lg px-6 py-4 flex items-center justify-between'>
        <h2 className='text-xl font-semibold text-neutral-900'>Addresses</h2>
        {hasAddresses && (
          <button
            onClick={handleAddAddress}
            className='cursor-pointer flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 transition-colors'
          >
            <PlusIcon className='h-5 w-5' />
            <span>Add Address</span>
          </button>
        )}
      </div>

      {/* Body */}
      <div className='bg-white border border-neutral-200 rounded-b-lg p-6'>
        {!hasAddresses ? (
          <div className='text-center py-12'>
            <div className='text-neutral-400 mb-4'>
              <svg
                className='mx-auto h-12 w-12'
                fill='none'
                viewBox='0 0 24 24'
                stroke='currentColor'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z'
                />
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M15 11a3 3 0 11-6 0 3 3 0 016 0z'
                />
              </svg>
            </div>
            <h3 className='text-lg font-medium text-neutral-900 mb-2'>
              No addresses yet
            </h3>
            <p className='text-neutral-500 mb-6'>
              Add your delivery address for faster checkout
            </p>
            <button
              onClick={handleAddAddress}
              className='cursor-pointer inline-flex items-center gap-2 px-6 py-3 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 transition-colors'
            >
              <PlusIcon className='h-5 w-5' />
              <span>Add Your First Address</span>
            </button>
          </div>
        ) : (
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
            {addresses.map((address) => (
              <AddressCard
                key={address.id}
                address={address}
                onEdit={handleEditAddress}
                onDelete={handleDeleteAddress}
              />
            ))}
          </div>
        )}
      </div>

      {/* Address Modal */}
      <AddressModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingAddress(null);
        }}
        onSubmit={handleSubmit}
        address={editingAddress}
      />
    </div>
  );
};
