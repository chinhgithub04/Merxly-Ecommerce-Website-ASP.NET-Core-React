import { useState } from 'react';
import { CheckCircleIcon, TrashIcon } from '@heroicons/react/24/outline';
import type { PaymentMethodDto } from '../../types/models/paymentMethod';
import { Modal } from '../ui/Modal';

interface PaymentCardProps {
  paymentMethod: PaymentMethodDto;
  onSetDefault: (id: string) => void;
  onRemove: (id: string) => void;
}

const CARD_BRAND_STYLES: Record<
  string,
  { gradient: string; textColor: string; icon: string }
> = {
  visa: {
    gradient: 'linear-gradient(135deg, #1B6392 0%, #124261 100%)',
    textColor: 'text-white',
    icon: '💳',
  },
  mastercard: {
    gradient: 'linear-gradient(135deg, #EB001B 0%, #F79E1B 100%)',
    textColor: 'text-white',
    icon: '💳',
  },
  amex: {
    gradient: 'linear-gradient(135deg, #006FCF 0%, #00438C 100%)',
    textColor: 'text-white',
    icon: '💳',
  },
  discover: {
    gradient: 'linear-gradient(135deg, #FF6000 0%, #E64C00 100%)',
    textColor: 'text-white',
    icon: '💳',
  },
  default: {
    gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    textColor: 'text-white',
    icon: '💳',
  },
};

export const PaymentCard = ({
  paymentMethod,
  onSetDefault,
  onRemove,
}: PaymentCardProps) => {
  const [showRemoveModal, setShowRemoveModal] = useState(false);
  const { card } = paymentMethod;
  if (!card) return null;

  const brandKey = card.brand.toLowerCase();
  const style = CARD_BRAND_STYLES[brandKey] || CARD_BRAND_STYLES.default;

  const handleSetDefault = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!paymentMethod.isDefault) {
      onSetDefault(paymentMethod.id);
    }
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowRemoveModal(true);
  };

  const handleRemoveConfirm = () => {
    onRemove(paymentMethod.id);
    setShowRemoveModal(false);
  };

  const handleRemoveModalClose = () => {
    setShowRemoveModal(false);
  };

  return (
    <div className='relative group'>
      <div
        className='rounded-xl p-4 md:p-6 shadow-lg transition-all duration-300 hover:shadow-2xl hover:scale-105 cursor-pointer'
        style={{ background: style.gradient }}
      >
        {/* Card Header - Brand and Default Badge on Same Line */}
        <div className='flex items-center justify-between mb-6 md:mb-8'>
          <div className='flex items-center gap-1.5 md:gap-2'>
            <span className='text-2xl md:text-3xl'>{style.icon}</span>
            <span
              className={`text-xs md:text-sm font-semibold uppercase ${style.textColor} opacity-90`}
            >
              {card.brand}
            </span>
          </div>
          {paymentMethod.isDefault && (
            <div className='flex items-center gap-1 bg-white/20 backdrop-blur-sm px-2 md:px-3 py-1 rounded-full'>
              <CheckCircleIcon className='h-3 w-3 md:h-4 md:w-4 text-white' />
              <span className='text-xs font-medium text-white'>Default</span>
            </div>
          )}
        </div>

        {/* Card Number */}
        <div className={`mb-4 md:mb-6 ${style.textColor}`}>
          <div className='flex items-center gap-2 md:gap-3 text-base md:text-xl font-mono tracking-wider'>
            <span>••••</span>
            <span>••••</span>
            <span>••••</span>
            <span className='font-semibold'>{card.last4}</span>
          </div>
        </div>

        {/* Card Footer */}
        <div className='flex items-end justify-between'>
          <div className={`${style.textColor} opacity-90`}>
            <div className='text-xs uppercase tracking-wide mb-1'>Expires</div>
            <div className='text-xs md:text-sm font-semibold'>
              {String(card.expMonth).padStart(2, '0')}/{card.expYear}
            </div>
          </div>
        </div>

        {/* Hover Actions */}
        <div className='absolute inset-0 bg-black/50 backdrop-blur-sm rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-2 md:gap-4'>
          {!paymentMethod.isDefault && (
            <button
              onClick={handleSetDefault}
              className='cursor-pointer px-3 md:px-4 py-1.5 md:py-2 text-xs md:text-sm bg-white text-neutral-900 rounded-lg font-medium hover:bg-neutral-100 transition-colors'
            >
              Set as Default
            </button>
          )}
          <button
            onClick={handleRemove}
            className='cursor-pointer p-1.5 md:p-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors'
          >
            <TrashIcon className='h-4 w-4 md:h-5 md:w-5' />
          </button>
        </div>
      </div>

      {/* Remove Payment Method Modal */}
      <Modal
        isOpen={showRemoveModal}
        onClose={handleRemoveModalClose}
        onDone={handleRemoveConfirm}
        title='Remove Payment Method'
        doneLabel='Remove'
        cancelLabel='Cancel'
      >
        <div className='space-y-4'>
          <p className='text-neutral-600'>
            Are you sure you want to remove this payment method? This action
            cannot be undone.
          </p>
        </div>
      </Modal>
    </div>
  );
};
