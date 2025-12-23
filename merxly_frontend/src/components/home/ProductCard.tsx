import { StarIcon } from '@heroicons/react/24/solid';
import { StarIcon as StarOutlineIcon } from '@heroicons/react/24/outline';
import type { ProductDto } from '../../types/models/product';
import { getProductImageUrl } from '../../utils/cloudinaryHelpers';

interface ProductCardProps {
  product: ProductDto;
}

export const ProductCard = ({ product }: ProductCardProps) => {
  const {
    name,
    minPrice,
    maxPrice,
    mainMediaPublicId,
    averageRating,
    reviewCount,
  } = product;

  // Render star rating
  const renderStars = () => {
    const stars = [];
    const fullStars = Math.floor(averageRating);

    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(<StarIcon key={i} className='h-4 w-4 text-yellow-400' />);
      } else {
        stars.push(
          <StarOutlineIcon key={i} className='h-4 w-4 text-neutral-300' />
        );
      }
    }

    return stars;
  };

  // Format price display
  const formatPrice = () => {
    if (!minPrice && !maxPrice) {
      return 'Price not available';
    }

    if (minPrice === maxPrice || !maxPrice) {
      return `₫${minPrice?.toFixed(2)}`;
    }

    return `₫${minPrice?.toFixed(2)} - ₫${maxPrice?.toFixed(2)}`;
  };

  return (
    <div className='border-2 border-neutral-200 rounded-lg hover:border-primary-600 transition-colors cursor-pointer p-4'>
      {/* Product Image */}
      <div className='flex justify-center mb-4'>
        {mainMediaPublicId ? (
          <img
            src={getProductImageUrl(mainMediaPublicId, 'card')}
            alt={name}
            className='w-full h-48 object-cover rounded-md'
          />
        ) : (
          <div className='w-full h-48 bg-neutral-100 rounded-md flex items-center justify-center'>
            <span className='text-neutral-400 text-sm'>No Image</span>
          </div>
        )}
      </div>

      {/* Rating Section */}
      <div className='flex items-center gap-1 mb-2'>
        <div className='flex'>{renderStars()}</div>
        <span className='text-xs text-neutral-500'>({reviewCount})</span>
      </div>

      {/* Product Name */}
      <h3 className='text-sm font-medium text-neutral-900 line-clamp-2 mb-2'>
        {name}
      </h3>

      {/* Price */}
      <p className='text-base font-bold text-primary-600'>{formatPrice()}</p>
    </div>
  );
};
