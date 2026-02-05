import { useState, useRef } from 'react';
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  PlayCircleIcon,
} from '@heroicons/react/24/outline';
import type { ProductVariantMediaDto } from '../../../types/models/productVariantMedia';
import { MediaType } from '../../../types/enums';
import {
  getProductImageUrl,
  getVideoUrl,
  getVideoThumbnailUrl,
} from '../../../utils/cloudinaryHelpers';

interface ProductMediaGalleryProps {
  media: ProductVariantMediaDto[];
}

export const ProductMediaGallery = ({ media }: ProductMediaGalleryProps) => {
  const [selectedMediaIndex, setSelectedMediaIndex] = useState(0);
  const thumbnailContainerRef = useRef<HTMLDivElement>(null);

  const selectedMedia = media[selectedMediaIndex];

  const scrollThumbnails = (direction: 'left' | 'right') => {
    if (thumbnailContainerRef.current) {
      const scrollAmount = 200;
      const newScrollLeft =
        thumbnailContainerRef.current.scrollLeft +
        (direction === 'left' ? -scrollAmount : scrollAmount);

      thumbnailContainerRef.current.scrollTo({
        left: newScrollLeft,
        behavior: 'smooth',
      });
    }
  };

  const renderMainMedia = () => {
    if (!selectedMedia) {
      return (
        <div className='w-full h-64 md:h-96 lg:h-[600px] bg-neutral-100 rounded-lg flex items-center justify-center'>
          <span className='text-neutral-400'>No media available</span>
        </div>
      );
    }

    if (selectedMedia.mediaType === MediaType.Video) {
      return (
        <video
          key={selectedMedia.id}
          controls
          className='w-full h-64 md:h-96 lg:h-[600px] object-contain bg-neutral-900 rounded-lg'
          src={getVideoUrl(selectedMedia.mediaPublicId)}
        >
          Your browser does not support the video tag.
        </video>
      );
    }

    return (
      <img
        src={getProductImageUrl(selectedMedia.mediaPublicId, 'zoom')}
        alt='Product'
        className='w-full h-64 md:h-96 lg:h-[600px] object-contain bg-neutral-50 rounded-lg'
      />
    );
  };

  const renderThumbnail = (
    mediaItem: ProductVariantMediaDto,
    index: number,
  ) => {
    const isActive = index === selectedMediaIndex;
    const isVideo = mediaItem.mediaType === MediaType.Video;

    const thumbnailUrl = isVideo
      ? getVideoThumbnailUrl(mediaItem.mediaPublicId)
      : getProductImageUrl(mediaItem.mediaPublicId, 'card');

    return (
      <button
        key={mediaItem.id}
        onClick={() => setSelectedMediaIndex(index)}
        className={`relative shrink-0 w-20 h-20 rounded-lg border-2 transition-colors ${
          isActive
            ? 'border-primary-600'
            : 'border-neutral-200 hover:border-neutral-400'
        }`}
      >
        <img
          src={thumbnailUrl}
          alt={`Thumbnail ${index + 1}`}
          className='w-full h-full object-contain rounded-md'
        />
        {isVideo && (
          <div className='absolute inset-0 flex items-center justify-center'>
            <PlayCircleIcon className='h-8 w-8 text-white drop-shadow-lg' />
          </div>
        )}
      </button>
    );
  };

  if (!media || media.length === 0) {
    return (
      <div className='w-full h-64 md:h-96 lg:h-[600px] bg-neutral-100 rounded-lg flex items-center justify-center'>
        <span className='text-neutral-400'>No media available</span>
      </div>
    );
  }

  return (
    <div className='space-y-4'>
      {/* Main Media Display */}
      <div>{renderMainMedia()}</div>

      {/* Thumbnail Navigation */}
      {media.length > 1 && (
        <div className='relative flex items-center gap-2'>
          {/* Left Arrow */}
          <button
            onClick={() => scrollThumbnails('left')}
            className='shrink-0 w-10 h-10 rounded-full bg-white border border-neutral-300 flex items-center justify-center hover:bg-neutral-50 transition-colors'
            aria-label='Scroll left'
          >
            <ChevronLeftIcon className='h-6 w-6 text-neutral-700' />
          </button>

          {/* Thumbnails Container */}
          <div
            ref={thumbnailContainerRef}
            className='flex gap-2 overflow-x-auto scrollbar-hide flex-1'
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {media.map((mediaItem, index) => renderThumbnail(mediaItem, index))}
          </div>

          {/* Right Arrow */}
          <button
            onClick={() => scrollThumbnails('right')}
            className='shrink-0 w-10 h-10 rounded-full bg-white border border-neutral-300 flex items-center justify-center hover:bg-neutral-50 transition-colors'
            aria-label='Scroll right'
          >
            <ChevronRightIcon className='h-6 w-6 text-neutral-700' />
          </button>
        </div>
      )}
    </div>
  );
};
