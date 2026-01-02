import { PhotoIcon } from '@heroicons/react/24/outline';
import type { CustomerOrderItemDto } from '../../../../types/models/customerOrder';
import { getProductImageUrl } from '../../../../utils/cloudinaryHelpers';

interface CustomerOrderItemsTableProps {
  items: CustomerOrderItemDto[];
}

export const CustomerOrderItemsTable = ({
  items,
}: CustomerOrderItemsTableProps) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(amount);
  };

  const formatAttributes = (attributes: Record<string, string>) => {
    return Object.entries(attributes)
      .map(([key, value]) => `${key}: ${value}`)
      .join(', ');
  };

  return (
    <div className='space-y-4'>
      <h3 className='text-lg font-semibold text-neutral-900'>Order Items</h3>
      <div className='overflow-x-auto'>
        <table className='w-full'>
          <thead>
            <tr className='border-b border-neutral-200'>
              <th className='text-left py-3 px-4 text-sm font-medium text-neutral-500'>
                Product
              </th>
              <th className='text-center py-3 px-4 text-sm font-medium text-neutral-500'>
                Quantity
              </th>
              <th className='text-right py-3 px-4 text-sm font-medium text-neutral-500'>
                Unit Price
              </th>
              <th className='text-right py-3 px-4 text-sm font-medium text-neutral-500'>
                Total
              </th>
            </tr>
          </thead>
          <tbody className='divide-y divide-neutral-100'>
            {items.map((item) => (
              <tr key={item.id} className='hover:bg-neutral-50'>
                <td className='py-4 px-4'>
                  <div className='flex items-center gap-3'>
                    {/* Product Image */}
                    {item.productVariantMainPublicId ? (
                      <img
                        src={getProductImageUrl(
                          item.productVariantMainPublicId,
                          'thumbnail'
                        )}
                        alt={item.productVariantName}
                        className='w-12 h-12 object-cover rounded-lg'
                      />
                    ) : (
                      <div className='w-12 h-12 bg-neutral-100 rounded-lg flex items-center justify-center'>
                        <PhotoIcon className='h-6 w-6 text-neutral-400' />
                      </div>
                    )}
                    <div>
                      <p className='font-medium text-neutral-900'>
                        {item.productVariantName}
                      </p>
                      {Object.keys(item.selectedAttributes).length > 0 && (
                        <p className='text-sm text-neutral-500'>
                          {formatAttributes(item.selectedAttributes)}
                        </p>
                      )}
                    </div>
                  </div>
                </td>
                <td className='py-4 px-4 text-center'>
                  <span className='inline-flex items-center justify-center min-w-8 px-2 py-1 bg-neutral-100 rounded text-sm font-medium text-neutral-700'>
                    {item.quantity}
                  </span>
                </td>
                <td className='py-4 px-4 text-right text-sm text-neutral-600'>
                  {formatCurrency(item.unitPrice)}
                </td>
                <td className='py-4 px-4 text-right font-medium text-neutral-900'>
                  {formatCurrency(item.totalPrice)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
