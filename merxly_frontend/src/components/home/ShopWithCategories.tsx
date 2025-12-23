import { useRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import { getParentCategories } from '../../services/categoryService';
import { getCategoryImageUrl } from '../../utils/cloudinaryHelpers';

export const ShopWithCategories = () => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const { data: categoriesData } = useQuery({
    queryKey: ['parent-categories'],
    queryFn: () => getParentCategories(),
  });

  const categories = categoriesData?.data?.items || [];

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = 400;
      const newScrollPosition =
        scrollContainerRef.current.scrollLeft +
        (direction === 'left' ? -scrollAmount : scrollAmount);

      scrollContainerRef.current.scrollTo({
        left: newScrollPosition,
        behavior: 'smooth',
      });
    }
  };

  return (
    <div className='bg-white py-12 px-20'>
      {/* Title */}
      <h2 className='text-3xl font-bold text-neutral-900 text-center mb-8'>
        Shop with Category
      </h2>

      {/* Categories Container */}
      <div className='relative'>
        {/* Left Arrow Button */}
        <button
          onClick={() => scroll('left')}
          className='absolute left-0 top-1/2 -translate-y-1/2 z-10 w-12 h-12 flex items-center justify-center bg-white rounded-full shadow-lg border border-neutral-200 text-neutral-600 hover:text-primary-600 hover:border-primary-600 transition-colors cursor-pointer'
          aria-label='Scroll left'
        >
          <ChevronLeftIcon className='h-6 w-6' />
        </button>

        {/* Scrollable Categories */}
        <div
          ref={scrollContainerRef}
          className='overflow-x-auto scrollbar-hide scroll-smooth px-14'
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          <div className='flex gap-6 pb-2'>
            {categories.map((category) => (
              <div
                key={category.id}
                className='shrink-0 w-50 h-55 border-2 border-neutral-200 rounded-lg hover:border-primary-600 transition-colors cursor-pointer'
              >
                <div className='flex flex-col items-center justify-center h-full p-4'>
                  {/* Category Image */}
                  {category.imagePublicId ? (
                    <img
                      src={getCategoryImageUrl(
                        category.imagePublicId,
                        120,
                        120
                      )}
                      alt={category.name}
                      className='w-30 h-30 object-cover rounded-md mb-2'
                    />
                  ) : (
                    <div className='w-30 h-30 bg-neutral-100 rounded-md mb-2 flex items-center justify-center'>
                      <span className='text-neutral-400 text-xs'>No Image</span>
                    </div>
                  )}

                  {/* Category Name */}
                  <span className='text-sm mt-2 font-medium text-neutral-700 text-center line-clamp-2'>
                    {category.name}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Arrow Button */}
        <button
          onClick={() => scroll('right')}
          className='absolute right-0 top-1/2 -translate-y-1/2 z-10 w-12 h-12 flex items-center justify-center bg-white rounded-full shadow-lg border border-neutral-200 text-neutral-600 hover:text-primary-600 hover:border-primary-600 transition-colors cursor-pointer'
          aria-label='Scroll right'
        >
          <ChevronRightIcon className='h-6 w-6' />
        </button>
      </div>
    </div>
  );
};
