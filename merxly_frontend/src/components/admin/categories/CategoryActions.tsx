import { PlusIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import type { Category } from './CategoryNode';

interface CategoryActionsProps {
  category: Category;
  isParent: boolean;
  onAddSubcategory: (parentId: string) => void;
  onEdit: (category: Category) => void;
  onDelete: (categoryId: string) => void;
}

export const CategoryActions = ({
  category,
  // isParent,
  onAddSubcategory,
  onEdit,
  onDelete,
}: CategoryActionsProps) => {
  return (
    <div className='flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity'>
      {/* Add Subcategory */}
      <button
        onClick={() => onAddSubcategory(category.id)}
        className='cursor-pointer p-1.5 text-primary-600 hover:bg-primary-50 rounded transition-colors'
        title='Add subcategory'
      >
        <PlusIcon className='h-4 w-4' />
      </button>

      {/* Edit */}
      <button
        onClick={() => onEdit(category)}
        className='cursor-pointer p-1.5 text-neutral-600 hover:bg-neutral-100 rounded transition-colors'
        title='Edit category'
      >
        <PencilIcon className='h-4 w-4' />
      </button>

      {/* Delete */}
      <button
        onClick={() => onDelete(category.id)}
        className='cursor-pointer p-1.5 text-error-600 hover:bg-error-50 rounded transition-colors'
        title='Delete category'
      >
        <TrashIcon className='h-4 w-4' />
      </button>
    </div>
  );
};
