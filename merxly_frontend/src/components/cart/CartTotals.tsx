interface CartTotalsProps {
  subtotal: number;
  selectedItemsCount: number;
  onCheckout: () => void;
}

export const CartTotals = ({
  subtotal,
  selectedItemsCount,
  onCheckout,
}: CartTotalsProps) => {
  const isCheckoutDisabled = selectedItemsCount === 0;

  return (
    <div className='bg-white border border-neutral-200 rounded-lg p-6 sticky top-6'>
      <h2 className='text-lg font-semibold text-neutral-900 mb-4'>
        Cart Totals
      </h2>

      {selectedItemsCount === 0 && (
        <div className='mb-4 text-sm text-amber-600 bg-amber-50 border border-amber-200 rounded-lg p-3'>
          Please select at least one item to checkout
        </div>
      )}

      <div className='space-y-3 mb-4'>
        <div className='flex items-center justify-between text-sm'>
          <span className='text-neutral-600'>
            Subtotal ({selectedItemsCount}{' '}
            {selectedItemsCount === 1 ? 'item' : 'items'})
          </span>
          <span className='text-neutral-900 font-medium'>
            ₫{subtotal.toLocaleString('vi-VN')}
          </span>
        </div>

        <div className='flex items-center justify-between text-sm'>
          <span className='text-neutral-600'>Shipping</span>
          <span className='text-green-600 font-medium'>Free</span>
        </div>
      </div>

      <div className='border-t border-neutral-200 pt-4 mb-4'>
        <div className='flex items-center justify-between'>
          <span className='text-base font-semibold text-neutral-900'>
            Total
          </span>
          <span className='text-xl font-bold text-primary-600'>
            ₫{subtotal.toLocaleString('vi-VN')}
          </span>
        </div>
      </div>

      <button
        onClick={onCheckout}
        disabled={isCheckoutDisabled}
        className='cursor-pointer w-full px-6 py-3 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-primary-600'
      >
        Proceed to checkout
      </button>
    </div>
  );
};
