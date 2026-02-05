import { useNavigate } from 'react-router-dom';
import { Modal } from '../ui';
import { getProductImageUrl } from '../../utils/cloudinaryHelpers';

interface AddToCartModalProps {
  isOpen: boolean;
  onClose: () => void;
  variantData: {
    imagePublicId: string | null;
    name: string;
    price: number;
    quantity: number;
    selectedAttributes: Record<string, string>;
  };
}

export const AddToCartModal = ({
  isOpen,
  onClose,
  variantData,
}: AddToCartModalProps) => {
  const navigate = useNavigate();

  const handleGoToCart = () => {
    onClose();
    navigate('/cart');
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title='Added to Cart'
      doneLabel='Go To Cart'
      onDone={handleGoToCart}
    >
      <div className='flex flex-col md:flex-row gap-3 md:gap-4'>
        {/* Product Image */}
        <div className='w-20 h-20 md:w-24 md:h-24 rounded-lg border border-neutral-200 overflow-hidden bg-neutral-100 shrink-0 mx-auto md:mx-0'>
          {variantData.imagePublicId ? (
            <img
              src={getProductImageUrl(variantData.imagePublicId, 'thumbnail')}
              alt={variantData.name}
              className='w-full h-full object-cover'
            />
          ) : (
            <div className='w-full h-full flex items-center justify-center text-neutral-400 text-xs'>
              No image
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className='flex-1 space-y-2 text-center md:text-left'>
          <h3 className='text-sm md:text-base font-semibold text-neutral-900'>
            {variantData.name}
          </h3>

          {/* Selected Attributes */}
          {Object.entries(variantData.selectedAttributes).length > 0 && (
            <div className='text-sm text-neutral-600 space-y-1'>
              {Object.entries(variantData.selectedAttributes).map(
                ([key, value]) => (
                  <div key={key}>
                    <span className='font-semibold'>{key}:</span> {value}
                  </div>
                ),
              )}
            </div>
          )}

          {/* Price and Quantity */}
          <div className='flex flex-col md:flex-row md:items-center gap-2 md:gap-4 text-xs md:text-sm'>
            <div>
              <span className='text-neutral-600'>Price: </span>
              <span className='font-semibold text-primary-600'>
                ₫{variantData.price.toLocaleString('vi-VN')}
              </span>
            </div>
            <div>
              <span className='text-neutral-600'>Quantity: </span>
              <span className='font-semibold text-neutral-900'>
                {variantData.quantity}
              </span>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};
