import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Modal } from '../ui';
import { CityWardSelector } from './CityWardSelector';
import type {
  CustomerAddressDto,
  CreateCustomerAddressDto,
} from '../../types/models/address';

interface AddressModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateCustomerAddressDto) => Promise<void>;
  address?: CustomerAddressDto | null;
}

export const AddressModal = ({
  isOpen,
  onClose,
  onSubmit,
  address,
}: AddressModalProps) => {
  const isEditMode = !!address;

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    setValue,
    watch,
  } = useForm<CreateCustomerAddressDto>({
    defaultValues: {
      fullName: '',
      title: '',
      addressLine: '',
      cityCode: 0,
      cityName: '',
      wardCode: 0,
      wardName: '',
      postalCode: '',
      phoneNumber: '',
      isDefault: false,
    },
  });

  // Watch city and ward values
  const cityCode = watch('cityCode');
  const cityName = watch('cityName');
  const wardCode = watch('wardCode');
  const wardName = watch('wardName');

  // Reset form when modal opens/closes or address changes
  useEffect(() => {
    if (isOpen && address) {
      reset({
        fullName: address.fullName,
        title: address.title || '',
        addressLine: address.addressLine,
        cityCode: address.cityCode,
        cityName: address.cityName,
        wardCode: address.wardCode,
        wardName: address.wardName,
        postalCode: address.postalCode,
        phoneNumber: address.phoneNumber || '',
        isDefault: address.isDefault,
      });
    } else if (isOpen && !address) {
      reset({
        fullName: '',
        title: '',
        addressLine: '',
        cityCode: 0,
        cityName: '',
        wardCode: 0,
        wardName: '',
        postalCode: '',
        phoneNumber: '',
        isDefault: false,
      });
    }
  }, [isOpen, address, reset]);

  const handleFormSubmit = async (data: CreateCustomerAddressDto) => {
    try {
      await onSubmit(data);
      onClose();
    } catch (error) {
      console.error('Failed to save address:', error);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditMode ? 'Edit Address' : 'Add New Address'}
      doneLabel={isSubmitting ? 'Saving...' : 'Save Address'}
      doneDisabled={isSubmitting}
      onDone={handleSubmit(handleFormSubmit)}
    >
      <form className='space-y-4'>
        {/* Title (Optional) */}
        <div>
          <label className='block text-sm font-medium text-neutral-700 mb-1'>
            Address Title (Optional)
          </label>
          <input
            type='text'
            placeholder='e.g., Home, Office, Warehouse'
            {...register('title')}
            className='w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500'
          />
        </div>

        {/* Full Name */}
        <div>
          <label className='block text-sm font-medium text-neutral-700 mb-1'>
            Full Name <span className='text-red-500'>*</span>
          </label>
          <input
            type='text'
            {...register('fullName', { required: 'Full name is required' })}
            className='w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500'
          />
          {errors.fullName && (
            <p className='mt-1 text-sm text-red-600'>
              {errors.fullName.message}
            </p>
          )}
        </div>

        {/* City & Ward Selector */}
        <CityWardSelector
          selectedCityCode={cityCode}
          selectedCityName={cityName}
          selectedWardCode={wardCode}
          selectedWardName={wardName}
          onCityChange={(code, name) => {
            setValue('cityCode', code);
            setValue('cityName', name);
          }}
          onWardChange={(code, name) => {
            setValue('wardCode', code);
            setValue('wardName', name);
          }}
        />

        {/* Address Line */}
        <div>
          <label className='block text-sm font-medium text-neutral-700 mb-1'>
            Street Address <span className='text-red-500'>*</span>
          </label>
          <input
            type='text'
            placeholder='House number, street name'
            {...register('addressLine', {
              required: 'Address line is required',
            })}
            className='w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500'
          />
          {errors.addressLine && (
            <p className='mt-1 text-sm text-red-600'>
              {errors.addressLine.message}
            </p>
          )}
        </div>

        {/* Phone Number */}
        <div>
          <label className='block text-sm font-medium text-neutral-700 mb-1'>
            Phone Number
          </label>
          <input
            type='tel'
            {...register('phoneNumber')}
            className='w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500'
          />
        </div>

        {/* Postal Code */}
        <div>
          <label className='block text-sm font-medium text-neutral-700 mb-1'>
            Postal Code <span className='text-red-500'>*</span>
          </label>
          <input
            type='text'
            {...register('postalCode', { required: 'Postal code is required' })}
            className='w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500'
          />
          {errors.postalCode && (
            <p className='mt-1 text-sm text-red-600'>
              {errors.postalCode.message}
            </p>
          )}
        </div>

        {/* Set as Default */}
        <div className='flex items-center mb-12'>
          <input
            type='checkbox'
            id='isDefault'
            {...register('isDefault')}
            className='h-4 w-4 text-primary-600 border-neutral-300 rounded focus:ring-primary-500 cursor-pointer'
          />
          <label
            htmlFor='isDefault'
            className='ml-2 block text-sm text-neutral-700 cursor-pointer'
          >
            Set as default address
          </label>
        </div>
      </form>
    </Modal>
  );
};
