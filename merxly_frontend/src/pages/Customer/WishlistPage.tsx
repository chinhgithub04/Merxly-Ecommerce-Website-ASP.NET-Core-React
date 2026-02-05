import { useState, useEffect } from 'react';
import { useWishlist } from '../../hooks/useWishlist';
import { WishlistItemRow } from '../../components/wishlist';

export const WishlistPage = () => {
  const { wishlist, isLoading, removeWishlistItem, clearWishlist } =
    useWishlist();
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());

  // Default select all available items when wishlist loads
  useEffect(() => {
    if (
      wishlist?.wishlistItems &&
      wishlist.wishlistItems.length > 0 &&
      selectedItems.size === 0
    ) {
      const availableItemIds = wishlist.wishlistItems.map((item) => item.id);
      setSelectedItems(new Set(availableItemIds));
    }
  }, [wishlist?.wishlistItems]);

  const handleSelectItem = (itemId: string) => {
    const newSelected = new Set(selectedItems);
    if (newSelected.has(itemId)) {
      newSelected.delete(itemId);
    } else {
      newSelected.add(itemId);
    }
    setSelectedItems(newSelected);
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked && wishlist?.wishlistItems) {
      const availableItemIds = wishlist.wishlistItems.map((item) => item.id);
      setSelectedItems(new Set(availableItemIds));
    } else {
      setSelectedItems(new Set());
    }
  };

  const isAllSelected =
    wishlist && wishlist.wishlistItems.length > 0
      ? wishlist.wishlistItems.every((item) => selectedItems.has(item.id))
      : false;

  const handleRemoveItem = async (itemId: string) => {
    try {
      await removeWishlistItem(itemId);
      const newSelected = new Set(selectedItems);
      newSelected.delete(itemId);
      setSelectedItems(newSelected);
    } catch (error) {
      console.error('Failed to remove wishlist item:', error);
    }
  };

  const handleClearAll = async () => {
    if (
      window.confirm('Are you sure you want to clear your entire wishlist?')
    ) {
      try {
        await clearWishlist();
        setSelectedItems(new Set());
      } catch (error) {
        console.error('Failed to clear wishlist:', error);
      }
    }
  };

  if (isLoading) {
    return (
      <div className='px-4 md:px-8 lg:px-20 py-6 md:py-12'>
        <div className='flex items-center justify-center py-20'>
          <p className='text-neutral-500'>Loading wishlist...</p>
        </div>
      </div>
    );
  }

  return (
    <div className='px-4 md:px-8 lg:px-20 py-6 md:py-12'>
      <div className='max-w-7xl mx-auto'>
        {/* Header with Select All and Clear */}
        <div className='bg-white border border-neutral-200 rounded-t-lg px-4 md:px-6 py-3 md:py-4 flex items-center justify-between'>
          <div className='flex items-center gap-2 md:gap-3'>
            <input
              type='checkbox'
              checked={isAllSelected}
              onChange={(e) => handleSelectAll(e.target.checked)}
              className='w-4 h-4 rounded border-neutral-300 text-primary-600 focus:ring-2 focus:ring-primary-600 cursor-pointer'
            />
            <h1 className='text-lg md:text-xl font-semibold text-neutral-900'>
              My Wishlist
            </h1>
            <span className='text-xs md:text-sm text-neutral-600'>
              ({wishlist?.totalItems || 0}{' '}
              {wishlist?.totalItems === 1 ? 'item' : 'items'})
            </span>
          </div>
          {wishlist && wishlist.wishlistItems.length > 0 && (
            <button
              onClick={handleClearAll}
              className='cursor-pointer px-3 md:px-4 py-1.5 md:py-2 text-xs md:text-sm text-red-600 hover:bg-red-50 rounded-md font-medium transition-colors'
            >
              Clear All
            </button>
          )}
        </div>

        {/* Wishlist Items Table */}
        <div className=''>
          {!wishlist || wishlist.wishlistItems.length === 0 ? (
            <div className='bg-white rounded-lg border border-neutral-200 m-3 md:m-4 px-4 py-12 text-center text-neutral-500'>
              Your wishlist is empty
            </div>
          ) : (
            <>
              {/* Desktop Table */}
              <div className='hidden md:block bg-white rounded-b-lg border border-neutral-200'>
                <table className='w-full'>
                  <thead className='bg-neutral-50 border-b border-neutral-200'>
                    <tr>
                      <th className='px-4 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider w-12'>
                        {/* Checkbox column */}
                      </th>
                      <th className='px-4 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider w-96'>
                        Products
                      </th>
                      <th className='px-4 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider w-32'>
                        Price
                      </th>
                      <th className='px-4 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider w-32'>
                        Stock Status
                      </th>
                      <th className='px-4 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider w-48'>
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className='divide-y divide-neutral-200'>
                    {wishlist.wishlistItems.map((item) => (
                      <WishlistItemRow
                        key={item.id}
                        item={item}
                        isSelected={selectedItems.has(item.id)}
                        onSelect={handleSelectItem}
                        onRemove={handleRemoveItem}
                      />
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile Cards */}
              <div className='md:hidden bg-white rounded-b-lg border border-neutral-200 divide-y divide-neutral-200'>
                {wishlist.wishlistItems.map((item) => (
                  <WishlistItemRow
                    key={item.id}
                    item={item}
                    isSelected={selectedItems.has(item.id)}
                    onSelect={handleSelectItem}
                    onRemove={handleRemoveItem}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
