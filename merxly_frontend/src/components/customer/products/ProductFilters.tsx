import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { StarIcon } from '@heroicons/react/24/solid';
import { StarIcon as StarOutlineIcon } from '@heroicons/react/24/outline';
import { getParentCategories } from '../../../services/categoryService';

interface ProductFiltersProps {
  selectedCategoryId: string | null;
  minPrice: number;
  maxPrice: number;
  minRating: number;
  onCategoryChange: (categoryId: string | null) => void;
  onPriceChange: (min: number, max: number) => void;
  onRatingChange: (rating: number) => void;
}

const MAX_PRICE = 100000000;

export const ProductFilters = ({
  selectedCategoryId,
  minPrice,
  maxPrice,
  minRating,
  onCategoryChange,
  onPriceChange,
  onRatingChange,
}: ProductFiltersProps) => {
  const [localMinPrice, setLocalMinPrice] = useState(minPrice);
  const [localMaxPrice, setLocalMaxPrice] = useState(maxPrice);
  const [minPriceInput, setMinPriceInput] = useState(minPrice.toString());
  const [maxPriceInput, setMaxPriceInput] = useState(maxPrice.toString());

  const { data: categoriesData } = useQuery({
    queryKey: ['parent-categories'],
    queryFn: () => getParentCategories(),
    staleTime: 5 * 60 * 1000,
  });

  const categories = categoriesData?.data?.items || [];

  useEffect(() => {
    setLocalMinPrice(minPrice);
    setLocalMaxPrice(maxPrice);
    setMinPriceInput(minPrice.toString());
    setMaxPriceInput(maxPrice.toString());
  }, [minPrice, maxPrice]);

  const handlePriceSliderChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    type: 'min' | 'max',
  ) => {
    const value = Number(e.target.value);
    if (type === 'min') {
      const constrainedValue = Math.min(value, localMaxPrice);
      setLocalMinPrice(constrainedValue);
      onPriceChange(constrainedValue, localMaxPrice);
    } else {
      const constrainedValue = Math.max(value, localMinPrice);
      setLocalMaxPrice(constrainedValue);
      onPriceChange(localMinPrice, constrainedValue);
    }
  };

  const handlePriceInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    type: 'min' | 'max',
  ) => {
    const value = e.target.value;
    if (type === 'min') {
      setMinPriceInput(value);
      const numValue = Number(value);
      if (value !== '' && !isNaN(numValue)) {
        setLocalMinPrice(numValue);
        setMinPriceInput(numValue.toString());
      }
    } else {
      const numValue = Number(value);
      if (value !== '' && !isNaN(numValue) && numValue > MAX_PRICE) {
        setMaxPriceInput(MAX_PRICE.toString());
        setLocalMaxPrice(MAX_PRICE);
      } else {
        setMaxPriceInput(value);
        if (value !== '' && !isNaN(numValue)) {
          setLocalMaxPrice(numValue);
        }
      }
    }
  };

  const handlePriceInputBlur = () => {
    let min = minPriceInput === '' ? 0 : Number(minPriceInput);
    let max = maxPriceInput === '' ? 0 : Number(maxPriceInput);

    if (min < 0) min = 0;
    if (max > MAX_PRICE) max = MAX_PRICE;
    if (max === 0) max = MAX_PRICE;
    if (min > max) {
      const temp = min;
      min = max;
      max = temp;
    }

    setLocalMinPrice(min);
    setLocalMaxPrice(max);
    setMinPriceInput(min.toString());
    setMaxPriceInput(max.toString());
    onPriceChange(min, max);
  };

  const handleRatingClick = (rating: number) => {
    if (minRating === rating) {
      onRatingChange(0);
    } else {
      onRatingChange(rating);
    }
  };

  const renderStars = () => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      const isFilled = i <= minRating;
      const isHalfFilled = i - 0.5 === minRating;

      stars.push(
        <div key={i} className='relative inline-block'>
          {/* Base star display */}
          <div className='relative pointer-events-none'>
            {isFilled ? (
              <StarIcon className='h-8 w-8 text-yellow-400' />
            ) : isHalfFilled ? (
              <>
                <StarOutlineIcon className='h-8 w-8 text-yellow-400' />
                <div className='absolute inset-0 w-1/2 overflow-hidden'>
                  <StarIcon className='h-8 w-8 text-yellow-400' />
                </div>
              </>
            ) : (
              <StarOutlineIcon className='h-8 w-8 text-yellow-400' />
            )}
          </div>
          {/* Clickable overlay for left half */}
          <div
            className='absolute inset-0 w-1/2 cursor-pointer'
            onClick={() => handleRatingClick(i - 0.5)}
          />
          {/* Clickable overlay for right half */}
          <div
            className='absolute inset-0 left-1/2 w-1/2 cursor-pointer'
            onClick={() => handleRatingClick(i)}
          />
        </div>,
      );
    }
    return stars;
  };

  return (
    <div className='w-full lg:w-70 py-6 space-y-6'>
      {/* Category Filter */}
      <div>
        <h3 className='text-lg font-semibold text-neutral-900 mb-4'>
          Category
        </h3>
        <div className='space-y-2'>
          <label className='flex items-center gap-2 cursor-pointer'>
            <input
              type='radio'
              name='category'
              checked={selectedCategoryId === null}
              onChange={() => onCategoryChange(null)}
              className='w-4 h-4 text-primary-600 cursor-pointer'
            />
            <span className='text-sm text-neutral-700'>All Categories</span>
          </label>
          {categories.map((category) => (
            <label
              key={category.id}
              className='flex items-center gap-2 cursor-pointer'
            >
              <input
                type='radio'
                name='category'
                checked={selectedCategoryId === category.id}
                onChange={() => onCategoryChange(category.id)}
                className='w-4 h-4 text-primary-600 cursor-pointer'
              />
              <span className='text-sm text-neutral-700'>{category.name}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Price Range Filter */}
      <div>
        <h3 className='text-lg font-semibold text-neutral-900 mb-4'>
          Price Range
        </h3>
        <div className='space-y-4'>
          {/* Dual-handle Range Slider */}
          <div className='relative pt-2 pb-2'>
            <div className='relative h-2'>
              {/* Slider Track */}
              <div className='absolute w-full h-2 bg-neutral-200 rounded-lg' />
              {/* Active Range */}
              <div
                className='absolute h-2 bg-primary-600 rounded-lg'
                style={{
                  left: `${(localMinPrice / MAX_PRICE) * 100}%`,
                  right: `${100 - (localMaxPrice / MAX_PRICE) * 100}%`,
                }}
              />
              {/* Min Handle */}
              <input
                type='range'
                min='0'
                max={MAX_PRICE}
                step='100000'
                value={localMinPrice}
                onChange={(e) => handlePriceSliderChange(e, 'min')}
                className='absolute w-full h-2 appearance-none bg-transparent pointer-events-none [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-primary-600 [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white [&::-webkit-slider-thumb]:shadow-md [&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:appearance-none [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-primary-600 [&::-moz-range-thumb]:cursor-pointer [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-white [&::-moz-range-thumb]:shadow-md'
              />
              {/* Max Handle */}
              <input
                type='range'
                min='0'
                max={MAX_PRICE}
                step='100000'
                value={localMaxPrice}
                onChange={(e) => handlePriceSliderChange(e, 'max')}
                className='absolute w-full h-2 appearance-none bg-transparent pointer-events-none [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-primary-600 [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white [&::-webkit-slider-thumb]:shadow-md [&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:appearance-none [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-primary-600 [&::-moz-range-thumb]:cursor-pointer [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-white [&::-moz-range-thumb]:shadow-md'
              />
            </div>
          </div>

          {/* Price Inputs */}
          <div className='flex items-center gap-2'>
            <input
              type='number'
              value={minPriceInput}
              onChange={(e) => handlePriceInputChange(e, 'min')}
              onBlur={() => handlePriceInputBlur()}
              className='w-full px-3 py-2 border border-neutral-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-600'
              placeholder='Min'
            />
            <span className='text-neutral-500'>-</span>
            <input
              type='number'
              value={maxPriceInput}
              onChange={(e) => handlePriceInputChange(e, 'max')}
              onBlur={() => handlePriceInputBlur()}
              className='w-full px-3 py-2 border border-neutral-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-600'
              placeholder='Max'
            />
          </div>
        </div>
      </div>

      {/* Rating Filter */}
      <div>
        <h3 className='text-lg font-semibold text-neutral-900 mb-4'>
          Minimum Rating
        </h3>
        <div className='flex gap-1'>{renderStars()}</div>
      </div>
    </div>
  );
};
