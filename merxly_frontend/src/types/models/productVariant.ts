import type { ProductAttributeValueDto } from './productAttributeValue';
import type {
  ProductVariantMediaDto,
  CreateProductVariantMediaDto,
} from './productVariantMedia';

export interface ProductVariantAttributeSelectionDto {
  attributeName: string;
  value: string;
}

export interface CreateProductVariantDto {
  sku: string | null;
  price: number;
  stockQuantity: number;
  attributeSelections: ProductVariantAttributeSelectionDto[];
  media: CreateProductVariantMediaDto[];
}

export interface ProductVariantDto {
  id: string;
  sku: string | null;
  price: number;
  stockQuantity: number;
  isActive: boolean;
  productAttributeValues: ProductAttributeValueDto[];
  productVariantMedia: ProductVariantMediaDto[];
}

export interface ResponseUpdateVariantItemDto {
  id: string;
  name: string;
  sku: string | null;
  price: number;
  weight: number | null;
  length: number | null;
  width: number | null;
  height: number | null;
  stockQuantity: number;
  isActive: boolean;
}

export interface BulkUpdateVariantItemDto {
  id: string;
  sku?: string | null;
  price?: number;
  stockQuantity?: number;
}

export interface BulkUpdateProductVariantsDto {
  updatedVariants: BulkUpdateVariantItemDto[];
  deletedVariantIds?: string[];
}

export interface BulkUpdateProductVariantsResponseDto {
  productId: string;
  newMinPrice: number;
  newMaxPrice: number;
  newTotalStock: number;
  updatedVariants: ResponseUpdateVariantItemDto[];
}
