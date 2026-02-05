import { useState, useMemo } from 'react';
import { TrashIcon } from '@heroicons/react/24/outline';
import { Link, useNavigate } from 'react-router-dom';
import type { WishlistItemDto } from '../../types/models/wishlist';
import { getProductImageUrl } from '../../utils/cloudinaryHelpers';
import { useCart } from '../../hooks/useCart';
import { AddToCartModal } from '../cart';

interface WishlistItemRowProps {
  item: WishlistItemDto;
  isSelected: boolean;
  onSelect: (itemId: string) => void;
  onRemove: (itemId: string) => void;
}

export const WishlistItemRow = ({
  item,
  isSelected,
  onSelect,
  onRemove,
}: WishlistItemRowProps) => {
  const navigate = useNavigate();
  const { cart, addToCart, isAddingToCart } = useCart();
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Check if this variant is already in the cart
  const isInCart = useMemo(() => {
    if (!cart || !item.productVariantId) return false;
    return cart.cartItems.some(
      (cartItem) => cartItem.productVariantId === item.productVariantId,
    );
  }, [cart, item.productVariantId]);

  const handleAddToCart = async () => {
    if (!item.productVariantId) return;

    try {
      await addToCart({
        productVariantId: item.productVariantId,
        quantity: 1,
      });
      setIsModalOpen(true);
    } catch (error) {
      console.error('Failed to add to cart:', error);
    }
  };

  const handleViewInCart = () => {
    navigate('/cart');
  };

  return (
    <>
      {/* Desktop Layout - Table Row */}
      <tr className='hidden md:table-row hover:bg-neutral-50 transition-colors'>
        <td className='px-4 py-4 w-12'>
          <input
            type='checkbox'
            checked={isSelected}
            onChange={() => onSelect(item.id)}
            className='w-4 h-4 rounded border-neutral-300 text-primary-600 focus:ring-2 focus:ring-primary-600 cursor-pointer disabled:cursor-not-allowed'
          />
        </td>
        <td className='px-4 py-4 w-96'>
          <div className='flex items-center gap-3'>
            <div className='w-16 h-16 rounded-lg border border-neutral-200 overflow-hidden bg-neutral-100 shrink-0'>
              {item.productImagePublicId ? (
                <img
                  src={getProductImageUrl(
                    item.productImagePublicId,
                    'thumbnail',
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
            <div className='flex flex-col gap-1 min-w-0 flex-1'>
              <Link
                to={`/products/${item.productId}`}
                className='text-sm font-medium text-neutral-900 hover:text-primary-600 line-clamp-2 transition-colors'
              >
                {item.productName}
              </Link>
              {Object.entries(item.selectedAttributes).length > 0 && (
                <div className='text-xs text-neutral-600 space-y-0.5'>
                  {Object.entries(item.selectedAttributes).map(
                    ([key, value]) => (
                      <div key={key} className='truncate'>
                        <span className='font-semibold'>{key}:</span> {value}
                      </div>
                    ),
                  )}
                </div>
              )}
            </div>
          </div>
        </td>
        <td className='px-4 py-4 w-32'>
          <span className='text-sm text-neutral-900 whitespace-nowrap'>
            ₫{item.price.toLocaleString('vi-VN')}
          </span>
        </td>
        <td className='px-4 py-4 w-32'>
          {item.isAvailable ? (
            <span className='uppercase text-sm text-green-600 font-medium'>
              In Stock
            </span>
          ) : (
            <span className='uppercase text-sm text-red-600 font-medium'>
              Out of stock
            </span>
          )}
        </td>
        <td className='px-4 py-4 w-48'>
          <div className='flex items-center gap-2'>
            {isInCart ? (
              <button
                onClick={handleViewInCart}
                className='w-full cursor-pointer px-4 py-2 text-sm font-medium text-primary-600 border border-primary-600 rounded-md hover:bg-primary-50 transition-colors'
              >
                View in cart
              </button>
            ) : (
              <button
                onClick={handleAddToCart}
                disabled={!item.isAvailable || isAddingToCart}
                className='w-full cursor-pointer px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-md hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors'
              >
                Add to cart
              </button>
            )}
            <button
              onClick={() => onRemove(item.id)}
              className='cursor-pointer p-2 text-neutral-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors'
            >
              <TrashIcon className='h-5 w-5' />
            </button>
          </div>
        </td>
      </tr>

      {/* Mobile Layout - Card */}
      <div className='md:hidden p-4'>
        {/* First Row: Checkbox, Image, Delete Button */}
        <div className='flex items-start justify-between gap-3 mb-3'>
          {/* Checkbox */}
          <div className='pt-1'>
            <input
              type='checkbox'
              checked={isSelected}
              onChange={() => onSelect(item.id)}
              className='w-4 h-4 rounded border-neutral-300 text-primary-600 focus:ring-2 focus:ring-primary-600 cursor-pointer'
            />
          </div>

          {/* Product Image */}
          <div className='w-20 h-20 rounded-lg border border-neutral-200 overflow-hidden bg-neutral-100 shrink-0 flex items-center justify-center'>
            {item.productImagePublicId ? (
              <img
                src={getProductImageUrl(item.productImagePublicId, 'thumbnail')}
                alt={item.productName}
                className='w-full h-full object-cover'
              />
            ) : (
              <div className='w-full h-full flex items-center justify-center text-neutral-400 text-xs'>
                No image
              </div>
            )}
          </div>

          {/* Delete Button */}
          <button
            onClick={() => onRemove(item.id)}
            className='cursor-pointer p-2 text-neutral-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors'
          >
            <TrashIcon className='h-5 w-5' />
          </button>
        </div>

        {/* Product Name */}
        <Link
          to={`/products/${item.productId}`}
          className='text-sm font-medium text-neutral-900 hover:text-primary-600 line-clamp-2 transition-colors block mb-2'
        >
          {item.productName}
        </Link>

        {/* Attributes - Flex */}
        {Object.entries(item.selectedAttributes).length > 0 && (
          <div className='flex flex-wrap gap-2 mb-3'>
            {Object.entries(item.selectedAttributes).map(([key, value]) => (
              <div
                key={key}
                className='text-xs text-neutral-600 bg-neutral-50 px-2 py-1 rounded'
              >
                <span className='font-semibold'>{key}:</span> {value}
              </div>
            ))}
          </div>
        )}

        {/* Price and Stock Status */}
        <div className='flex items-center justify-between mb-3'>
          <div className='text-sm text-neutral-600'>
            Price:{' '}
            <span className='font-medium text-neutral-900'>
              ₫{item.price.toLocaleString('vi-VN')}
            </span>
          </div>
          {item.isAvailable ? (
            <span className='text-xs text-green-600 font-medium uppercase'>
              In Stock
            </span>
          ) : (
            <span className='text-xs text-red-600 font-medium uppercase'>
              Out of stock
            </span>
          )}
        </div>

        {/* Actions */}
        <div className='w-full'>
          {isInCart ? (
            <button
              onClick={handleViewInCart}
              className='w-full cursor-pointer px-4 py-2.5 text-sm font-medium text-primary-600 border border-primary-600 rounded-md hover:bg-primary-50 transition-colors'
            >
              View in cart
            </button>
          ) : (
            <button
              onClick={handleAddToCart}
              disabled={!item.isAvailable || isAddingToCart}
              className='w-full cursor-pointer px-4 py-2.5 text-sm font-medium text-white bg-primary-600 rounded-md hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors'
            >
              Add to cart
            </button>
          )}
        </div>
      </div>

      {/* Add to Cart Modal */}
      <AddToCartModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        variantData={{
          imagePublicId: item.productImagePublicId,
          name: item.productName,
          price: item.price,
          quantity: 1,
          selectedAttributes: item.selectedAttributes,
        }}
      />
    </>
  );
};
