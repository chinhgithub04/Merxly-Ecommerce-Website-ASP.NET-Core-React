import { useState } from 'react';
import {
  BuildingStorefrontIcon,
  PhotoIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';

interface StoreRegistrationData {
  storeName: string;
  description: string;
  email: string;
  phoneNumber: string;
  website: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  stateProvince: string;
  postalCode: string;
  logoFile?: File;
  bannerFile?: File;
}

interface StoreRegistrationFormProps {
  onSubmit: (data: StoreRegistrationData) => void;
}

export const StoreRegistrationForm = ({
  onSubmit,
}: StoreRegistrationFormProps) => {
  const [formData, setFormData] = useState<StoreRegistrationData>({
    storeName: '',
    description: '',
    email: '',
    phoneNumber: '',
    website: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    stateProvince: '',
    postalCode: '',
  });

  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [bannerPreview, setBannerPreview] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState(1);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
      setFormData((prev) => ({ ...prev, logoFile: file }));
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
      setFormData((prev) => ({ ...prev, bannerFile: file }));
    }
  };

  const handleRemoveLogo = () => {
    setLogoPreview(null);
    setFormData((prev) => ({ ...prev, logoFile: undefined }));
  };

  const handleRemoveBanner = () => {
    setBannerPreview(null);
    setFormData((prev) => ({ ...prev, bannerFile: undefined }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const nextStep = () => {
    setCurrentStep((prev) => Math.min(prev + 1, 3));
  };

  const prevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  return (
    <form onSubmit={handleSubmit} className='space-y-8'>
      {/* Progress Steps */}
      <div className='flex items-center justify-center'>
        <div className='flex items-center gap-4'>
          {[1, 2, 3].map((step) => (
            <div key={step} className='flex items-center'>
              <div
                className={`flex items-center justify-center w-10 h-10 rounded-full border-2 font-semibold ${
                  step === currentStep
                    ? 'border-primary-600 bg-primary-600 text-white'
                    : step < currentStep
                    ? 'border-primary-600 bg-primary-600 text-white'
                    : 'border-neutral-300 bg-white text-neutral-500'
                }`}
              >
                {step}
              </div>
              {step < 3 && (
                <div
                  className={`w-16 h-0.5 ${
                    step < currentStep ? 'bg-primary-600' : 'bg-neutral-300'
                  }`}
                />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Step 1: Basic Information */}
      {currentStep === 1 && (
        <div className='space-y-6'>
          <div className='text-center mb-6'>
            <h2 className='text-2xl font-bold text-neutral-900'>
              Basic Information
            </h2>
            <p className='text-neutral-600 mt-1'>Tell us about your store</p>
          </div>

          <div>
            <label className='block text-sm font-medium text-neutral-700 mb-2'>
              Store Name <span className='text-error-600'>*</span>
            </label>
            <input
              type='text'
              name='storeName'
              value={formData.storeName}
              onChange={handleChange}
              placeholder='Enter your store name'
              required
              className='w-full px-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent'
            />
          </div>

          <div>
            <label className='block text-sm font-medium text-neutral-700 mb-2'>
              Description <span className='text-error-600'>*</span>
            </label>
            <textarea
              name='description'
              value={formData.description}
              onChange={handleChange}
              placeholder='Describe your store and what you sell'
              required
              rows={4}
              className='w-full px-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none'
            />
          </div>

          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            <div>
              <label className='block text-sm font-medium text-neutral-700 mb-2'>
                Email <span className='text-error-600'>*</span>
              </label>
              <input
                type='email'
                name='email'
                value={formData.email}
                onChange={handleChange}
                placeholder='store@example.com'
                required
                className='w-full px-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent'
              />
            </div>

            <div>
              <label className='block text-sm font-medium text-neutral-700 mb-2'>
                Phone Number <span className='text-error-600'>*</span>
              </label>
              <input
                type='tel'
                name='phoneNumber'
                value={formData.phoneNumber}
                onChange={handleChange}
                placeholder='+1 (555) 123-4567'
                required
                className='w-full px-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent'
              />
            </div>
          </div>

          <div>
            <label className='block text-sm font-medium text-neutral-700 mb-2'>
              Website
            </label>
            <input
              type='url'
              name='website'
              value={formData.website}
              onChange={handleChange}
              placeholder='https://www.yourstore.com'
              className='w-full px-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent'
            />
          </div>
        </div>
      )}

      {/* Step 2: Store Images */}
      {currentStep === 2 && (
        <div className='space-y-6'>
          <div className='text-center mb-6'>
            <h2 className='text-2xl font-bold text-neutral-900'>
              Store Images
            </h2>
            <p className='text-neutral-600 mt-1'>
              Upload your store logo and banner
            </p>
          </div>

          {/* Logo */}
          <div>
            <label className='block text-sm font-medium text-neutral-700 mb-3'>
              Store Logo
            </label>
            <div className='flex items-center gap-4'>
              {logoPreview ? (
                <div className='relative'>
                  <img
                    src={logoPreview}
                    alt='Store logo preview'
                    className='w-32 h-32 object-cover rounded-lg border border-neutral-200'
                  />
                  <button
                    type='button'
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
                  Recommended: Square image, at least 200x200px
                </p>
              </div>
            </div>
          </div>

          {/* Banner */}
          <div>
            <label className='block text-sm font-medium text-neutral-700 mb-3'>
              Store Banner
            </label>
            <div className='space-y-4'>
              {bannerPreview ? (
                <div className='relative'>
                  <img
                    src={bannerPreview}
                    alt='Store banner preview'
                    className='w-full h-48 object-cover rounded-lg border border-neutral-200'
                  />
                  <button
                    type='button'
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
                  Recommended: Wide image, at least 1200x400px
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Step 3: Store Address */}
      {currentStep === 3 && (
        <div className='space-y-6'>
          <div className='text-center mb-6'>
            <h2 className='text-2xl font-bold text-neutral-900'>
              Store Address
            </h2>
            <p className='text-neutral-600 mt-1'>
              Where is your store located?
            </p>
          </div>

          <div>
            <label className='block text-sm font-medium text-neutral-700 mb-2'>
              Address Line 1 <span className='text-error-600'>*</span>
            </label>
            <input
              type='text'
              name='addressLine1'
              value={formData.addressLine1}
              onChange={handleChange}
              placeholder='Street address'
              required
              className='w-full px-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent'
            />
          </div>

          <div>
            <label className='block text-sm font-medium text-neutral-700 mb-2'>
              Address Line 2
            </label>
            <input
              type='text'
              name='addressLine2'
              value={formData.addressLine2}
              onChange={handleChange}
              placeholder='Apartment, suite, unit, building, floor, etc.'
              className='w-full px-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent'
            />
          </div>

          <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
            <div>
              <label className='block text-sm font-medium text-neutral-700 mb-2'>
                City <span className='text-error-600'>*</span>
              </label>
              <input
                type='text'
                name='city'
                value={formData.city}
                onChange={handleChange}
                placeholder='City'
                required
                className='w-full px-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent'
              />
            </div>

            <div>
              <label className='block text-sm font-medium text-neutral-700 mb-2'>
                State/Province <span className='text-error-600'>*</span>
              </label>
              <input
                type='text'
                name='stateProvince'
                value={formData.stateProvince}
                onChange={handleChange}
                placeholder='State'
                required
                className='w-full px-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent'
              />
            </div>

            <div>
              <label className='block text-sm font-medium text-neutral-700 mb-2'>
                Postal Code <span className='text-error-600'>*</span>
              </label>
              <input
                type='text'
                name='postalCode'
                value={formData.postalCode}
                onChange={handleChange}
                placeholder='ZIP code'
                required
                className='w-full px-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent'
              />
            </div>
          </div>

          <div className='p-4 bg-blue-50 border border-blue-200 rounded-lg'>
            <p className='text-sm text-blue-800'>
              <span className='font-semibold'>Note:</span> This address will be
              used for shipping and will be displayed to customers.
            </p>
          </div>
        </div>
      )}

      {/* Navigation Buttons */}
      <div className='flex justify-between pt-6 border-t border-neutral-200'>
        {currentStep > 1 ? (
          <button
            type='button'
            onClick={prevStep}
            className='px-6 py-3 border border-neutral-300 rounded-lg text-neutral-700 hover:bg-neutral-50 transition-colors font-medium'
          >
            Previous
          </button>
        ) : (
          <div />
        )}

        {currentStep < 3 ? (
          <button
            type='button'
            onClick={nextStep}
            className='px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium'
          >
            Next
          </button>
        ) : (
          <button
            type='submit'
            className='px-6 py-3 bg-success-600 text-white rounded-lg hover:bg-success-700 transition-colors font-medium'
          >
            Submit Registration
          </button>
        )}
      </div>
    </form>
  );
};
