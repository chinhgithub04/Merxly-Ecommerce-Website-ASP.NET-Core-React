import { useRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import { getParentCategories } from '../../services/categoryService';
import { getCategoryImageUrl } from '../../utils/cloudinaryHelpers';

export const ShopWithCategories = () => {
  const navigate = useNavigate();
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
    <div className='bg-white py-8 md:py-12 px-4 md:px-8 lg:px-20'>
      {/* Title */}
      <h2 className='text-2xl md:text-3xl font-bold text-neutral-900 text-center mb-6 md:mb-8'>
        Shop with Category
      </h2>

      {/* Categories Container */}
      <div className='relative'>
        {/* Left Arrow Button */}
        <button
          onClick={() => scroll('left')}
          className='hidden md:flex absolute left-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 md:w-12 md:h-12 items-center justify-center bg-white rounded-full shadow-lg border border-neutral-200 text-neutral-600 hover:text-primary-600 hover:border-primary-600 transition-colors cursor-pointer'
          aria-label='Scroll left'
        >
          <ChevronLeftIcon className='h-5 w-5 md:h-6 md:w-6' />
        </button>

        {/* Scrollable Categories */}
        <div
          ref={scrollContainerRef}
          className='overflow-x-auto scrollbar-hide scroll-smooth px-0 md:px-14'
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          <div className='flex gap-4 md:gap-6 pb-2'>
            {categories.map((category) => (
              <div
                key={category.id}
                onClick={() => navigate(`/search?categoryId=${category.id}`)}
                className='shrink-0 w-40 md:w-50 min-h-52 border-2 border-neutral-200 rounded-lg hover:border-primary-600 transition-colors cursor-pointer'
              >
                <div className='flex flex-col items-center justify-center p-4'>
                  {/* Category Image */}
                  {category.imagePublicId ? (
                    <img
                      src={getCategoryImageUrl(
                        category.imagePublicId,
                        120,
                        120,
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
                  <span className='text-sm mt-2 md:mt-5 font-medium text-neutral-700 text-center line-clamp-2'>
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
          className='hidden md:flex absolute right-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 md:w-12 md:h-12 items-center justify-center bg-white rounded-full shadow-lg border border-neutral-200 text-neutral-600 hover:text-primary-600 hover:border-primary-600 transition-colors cursor-pointer'
          aria-label='Scroll right'
        >
          <ChevronRightIcon className='h-5 w-5 md:h-6 md:w-6' />
        </button>
      </div>
    </div>
  );
};
