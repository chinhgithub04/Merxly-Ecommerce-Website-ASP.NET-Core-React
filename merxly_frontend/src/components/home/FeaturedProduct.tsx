import { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { ChevronRightIcon } from '@heroicons/react/24/outline';
import { getTop10FeaturedProducts } from '../../services/productService';
import { getParentCategories } from '../../services/categoryService';
import { ProductCard } from './ProductCard';
import { useNavigate } from 'react-router-dom';

export const FeaturedProduct = () => {
  const navigate = useNavigate();

  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(
    null,
  );

  // Fetch parent categories
  const { data: categoriesData } = useQuery({
    queryKey: ['parent-categories', 1, 3],
    queryFn: () => getParentCategories(1, 3),
  });

  const categories = categoriesData?.data?.items || [];

  // Fetch featured products
  const { data: productsData } = useQuery({
    queryKey: ['featured-products', selectedCategoryId],
    queryFn: () => getTop10FeaturedProducts(selectedCategoryId || undefined),
  });

  const products = productsData?.data || [];

  // Split products into 2 rows of 5
  const productRows = useMemo(() => {
    const row1 = products.slice(0, 5);
    const row2 = products.slice(5, 10);
    return [row1, row2];
  }, [products]);

  const handleBrowseAllClick = () => {
    navigate('/search');
  };

  return (
    <div className='bg-neutral-50 py-8 md:py-12 px-4 md:px-8 lg:px-20'>
      {/* Header Row */}
      <div className='flex flex-col md:flex-row items-start md:items-center justify-between mb-6 md:mb-8 gap-4'>
        {/* Title */}
        <h2 className='text-2xl md:text-3xl font-bold text-neutral-900'>
          Featured Product
        </h2>

        {/* Filter Options */}
        <div className='flex items-center gap-3 md:gap-6 overflow-x-auto scrollbar-hide w-full md:w-auto'>
          {/* All Product */}
          <button
            onClick={() => setSelectedCategoryId(null)}
            className={`text-xs md:text-sm font-medium pb-2 transition-colors cursor-pointer whitespace-nowrap ${
              selectedCategoryId === null
                ? 'text-neutral-900 border-b-2 border-primary-600'
                : 'text-neutral-600 hover:text-neutral-900'
            }`}
          >
            All Product
          </button>

          {/* Parent Categories */}
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategoryId(category.id)}
              className={`text-xs md:text-sm font-medium pb-2 transition-colors cursor-pointer whitespace-nowrap ${
                selectedCategoryId === category.id
                  ? 'text-neutral-900 border-b-2 border-primary-600'
                  : 'text-neutral-600 hover:text-neutral-900'
              }`}
            >
              {category.name}
            </button>
          ))}

          {/* Browse All Product */}
          <button
            onClick={handleBrowseAllClick}
            className='flex items-center gap-1 text-xs md:text-sm font-medium pb-2 text-primary-600 hover:text-primary-700 transition-colors cursor-pointer whitespace-nowrap'
          >
            <span>Browse All Product</span>
            <ChevronRightIcon className='h-4 w-4' />
          </button>
        </div>
      </div>

      {/* Product Grid - 2 rows x 5 columns on desktop, single column on mobile */}
      <div className='space-y-4 md:space-y-6'>
        {productRows.map((row, rowIndex) => (
          <div
            key={rowIndex}
            className='grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6'
          >
            {row.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};
