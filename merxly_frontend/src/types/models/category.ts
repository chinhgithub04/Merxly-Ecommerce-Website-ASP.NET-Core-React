export interface CategoryDto {
  id: string;
  name: string;
  parentCategoryId: string | null;
  children: CategoryDto[];
}

export interface ParentCategoryDto {
  id: string;
  name: string;
  imagePublicId: string | null;
  isActive: boolean;
}

export interface CategoryForStore {
  id: string;
  name: string;
  productCount: number;
}
