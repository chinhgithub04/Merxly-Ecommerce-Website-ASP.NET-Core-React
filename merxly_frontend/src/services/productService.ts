import type { Response, PagedResponse } from '../types/api/common';
import type { CategoryForStore } from '../types/models/category';
import type {
  ProductDto,
  ProductForStore,
  ProductQueryParameters,
  CreateProductDto,
  StoreDetailProductDto,
  UpdateProductDto,
  ResponseUpdateProductDto,
} from '../types/models/product';
import type {
  AddAttributeWithVariantsDto,
  AddAttributesWithVariantsResponseDto,
  BulkUpdateProductAttributesDto,
  BulkUpdateProductAttributesResponseDto,
  DeleteAttributesWithVariantsDto,
  BulkDeleteAttributesResponseDto,
} from '../types/models/productAttribute';
import type {
  AddAttributeValuesAndVariants,
  AddAttributeValuesWithVariantsResponseDto,
  BulkUpdateProductAttributeValuesDto,
  BulkUpdateProductAttributeValuesResponseDto,
  DeleteAttributeValuesWithVariantsDto,
  BulkDeleteAttributeValuesResponseDto,
} from '../types/models/productAttributeValue';
import type {
  BulkUpdateProductVariantsDto,
  BulkUpdateProductVariantsResponseDto,
} from '../types/models/productVariant';
import apiClient from './apiClient';

// Customer
export const getTop10FeaturedProducts = async (
  categoryId?: string
): Promise<Response<ProductDto[]>> => {
  const response = await apiClient.get<Response<ProductDto[]>>(
    '/Products/top-10-featured',
    {
      params: categoryId ? { categoryId } : {},
    }
  );
  return response.data;
};

// Store Products
export const getStoreProducts = async (
  params: ProductQueryParameters
): Promise<Response<PagedResponse<ProductForStore>>> => {
  const response = await apiClient.get<
    Response<PagedResponse<ProductForStore>>
  >('/StoreProducts', { params });
  return response.data;
};

export const getUsedCategories = async (): Promise<
  Response<CategoryForStore[]>
> => {
  const response = await apiClient.get<Response<CategoryForStore[]>>(
    '/StoreProducts/used-categories'
  );
  return response.data;
};

export const createProduct = async (
  product: CreateProductDto
): Promise<Response<StoreDetailProductDto>> => {
  const response = await apiClient.post<Response<StoreDetailProductDto>>(
    '/StoreProducts',
    product
  );
  return response.data;
};

export const getProductById = async (
  productId: string
): Promise<Response<StoreDetailProductDto>> => {
  const response = await apiClient.get<Response<StoreDetailProductDto>>(
    `/StoreProducts/${productId}`
  );
  return response.data;
};

export const updateProduct = async (
  productId: string,
  product: UpdateProductDto
): Promise<Response<ResponseUpdateProductDto>> => {
  const response = await apiClient.patch<Response<ResponseUpdateProductDto>>(
    `/StoreProducts/${productId}/basic`,
    product
  );
  return response.data;
};

export const addAttributeValues = async (
  productId: string,
  data: AddAttributeValuesAndVariants
): Promise<Response<AddAttributeValuesWithVariantsResponseDto>> => {
  const response = await apiClient.post<
    Response<AddAttributeValuesWithVariantsResponseDto>
  >(`/StoreProducts/${productId}/attribute-values`, data);
  return response.data;
};

export const updateAttributeValues = async (
  productAttributeId: string,
  data: BulkUpdateProductAttributeValuesDto
): Promise<Response<BulkUpdateProductAttributeValuesResponseDto>> => {
  const response = await apiClient.patch<
    Response<BulkUpdateProductAttributeValuesResponseDto>
  >(`/StoreProducts/attribute-values/${productAttributeId}`, data);
  return response.data;
};

export const deleteAttributeValues = async (
  productId: string,
  data: DeleteAttributeValuesWithVariantsDto
): Promise<Response<BulkDeleteAttributeValuesResponseDto>> => {
  const response = await apiClient.delete<
    Response<BulkDeleteAttributeValuesResponseDto>
  >(`/StoreProducts/${productId}/attribute-values`, { data });
  return response.data;
};

export const addAttributes = async (
  productId: string,
  data: AddAttributeWithVariantsDto
): Promise<Response<AddAttributesWithVariantsResponseDto>> => {
  const response = await apiClient.post<
    Response<AddAttributesWithVariantsResponseDto>
  >(`/StoreProducts/${productId}/attributes`, data);
  return response.data;
};

export const updateAttributes = async (
  productId: string,
  data: BulkUpdateProductAttributesDto
): Promise<Response<BulkUpdateProductAttributesResponseDto>> => {
  const response = await apiClient.patch<
    Response<BulkUpdateProductAttributesResponseDto>
  >(`/StoreProducts/${productId}/attributes`, data);
  return response.data;
};

export const deleteAttributes = async (
  productId: string,
  data: DeleteAttributesWithVariantsDto
): Promise<Response<BulkDeleteAttributesResponseDto>> => {
  const response = await apiClient.delete<
    Response<BulkDeleteAttributesResponseDto>
  >(`/StoreProducts/${productId}/attributes`, { data });
  return response.data;
};

export const updateVariants = async (
  productId: string,
  data: BulkUpdateProductVariantsDto
): Promise<Response<BulkUpdateProductVariantsResponseDto>> => {
  const response = await apiClient.patch<
    Response<BulkUpdateProductVariantsResponseDto>
  >(`/StoreProducts/${productId}/variants`, data);
  return response.data;
};
