import { useState } from 'react';
import { CheckIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { OrderStatus } from '../../../../types/enums';
import { Modal } from '../../../ui/Modal';
import { Book, Handshake, Package } from 'lucide-react';

interface OrderActionButtonsProps {
  status: OrderStatus;
  isUpdating: boolean;
  onStatusUpdate: (newStatus: OrderStatus, notes?: string) => void;
}

interface ActionButton {
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  newStatus: OrderStatus;
  variant: 'primary' | 'secondary' | 'danger';
}

export const OrderActionButtons = ({
  status,
  isUpdating,
  onStatusUpdate,
}: OrderActionButtonsProps) => {
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelNotes, setCancelNotes] = useState('');

  // Get available actions based on current status
  const getAvailableActions = (): ActionButton[] => {
    switch (status) {
      case OrderStatus.Pending:
        return [
          {
            label: 'Confirm Order',
            icon: CheckIcon,
            newStatus: OrderStatus.Confirmed,
            variant: 'primary',
          },
          {
            label: 'Cancel Order',
            icon: XMarkIcon,
            newStatus: OrderStatus.Cancelled,
            variant: 'danger',
          },
        ];
      case OrderStatus.Confirmed:
        return [
          {
            label: 'Start Packaging',
            icon: Book,
            newStatus: OrderStatus.Processing,
            variant: 'primary',
          },
          {
            label: 'Cancel Order',
            icon: XMarkIcon,
            newStatus: OrderStatus.Cancelled,
            variant: 'danger',
          },
        ];
      case OrderStatus.Processing:
        return [
          {
            label: 'Mark as Delivering',
            icon: Package,
            newStatus: OrderStatus.Delivering,
            variant: 'primary',
          },
        ];
      case OrderStatus.Delivering:
        return [
          {
            label: 'Mark as Shipped',
            icon: Handshake,
            newStatus: OrderStatus.Shipped,
            variant: 'primary',
          },
        ];
      default:
        return [];
    }
  };

  const handleActionClick = (action: ActionButton) => {
    if (action.newStatus === OrderStatus.Cancelled) {
      setShowCancelModal(true);
    } else {
      onStatusUpdate(action.newStatus);
    }
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

  const actions = getAvailableActions();

  if (actions.length === 0) {
    return null;
  }

  const getButtonStyles = (variant: ActionButton['variant']) => {
    switch (variant) {
      case 'primary':
        return 'bg-primary-600 hover:bg-primary-700 text-white';
      case 'secondary':
        return 'bg-neutral-100 hover:bg-neutral-200 text-neutral-700';
      case 'danger':
        return 'bg-white hover:bg-red-50 text-red-600 border border-red-300';
    }
  };

  return (
    <div className='flex flex-wrap gap-3'>
      {actions.map((action, index) => {
        const Icon = action.icon;
        return (
          <button
            key={index}
            onClick={() => handleActionClick(action)}
            disabled={isUpdating}
            className={`cursor-pointer inline-flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${getButtonStyles(
              action.variant
            )}`}
          >
            <Icon className='h-5 w-5' />
            {isUpdating ? 'Updating...' : action.label}
          </button>
        );
      })}

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
              placeholder='Enter the reason for cancellation...'
              rows={3}
              className='w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none'
            />
          </div>
        </div>
      </Modal>
    </div>
  );
};
