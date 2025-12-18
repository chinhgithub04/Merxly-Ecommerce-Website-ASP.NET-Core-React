import type { Response, PagedResponse } from '../types/api/common';
import type { CategoryForStore } from '../types/models/category';
import type {
  ProductForStore,
  ProductQueryParameters,
  CreateProductDto,
  StoreDetailProductDto,
  UpdateProductDto,
  ResponseUpdateProductDto,
} from '../types/models/product';
import apiClient from './apiClient';

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
