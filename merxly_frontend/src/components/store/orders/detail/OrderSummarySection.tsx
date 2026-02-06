interface OrderSummarySectionProps {
  subTotal: number;
  shippingCost?: number;
  totalAmount: number;
}

export const OrderSummarySection = ({
  subTotal,
  shippingCost,
  totalAmount,
}: OrderSummarySectionProps) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(amount);
  };

  return (
    <div className='space-y-3 md:space-y-4'>
      <h3 className='text-base md:text-lg font-semibold text-neutral-900'>
        Order Summary
      </h3>
      <div className='space-y-2 md:space-y-3'>
        <div className='flex items-center justify-between text-sm md:text-base'>
          <span className='text-neutral-600'>Subtotal</span>
          <span className='text-neutral-900'>{formatCurrency(subTotal)}</span>
        </div>
        <div className='flex items-center justify-between text-sm md:text-base'>
          <span className='text-neutral-600'>Shipping</span>
          <span className='text-neutral-900'>
            {shippingCost && shippingCost > 0 ? (
              formatCurrency(shippingCost)
            ) : (
              <span className='text-green-600 font-medium'>Free</span>
            )}
          </span>
        </div>
        <div className='border-t border-neutral-200 pt-2 md:pt-3'>
          <div className='flex items-center justify-between'>
            <span className='text-base md:text-lg font-semibold text-neutral-900'>
              Total
            </span>
            <span className='text-base md:text-lg font-bold text-neutral-900'>
              {formatCurrency(totalAmount)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
