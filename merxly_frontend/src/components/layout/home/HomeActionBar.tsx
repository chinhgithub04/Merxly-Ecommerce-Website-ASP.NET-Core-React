import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import {
  ChevronDownIcon,
  ChevronUpIcon,
  ChevronRightIcon,
  TruckIcon,
  ScaleIcon,
  ChatBubbleLeftRightIcon,
  QuestionMarkCircleIcon,
} from '@heroicons/react/24/outline';
import { getCategoryTree } from '../../../services/categoryService';
import type { CategoryDto } from '../../../types/models/category';

export const HomeActionBar = () => {
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [hoveredCategoryId, setHoveredCategoryId] = useState<string | null>(
    null
  );

  const handleCategoryClick = (categoryId: string) => {
    setIsDropdownOpen(false);
    navigate(`/search?categoryId=${categoryId}`);
  };

  const { data: categoriesData } = useQuery({
    queryKey: ['categories-tree'],
    queryFn: () => getCategoryTree(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const categories = categoriesData?.data?.items || [];
  const rootCategories = categories.filter((cat) => !cat.parentCategoryId);

  const renderCategoryItem = (category: CategoryDto, level: number = 0) => {
    const hasChildren = category.children && category.children.length > 0;
    const isHovered = hoveredCategoryId === category.id;

    return (
      <div
        key={category.id}
        className='relative'
        onMouseEnter={() => setHoveredCategoryId(category.id)}
        onMouseLeave={() => setHoveredCategoryId(null)}
      >
        <button
          onClick={() => handleCategoryClick(category.id)}
          className='w-full flex items-center justify-between px-4 py-2.5 text-sm text-neutral-700 hover:bg-neutral-50 transition-colors cursor-pointer text-left'
        >
          <span>{category.name}</span>
          {hasChildren && (
            <ChevronRightIcon className='h-4 w-4 text-neutral-400' />
          )}
        </button>

        {/* Submenu */}
        {hasChildren && isHovered && (
          <div className='absolute left-full top-0 ml-1 min-w-[200px] bg-white border border-neutral-200 rounded-lg shadow-lg py-2 z-50'>
            {category.children.map((child) =>
              renderCategoryItem(child, level + 1)
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className='fixed top-20 left-0 right-0 bg-white border-b border-neutral-200 z-20'>
      <div className='flex items-center gap-6 px-20 py-3'>
        {/* Category Dropdown */}
        <div className='relative'>
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className='flex items-center gap-2 px-4 py-2 text-sm font-medium text-neutral-700 bg-white border border-neutral-300 rounded-lg hover:bg-neutral-50 transition-colors cursor-pointer'
          >
            <span>All category</span>
            {isDropdownOpen ? (
              <ChevronUpIcon className='h-4 w-4' />
            ) : (
              <ChevronDownIcon className='h-4 w-4' />
            )}
          </button>

          {/* Dropdown Menu */}
          {isDropdownOpen && (
            <>
              {/* Backdrop to close dropdown */}
              <div
                className='fixed inset-0 z-10'
                onClick={() => setIsDropdownOpen(false)}
              />

              {/* Dropdown content */}
              <div className='absolute top-full left-0 mt-1 min-w-[250px] bg-white border border-neutral-200 rounded-lg shadow-lg z-20'>
                {rootCategories.map((category) => renderCategoryItem(category))}
              </div>
            </>
          )}
        </div>

        {/* Action Buttons */}
        <button className='flex items-center gap-2 px-4 py-2 text-sm text-neutral-700 hover:text-primary-600 transition-colors cursor-pointer'>
          <TruckIcon className='h-5 w-5' />
          <span>Track Order</span>
        </button>

        <button className='flex items-center gap-2 px-4 py-2 text-sm text-neutral-700 hover:text-primary-600 transition-colors cursor-pointer'>
          <ScaleIcon className='h-5 w-5' />
          <span>Compare</span>
        </button>

        <button className='flex items-center gap-2 px-4 py-2 text-sm text-neutral-700 hover:text-primary-600 transition-colors cursor-pointer'>
          <ChatBubbleLeftRightIcon className='h-5 w-5' />
          <span>Customer Support</span>
        </button>

        <button className='flex items-center gap-2 px-4 py-2 text-sm text-neutral-700 hover:text-primary-600 transition-colors cursor-pointer'>
          <QuestionMarkCircleIcon className='h-5 w-5' />
          <span>Need help</span>
        </button>
      </div>
    </div>
  );
};
