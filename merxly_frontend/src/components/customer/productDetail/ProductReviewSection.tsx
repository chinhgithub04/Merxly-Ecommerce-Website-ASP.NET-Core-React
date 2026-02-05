import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getReviews } from '../../../services/reviewService';
import { ProductReviewItem } from './ProductReviewItem';
import { RatingInput } from '../reviews/RatingInput';
import type { ReviewQueryParameters } from '../../../types/models/review';

interface ProductReviewSectionProps {
  productId: string;
  averageRating: number;
  reviewCount: number;
}

export const ProductReviewSection = ({
  productId,
  averageRating,
  reviewCount,
}: ProductReviewSectionProps) => {
  const [ratingFilter, setRatingFilter] = useState<number | undefined>(
    undefined,
  );
  const [sortOrder, setSortOrder] = useState<'Ascending' | 'Descending'>(
    'Descending',
  );
  const [hasMedia, setHasMedia] = useState<boolean | undefined>(undefined);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  const queryParams: ReviewQueryParameters = {
    productId,
    rating: ratingFilter,
    sortOrder: sortOrder,
    hasMedia: hasMedia,
    pageNumber: currentPage,
    pageSize,
  };

  const { data: reviewsData, isLoading } = useQuery({
    queryKey: [
      'product-reviews',
      productId,
      ratingFilter,
      sortOrder,
      hasMedia,
      currentPage,
    ],
    queryFn: () => getReviews(queryParams),
  });

  const reviews = reviewsData?.data;

  const handleRatingFilterClick = (rating: number) => {
    setRatingFilter(ratingFilter === rating ? undefined : rating);
    setCurrentPage(1); // Reset to first page when filter changes
  };

  const handleClearFilter = () => {
    setRatingFilter(undefined);
    setCurrentPage(1);
  };

  return (
    <div className='pt-12 border-neutral-200'>
      <h2 className='text-xl md:text-2xl font-bold text-neutral-900 mb-6'>
        Customer Reviews
      </h2>

      {/* Rating Summary */}
      <div className='bg-neutral-50 rounded-lg p-4 md:p-6 mb-6'>
        <div className='flex flex-col md:flex-row md:items-center gap-6 md:gap-8'>
          <div className='text-center'>
            <div className='text-4xl md:text-5xl font-bold text-primary-600 mb-2'>
              {averageRating.toFixed(1)}
            </div>
            <RatingInput
              value={Math.round(averageRating)}
              onChange={() => {}}
              readOnly
              size='md'
            />
            <p className='text-sm text-neutral-600 mt-2'>
              {reviewCount} {reviewCount === 1 ? 'review' : 'reviews'}
            </p>
          </div>

          {/* Rating Filter Buttons */}
          <div className='flex-1 space-y-4'>
            {/* Rating Filter */}
            <div>
              <div className='flex gap-2 flex-wrap'>
                <button
                  onClick={handleClearFilter}
                  className={`cursor-pointer px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    ratingFilter === undefined
                      ? 'bg-primary-600 text-white'
                      : 'bg-white border border-neutral-300 text-neutral-700 hover:bg-neutral-50'
                  }`}
                >
                  All
                </button>
                {[5, 4, 3, 2, 1].map((rating) => (
                  <button
                    key={rating}
                    onClick={() => handleRatingFilterClick(rating)}
                    className={`cursor-pointer px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1 ${
                      ratingFilter === rating
                        ? 'bg-primary-600 text-white'
                        : 'bg-white border border-neutral-300 text-neutral-700 hover:bg-neutral-50'
                    }`}
                  >
                    {rating} ★
                  </button>
                ))}
              </div>
            </div>
            {/* Sort Order */}
            <div>
              <p className='text-sm font-medium text-neutral-700 mb-3'>
                Sort by:
              </p>
              <div className='flex gap-2 flex-wrap'>
                <button
                  onClick={() => {
                    setSortOrder('Descending');
                    setCurrentPage(1);
                  }}
                  className={`cursor-pointer px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    sortOrder === 'Descending'
                      ? 'bg-primary-600 text-white'
                      : 'bg-white border border-neutral-300 text-neutral-700 hover:bg-neutral-50'
                  }`}
                >
                  Newest
                </button>
                <button
                  onClick={() => {
                    setSortOrder('Ascending');
                    setCurrentPage(1);
                  }}
                  className={`cursor-pointer px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    sortOrder === 'Ascending'
                      ? 'bg-primary-600 text-white'
                      : 'bg-white border border-neutral-300 text-neutral-700 hover:bg-neutral-50'
                  }`}
                >
                  Oldest
                </button>
              </div>
            </div>
            {/* Has Media Filter */}
            <div>
              <p className='text-sm font-medium text-neutral-700 mb-3'>
                Filter by content:
              </p>
              <div className='flex gap-2 flex-wrap'>
                <button
                  onClick={() => {
                    setHasMedia(undefined);
                    setCurrentPage(1);
                  }}
                  className={`cursor-pointer px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    hasMedia === undefined
                      ? 'bg-primary-600 text-white'
                      : 'bg-white border border-neutral-300 text-neutral-700 hover:bg-neutral-50'
                  }`}
                >
                  All
                </button>
                <button
                  onClick={() => {
                    setHasMedia(true);
                    setCurrentPage(1);
                  }}
                  className={`cursor-pointer px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    hasMedia === true
                      ? 'bg-primary-600 text-white'
                      : 'bg-white border border-neutral-300 text-neutral-700 hover:bg-neutral-50'
                  }`}
                >
                  With Media
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Reviews List */}
      {isLoading ? (
        <div className='text-center py-12'>
          <p className='text-neutral-500'>Loading reviews...</p>
        </div>
      ) : reviews && reviews.items.length > 0 ? (
        <>
          <div className='space-y-0'>
            {reviews.items.map((review) => (
              <ProductReviewItem key={review.id} review={review} />
            ))}
          </div>

          {/* Pagination */}
          {reviews.totalPages > 1 && (
            <div className='flex items-center justify-center gap-2 mt-8'>
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className='cursor-pointer px-4 py-2 rounded-lg border border-neutral-300 text-neutral-700 hover:bg-neutral-50 disabled:opacity-50 disabled:cursor-not-allowed'
              >
                Previous
              </button>
              <span className='px-4 py-2 text-neutral-700'>
                Page {currentPage} of {reviews.totalPages}
              </span>
              <button
                onClick={() =>
                  setCurrentPage((p) => Math.min(reviews.totalPages, p + 1))
                }
                disabled={currentPage === reviews.totalPages}
                className='cursor-pointer px-4 py-2 rounded-lg border border-neutral-300 text-neutral-700 hover:bg-neutral-50 disabled:opacity-50 disabled:cursor-not-allowed'
              >
                Next
              </button>
            </div>
          )}
        </>
      ) : (
        <div className='text-center py-12'>
          <p className='text-neutral-500'>
            {ratingFilter
              ? `No reviews with ${ratingFilter} stars yet`
              : 'No reviews yet. Be the first to review this product!'}
          </p>
        </div>
      )}
    </div>
  );
};
