import type { StoreCartGroup } from '../../types/models/cart';
import { CartItemRow } from './CartItemRow';

interface StoreCartSectionProps {
  group: StoreCartGroup;
  selectedItems: Set<string>;
  onSelectItem: (itemId: string) => void;
  onUpdateQuantity: (itemId: string, quantity: number) => void;
  onRemoveItem: (itemId: string) => void;
}

export const StoreCartSection = ({
  group,
  selectedItems,
  onSelectItem,
  onUpdateQuantity,
  onRemoveItem,
}: StoreCartSectionProps) => {
  return (
    <div className='mb-4 md:mb-6 last:mb-0'>
      {/* Store Header */}
      <div className='bg-neutral-50 border-t border-x border-neutral-200 rounded-t-lg px-3 md:px-4 py-2 md:py-3'>
        <div className='flex items-center justify-between'>
          <h3 className='text-sm md:text-base font-semibold text-neutral-900'>
            {group.storeName}
          </h3>
          <span className='text-xs md:text-sm text-neutral-600'>
            {group.items.length} {group.items.length === 1 ? 'item' : 'items'}
          </span>
        </div>
      </div>

      {/* Store Items - Table (Desktop) */}
      <div className='hidden md:block bg-white border-x border-neutral-200'>
        <table className='w-full'>
          <tbody className='divide-y divide-neutral-200'>
            {group.items.map((item) => (
              <CartItemRow
                key={item.id}
                item={item}
                isSelected={selectedItems.has(item.id)}
                onSelect={onSelectItem}
                onUpdateQuantity={onUpdateQuantity}
                onRemove={onRemoveItem}
              />
            ))}
          </tbody>
        </table>
      </div>

      {/* Store Items - Cards (Mobile) */}
      <div className='md:hidden bg-white border-x border-b border-neutral-200 divide-y divide-neutral-200'>
        {group.items.map((item) => (
          <CartItemRow
            key={item.id}
            item={item}
            isSelected={selectedItems.has(item.id)}
            onSelect={onSelectItem}
            onUpdateQuantity={onUpdateQuantity}
            onRemove={onRemoveItem}
          />
        ))}
      </div>

      {/* Store Subtotal */}
      <div className='bg-white border-x border-b border-neutral-200 rounded-b-lg px-3 md:px-4 py-2 md:py-3'>
        <div className='flex items-center justify-end gap-2'>
          <span className='text-xs md:text-sm text-neutral-600'>
            Store Subtotal:
          </span>
          <span className='text-sm md:text-base font-semibold text-neutral-900'>
            ₫{group.storeSubtotal.toLocaleString('vi-VN')}
          </span>
        </div>
      </div>
    </div>
  );
};
