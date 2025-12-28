import {
  MapPinIcon,
  PhoneIcon,
  PencilIcon,
  TrashIcon,
  CheckCircleIcon,
} from '@heroicons/react/24/outline';
import type { CustomerAddressDto } from '../../types/models/address';

interface AddressCardProps {
  address: CustomerAddressDto;
  onEdit: (address: CustomerAddressDto) => void;
  onDelete: (id: string) => void;
}

export const AddressCard = ({
  address,
  onEdit,
  onDelete,
}: AddressCardProps) => {
  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this address?')) {
      onDelete(address.id);
    }
  };

  return (
    <div className='relative group bg-white border border-neutral-200 rounded-lg p-5 hover:shadow-lg transition-all duration-300'>
      {/* Default Badge */}
      {address.isDefault && (
        <div className='absolute top-4 right-4 flex items-center gap-1.5 bg-primary-50 text-primary-700 px-3 py-1 rounded-full'>
          <CheckCircleIcon className='h-4 w-4' />
          <span className='text-xs font-semibold'>Default</span>
        </div>
      )}

      {/* Title */}
      {address.title && (
        <div className='mb-3'>
          <span className='inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium bg-neutral-100 text-neutral-800'>
            {address.title}
          </span>
        </div>
      )}

      {/* Full Name */}
      <h3 className='text-base font-semibold text-neutral-900 mb-3'>
        {address.fullName}
      </h3>

      {/* Address */}
      <div className='flex items-start gap-2 text-sm text-neutral-600 mb-2'>
        <MapPinIcon className='h-5 w-5 shrink-0 mt-0.5 text-neutral-400' />
        <span className='flex-1'>{address.fullAddress}</span>
      </div>

      {/* Phone */}
      {address.phoneNumber && (
        <div className='flex items-center gap-2 text-sm text-neutral-600 mb-4'>
          <PhoneIcon className='h-5 w-5 shrink-0 text-neutral-400' />
          <span>{address.phoneNumber}</span>
        </div>
      )}

      {/* Postal Code */}
      <div className='text-xs text-neutral-500 mb-4'>
        Postal Code: {address.postalCode}
      </div>

      {/* Actions */}
      <div className='flex items-center gap-2 pt-4 border-t border-neutral-100'>
        <button
          onClick={() => onEdit(address)}
          className='cursor-pointer flex-1 flex items-center justify-center gap-2 px-4 py-2 border border-neutral-300 text-neutral-700 rounded-lg font-medium hover:bg-neutral-50 transition-colors'
        >
          <PencilIcon className='h-4 w-4' />
          <span>Edit</span>
        </button>
        <button
          onClick={handleDelete}
          className='cursor-pointer p-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition-colors'
        >
          <TrashIcon className='h-5 w-5' />
        </button>
      </div>
    </div>
  );
};
