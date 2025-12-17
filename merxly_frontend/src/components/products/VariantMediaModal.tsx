import { useState, useRef, useEffect } from 'react';
import {
  PhotoIcon,
  VideoCameraIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';
import { Modal } from '../ui/Modal';

interface MediaFile {
  id: string;
  file: File;
  preview: string;
  isMain: boolean;
  timestamp: Date;
}

interface VariantMediaModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (files: MediaFile[]) => void;
  initialFiles?: MediaFile[];
}

const MAX_FILES = 9;

export const VariantMediaModal = ({
  isOpen,
  onClose,
  onSave,
  initialFiles = [],
}: VariantMediaModalProps) => {
  const [mediaFiles, setMediaFiles] = useState<MediaFile[]>(initialFiles);
  const [error, setError] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sync mediaFiles with initialFiles when modal opens
  useEffect(() => {
    if (isOpen) {
      setMediaFiles(initialFiles);
      setError('');
    }
  }, [isOpen, initialFiles]);

  const handleFileSelect = (files: FileList | null) => {
    if (!files) return;

    const newFilesCount = files.length;
    const currentCount = mediaFiles.length;

    if (currentCount + newFilesCount > MAX_FILES) {
      setError(`You can only upload up to ${MAX_FILES} files`);
      return;
    }

    setError('');

    const newMediaFiles: MediaFile[] = [];

    Array.from(files).forEach((file) => {
      const isImage = file.type.startsWith('image/');
      const isVideo = file.type.startsWith('video/');

      if (!isImage && !isVideo) return;

      const preview = URL.createObjectURL(file);
      const mediaFile: MediaFile = {
        id: `${Date.now()}-${Math.random()}`,
        file,
        preview,
        isMain: mediaFiles.length === 0 && newMediaFiles.length === 0,
        timestamp: new Date(),
      };

      newMediaFiles.push(mediaFile);
    });

    setMediaFiles([...mediaFiles, ...newMediaFiles]);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    handleFileSelect(e.dataTransfer.files);
  };

  const handleRemoveFile = (id: string) => {
    const updatedFiles = mediaFiles.filter((f) => f.id !== id);

    // If removed file was main, set first file as main
    if (updatedFiles.length > 0) {
      const hadMain = updatedFiles.some((f) => f.isMain);
      if (!hadMain) {
        updatedFiles[0].isMain = true;
      }
    }

    setMediaFiles(updatedFiles);
  };

  const handleSetMain = (id: string) => {
    setMediaFiles(
      mediaFiles.map((f) => ({
        ...f,
        isMain: f.id === id,
      }))
    );
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const formatTimestamp = (date: Date): string => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const handleDone = () => {
    onSave(mediaFiles);
    onClose();
  };

  const handleCancel = () => {
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleCancel}
      onDone={handleDone}
      title='Upload media'
    >
      <div className='space-y-6'>
        {/* Upload Area */}
        <div>
          <div
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className='border-2 border-dashed border-neutral-300 rounded-lg p-12 text-center hover:border-neutral-400 hover:bg-neutral-50 transition-colors cursor-pointer'
          >
            <div className='flex flex-col items-center gap-3'>
              <div className='flex items-center gap-2'>
                <PhotoIcon className='w-10 h-10 text-neutral-400' />
                <VideoCameraIcon className='w-10 h-10 text-neutral-400' />
              </div>
              <div>
                <p className='text-sm font-medium text-neutral-700'>
                  Drag and drop images or videos here
                </p>
                <p className='text-xs text-neutral-500 mt-1'>
                  or click to upload
                </p>
              </div>
              <p className='text-xs text-neutral-400 mt-2'>
                Maximum {MAX_FILES} files
              </p>
            </div>
          </div>

          <input
            ref={fileInputRef}
            type='file'
            multiple
            accept='image/*,video/*'
            onChange={(e) => handleFileSelect(e.target.files)}
            className='hidden'
          />

          {error && (
            <p className='mt-2 text-sm text-red-600 text-center'>{error}</p>
          )}
        </div>

        {/* Media List */}
        {mediaFiles.length > 0 && (
          <div className='border border-neutral-200 rounded-lg overflow-hidden'>
            <div className='divide-y divide-neutral-100'>
              {mediaFiles.map((media) => {
                const isVideo = media.file.type.startsWith('video/');
                const extension = media.file.name.split('.').pop() || '';

                return (
                  <div
                    key={media.id}
                    className='flex items-center gap-4 p-3 hover:bg-neutral-50 transition-colors'
                  >
                    {/* Checkbox */}
                    <input type='checkbox' className='rounded shrink-0' />

                    {/* Thumbnail */}
                    <div className='w-16 h-16 rounded-md overflow-hidden bg-neutral-100 shrink-0 flex items-center justify-center'>
                      {isVideo ? (
                        <VideoCameraIcon className='w-8 h-8 text-neutral-400' />
                      ) : (
                        <img
                          src={media.preview}
                          alt={media.file.name}
                          className='w-full h-full object-cover'
                        />
                      )}
                    </div>

                    {/* File Info */}
                    <div className='flex-1 min-w-0'>
                      <p className='text-sm font-medium text-neutral-900 truncate'>
                        {media.file.name}
                      </p>
                      <div className='flex items-center gap-3 mt-1'>
                        <span className='text-xs text-neutral-500 uppercase'>
                          {extension}
                        </span>
                        <span className='text-xs text-neutral-500'>
                          {formatFileSize(media.file.size)}
                        </span>
                        <span className='text-xs text-neutral-500'>
                          {formatTimestamp(media.timestamp)}
                        </span>
                      </div>
                    </div>

                    {/* Main Toggle */}
                    <div className='flex items-center gap-2 shrink-0'>
                      <label className='flex items-center gap-2 cursor-pointer'>
                        <span className='text-xs text-neutral-600'>Main</span>
                        <div className='relative'>
                          <input
                            type='checkbox'
                            checked={media.isMain}
                            onChange={() => handleSetMain(media.id)}
                            className='sr-only peer'
                          />
                          <div className='w-9 h-5 bg-neutral-200 rounded-full peer peer-checked:bg-primary-600 transition-colors'></div>
                          <div className='absolute left-0.5 top-0.5 w-4 h-4 bg-white rounded-full transition-transform peer-checked:translate-x-4'></div>
                        </div>
                      </label>
                    </div>

                    {/* Remove Button */}
                    <button
                      type='button'
                      onClick={() => handleRemoveFile(media.id)}
                      className='p-1.5 text-neutral-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors shrink-0'
                    >
                      <XMarkIcon className='w-5 h-5' />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
};
