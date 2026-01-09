import { useState, useMemo, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useSearchParams } from 'react-router-dom';
import { ProductCard } from '../../components/home/ProductCard';
import { ProductFilters } from '../../components/customer/products/ProductFilters';
import { ActiveFiltersBar } from '../../components/customer/products/ActiveFiltersBar';
import { getProducts } from '../../services/productService';
import { getParentCategories } from '../../services/categoryService';
import { ProductSortBy } from '../../types/enums';
import type { CustomerProductQueryParameters } from '../../types/models/product';

const PRODUCTS_PER_PAGE = 20;

export const SearchProductPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  // Parse query params from URL
  const [filters, setFilters] = useState<CustomerProductQueryParameters>({
    pageNumber: Number(searchParams.get('page')) || 1,
    pageSize: PRODUCTS_PER_PAGE,
    categoryId: searchParams.get('categoryId') || undefined,
    minPrice: Number(searchParams.get('minPrice')) || 0,
    maxPrice: searchParams.get('maxPrice')
      ? Number(searchParams.get('maxPrice'))
      : undefined,
    minRating: Number(searchParams.get('minRating')) || 0,
    sortBy:
      (Number(searchParams.get('sortBy')) as ProductSortBy) ||
      ProductSortBy.PlatformFeatured,
    searchTerm: searchParams.get('q') || undefined,
  });

  // Sync filters with URL changes (e.g., when navigating from HomeHeader search)
  useEffect(() => {
    setFilters({
      pageNumber: Number(searchParams.get('page')) || 1,
      pageSize: PRODUCTS_PER_PAGE,
      categoryId: searchParams.get('categoryId') || undefined,
      minPrice: Number(searchParams.get('minPrice')) || 0,
      maxPrice: searchParams.get('maxPrice')
        ? Number(searchParams.get('maxPrice'))
        : undefined,
      minRating: Number(searchParams.get('minRating')) || 0,
      sortBy:
        (Number(searchParams.get('sortBy')) as ProductSortBy) ||
        ProductSortBy.PlatformFeatured,
      searchTerm: searchParams.get('q') || undefined,
    });
  }, [searchParams]);

  // Fetch categories for filter labels
  const { data: categoriesData } = useQuery({
    queryKey: ['parent-categories'],
    queryFn: () => getParentCategories(),
  });

  const categories = categoriesData?.data?.items || [];

  // Fetch products
  const { data: productsData, isLoading } = useQuery({
    queryKey: ['products', filters],
    queryFn: () => getProducts(filters),
  });

  const products = productsData?.data?.items || [];
  const totalResults = productsData?.data?.totalCount || 0;
  const totalPages = productsData?.data?.totalPages || 1;

  // Update filters and URL
  const updateFilters = (
    newFilters: Partial<CustomerProductQueryParameters>
  ) => {
    const updated = { ...filters, ...newFilters, pageNumber: 1 };

    // Don't send maxPrice if it's at maximum (10,000,000)
    if (updated.maxPrice && updated.maxPrice >= 10000000) {
      updated.maxPrice = undefined;
    }

    setFilters(updated);

    // Update URL params
    const params = new URLSearchParams();
    if (updated.categoryId) params.set('categoryId', updated.categoryId);
    if (updated.minPrice && updated.minPrice > 0)
      params.set('minPrice', updated.minPrice.toString());
    if (updated.maxPrice && updated.maxPrice < 10000000)
      params.set('maxPrice', updated.maxPrice.toString());
    if (updated.minRating && updated.minRating > 0)
      params.set('minRating', updated.minRating.toString());
    if (updated.sortBy !== undefined)
      params.set('sortBy', updated.sortBy.toString());
    if (updated.searchTerm) params.set('q', updated.searchTerm);
    params.set('page', '1');

    setSearchParams(params);
  };

  const handlePageChange = (page: number) => {
    setFilters({ ...filters, pageNumber: page });
    const params = new URLSearchParams(searchParams);
    params.set('page', page.toString());
    setSearchParams(params);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Build active filters
  const activeFilters = useMemo(() => {
    const active: Array<{ key: string; label: string; value: string }> = [];

    if (filters.categoryId) {
      const category = categories.find((c) => c.id === filters.categoryId);
      if (category) {
        active.push({
          key: 'categoryId',
          label: category.name,
          value: category.id,
        });
      }
    }

    if (filters.minPrice && filters.minPrice > 0) {
      active.push({
        key: 'minPrice',
        label: `Min: ₫${filters.minPrice.toLocaleString('vi-VN')}`,
        value: filters.minPrice.toString(),
      });
    }

    if (filters.maxPrice) {
      active.push({
        key: 'maxPrice',
        label: `Max: ₫${filters.maxPrice.toLocaleString('vi-VN')}`,
        value: filters.maxPrice.toString(),
      });
    }

    if (filters.minRating && filters.minRating > 0) {
      active.push({
        key: 'minRating',
        label: `${filters.minRating}+ stars`,
        value: filters.minRating.toString(),
      });
    }

    return active;
  }, [filters, categories]);

  const handleRemoveFilter = (key: string) => {
    if (key === 'categoryId') {
      updateFilters({ categoryId: undefined });
    } else if (key === 'minPrice') {
      updateFilters({ minPrice: 0 });
    } else if (key === 'maxPrice') {
      updateFilters({ maxPrice: 10000000 });
    } else if (key === 'minRating') {
      updateFilters({ minRating: 0 });
    }
  };

  // Split products into rows (5 rows x 4 products)
  const productRows = useMemo(() => {
    const rows: (typeof products)[] = [];
    for (let i = 0; i < products.length; i += 4) {
      rows.push(products.slice(i, i + 4));
    }
    return rows;
  }, [products]);

  const sortOptions = [
    { value: ProductSortBy.PlatformFeatured, label: 'Featured' },
    { value: ProductSortBy.PriceLowToHigh, label: 'Price: Low to High' },
    { value: ProductSortBy.PriceHighToLow, label: 'Price: High to Low' },
    { value: ProductSortBy.BestSelling, label: 'Best Selling' },
    { value: ProductSortBy.Rating, label: 'Rating' },
    { value: ProductSortBy.Newest, label: 'Newest' },
  ];

  return (
    <div className='px-20 p-8'>
      <div className='flex gap-6'>
        {/* Left Sidebar - Filters */}
        <aside className='shrink-0'>
          <ProductFilters
            selectedCategoryId={filters.categoryId || null}
            minPrice={filters.minPrice || 0}
            maxPrice={filters.maxPrice || 10000000}
            minRating={filters.minRating || 0}
            onCategoryChange={(categoryId) =>
              updateFilters({ categoryId: categoryId || undefined })
            }
            onPriceChange={(min, max) =>
              updateFilters({ minPrice: min, maxPrice: max })
            }
            onRatingChange={(rating) => updateFilters({ minRating: rating })}
          />
        </aside>

        {/* Right Section - Products */}
        <div className='flex-1'>
          {/* Sort Section */}
          <div className='flex justify-end mb-4'>
            <div className='flex items-center gap-2'>
              <span className='text-sm text-neutral-700'>Sort by:</span>
              <select
                value={filters.sortBy}
                onChange={(e) =>
                  updateFilters({
                    sortBy: Number(e.target.value) as ProductSortBy,
                  })
                }
                className='px-4 py-2 border border-neutral-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-600 cursor-pointer'
              >
                {sortOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Active Filters Bar */}
          <ActiveFiltersBar
            filters={activeFilters}
            totalResults={totalResults}
            onRemoveFilter={handleRemoveFilter}
          />

          {/* Products Grid */}
          {isLoading ? (
            <div className='flex items-center justify-center py-20'>
              <p className='text-neutral-500'>Loading products...</p>
            </div>
          ) : products.length === 0 ? (
            <div className='flex items-center justify-center py-20'>
              <p className='text-neutral-500'>No products found</p>
            </div>
          ) : (
            <div className='space-y-6 mb-8'>
              {productRows.map((row, rowIndex) => (
                <div key={rowIndex} className='grid grid-cols-4 gap-6'>
                  {row.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              ))}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className='flex justify-center gap-2'>
              <button
                onClick={() => handlePageChange(filters.pageNumber! - 1)}
                disabled={filters.pageNumber === 1}
                className='px-4 py-2 border border-neutral-300 rounded-lg text-sm font-medium text-neutral-700 hover:bg-neutral-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer'
              >
                Previous
              </button>

              {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                let pageNum: number;
                if (totalPages <= 5) {
                  pageNum = i + 1;
                } else if (filters.pageNumber! <= 3) {
                  pageNum = i + 1;
                } else if (filters.pageNumber! >= totalPages - 2) {
                  pageNum = totalPages - 4 + i;
                } else {
                  pageNum = filters.pageNumber! - 2 + i;
                }

                return (
                  <button
                    key={pageNum}
                    onClick={() => handlePageChange(pageNum)}
                    className={`px-4 py-2 border rounded-lg text-sm font-medium transition-colors cursor-pointer ${
                      filters.pageNumber === pageNum
                        ? 'bg-primary-600 text-white border-primary-600'
                        : 'border-neutral-300 text-neutral-700 hover:bg-neutral-50'
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}

              <button
                onClick={() => handlePageChange(filters.pageNumber! + 1)}
                disabled={filters.pageNumber === totalPages}
                className='px-4 py-2 border border-neutral-300 rounded-lg text-sm font-medium text-neutral-700 hover:bg-neutral-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer'
              >
                Next
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
