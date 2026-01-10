import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { CityWardSelector } from '../../addresses/CityWardSelector';
import type {
  StoreAddressDto,
  CreateStoreAddressDto,
} from '../../../types/models/storeAddress';

interface AddLocationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateStoreAddressDto) => Promise<void>;
  initialData?: StoreAddressDto | null;
  isEdit?: boolean;
}

export const AddLocationModal = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  isEdit = false,
}: AddLocationModalProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    setValue,
    watch,
  } = useForm<CreateStoreAddressDto>({
    defaultValues: {
      addressLine: '',
      cityCode: 0,
      cityName: '',
      wardCode: 0,
      wardName: '',
      postalCode: '',
    },
  });

  // Watch city and ward values
  const cityCode = watch('cityCode');
  const cityName = watch('cityName');
  const wardCode = watch('wardCode');
  const wardName = watch('wardName');

  // Reset form when modal opens/closes or initialData changes
  useEffect(() => {
    if (isOpen && initialData) {
      reset({
        addressLine: initialData.addressLine,
        cityCode: initialData.cityCode,
        cityName: initialData.cityName,
        wardCode: initialData.wardCode,
        wardName: initialData.wardName,
        postalCode: initialData.postalCode,
      });
    } else if (isOpen && !initialData) {
      reset({
        addressLine: '',
        cityCode: 0,
        cityName: '',
        wardCode: 0,
        wardName: '',
        postalCode: '',
      });
    }
  }, [isOpen, initialData, reset]);

  const handleFormSubmit = async (data: CreateStoreAddressDto) => {
    try {
      await onSubmit(data);
      onClose();
    } catch (error) {
      console.error('Failed to save store address:', error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className='fixed inset-0 bg-black/50 bg-opacity-50 flex items-center justify-center z-50 p-4'>
      <div className='bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto'>
        {/* Header */}
        <div className='sticky top-0 bg-white border-b border-neutral-200 p-6 flex items-center justify-between'>
          <h2 className='text-2xl font-bold text-neutral-900'>
            {isEdit ? 'Edit Store Address' : 'Add Store Address'}
          </h2>
          <button
            onClick={onClose}
            className='p-2 hover:bg-neutral-100 rounded-lg transition-colors'
          >
            <XMarkIcon className='h-6 w-6 text-neutral-600' />
          </button>
        </div>

        <form
          onSubmit={handleSubmit(handleFormSubmit)}
          className='p-6 space-y-6'
        >
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
            <label className='block text-sm font-medium text-neutral-700 mb-2'>
              Street Address <span className='text-red-500'>*</span>
            </label>
            <input
              type='text'
              placeholder='House number, street name'
              {...register('addressLine', {
                required: 'Address line is required',
              })}
              className='w-full px-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent'
            />
            {errors.addressLine && (
              <p className='mt-1 text-sm text-red-600'>
                {errors.addressLine.message}
              </p>
            )}
          </div>

          {/* Postal Code */}
          <div>
            <label className='block text-sm font-medium text-neutral-700 mb-2'>
              Postal Code <span className='text-red-500'>*</span>
            </label>
            <input
              type='text'
              {...register('postalCode', {
                required: 'Postal code is required',
              })}
              className='w-full px-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent'
            />
            {errors.postalCode && (
              <p className='mt-1 text-sm text-red-600'>
                {errors.postalCode.message}
              </p>
            )}
          </div>

          {/* Actions */}
          <div className='flex justify-end gap-3 pt-4 border-t border-neutral-200'>
            <button
              type='button'
              onClick={onClose}
              disabled={isSubmitting}
              className='cursor-pointer px-4 py-2 border border-neutral-300 rounded-lg text-neutral-700 hover:bg-neutral-50 transition-colors disabled:opacity-50'
            >
              Cancel
            </button>
            <button
              type='submit'
              disabled={isSubmitting}
              className='cursor-pointer px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50'
            >
              {isSubmitting
                ? 'Saving...'
                : isEdit
                ? 'Save Changes'
                : 'Add Address'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
