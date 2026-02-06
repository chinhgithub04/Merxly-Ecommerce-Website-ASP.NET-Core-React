import { useState } from 'react';
import {
  MapPinIcon,
  PhoneIcon,
  PencilIcon,
  TrashIcon,
  CheckCircleIcon,
} from '@heroicons/react/24/outline';
import type { CustomerAddressDto } from '../../types/models/address';
import { Modal } from '../ui/Modal';

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
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = () => {
    onDelete(address.id);
    setShowDeleteModal(false);
  };

  const handleDeleteModalClose = () => {
    setShowDeleteModal(false);
  };

  return (
    <div className='relative group bg-white border border-neutral-200 rounded-lg p-4 md:p-5 hover:shadow-lg transition-all duration-300'>
      {/* Title and Default Badge - Same Line */}
      <div className='flex items-center justify-between gap-2 mb-3'>
        {address.title && (
          <span className='inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium bg-neutral-100 text-neutral-800'>
            {address.title}
          </span>
        )}
        {address.isDefault && (
          <div className='flex items-center gap-1.5 bg-primary-50 text-primary-700 px-2 md:px-3 py-1 rounded-full ml-auto'>
            <CheckCircleIcon className='h-3 w-3 md:h-4 md:w-4' />
            <span className='text-xs font-semibold'>Default</span>
          </div>
        )}
      </div>

      {/* Full Name */}
      <h3 className='text-sm md:text-base font-semibold text-neutral-900 mb-2 md:mb-3'>
        {address.fullName}
      </h3>

      {/* Address */}
      <div className='flex items-start gap-2 text-xs md:text-sm text-neutral-600 mb-2'>
        <MapPinIcon className='h-4 w-4 md:h-5 md:w-5 shrink-0 mt-0.5 text-neutral-400' />
        <span className='flex-1'>{address.fullAddress}</span>
      </div>

      {/* Phone */}
      {address.phoneNumber && (
        <div className='flex items-center gap-2 text-xs md:text-sm text-neutral-600 mb-3 md:mb-4'>
          <PhoneIcon className='h-4 w-4 md:h-5 md:w-5 shrink-0 text-neutral-400' />
          <span>{address.phoneNumber}</span>
        </div>
      )}

      {/* Postal Code */}
      <div className='text-xs text-neutral-500 mb-3 md:mb-4'>
        Postal Code: {address.postalCode}
      </div>

      {/* Actions */}
      <div className='flex items-center gap-2 pt-3 md:pt-4 border-t border-neutral-100'>
        <button
          onClick={() => onEdit(address)}
          className='cursor-pointer flex-1 flex items-center justify-center gap-2 px-3 md:px-4 py-1.5 md:py-2 text-xs md:text-sm border border-neutral-300 text-neutral-700 rounded-lg font-medium hover:bg-neutral-50 transition-colors'
        >
          <PencilIcon className='h-3 w-3 md:h-4 md:w-4' />
          <span>Edit</span>
        </button>
        <button
          onClick={handleDelete}
          className='cursor-pointer p-1.5 md:p-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition-colors'
        >
          <TrashIcon className='h-4 w-4 md:h-5 md:w-5' />
        </button>
      </div>

      {/* Delete Address Modal */}
      <Modal
        isOpen={showDeleteModal}
        onClose={handleDeleteModalClose}
        onDone={handleDeleteConfirm}
        title='Delete Address'
        doneLabel='Delete'
        cancelLabel='Cancel'
      >
        <div className='space-y-4'>
          <p className='text-neutral-600'>
            Are you sure you want to delete this address? This action cannot be
            undone.
          </p>
        </div>
      </Modal>
    </div>
  );
};
