import { useState } from 'react';
import { BuildingStorefrontIcon } from '@heroicons/react/24/outline';
import { StoreInfoCard } from '../../components/store/myStore/StoreInfoCard';
import { EditStoreModal } from '../../components/store/myStore/EditStoreModal';
import { StoreImagesCard } from '../../components/store/myStore/StoreImagesCard';
import { StoreVerificationCard } from '../../components/store/myStore/StoreVerificationCard';

interface StoreData {
  storeName: string;
  description: string;
  email: string;
  phoneNumber: string;
  website: string;
  isActive: boolean;
  isVerified: boolean;
  commissionRate: number;
  logoImageUrl?: string;
  bannerImageUrl?: string;
}

// Mock store data
const mockStoreData: StoreData = {
  storeName: 'Premium Electronics Store',
  description:
    'Your trusted destination for the latest electronics, gadgets, and tech accessories. We offer high-quality products with competitive prices and excellent customer service.',
  email: 'contact@premiumelectronics.com',
  phoneNumber: '+1 (555) 789-0123',
  website: 'https://www.premiumelectronics.com',
  isActive: true,
  isVerified: true,
  commissionRate: 10,
  logoImageUrl: 'https://via.placeholder.com/200',
  bannerImageUrl: 'https://via.placeholder.com/1200x400',
};

export const StoreMyStorePage = () => {
  const [storeData, setStoreData] = useState(mockStoreData);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const handleEditStore = () => {
    setIsEditModalOpen(true);
  };

  const handleSaveStore = (data: any) => {
    setStoreData((prev) => ({
      ...prev,
      ...data,
    }));
  };

  const handleUpdateLogo = (file: File) => {
    console.log('Logo file selected:', file.name);
    // In real implementation, this would upload to server
  };

  const handleUpdateBanner = (file: File) => {
    console.log('Banner file selected:', file.name);
    // In real implementation, this would upload to server
  };

  const handleRemoveLogo = () => {
    setStoreData((prev) => ({
      ...prev,
      logoImageUrl: undefined,
    }));
  };

  const handleRemoveBanner = () => {
    setStoreData((prev) => ({
      ...prev,
      bannerImageUrl: undefined,
    }));
  };

  return (
    <div className='space-y-6'>
      {/* Page Header */}
      <div className='flex items-center gap-3'>
        <div className='p-2 bg-primary-50 rounded-lg'>
          <BuildingStorefrontIcon className='h-6 w-6 text-primary-600' />
        </div>
        <div>
          <h1 className='text-3xl font-bold text-neutral-900'>My Store</h1>
          <p className='text-sm text-neutral-600'>
            Manage your store information and settings
          </p>
        </div>
      </div>

      {/* Info Alert */}
      <div className='bg-blue-50 border border-blue-200 rounded-lg p-4'>
        <div className='flex items-start gap-3'>
          <div className='flex-shrink-0'>
            <svg
              className='h-5 w-5 text-blue-600'
              fill='none'
              viewBox='0 0 24 24'
              stroke='currentColor'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
              />
            </svg>
          </div>
          <div>
            <h3 className='text-sm font-semibold text-blue-900 mb-1'>
              Keep Your Store Information Up to Date
            </h3>
            <p className='text-sm text-blue-800'>
              Accurate store information helps customers find and trust your
              business. Make sure your contact details and description are
              current.
            </p>
          </div>
        </div>
      </div>

      {/* Store Information Card */}
      <StoreInfoCard
        storeName={storeData.storeName}
        description={storeData.description}
        email={storeData.email}
        phoneNumber={storeData.phoneNumber}
        website={storeData.website}
        isActive={storeData.isActive}
        isVerified={storeData.isVerified}
        commissionRate={storeData.commissionRate}
        onEdit={handleEditStore}
      />

      {/* Store Images Card */}
      <StoreImagesCard
        logoImageUrl={storeData.logoImageUrl}
        bannerImageUrl={storeData.bannerImageUrl}
        onUpdateLogo={handleUpdateLogo}
        onUpdateBanner={handleUpdateBanner}
        onRemoveLogo={handleRemoveLogo}
        onRemoveBanner={handleRemoveBanner}
      />

      {/* Store Verification Card */}
      <StoreVerificationCard
        isVerified={storeData.isVerified}
        isActive={storeData.isActive}
      />

      {/* Edit Store Modal */}
      <EditStoreModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSubmit={handleSaveStore}
        initialData={{
          storeName: storeData.storeName,
          description: storeData.description || '',
          email: storeData.email,
          phoneNumber: storeData.phoneNumber,
          website: storeData.website || '',
        }}
      />
    </div>
  );
};
