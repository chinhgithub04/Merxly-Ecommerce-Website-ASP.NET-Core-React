import { useState } from 'react';
import {
  PhotoIcon,
  VideoCameraIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';
import { uploadImage, uploadVideo } from '../../../services/uploadService';
import { MediaType } from '../../../types/enums/MediaType';
import { getMediaThumbnailUrl } from '../../../utils/cloudinaryHelpers';
import type { CreateReviewMediaDto } from '../../../types/models/review';

interface MediaUploadProps {
  medias: CreateReviewMediaDto[];
  onMediasChange: (medias: CreateReviewMediaDto[]) => void;
  maxFiles?: number;
}

export const MediaUpload = ({
  medias,
  onMediasChange,
  maxFiles = 10,
}: MediaUploadProps) => {
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const handleFileSelect = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    if (medias.length + files.length > maxFiles) {
      setUploadError(`Maximum ${maxFiles} files allowed`);
      return;
    }

    setUploading(true);
    setUploadError(null);

    const newMedias: CreateReviewMediaDto[] = [];

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const isVideo = file.type.startsWith('video/');

        let result;
        if (isVideo) {
          result = await uploadVideo(file, 'reviews');
        } else {
          result = await uploadImage(file, 'reviews', 0); // 0 = Image type
        }

        if (result.isSuccess && result.data) {
          newMedias.push({
            mediaPublicId: result.data.publicId,
            displayOrder: medias.length + newMedias.length,
            mediaType: isVideo ? MediaType.Video : MediaType.Image,
          });
        }
      }

      onMediasChange([...medias, ...newMedias]);
    } catch (error) {
      console.error('Upload error:', error);
      setUploadError('Failed to upload some files');
    } finally {
      setUploading(false);
      // Reset input
      event.target.value = '';
    }
  };

  const handleRemoveMedia = (index: number) => {
    const newMedias = medias.filter((_, i) => i !== index);
    // Update display order
    const reorderedMedias = newMedias.map((media, i) => ({
      ...media,
      displayOrder: i,
    }));
    onMediasChange(reorderedMedias);
  };

  return (
    <div className='space-y-3'>
      {/* Upload Button */}
      <div className='flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3'>
        <label className='cursor-pointer inline-flex items-center gap-2 px-3 md:px-4 py-2 border border-neutral-300 rounded-lg hover:bg-neutral-50 transition-colors text-xs md:text-sm font-medium text-neutral-700'>
          <PhotoIcon className='h-4 md:h-5 w-4 md:w-5 shrink-0' />
          <span>Add Photos/Videos</span>
          <input
            type='file'
            multiple
            accept='image/*,video/*'
            onChange={handleFileSelect}
            disabled={uploading || medias.length >= maxFiles}
            className='hidden'
          />
        </label>
        <span className='text-xs md:text-sm text-neutral-500'>
          {medias.length} / {maxFiles} files
        </span>
      </div>

      {uploading && (
        <div className='text-xs md:text-sm text-neutral-600'>Uploading...</div>
      )}

      {uploadError && (
        <div className='text-xs md:text-sm text-red-600'>{uploadError}</div>
      )}

      {/* Media Preview */}
      {medias.length > 0 && (
        <div className='grid grid-cols-3 sm:grid-cols-4 gap-2'>
          {medias.map((media, index) => (
            <div key={index} className='relative group'>
              <div className='aspect-square rounded-lg overflow-hidden bg-neutral-100 border border-neutral-200'>
                <img
                  src={getMediaThumbnailUrl(
                    media.mediaPublicId,
                    media.mediaType,
                  )}
                  alt={`Upload ${index + 1}`}
                  className='w-full h-full object-cover'
                />
                {media.mediaType === MediaType.Video && (
                  <div className='absolute inset-0 flex items-center justify-center'>
                    <VideoCameraIcon className='h-8 w-8 text-white drop-shadow-lg' />
                  </div>
                )}
              </div>
              <button
                type='button'
                onClick={() => handleRemoveMedia(index)}
                className='cursor-pointer absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 md:opacity-0 md:group-hover:opacity-100 transition-opacity shrink-0'
              >
                <XMarkIcon className='h-3 md:h-4 w-3 md:w-4' />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
