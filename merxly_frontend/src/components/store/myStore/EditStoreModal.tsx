import { XMarkIcon } from '@heroicons/react/24/outline';
import { useState } from 'react';

interface StoreFormData {
  storeName: string;
  description: string;
  email: string;
  phoneNumber: string;
  website: string;
}

interface EditStoreModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: StoreFormData) => void;
  initialData: StoreFormData;
}

export const EditStoreModal = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
}: EditStoreModalProps) => {
  const [formData, setFormData] = useState<StoreFormData>(initialData);

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
    <div className='fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4'>
      <div className='bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto'>
        {/* Header */}
        <div className='sticky top-0 bg-white border-b border-neutral-200 p-6 flex items-center justify-between'>
          <h2 className='text-2xl font-bold text-neutral-900'>
            Edit Store Information
          </h2>
          <button
            onClick={onClose}
            className='p-2 hover:bg-neutral-100 rounded-lg transition-colors'
          >
            <XMarkIcon className='h-6 w-6 text-neutral-600' />
          </button>
        </div>

        <form onSubmit={handleSubmit} className='p-6 space-y-6'>
          {/* Store Name */}
          <div>
            <label className='block text-sm font-medium text-neutral-700 mb-2'>
              Store Name <span className='text-error-600'>*</span>
            </label>
            <input
              type='text'
              name='storeName'
              value={formData.storeName}
              onChange={handleChange}
              placeholder='Enter your store name'
              required
              className='w-full px-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent'
            />
          </div>

          {/* Description */}
          <div>
            <label className='block text-sm font-medium text-neutral-700 mb-2'>
              Description
            </label>
            <textarea
              name='description'
              value={formData.description}
              onChange={handleChange}
              placeholder='Describe your store and what you sell'
              rows={4}
              className='w-full px-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none'
            />
          </div>

          {/* Email and Phone */}
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            <div>
              <label className='block text-sm font-medium text-neutral-700 mb-2'>
                Email <span className='text-error-600'>*</span>
              </label>
              <input
                type='email'
                name='email'
                value={formData.email}
                onChange={handleChange}
                placeholder='store@example.com'
                required
                className='w-full px-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent'
              />
            </div>

            <div>
              <label className='block text-sm font-medium text-neutral-700 mb-2'>
                Phone Number <span className='text-error-600'>*</span>
              </label>
              <input
                type='tel'
                name='phoneNumber'
                value={formData.phoneNumber}
                onChange={handleChange}
                placeholder='+1 (555) 123-4567'
                required
                className='w-full px-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent'
              />
            </div>
          </div>

          {/* Website */}
          <div>
            <label className='block text-sm font-medium text-neutral-700 mb-2'>
              Website
            </label>
            <input
              type='url'
              name='website'
              value={formData.website}
              onChange={handleChange}
              placeholder='https://www.yourstore.com'
              className='w-full px-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent'
            />
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
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
