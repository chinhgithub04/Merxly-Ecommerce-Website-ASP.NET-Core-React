interface OrderStatsProps {
  totalOrders: number;
  pendingOrders: number;
  processingOrders: number;
  shippedOrders: number;
  totalRevenue: number;
}

export const OrderStats = ({
  totalOrders,
  pendingOrders,
  processingOrders,
  shippedOrders,
  totalRevenue,
}: OrderStatsProps) => {
  return (
    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4'>
      <div className='bg-white rounded-lg border border-neutral-200 p-4'>
        <p className='text-sm text-neutral-600 mb-1'>Total Orders</p>
        <p className='text-2xl font-bold text-neutral-900'>{totalOrders}</p>
      </div>
      <div className='bg-white rounded-lg border border-neutral-200 p-4'>
        <p className='text-sm text-neutral-600 mb-1'>Pending</p>
        <p className='text-2xl font-bold text-yellow-600'>{pendingOrders}</p>
      </div>
      <div className='bg-white rounded-lg border border-neutral-200 p-4'>
        <p className='text-sm text-neutral-600 mb-1'>Processing</p>
        <p className='text-2xl font-bold text-blue-600'>{processingOrders}</p>
      </div>
      <div className='bg-white rounded-lg border border-neutral-200 p-4'>
        <p className='text-sm text-neutral-600 mb-1'>Shipped</p>
        <p className='text-2xl font-bold text-purple-600'>{shippedOrders}</p>
      </div>
      <div className='bg-white rounded-lg border border-neutral-200 p-4'>
        <p className='text-sm text-neutral-600 mb-1'>Total Revenue</p>
        <p className='text-2xl font-bold text-green-600'>
          ₫{totalRevenue.toLocaleString()}
        </p>
      </div>
    </div>
  );
};
