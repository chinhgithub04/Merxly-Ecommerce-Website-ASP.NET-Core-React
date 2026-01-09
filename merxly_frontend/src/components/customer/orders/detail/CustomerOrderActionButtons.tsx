import { useState } from 'react';
import { XMarkIcon, CheckCircleIcon } from '@heroicons/react/24/outline';
import { OrderStatus } from '../../../../types/enums/Status';
import { Modal } from '../../../ui/Modal';

interface CustomerOrderActionButtonsProps {
  status: OrderStatus;
  isUpdating: boolean;
  onStatusUpdate: (newStatus: OrderStatus, notes?: string) => void;
}

export const CustomerOrderActionButtons = ({
  status,
  isUpdating,
  onStatusUpdate,
}: CustomerOrderActionButtonsProps) => {
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelNotes, setCancelNotes] = useState('');

  const handleCancelClick = () => {
    setShowCancelModal(true);
  };

  const handleCancelConfirm = () => {
    onStatusUpdate(OrderStatus.Cancelled, cancelNotes || undefined);
    setShowCancelModal(false);
    setCancelNotes('');
  };

  const handleCancelModalClose = () => {
    setShowCancelModal(false);
    setCancelNotes('');
  };

  const handleReceivedClick = () => {
    if (
      confirm(
        'Please confirm that you have received your order. This action cannot be undone.'
      )
    ) {
      onStatusUpdate(OrderStatus.Completed);
    }
  };

  // Show Cancel Order button when status is Confirmed
  if (status === OrderStatus.Confirmed) {
    return (
      <>
        <div className='flex flex-wrap gap-3'>
          <button
            onClick={handleCancelClick}
            disabled={isUpdating}
            className='inline-flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed bg-white hover:bg-red-50 text-red-600 border border-red-300'
          >
            <XMarkIcon className='h-5 w-5' />
            {isUpdating ? 'Updating...' : 'Cancel Order'}
          </button>
        </div>

        {/* Cancel Order Modal */}
        <Modal
          isOpen={showCancelModal}
          onClose={handleCancelModalClose}
          onDone={handleCancelConfirm}
          title='Cancel Order'
          doneLabel='Confirm Cancel'
          cancelLabel='Go Back'
        >
          <div className='space-y-4'>
            <p className='text-neutral-600'>
              Are you sure you want to cancel this order? This action cannot be
              undone.
            </p>
            <div>
              <label
                htmlFor='cancelNotes'
                className='block text-sm font-medium text-neutral-700 mb-2'
              >
                Reason for cancellation (optional)
              </label>
              <textarea
                id='cancelNotes'
                value={cancelNotes}
                onChange={(e) => setCancelNotes(e.target.value)}
                rows={4}
                className='w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none'
                placeholder='Please provide a reason for cancelling this order...'
              />
            </div>
          </div>
        </Modal>
      </>
    );
  }

  // Show "I have received the order" button when status is Shipped
  if (status === OrderStatus.Shipped) {
    return (
      <div className='flex flex-wrap gap-3'>
        <button
          onClick={handleReceivedClick}
          disabled={isUpdating}
          className='inline-flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed bg-primary-600 hover:bg-primary-700 text-white'
        >
          <CheckCircleIcon className='h-5 w-5' />
          {isUpdating ? 'Updating...' : 'I have received the order'}
        </button>
      </div>
    );
  }

  // No actions available for other statuses
  return null;
};
