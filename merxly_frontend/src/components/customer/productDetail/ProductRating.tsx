import { StarIcon } from '@heroicons/react/24/solid';
import { StarIcon as StarOutlineIcon } from '@heroicons/react/24/outline';

interface ProductRatingProps {
  averageRating: number;
  reviewCount: number;
}

export const ProductRating = ({
  averageRating,
  reviewCount,
}: ProductRatingProps) => {
  const renderStars = () => {
    const stars = [];
    const fullStars = Math.floor(averageRating);
    const hasHalfStar = averageRating % 1 >= 0.5;

    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(<StarIcon key={i} className='h-6 w-6 text-yellow-400' />);
      } else if (i === fullStars && hasHalfStar) {
        stars.push(
          <div key={i} className='relative inline-block'>
            <StarOutlineIcon className='h-6 w-6 text-neutral-300' />
            <div className='absolute inset-0 w-1/2 overflow-hidden'>
              <StarIcon className='h-6 w-6 text-yellow-400' />
            </div>
          </div>,
        );
      } else {
        stars.push(
          <StarOutlineIcon key={i} className='h-6 w-6 text-neutral-300' />,
        );
      }
    }

    return stars;
  };

  return (
    <div className='flex flex-col md:flex-row md:items-center gap-2 md:gap-3'>
      <div className='flex'>{renderStars()}</div>
      <div className='flex items-baseline gap-2'>
        <span className='text-lg font-bold text-neutral-900'>
          {averageRating.toFixed(1)} Star Rating
        </span>
        <span className='text-xs md:text-sm text-neutral-500'>
          ({reviewCount.toLocaleString()} User feedback)
        </span>
      </div>
    </div>
  );
};
