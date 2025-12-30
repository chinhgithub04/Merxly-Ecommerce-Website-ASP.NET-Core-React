import { useMemo } from 'react';
import type { CartItemDto } from '../../types/models/cart';
import { getProductImageUrl } from '../../utils/cloudinaryHelpers';

interface StoreGroup {
  storeId: string;
  storeName: string;
  items: CartItemDto[];
  storeSubtotal: number;
}

interface OrderSummaryProps {
  items: CartItemDto[];
  storeNotes: Record<string, string>;
  onStoreNoteChange: (storeId: string, note: string) => void;
  onPlaceOrder: () => void;
  isPlacingOrder: boolean;
}

export const OrderSummary = ({
  items,
  storeNotes,
  onStoreNoteChange,
  onPlaceOrder,
  isPlacingOrder,
}: OrderSummaryProps) => {
  // Group items by store
  const storeGroups = useMemo<StoreGroup[]>(() => {
    const groupsMap = new Map<string, StoreGroup>();

    items.forEach((item) => {
      if (!groupsMap.has(item.storeId)) {
        groupsMap.set(item.storeId, {
          storeId: item.storeId,
          storeName: item.storeName,
          items: [],
          storeSubtotal: 0,
        });
      }

      const group = groupsMap.get(item.storeId)!;
      group.items.push(item);
      group.storeSubtotal += item.priceAtAdd * item.quantity;
    });

    return Array.from(groupsMap.values());
  }, [items]);

  const subtotal = useMemo(() => {
    return items.reduce(
      (sum, item) => sum + item.priceAtAdd * item.quantity,
      0
    );
  }, [items]);

  return (
    <div className='bg-white border border-neutral-200 rounded-lg p-6 sticky top-6'>
      <h2 className='text-lg font-semibold text-neutral-900 mb-4'>
        Order Summary
      </h2>

      <div className='space-y-6 mb-6 max-h-[500px] overflow-y-auto'>
        {storeGroups.map((group) => (
          <div key={group.storeId} className='space-y-3'>
            {/* Store Name */}
            <div className='flex items-center justify-between border-b border-neutral-200 pb-2'>
              <h3 className='font-medium text-neutral-900'>
                {group.storeName}
              </h3>
              <span className='text-sm text-neutral-600'>
                ₫{group.storeSubtotal.toLocaleString('vi-VN')}
              </span>
            </div>

            {/* Store Items */}
            <div className='space-y-3'>
              {group.items.map((item) => (
                <div key={item.id} className='flex items-start gap-3'>
                  {/* Product Image */}
                  <div className='w-16 h-16 rounded-lg border border-neutral-200 overflow-hidden bg-neutral-100 shrink-0'>
                    {item.productImagePublicId ? (
                      <img
                        src={getProductImageUrl(
                          item.productImagePublicId,
                          'thumbnail'
                        )}
                        alt={item.productName}
                        className='w-full h-full object-cover'
                      />
                    ) : (
                      <div className='w-full h-full flex items-center justify-center text-neutral-400 text-xs'>
                        No image
                      </div>
                    )}
                  </div>

                  {/* Product Details */}
                  <div className='flex-1 min-w-0'>
                    <p className='text-sm font-medium text-neutral-900 line-clamp-2'>
                      {item.productName}
                    </p>
                    {Object.entries(item.selectedAttributes).length > 0 && (
                      <p className='text-xs text-neutral-600 mt-1'>
                        {Object.entries(item.selectedAttributes)
                          .map(([key, value]) => `${key}: ${value}`)
                          .join(', ')}
                      </p>
                    )}
                    <div className='flex items-center justify-between mt-1'>
                      <span className='text-xs text-neutral-600'>
                        {item.quantity} x ₫
                        {item.priceAtAdd.toLocaleString('vi-VN')}
                      </span>
                      <span className='text-sm font-medium text-neutral-900'>
                        ₫
                        {(item.priceAtAdd * item.quantity).toLocaleString(
                          'vi-VN'
                        )}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Store Note */}
            <div>
              <label className='block text-xs font-medium text-neutral-700 mb-1'>
                Delivery instructions for {group.storeName}
              </label>
              <textarea
                value={storeNotes[group.storeId] || ''}
                onChange={(e) =>
                  onStoreNoteChange(group.storeId, e.target.value)
                }
                placeholder='e.g., Leave at door, Call before delivery...'
                rows={2}
                maxLength={500}
                className='w-full px-3 py-2 text-sm border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none'
              />
              <p className='text-xs text-neutral-500 mt-1'>
                {storeNotes[group.storeId]?.length || 0}/500
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Summary */}
      <div className='space-y-3 mb-4 border-t border-neutral-200 pt-4'>
        <div className='flex items-center justify-between text-sm'>
          <span className='text-neutral-600'>
            Subtotal ({items.length} {items.length === 1 ? 'item' : 'items'})
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
        onClick={onPlaceOrder}
        disabled={isPlacingOrder}
        className='cursor-pointer w-full px-6 py-3 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-primary-600'
      >
        {isPlacingOrder ? 'Processing...' : 'Place Order'}
      </button>
    </div>
  );
};
