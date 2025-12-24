import { PhotoIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { useState } from 'react';

interface StoreImagesCardProps {
  logoImageUrl?: string;
  bannerImageUrl?: string;
  onUpdateLogo: (file: File) => void;
  onUpdateBanner: (file: File) => void;
  onRemoveLogo: () => void;
  onRemoveBanner: () => void;
}

export const StoreImagesCard = ({
  logoImageUrl,
  bannerImageUrl,
  onUpdateLogo,
  onUpdateBanner,
  onRemoveLogo,
  onRemoveBanner,
}: StoreImagesCardProps) => {
  const [logoPreview, setLogoPreview] = useState<string | undefined>(
    logoImageUrl
  );
  const [bannerPreview, setBannerPreview] = useState<string | undefined>(
    bannerImageUrl
  );

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
      onUpdateLogo(file);
    }
  };

  const handleBannerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setBannerPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
      onUpdateBanner(file);
    }
  };

  const handleRemoveLogo = () => {
    setLogoPreview(undefined);
    onRemoveLogo();
  };

  const handleRemoveBanner = () => {
    setBannerPreview(undefined);
    onRemoveBanner();
  };

  return (
    <div className='bg-white rounded-lg border border-neutral-200'>
      <div className='p-6 border-b border-neutral-200'>
        <div className='flex items-center gap-3'>
          <div className='p-2 bg-primary-50 rounded-lg'>
            <PhotoIcon className='h-6 w-6 text-primary-600' />
          </div>
          <div>
            <h2 className='text-lg font-semibold text-neutral-900'>
              Store Images
            </h2>
            <p className='text-sm text-neutral-600'>
              Manage your store logo and banner image
            </p>
          </div>
        </div>
      </div>

      <div className='p-6 space-y-6'>
        {/* Store Logo */}
        <div>
          <label className='block text-sm font-medium text-neutral-700 mb-3'>
            Store Logo
          </label>
          <div className='flex items-center gap-4'>
            {logoPreview ? (
              <div className='relative'>
                <img
                  src={logoPreview}
                  alt='Store logo'
                  className='w-32 h-32 object-cover rounded-lg border border-neutral-200'
                />
                <button
                  onClick={handleRemoveLogo}
                  className='absolute -top-2 -right-2 p-1 bg-error-600 text-white rounded-full hover:bg-error-700 transition-colors'
                >
                  <XMarkIcon className='h-4 w-4' />
                </button>
              </div>
            ) : (
              <div className='w-32 h-32 flex items-center justify-center border-2 border-dashed border-neutral-300 rounded-lg bg-neutral-50'>
                <PhotoIcon className='h-12 w-12 text-neutral-400' />
              </div>
            )}

            <div className='flex-1'>
              <label
                htmlFor='logo-upload'
                className='inline-block px-4 py-2 border border-neutral-300 rounded-lg text-neutral-700 hover:bg-neutral-50 transition-colors cursor-pointer'
              >
                {logoPreview ? 'Change Logo' : 'Upload Logo'}
              </label>
              <input
                id='logo-upload'
                type='file'
                accept='image/*'
                onChange={handleLogoChange}
                className='hidden'
              />
              <p className='text-xs text-neutral-500 mt-2'>
                Recommended: Square image, at least 200x200px. Max size: 2MB
              </p>
            </div>
          </div>
        </div>

        {/* Store Banner */}
        <div>
          <label className='block text-sm font-medium text-neutral-700 mb-3'>
            Store Banner
          </label>
          <div className='space-y-4'>
            {bannerPreview ? (
              <div className='relative'>
                <img
                  src={bannerPreview}
                  alt='Store banner'
                  className='w-full h-48 object-cover rounded-lg border border-neutral-200'
                />
                <button
                  onClick={handleRemoveBanner}
                  className='absolute top-2 right-2 p-1 bg-error-600 text-white rounded-full hover:bg-error-700 transition-colors'
                >
                  <XMarkIcon className='h-4 w-4' />
                </button>
              </div>
            ) : (
              <div className='w-full h-48 flex items-center justify-center border-2 border-dashed border-neutral-300 rounded-lg bg-neutral-50'>
                <div className='text-center'>
                  <PhotoIcon className='h-12 w-12 text-neutral-400 mx-auto mb-2' />
                  <p className='text-sm text-neutral-600'>No banner image</p>
                </div>
              </div>
            )}

            <div>
              <label
                htmlFor='banner-upload'
                className='inline-block px-4 py-2 border border-neutral-300 rounded-lg text-neutral-700 hover:bg-neutral-50 transition-colors cursor-pointer'
              >
                {bannerPreview ? 'Change Banner' : 'Upload Banner'}
              </label>
              <input
                id='banner-upload'
                type='file'
                accept='image/*'
                onChange={handleBannerChange}
                className='hidden'
              />
              <p className='text-xs text-neutral-500 mt-2'>
                Recommended: Wide image, at least 1200x400px. Max size: 5MB
              </p>
            </div>
          </div>
        </div>

        {/* Info Note */}
        <div className='p-4 bg-blue-50 border border-blue-200 rounded-lg'>
          <p className='text-sm text-blue-800'>
            <span className='font-semibold'>Tip:</span> High-quality images help
            build trust with customers. Your logo will appear in search results
            and your banner on your store page.
          </p>
        </div>
      </div>
    </div>
  );
};
