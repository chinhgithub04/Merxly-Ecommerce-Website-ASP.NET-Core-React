import { useState } from 'react';
import { PlusIcon } from '@heroicons/react/24/outline';
import { usePaymentMethods } from '../../hooks/usePaymentMethods';
import { PaymentCard, AddPaymentMethodModal } from '../paymentMethods';

export const PaymentMethodsSection = () => {
  const {
    paymentMethods,
    isLoading,
    addPaymentMethod,
    setDefaultPaymentMethod,
    removePaymentMethod,
  } = usePaymentMethods();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleAddPaymentMethod = async (paymentMethodId: string) => {
    try {
      await addPaymentMethod({ paymentMethodId });
      setIsModalOpen(false);
    } catch (error) {
      console.error('Failed to add payment method:', error);
    }
  };

  const handleSetDefault = async (id: string) => {
    try {
      await setDefaultPaymentMethod(id);
    } catch (error) {
      console.error('Failed to set default payment method:', error);
    }
  };

  const handleRemove = async (id: string) => {
    try {
      await removePaymentMethod(id);
    } catch (error) {
      console.error('Failed to remove payment method:', error);
    }
  };

  if (isLoading) {
    return (
      <div>
        <div className='bg-white border-t border-x border-neutral-200 rounded-t-lg px-6 py-4'>
          <h2 className='text-xl font-semibold text-neutral-900'>
            Payment methods
          </h2>
        </div>
        <div className='bg-white border border-neutral-200 rounded-b-lg p-6'>
          <div className='flex items-center justify-center py-20'>
            <p className='text-neutral-500'>Loading payment methods...</p>
          </div>
        </div>
      </div>
    );
  }

  const hasPaymentMethods = paymentMethods.length > 0;

  return (
    <div>
      {/* Header */}
      <div className='bg-white border-t border-x border-neutral-200 rounded-t-lg px-6 py-4 flex items-center justify-between'>
        <h2 className='text-xl font-semibold text-neutral-900'>
          Payment methods
        </h2>
        {hasPaymentMethods && (
          <button
            onClick={() => setIsModalOpen(true)}
            className='cursor-pointer flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 transition-colors'
          >
            <PlusIcon className='h-5 w-5' />
            <span>Add Payment Method</span>
          </button>
        )}
      </div>

      {/* Body */}
      <div className='bg-white border border-neutral-200 rounded-b-lg p-6'>
        {!hasPaymentMethods ? (
          <div className='text-center py-12'>
            <div className='text-neutral-400 mb-4'>
              <svg
                className='mx-auto h-12 w-12'
                fill='none'
                viewBox='0 0 24 24'
                stroke='currentColor'
                aria-hidden='true'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z'
                />
              </svg>
            </div>
            <h3 className='text-lg font-medium text-neutral-900 mb-2'>
              No payment methods yet
            </h3>
            <p className='text-neutral-500 mb-6'>
              Add a payment method to make checkout faster and easier
            </p>
            <button
              onClick={() => setIsModalOpen(true)}
              className='cursor-pointer inline-flex items-center gap-2 px-6 py-3 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 transition-colors'
            >
              <PlusIcon className='h-5 w-5' />
              <span>Add Your First Payment Method</span>
            </button>
          </div>
        ) : (
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
            {paymentMethods.map((pm) => (
              <PaymentCard
                key={pm.id}
                paymentMethod={pm}
                onSetDefault={handleSetDefault}
                onRemove={handleRemove}
              />
            ))}
          </div>
        )}
      </div>

      {/* Add Payment Method Modal */}
      <AddPaymentMethodModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={handleAddPaymentMethod}
      />
    </div>
  );
};
