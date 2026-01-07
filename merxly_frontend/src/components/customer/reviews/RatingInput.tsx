import { StarIcon } from '@heroicons/react/24/solid';
import { StarIcon as StarOutlineIcon } from '@heroicons/react/24/outline';

interface RatingInputProps {
  value: number;
  onChange: (rating: number) => void;
  readOnly?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export const RatingInput = ({
  value,
  onChange,
  readOnly = false,
  size = 'md',
}: RatingInputProps) => {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-6 w-6',
    lg: 'h-8 w-8',
  };

  return (
    <div className='flex items-center gap-1'>
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type='button'
          onClick={() => !readOnly && onChange(star)}
          disabled={readOnly}
          className={`${
            readOnly
              ? ''
              : 'cursor-pointer hover:scale-110 transition-transform'
          }`}
        >
          {star <= value ? (
            <StarIcon className={`${sizeClasses[size]} text-yellow-400`} />
          ) : (
            <StarOutlineIcon
              className={`${sizeClasses[size]} text-neutral-300`}
            />
          )}
        </button>
      ))}
    </div>
  );
};
