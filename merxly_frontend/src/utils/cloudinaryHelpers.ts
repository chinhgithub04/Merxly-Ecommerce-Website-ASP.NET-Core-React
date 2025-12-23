import { cld } from '../lib/cloudinary';
import { fill, scale, thumbnail } from '@cloudinary/url-gen/actions/resize';
import { autoGravity } from '@cloudinary/url-gen/qualifiers/gravity';
import { auto } from '@cloudinary/url-gen/qualifiers/quality';
import { MediaType } from '../types/enums';

/**
 * Image transformation presets
 * These provide consistent sizing and quality across the application
 */
export const IMAGE_PRESETS = {
  /**
   * Small thumbnail - 64x64px
   * Used in: Variant table thumbnails
   */
  thumbnail: {
    width: 64,
    height: 64,
  },
  /**
   * Card image - 300px width
   * Used in: Product cards, search results
   */
  card: {
    width: 300,
    height: 300,
  },
  /**
   * Detail image - 600px width
   * Used in: Product detail page main image
   */
  detail: {
    width: 600,
    height: 600,
  },
  /**
   * Zoom image - 1200px width
   * Used in: Product image zoom/lightbox
   */
  zoom: {
    width: 1200,
    height: 1200,
  },
} as const;

export type ImagePreset = keyof typeof IMAGE_PRESETS;

/**
 * Get a Cloudinary image URL with transformations
 * @param publicId - The Cloudinary public ID of the image
 * @param preset - The preset to use (thumbnail, card, detail, zoom)
 * @returns The transformed image URL
 */
export const getProductImageUrl = (
  publicId: string,
  preset: ImagePreset = 'card'
): string => {
  const { width, height } = IMAGE_PRESETS[preset];

  const image = cld.image(publicId);

  // Apply transformations
  image
    .resize(fill().width(width).height(height).gravity(autoGravity()))
    .quality(auto());

  return image.toURL();
};

/**
 * Get a Cloudinary image URL with custom dimensions
 * @param publicId - The Cloudinary public ID of the image
 * @param width - Custom width in pixels
 * @param height - Custom height in pixels (optional, maintains aspect ratio if not provided)
 * @returns The transformed image URL
 */
export const getProductImageUrlCustom = (
  publicId: string,
  width: number,
  height?: number
): string => {
  const image = cld.image(publicId);

  if (height) {
    image.resize(fill().width(width).height(height).gravity(autoGravity()));
  } else {
    image.resize(scale().width(width));
  }

  image.quality(auto());

  return image.toURL();
};

/**
 * Get a video thumbnail URL (poster frame)
 * Uses Cloudinary's automatic thumbnail generation from video
 * No transformations applied to avoid credit usage
 * @param publicId - The Cloudinary public ID of the video
 * @returns The video thumbnail URL
 */
export const getVideoThumbnailUrl = (publicId: string): string => {
  // Get thumbnail as JPG (Cloudinary automatically extracts a frame)
  // Using .setAssetType('video') to get the video thumbnail
  const thumbnailImage = cld
    .image(publicId)
    .setAssetType('video')
    .format('auto')
    .resize(thumbnail().width(300).height(300).gravity(autoGravity()));

  return thumbnailImage.toURL();
};

/**
 * Get a video playback URL
 * No transformations applied to avoid credit usage
 * @param publicId - The Cloudinary public ID of the video
 * @returns The video playback URL
 */
export const getVideoUrl = (publicId: string): string => {
  const video = cld.video(publicId);
  return video.toURL();
};

/**
 * Get media URL based on media type (image or video)
 * For images: returns transformed image URL
 * For videos: returns video thumbnail URL (for preview)
 * @param publicId - The Cloudinary public ID
 * @param mediaType - The media type (Image = 0, Video = 1)
 * @param preset - The preset to use for images
 * @returns The media URL
 */
export const getMediaUrl = (
  publicId: string,
  mediaType: MediaType,
  preset: ImagePreset = 'card'
): string => {
  if (mediaType === MediaType.Video) {
    return getVideoThumbnailUrl(publicId);
  }
  return getProductImageUrl(publicId, preset);
};

/**
 * Get media thumbnail URL for preview purposes
 * Always returns an image URL (even for videos)
 * @param publicId - The Cloudinary public ID
 * @param mediaType - The media type (Image = 0, Video = 1)
 * @returns The thumbnail URL
 */
export const getMediaThumbnailUrl = (
  publicId: string,
  mediaType: MediaType
): string => {
  if (mediaType === MediaType.Video) {
    return getVideoThumbnailUrl(publicId);
  }
  return getProductImageUrl(publicId, 'thumbnail');
};

/**
 * Get a Cloudinary category image URL with transformations
 * @param publicId - The Cloudinary public ID of the category image
 * @param width - Image width in pixels (default: 200)
 * @param height - Image height in pixels (default: 200)
 * @returns The transformed category image URL
 */
export const getCategoryImageUrl = (
  publicId: string,
  width: number = 200,
  height: number = 200
): string => {
  const image = cld.image(publicId);

  // Apply transformations
  image
    .resize(fill().width(width).height(height).gravity(autoGravity()))
    .quality(auto());

  return image.toURL();
};
