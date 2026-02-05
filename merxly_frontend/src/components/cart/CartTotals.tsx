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
    <div className='bg-white border border-neutral-200 rounded-lg p-4 md:p-6 lg:sticky lg:top-6'>
      <h2 className='text-base md:text-lg font-semibold text-neutral-900 mb-3 md:mb-4'>
        Cart Totals
      </h2>

      {selectedItemsCount === 0 && (
        <div className='mb-3 md:mb-4 text-xs md:text-sm text-amber-600 bg-amber-50 border border-amber-200 rounded-lg p-3'>
          Please select at least one item to checkout
        </div>
      )}

      <div className='space-y-2 md:space-y-3 mb-3 md:mb-4'>
        <div className='flex items-center justify-between text-xs md:text-sm'>
          <span className='text-neutral-600'>
            Subtotal ({selectedItemsCount}{' '}
            {selectedItemsCount === 1 ? 'item' : 'items'})
          </span>
          <span className='text-neutral-900 font-medium'>
            ₫{subtotal.toLocaleString('vi-VN')}
          </span>
        </div>

        <div className='flex items-center justify-between text-xs md:text-sm'>
          <span className='text-neutral-600'>Shipping</span>
          <span className='text-green-600 font-medium'>Free</span>
        </div>
      </div>

      <div className='border-t border-neutral-200 pt-3 md:pt-4 mb-3 md:mb-4'>
        <div className='flex items-center justify-between'>
          <span className='text-sm md:text-base font-semibold text-neutral-900'>
            Total
          </span>
          <span className='text-lg md:text-xl font-bold text-primary-600'>
            ₫{subtotal.toLocaleString('vi-VN')}
          </span>
        </div>
      </div>

      <button
        onClick={onCheckout}
        disabled={isCheckoutDisabled}
        className='cursor-pointer w-full px-4 md:px-6 py-2.5 md:py-3 bg-primary-600 text-white rounded-lg text-sm md:text-base font-medium hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-primary-600'
      >
        Proceed to checkout
      </button>
    </div>
  );
};
