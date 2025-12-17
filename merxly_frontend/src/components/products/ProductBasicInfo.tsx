import { Input } from '../ui/Input';
import { ProductCategorySelector } from './ProductCategorySelector';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';

interface ProductBasicInfoProps {
  productName: string;
  description: string;
  categoryId: string | null;
  onProductNameChange: (value: string) => void;
  onDescriptionChange: (value: string) => void;
  onCategoryChange: (categoryId: string) => void;
}

const quillModules = {
  toolbar: [
    [{ header: [1, 2, 3, false] }],
    ['bold', 'italic', 'underline', 'strike'],
    [{ list: 'ordered' }, { list: 'bullet' }],
    ['link'],
    ['clean'],
  ],
};

const quillFormats = [
  'header',
  'bold',
  'italic',
  'underline',
  'strike',
  'list',
  'link',
];

export const ProductBasicInfo = ({
  productName,
  description,
  categoryId,
  onProductNameChange,
  onDescriptionChange,
  onCategoryChange,
}: ProductBasicInfoProps) => {
  const quillKey = description ? 'with-content' : 'empty';

  return (
    <div className='bg-white rounded-lg border border-neutral-200 p-6'>
      <h2 className='text-base font-semibold text-neutral-900 mb-4'>
        Basic Information
      </h2>

      <div className='space-y-4'>
        <Input
          label='Product Name'
          value={productName}
          onChange={(e) => onProductNameChange(e.target.value)}
          placeholder='e.g. Classic T-Shirt'
        />

        <div>
          <label className='block text-sm font-medium text-neutral-700 mb-1'>
            Description
          </label>
          <ReactQuill
            key={quillKey}
            theme='snow'
            value={description}
            onChange={onDescriptionChange}
            modules={quillModules}
            formats={quillFormats}
            className='bg-white'
          />
        </div>

        <ProductCategorySelector
          selectedCategoryId={categoryId}
          onSelectCategory={onCategoryChange}
        />
      </div>
    </div>
  );
};
