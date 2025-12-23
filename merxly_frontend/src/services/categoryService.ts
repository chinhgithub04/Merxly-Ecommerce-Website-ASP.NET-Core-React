import type { Response, PagedResponse } from '../types/api/common';
import type { CategoryDto, ParentCategoryDto } from '../types/models/category';
import apiClient from './apiClient';

export const getCategoryTree = async (
  pageNumber = 1,
  pageSize = 100
): Promise<Response<PagedResponse<CategoryDto>>> => {
  const response = await apiClient.get<Response<PagedResponse<CategoryDto>>>(
    '/Categories/tree',
    {
      params: { pageNumber, pageSize },
    }
  );
  return response.data;
};

export const getParentCategories = async (
  pageNumber = 1,
  pageSize = 100
): Promise<Response<PagedResponse<ParentCategoryDto>>> => {
  const response = await apiClient.get<
    Response<PagedResponse<ParentCategoryDto>>
  >('/Categories/parents', {
    params: { pageNumber, pageSize },
  });
  return response.data;
};
