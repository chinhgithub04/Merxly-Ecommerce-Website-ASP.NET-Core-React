import { useState, useMemo } from 'react';
import { RectangleGroupIcon, PlusIcon } from '@heroicons/react/24/outline';
import { CategoryTree } from '../../components/admin/categories/CategoryTree';
import {
  AddEditCategoryModal,
  type CategoryFormData,
} from '../../components/admin/categories/AddEditCategoryModal';
import type { Category } from '../../components/admin/categories/CategoryNode';
import {
  useAdminCategoryTree,
  useCreateCategory,
  useUpdateCategory,
  useDeleteCategory,
} from '../../hooks/useCategories';
import type { AdminCategoryDto } from '../../types/models/category';
import { uploadImage } from '../../services/uploadService';
import { getCategoryImageUrl } from '../../utils/cloudinaryHelpers';

// Transform AdminCategoryDto to Category structure for the UI
const transformAdminCategoryDto = (dto: AdminCategoryDto): Category => {
  return {
    id: dto.id,
    name: dto.name,
    description: dto.description ?? undefined,
    imageUrl: dto.imagePublicId
      ? getCategoryImageUrl(dto.imagePublicId)
      : undefined,
    parentCategoryId: dto.parentCategoryId ?? undefined,
    isActive: dto.isActive,
    subCategories: dto.children.map((child) =>
      transformAdminCategoryDto(child),
    ),
  };
};

export const AdminCategoriesPage = () => {
  // Fetch data from API
  const { data: adminCategoryTreeResponse, isLoading } = useAdminCategoryTree(
    1,
    100,
  );

  // Mutations
  const createMutation = useCreateCategory();
  const updateMutation = useUpdateCategory();
  const deleteMutation = useDeleteCategory();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [parentCategoryForAdd, setParentCategoryForAdd] = useState<
    Category | undefined
  >();
  const [editingCategory, setEditingCategory] = useState<
    Category | undefined
  >();

  // Transform API data to UI structure
  const categories = useMemo(() => {
    if (!adminCategoryTreeResponse?.data?.items) {
      return [];
    }

    return adminCategoryTreeResponse.data.items.map((dto) =>
      transformAdminCategoryDto(dto),
    );
  }, [adminCategoryTreeResponse]);

  // Calculate stats
  const stats = useMemo(() => {
    const countAllCategories = (cats: Category[]): number => {
      return cats.reduce(
        (sum, cat) => sum + 1 + countAllCategories(cat.subCategories),
        0,
      );
    };

    const countActiveCategories = (cats: Category[]): number => {
      return cats.reduce(
        (sum, cat) =>
          sum +
          (cat.isActive ? 1 : 0) +
          countActiveCategories(cat.subCategories),
        0,
      );
    };

    return {
      total: countAllCategories(categories),
      active: countActiveCategories(categories),
      parents: categories.length,
    };
  }, [categories]);

  const handleAddTopLevel = () => {
    setParentCategoryForAdd(undefined);
    setEditingCategory(undefined);
    setIsModalOpen(true);
  };

  const handleAddSubcategory = (parentId: string) => {
    const findCategory = (
      cats: Category[],
      id: string,
    ): Category | undefined => {
      for (const cat of cats) {
        if (cat.id === id) return cat;
        const found = findCategory(cat.subCategories, id);
        if (found) return found;
      }
      return undefined;
    };

    const parent = findCategory(categories, parentId);
    setParentCategoryForAdd(parent);
    setEditingCategory(undefined);
    setIsModalOpen(true);
  };

  const handleEdit = (category: Category) => {
    setEditingCategory(category);
    setParentCategoryForAdd(undefined);
    setIsModalOpen(true);
  };

  const handleDelete = async (categoryId: string) => {
    if (
      confirm(
        'Are you sure you want to delete this category? This will also delete all subcategories.',
      )
    ) {
      try {
        await deleteMutation.mutateAsync(categoryId);
      } catch (error) {
        console.error('Failed to delete category:', error);
        alert('Failed to delete category. Please try again.');
      }
    }
  };

  const handleSubmit = async (data: CategoryFormData) => {
    setIsModalOpen(false);

    try {
      // Upload image if provided
      let imagePublicId: string | undefined = undefined;
      if (data.imageFile) {
        const uploadResult = await uploadImage(
          data.imageFile,
          'categories',
          0, // ImageType.Logo
        );
        imagePublicId = uploadResult.data?.publicId;
      }

      if (editingCategory) {
        // Update existing category
        await updateMutation.mutateAsync({
          id: editingCategory.id,
          data: {
            name: data.name,
            description: data.description,
            imagePublicId,
            isActive: data.isActive,
            parentCategoryId: data.parentCategoryId,
          },
        });
      } else {
        // Create new category
        await createMutation.mutateAsync({
          name: data.name,
          description: data.description,
          imagePublicId,
          parentCategoryId: data.parentCategoryId,
        });
      }
    } catch (error) {
      console.error('Failed to save category:', error);
      alert('Failed to save category. Please try again.');
    }
  };

  return (
    <div className='space-y-6'>
      {/* Page Header */}
      <div className='flex items-center justify-between'>
        <div className='flex items-center gap-3'>
          <div className='p-2 bg-primary-50 rounded-lg'>
            <RectangleGroupIcon className='h-6 w-6 text-primary-600' />
          </div>
          <div>
            <h1 className='text-3xl font-bold text-neutral-900'>Categories</h1>
            <p className='text-sm text-neutral-600'>
              Manage product categories and their hierarchy
            </p>
          </div>
        </div>
        <button
          onClick={handleAddTopLevel}
          className='cursor-pointer flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium'
        >
          <PlusIcon className='h-5 w-5' />
          Add Category
        </button>
      </div>

      {/* Loading State */}
      {isLoading ? (
        <div className='flex items-center justify-center py-12'>
          <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600'></div>
        </div>
      ) : (
        <>
          {/* Stats */}
          <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
            <div className='bg-white rounded-lg border border-neutral-200 p-6'>
              <p className='text-sm text-neutral-600 mb-1'>Total Categories</p>
              <p className='text-3xl font-bold text-neutral-900'>
                {stats.total}
              </p>
            </div>
            <div className='bg-white rounded-lg border border-neutral-200 p-6'>
              <p className='text-sm text-neutral-600 mb-1'>Active Categories</p>
              <p className='text-3xl font-bold text-neutral-900'>
                {stats.active}
              </p>
            </div>
            <div className='bg-white rounded-lg border border-neutral-200 p-6'>
              <p className='text-sm text-neutral-600 mb-1'>Parent Categories</p>
              <p className='text-3xl font-bold text-neutral-900'>
                {stats.parents}
              </p>
            </div>
          </div>

          {/* Category Tree */}
          <CategoryTree
            categories={categories}
            onAddSubcategory={handleAddSubcategory}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </>
      )}

      {/* Add/Edit Modal */}
      <AddEditCategoryModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmit}
        parentCategory={parentCategoryForAdd}
        editingCategory={editingCategory}
      />
    </div>
  );
};
