import { XMarkIcon } from '@heroicons/react/24/outline';
import { useState } from 'react';

interface LocationFormData {
  addressLine1: string;
  addressLine2: string;
  city: string;
  stateProvince: string;
  postalCode: string;
}

interface AddLocationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: LocationFormData) => void;
  initialData?: Partial<LocationFormData>;
  isEdit?: boolean;
}

export const AddLocationModal = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  isEdit = false,
}: AddLocationModalProps) => {
  const [formData, setFormData] = useState<LocationFormData>({
    addressLine1: initialData?.addressLine1 || '',
    addressLine2: initialData?.addressLine2 || '',
    city: initialData?.city || '',
    stateProvince: initialData?.stateProvince || '',
    postalCode: initialData?.postalCode || '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    onClose();
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
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

        <form onSubmit={handleSubmit} className='p-6 space-y-6'>
          {/* Address Line 1 */}
          <div>
            <label className='block text-sm font-medium text-neutral-700 mb-2'>
              Address Line 1 <span className='text-error-600'>*</span>
            </label>
            <input
              type='text'
              name='addressLine1'
              value={formData.addressLine1}
              onChange={handleChange}
              placeholder='Street address'
              required
              className='w-full px-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent'
            />
          </div>

          {/* Address Line 2 */}
          <div>
            <label className='block text-sm font-medium text-neutral-700 mb-2'>
              Address Line 2
            </label>
            <input
              type='text'
              name='addressLine2'
              value={formData.addressLine2}
              onChange={handleChange}
              placeholder='Apartment, suite, unit, building, floor, etc.'
              className='w-full px-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent'
            />
          </div>

          {/* City, State, Postal Code */}
          <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
            <div>
              <label className='block text-sm font-medium text-neutral-700 mb-2'>
                City <span className='text-error-600'>*</span>
              </label>
              <input
                type='text'
                name='city'
                value={formData.city}
                onChange={handleChange}
                placeholder='City'
                required
                className='w-full px-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent'
              />
            </div>

            <div>
              <label className='block text-sm font-medium text-neutral-700 mb-2'>
                State/Province <span className='text-error-600'>*</span>
              </label>
              <input
                type='text'
                name='stateProvince'
                value={formData.stateProvince}
                onChange={handleChange}
                placeholder='State'
                required
                className='w-full px-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent'
              />
            </div>

            <div>
              <label className='block text-sm font-medium text-neutral-700 mb-2'>
                Postal Code <span className='text-error-600'>*</span>
              </label>
              <input
                type='text'
                name='postalCode'
                value={formData.postalCode}
                onChange={handleChange}
                placeholder='ZIP code'
                required
                className='w-full px-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent'
              />
            </div>
          </div>

          {/* Actions */}
          <div className='flex justify-end gap-3 pt-4 border-t border-neutral-200'>
            <button
              type='button'
              onClick={onClose}
              className='px-4 py-2 border border-neutral-300 rounded-lg text-neutral-700 hover:bg-neutral-50 transition-colors'
            >
              Cancel
            </button>
            <button
              type='submit'
              className='px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors'
            >
              {isEdit ? 'Save Changes' : 'Add Address'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
