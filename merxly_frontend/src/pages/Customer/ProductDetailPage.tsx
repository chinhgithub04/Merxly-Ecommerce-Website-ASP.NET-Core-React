import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getProductByIdCustomer } from '../../services/productService';
import {
  ProductMediaGallery,
  ProductRating,
  ProductVariantSelector,
  ProductActions,
  ProductReviewSection,
} from '../../components/customer/productDetail';
import { AddToCartModal } from '../../components/cart';
import { useCart } from '../../hooks/useCart';
import type { ProductVariantForCustomerDto } from '../../types/models/productVariant';

export const ProductDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToCart, isAddingToCart } = useCart();

  // Fetch product details
  const { data: productData, isLoading } = useQuery({
    queryKey: ['product-detail', id],
    queryFn: () => getProductByIdCustomer(id!),
    enabled: !!id,
  });

  const product = productData?.data;

  // Track selected variant
  const [selectedVariant, setSelectedVariant] = useState<
    ProductVariantForCustomerDto | undefined
  >(() => product?.variants.find((v) => v.isActive));

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [addedQuantity, setAddedQuantity] = useState(0);

  const handleAddToCart = async (quantity: number) => {
    if (!selectedVariant) return;

    try {
      await addToCart({
        productVariantId: selectedVariant.id,
        quantity,
      });
      setAddedQuantity(quantity);
      setIsModalOpen(true);
    } catch (error) {
      console.error('Failed to add to cart:', error);
    }
  };

  if (isLoading) {
    return (
      <div className='px-20 py-12'>
        <div className='flex items-center justify-center py-20'>
          <p className='text-neutral-500'>Loading product details...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className='px-20 py-12'>
        <div className='flex flex-col items-center justify-center py-20'>
          <p className='text-neutral-500 mb-4'>Product not found</p>
          <button
            onClick={() => navigate('/products')}
            className='px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors cursor-pointer'
          >
            Back to Products
          </button>
        </div>
      </div>
    );
  }

  const handleCategoryClick = () => {
    navigate(`/products?categoryId=${product.categoryId}`);
  };

  const variantMedia =
    selectedVariant?.productVariantMedia.sort(
      (a, b) => a.displayOrder - b.displayOrder
    ) || [];

  return (
    <div className='px-20 py-12'>
      <div className='grid grid-cols-2 gap-12'>
        {/* Left Column - Media Gallery */}
        <div>
          <ProductMediaGallery media={variantMedia} />
        </div>

        {/* Right Column - Product Info */}
        <div className='space-y-6'>
          {/* Rating Section */}
          <ProductRating
            averageRating={product.averageRating}
            reviewCount={product.reviewCount}
          />

          {/* Product Name */}
          <h1 className='text-3xl font-bold text-neutral-900'>
            {product.name}
          </h1>

          {/* Category */}
          <div className='text-sm text-neutral-600'>
            <span>Category: </span>
            <button
              onClick={handleCategoryClick}
              className='text-primary-600 hover:text-primary-700 font-medium underline cursor-pointer'
            >
              {product.categoryName}
            </button>
          </div>

          {/* Price */}
          {selectedVariant && (
            <div className='text-3xl font-bold text-primary-600'>
              ₫{selectedVariant.price.toLocaleString('vi-VN')}
            </div>
          )}

          {/* Divider */}
          <div className='border-t border-neutral-200' />

          {/* Variant Selector */}
          {product.productAttributes.length > 0 && (
            <ProductVariantSelector
              productAttributes={product.productAttributes}
              variants={product.variants}
              onVariantChange={setSelectedVariant}
            />
          )}

          {/* Divider */}
          <div className='border-t border-neutral-200' />

          {/* Action Buttons */}
          {selectedVariant && (
            <ProductActions
              stockQuantity={selectedVariant.stockQuantity}
              onAddToCart={handleAddToCart}
              isAddingToCart={isAddingToCart}
            />
          )}

          {/* Product Description */}
          {product.description && (
            <div className='pt-6 border-t border-neutral-200'>
              <h3 className='text-lg font-semibold text-neutral-900 mb-3'>
                Description
              </h3>
              <div
                className='text-neutral-700 prose prose-sm max-w-none'
                dangerouslySetInnerHTML={{ __html: product.description }}
              />
            </div>
          )}

          {/* Store Info */}
          <div className='pt-6 border-t border-neutral-200'>
            <h3 className='text-lg font-semibold text-neutral-900 mb-3'>
              Store Information
            </h3>
            <div className='flex items-center gap-3'>
              <div className='w-12 h-12 bg-neutral-200 rounded-full flex items-center justify-center text-neutral-600 font-bold'>
                {product.storeName.charAt(0).toUpperCase()}
              </div>
              <div>
                <p className='font-medium text-neutral-900'>
                  {product.storeName}
                  {product.storeIsVerified && (
                    <span className='ml-2 text-xs text-green-600 bg-green-50 px-2 py-0.5 rounded'>
                      Verified
                    </span>
                  )}
                </p>
                <p className='text-sm text-neutral-500'>
                  {product.totalSold.toLocaleString()} products sold
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Customer Reviews Section */}
      {product.reviewCount > 0 && (
        <ProductReviewSection
          productId={product.id}
          averageRating={product.averageRating}
          reviewCount={product.reviewCount}
        />
      )}

      {/* Add to Cart Modal */}
      {selectedVariant && product && (
        <AddToCartModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          variantData={{
            imagePublicId:
              selectedVariant.productVariantMedia.find((m) => m.isMain)
                ?.mediaPublicId || null,
            name: product.name,
            price: selectedVariant.price,
            quantity: addedQuantity,
            selectedAttributes: product.productAttributes.reduce(
              (acc, attr) => {
                const attrValue = selectedVariant.productAttributeValues.find(
                  (pav) =>
                    attr.productAttributeValues.some(
                      (av) => av.id === pav.productAttributeValueId
                    )
                );
                if (attrValue) {
                  acc[attr.name] = attrValue.value;
                }
                return acc;
              },
              {} as Record<string, string>
            ),
          }}
        />
      )}
    </div>
  );
};
