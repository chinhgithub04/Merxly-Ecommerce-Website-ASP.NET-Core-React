import { useRef } from 'react';
import { useCreateProduct } from '../../hooks/useCreateProduct';
import { CreateProductHeader } from '../../components/products/CreateProductHeader';
import { ProductBasicInfo } from '../../components/products/ProductBasicInfo';
import {
  ProductVariantsSection,
  type ProductVariantsSectionRef,
} from '../../components/products/ProductVariantsSection';
import { ProductStatusSection } from '../../components/products/ProductStatusSection';
import { ProductFeaturedSection } from '../../components/products/ProductFeaturedSection';

export const CreateProductPage = () => {
  const variantsRef = useRef<ProductVariantsSectionRef>(null);
  const {
    productName,
    description,
    categoryId,
    isActive,
    isStoreFeatured,
    attributes,
    variants,
    groupBy,
    errors,
    setProductName,
    setDescription,
    setCategoryId,
    setIsActive,
    setIsStoreFeatured,
    setAttributes,
    setVariants,
    setGroupBy,
    setDeletedAttributeValueIds,
    setDeletedAttributeIds,
    setMarkedForDeletionIds,
    handleSubmit,
    handleBack,
    handleDiscard,
    isSubmitting,
    isLoading,
    isEditMode,
    isDirty,
  } = useCreateProduct(variantsRef);

  // Show loading state while fetching product data
  if (isLoading && isEditMode) {
    return (
      <div className='h-screen flex items-center justify-center bg-neutral-50'>
        <div className='text-center'>
          <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto'></div>
          <p className='mt-4 text-neutral-600'>Loading product...</p>
        </div>
      </div>
    );
  }

  return (
    <div className='h-screen flex flex-col bg-neutral-50'>
      {/* Custom Header */}
      <CreateProductHeader
        productName={productName}
        onBack={handleBack}
        onDiscard={handleDiscard}
        onSave={handleSubmit}
        isSaving={isSubmitting}
        isDirty={isDirty}
      />

      {/* Main Content */}
      <div className='flex-1 overflow-auto'>
        <div className='max-w-7xl mx-auto p-6'>
          <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
            {/* Left Column - Main Content (2/3) */}
            <div className='lg:col-span-2 space-y-6'>
              <ProductBasicInfo
                productName={productName}
                description={description}
                categoryId={categoryId}
                onProductNameChange={setProductName}
                onDescriptionChange={setDescription}
                onCategoryChange={setCategoryId}
              />

              {errors.productName && (
                <p className='text-sm text-red-600'>{errors.productName}</p>
              )}
              {errors.categoryId && (
                <p className='text-sm text-red-600'>{errors.categoryId}</p>
              )}

              <ProductVariantsSection
                ref={variantsRef}
                attributes={attributes}
                variants={variants}
                groupBy={groupBy}
                onAttributesChange={setAttributes}
                onVariantsChange={setVariants}
                onGroupByChange={setGroupBy}
                onDeleteAttributeValue={(valueId) => {
                  setDeletedAttributeValueIds((prev) => [...prev, valueId]);
                }}
                onDeleteAttribute={(attributeId) => {
                  setDeletedAttributeIds((prev) => [...prev, attributeId]);
                }}
                onMarkedForDeletionChange={setMarkedForDeletionIds}
                isEditMode={isEditMode}
              />

              {errors.variants && (
                <p className='text-sm text-red-600'>{errors.variants}</p>
              )}
            </div>

            {/* Right Column - Sidebar (1/3) */}
            <div className='space-y-6'>
              <ProductStatusSection
                isActive={isActive}
                onStatusChange={setIsActive}
              />

              <ProductFeaturedSection
                isStoreFeatured={isStoreFeatured}
                onFeaturedChange={setIsStoreFeatured}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
