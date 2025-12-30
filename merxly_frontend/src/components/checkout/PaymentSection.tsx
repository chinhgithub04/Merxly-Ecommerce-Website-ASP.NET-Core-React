import { useState } from 'react';
import { PencilIcon, CreditCardIcon } from '@heroicons/react/24/outline';
import type { PaymentMethodDto } from '../../types/models/paymentMethod';
import { AddPaymentMethodModal } from '../paymentMethods/AddPaymentMethodModal';
import { usePaymentMethods } from '../../hooks/usePaymentMethods';

interface PaymentSectionProps {
  selectedPaymentMethod: PaymentMethodDto | null;
  onSelectPaymentMethod: (paymentMethod: PaymentMethodDto) => void;
}

export const PaymentSection = ({
  selectedPaymentMethod,
  onSelectPaymentMethod,
}: PaymentSectionProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSelectingPayment, setIsSelectingPayment] = useState(false);
  const { paymentMethods, addPaymentMethod } = usePaymentMethods();

  const handleAddPaymentMethod = async (paymentMethodId: string) => {
    const response = await addPaymentMethod({ paymentMethodId });
    if (response.data) {
      onSelectPaymentMethod(response.data);
      setIsModalOpen(false);
      setIsSelectingPayment(false);
    }
  };

  const getCardBrandIcon = () => {
    return <CreditCardIcon className='h-5 w-5' />;
  };

  return (
    <div className='bg-white border border-neutral-200 rounded-lg p-6'>
      <div className='flex items-center justify-between mb-4'>
        <h2 className='text-lg font-semibold text-neutral-900'>
          Payment Method
        </h2>
        {selectedPaymentMethod && !isSelectingPayment && (
          <button
            onClick={() => setIsSelectingPayment(true)}
            className='cursor-pointer flex items-center gap-2 text-sm text-primary-600 hover:text-primary-700 font-medium'
          >
            <PencilIcon className='h-4 w-4' />
            Change
          </button>
        )}
      </div>

      {!selectedPaymentMethod && !isSelectingPayment ? (
        <div className='text-center py-6'>
          <p className='text-sm text-neutral-600 mb-4'>
            No payment method found. Please add a payment method.
          </p>
          <button
            onClick={() => setIsModalOpen(true)}
            className='cursor-pointer px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors'
          >
            Add Payment Method
          </button>
        </div>
      ) : isSelectingPayment ? (
        <div className='space-y-3'>
          {paymentMethods.map((method) => (
            <div
              key={method.id}
              onClick={() => {
                onSelectPaymentMethod(method);
                setIsSelectingPayment(false);
              }}
              className={`cursor-pointer p-4 border rounded-lg transition-colors ${
                selectedPaymentMethod?.id === method.id
                  ? 'border-primary-600 bg-primary-50'
                  : 'border-neutral-200 hover:border-primary-300'
              }`}
            >
              <div className='flex items-center justify-between'>
                <div className='flex items-center gap-3'>
                  {getCardBrandIcon()}
                  <div>
                    <p className='font-medium text-neutral-900'>
                      {method.card?.brand.toUpperCase()} ••••{' '}
                      {method.card?.last4}
                    </p>
                    <p className='text-sm text-neutral-600'>
                      Expires {method.card?.expMonth}/{method.card?.expYear}
                    </p>
                  </div>
                </div>
                {method.isDefault && (
                  <span className='text-xs bg-primary-100 text-primary-700 px-2 py-1 rounded'>
                    Default
                  </span>
                )}
              </div>
            </div>
          ))}
          <button
            onClick={() => setIsModalOpen(true)}
            className='cursor-pointer w-full px-4 py-3 border-2 border-dashed border-neutral-300 rounded-lg text-neutral-600 hover:border-primary-400 hover:text-primary-600 transition-colors'
          >
            + Add New Payment Method
          </button>
        </div>
      ) : (
        <div className='p-4 bg-neutral-50 rounded-lg flex items-center gap-3'>
          {getCardBrandIcon()}
          <div>
            <p className='font-medium text-neutral-900'>
              {selectedPaymentMethod?.card?.brand.toUpperCase()} ••••{' '}
              {selectedPaymentMethod?.card?.last4}
            </p>
            <p className='text-sm text-neutral-600'>
              Expires {selectedPaymentMethod?.card?.expMonth}/
              {selectedPaymentMethod?.card?.expYear}
            </p>
          </div>
        </div>
      )}

      <AddPaymentMethodModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={handleAddPaymentMethod}
      />
    </div>
  );
};
