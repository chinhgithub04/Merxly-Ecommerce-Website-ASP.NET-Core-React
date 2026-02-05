import { useState } from 'react';
import { Link } from 'react-router-dom';
import { TrashIcon, MinusIcon, PlusIcon } from '@heroicons/react/24/outline';
import type { CartItemDto } from '../../types/models/cart';
import { getProductImageUrl } from '../../utils/cloudinaryHelpers';
import { Modal } from '../ui/Modal';

interface CartItemRowProps {
  item: CartItemDto;
  isSelected: boolean;
  onSelect: (itemId: string) => void;
  onUpdateQuantity: (itemId: string, quantity: number) => void;
  onRemove: (itemId: string) => void;
}

export const CartItemRow = ({
  item,
  isSelected,
  onSelect,
  onUpdateQuantity,
  onRemove,
}: CartItemRowProps) => {
  const [quantity, setQuantity] = useState(item.quantity);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const handleIncrement = () => {
    if (quantity < item.stockQuantity) {
      const newQuantity = quantity + 1;
      setQuantity(newQuantity);
      onUpdateQuantity(item.id, newQuantity);
    }
  };

  const handleDecrement = () => {
    if (quantity > 1) {
      const newQuantity = quantity - 1;
      setQuantity(newQuantity);
      onUpdateQuantity(item.id, newQuantity);
    }
  };

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (!isNaN(value) && value >= 1 && value <= item.stockQuantity) {
      setQuantity(value);
      onUpdateQuantity(item.id, value);
    }
  };

  const subtotal = item.priceAtAdd * quantity;

  const handleDeleteClick = () => {
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = () => {
    onRemove(item.id);
    setShowDeleteModal(false);
  };

  const handleDeleteModalClose = () => {
    setShowDeleteModal(false);
  };

  return (
    <>
      {/* Desktop Layout - Table Row */}
      <tr
        className={`hidden md:table-row hover:bg-neutral-50 transition-colors ${
          !item.isAvailable ? 'opacity-50' : ''
        }`}
      >
        <td className='px-4 py-4 w-12'>
          <input
            type='checkbox'
            checked={isSelected}
            onChange={() => onSelect(item.id)}
            disabled={!item.isAvailable}
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
              {!item.isAvailable && (
                <span className='text-xs text-red-600 font-medium'>
                  Out of stock
                </span>
              )}
            </div>
          </div>
        </td>
        <td className='px-4 py-4 w-32'>
          <span className='text-sm text-neutral-900 whitespace-nowrap'>
            ₫{item.priceAtAdd.toLocaleString('vi-VN')}
          </span>
        </td>
        <td className='px-4 py-4 w-40'>
          <div className='flex items-center border border-neutral-300 rounded-lg w-fit'>
            <button
              onClick={handleDecrement}
              disabled={quantity <= 1}
              className='cursor-pointer p-2 hover:bg-neutral-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors'
            >
              <MinusIcon className='h-4 w-4 text-neutral-700' />
            </button>
            <input
              type='number'
              value={quantity}
              onChange={handleQuantityChange}
              min={1}
              max={item.stockQuantity}
              className='cursor-pointer w-12 text-center border-x border-neutral-300 py-1.5 text-sm text-neutral-900 font-medium focus:outline-none'
            />
            <button
              onClick={handleIncrement}
              disabled={quantity >= item.stockQuantity}
              className='cursor-pointer p-2 hover:bg-neutral-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors'
            >
              <PlusIcon className='h-4 w-4 text-neutral-700' />
            </button>
          </div>
        </td>
        <td className='px-4 py-4 w-32'>
          <span className='text-sm font-medium text-neutral-900 whitespace-nowrap'>
            ₫{subtotal.toLocaleString('vi-VN')}
          </span>
        </td>
        <td className='px-4 py-4 w-16'>
          <button
            onClick={handleDeleteClick}
            className='cursor-pointer p-2 text-neutral-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors'
          >
            <TrashIcon className='h-5 w-5' />
          </button>

          {/* Delete Item Modal */}
          <Modal
            isOpen={showDeleteModal}
            onClose={handleDeleteModalClose}
            onDone={handleDeleteConfirm}
            title='Remove Item'
            doneLabel='Remove'
            cancelLabel='Cancel'
          >
            <div className='space-y-4'>
              <p className='text-neutral-600'>
                Are you sure you want to remove this item from your cart? This
                action cannot be undone.
              </p>
            </div>
          </Modal>
        </td>
      </tr>

      {/* Mobile Layout - Card */}
      <div className={`md:hidden p-4 ${!item.isAvailable ? 'opacity-50' : ''}`}>
        {/* First Row: Checkbox, Image, Delete Button */}
        <div className='flex items-start justify-between gap-3 mb-3'>
          {/* Checkbox */}
          <div className='pt-1'>
            <input
              type='checkbox'
              checked={isSelected}
              onChange={() => onSelect(item.id)}
              disabled={!item.isAvailable}
              className='w-4 h-4 rounded border-neutral-300 text-primary-600 focus:ring-2 focus:ring-primary-600 cursor-pointer disabled:cursor-not-allowed'
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
            onClick={handleDeleteClick}
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

        {!item.isAvailable && (
          <span className='text-xs text-red-600 font-medium block mb-3'>
            Out of stock
          </span>
        )}

        {/* Price */}
        <div className='text-sm text-neutral-600 mb-3'>
          Unit Price:{' '}
          <span className='font-medium text-neutral-900'>
            ₫{item.priceAtAdd.toLocaleString('vi-VN')}
          </span>
        </div>

        {/* Quantity Controls and Subtotal */}
        <div className='space-y-3'>
          <div className='flex items-center border border-neutral-300 rounded-lg w-fit'>
            <button
              onClick={handleDecrement}
              disabled={quantity <= 1}
              className='cursor-pointer p-2 hover:bg-neutral-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors'
            >
              <MinusIcon className='h-4 w-4 text-neutral-700' />
            </button>
            <input
              type='number'
              value={quantity}
              onChange={handleQuantityChange}
              min={1}
              max={item.stockQuantity}
              className='cursor-pointer w-10 text-center border-x border-neutral-300 py-1.5 text-sm text-neutral-900 font-medium focus:outline-none'
            />
            <button
              onClick={handleIncrement}
              disabled={quantity >= item.stockQuantity}
              className='cursor-pointer p-2 hover:bg-neutral-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors'
            >
              <PlusIcon className='h-4 w-4 text-neutral-700' />
            </button>
          </div>

          {/* Subtotal */}
          <div className='text-sm text-neutral-600'>
            Subtotal:{' '}
            <span className='font-semibold text-neutral-900'>
              ₫{subtotal.toLocaleString('vi-VN')}
            </span>
          </div>
        </div>
      </div>

      {/* Delete Item Modal */}
      <Modal
        isOpen={showDeleteModal}
        onClose={handleDeleteModalClose}
        onDone={handleDeleteConfirm}
        title='Remove Item'
        doneLabel='Remove'
        cancelLabel='Cancel'
      >
        <div className='space-y-4'>
          <p className='text-neutral-600'>
            Are you sure you want to remove this item from your cart? This
            action cannot be undone.
          </p>
        </div>
      </Modal>
    </>
  );
};
