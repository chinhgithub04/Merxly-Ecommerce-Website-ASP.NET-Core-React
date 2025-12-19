import { useState } from 'react';
import {
  ChevronDownIcon,
  ChevronUpIcon,
  TrashIcon,
  Bars3Icon,
  PhotoIcon,
} from '@heroicons/react/24/outline';
import { VariantMediaModal } from './VariantMediaModal';
import type { CreateProductVariantMediaDto } from '../../types/models/productVariantMedia';
import { getMediaThumbnailUrl } from '../../utils/cloudinaryHelpers';

// Internal types
interface AttributeValue {
  id: string;
  value: string;
}

interface Attribute {
  id: string;
  name: string;
  values: AttributeValue[];
}

interface Variant {
  id: string;
  attributeValues: Record<string, string>; // attributeId -> valueId
  price: number;
  available: number;
  sku: string;
  media?: CreateProductVariantMediaDto[];
}

interface ProductVariantsSectionProps {
  attributes: Attribute[];
  variants: Variant[];
  groupBy: string | null;
  onAttributesChange: (attributes: Attribute[]) => void;
  onVariantsChange: (variants: Variant[]) => void;
  onGroupByChange: (groupBy: string | null) => void;
  onDeleteAttributeValue?: (valueId: string) => void;
  isEditMode?: boolean;
}

export const ProductVariantsSection = ({
  attributes,
  variants,
  groupBy,
  onAttributesChange,
  onVariantsChange,
  onGroupByChange,
  onDeleteAttributeValue,
  isEditMode = false,
}: ProductVariantsSectionProps) => {
  const [editingAttributeId, setEditingAttributeId] = useState<string | null>(
    null
  );
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set());
  const [validationErrors, setValidationErrors] = useState<{
    name?: string;
    values?: string;
    duplicateName?: boolean;
    duplicateValues?: Set<string>;
  }>({});
  const [draggedAttrIndex, setDraggedAttrIndex] = useState<number | null>(null);
  const [draggedValueIndex, setDraggedValueIndex] = useState<number | null>(
    null
  );
  const [mediaModalOpen, setMediaModalOpen] = useState(false);
  const [selectedVariantId, setSelectedVariantId] = useState<string | null>(
    null
  );

  // Generate variants based on attributes (Cartesian product)
  const generateVariants = (attrs: Attribute[]): Variant[] => {
    const validAttrs = attrs.filter(
      (attr) => attr.name && attr.values.some((v) => v.value)
    );

    if (validAttrs.length === 0) return [];

    // Get valid values for each attribute
    const validValuesByAttr = validAttrs.map((attr) => ({
      attrId: attr.id,
      values: attr.values.filter((v) => v.value),
    }));

    // Cartesian product
    const cartesian = (
      arr: Array<{ attrId: string; values: AttributeValue[] }>
    ): Array<Record<string, string>> => {
      if (arr.length === 0) return [{}];
      const [first, ...rest] = arr;
      const restProduct = cartesian(rest);
      return first.values.flatMap((val) =>
        restProduct.map((prod) => ({
          [first.attrId]: val.id,
          ...prod,
        }))
      );
    };

    const combinations = cartesian(validValuesByAttr);

    return combinations.map((combo) => {
      // Check if variant already exists
      const existing = variants.find((v) => {
        return Object.keys(combo).every(
          (attrId) => v.attributeValues[attrId] === combo[attrId]
        );
      });

      if (existing) {
        return existing;
      }

      return {
        id: `variant-${Date.now()}-${Math.random()}`,
        attributeValues: combo,
        price: 0,
        available: 0,
        sku: '',
      };
    });
  };

  // Add new attribute
  const handleAddAttribute = () => {
    if (attributes.length >= 3) return;

    const newAttr: Attribute = {
      id: `attr-${Date.now()}`,
      name: '',
      values: [{ id: `val-${Date.now()}`, value: '' }],
    };

    onAttributesChange([...attributes, newAttr]);
    setEditingAttributeId(newAttr.id);
  };

  // Update attribute name
  const handleUpdateAttributeName = (id: string, name: string) => {
    const updated = attributes.map((attr) =>
      attr.id === id ? { ...attr, name } : attr
    );
    onAttributesChange(updated);

    // Regenerate variants
    const newVariants = generateVariants(updated);
    onVariantsChange(newVariants);

    // Set default group by if needed
    if (
      updated.filter((a) => a.name && a.values.some((v) => v.value)).length >=
        2 &&
      !groupBy
    ) {
      onGroupByChange(updated.find((a) => a.name)?.id || null);
    }
  };

  // Update attribute value
  const handleUpdateAttributeValue = (
    attributeId: string,
    valueId: string,
    value: string
  ) => {
    const updated = attributes.map((attr) => {
      if (attr.id === attributeId) {
        const updatedValues = attr.values.map((v) =>
          v.id === valueId ? { ...v, value } : v
        );

        // Auto-add new empty value if this is the last one and has value
        const lastValue = updatedValues[updatedValues.length - 1];
        if (lastValue.id === valueId && value) {
          updatedValues.push({ id: `val-${Date.now()}`, value: '' });
        }

        return { ...attr, values: updatedValues };
      }
      return attr;
    });

    onAttributesChange(updated);

    // Regenerate variants
    const newVariants = generateVariants(updated);
    onVariantsChange(newVariants);

    // Set default group by if needed
    if (
      updated.filter((a) => a.name && a.values.some((v) => v.value)).length >=
        2 &&
      !groupBy
    ) {
      onGroupByChange(updated.find((a) => a.name)?.id || null);
    }
  };

  // Delete attribute value
  const handleDeleteAttributeValue = (attributeId: string, valueId: string) => {
    // In edit mode, check if this is an existing value (not a new one with 'val-new-' prefix)
    // If it's existing, track it for deletion on save
    if (
      isEditMode &&
      !valueId.startsWith('val-new-') &&
      onDeleteAttributeValue
    ) {
      onDeleteAttributeValue(valueId);
    }

    const updated = attributes.map((attr) => {
      if (attr.id === attributeId) {
        const filtered = attr.values.filter((v) => v.id !== valueId);
        // Keep at least one empty value
        if (filtered.length === 0) {
          filtered.push({ id: `val-${Date.now()}`, value: '' });
        }
        return { ...attr, values: filtered };
      }
      return attr;
    });

    onAttributesChange(updated);

    // Regenerate variants
    const newVariants = generateVariants(updated);
    onVariantsChange(newVariants);
  };

  // Delete attribute
  const handleDeleteAttribute = (id: string) => {
    const updated = attributes.filter((attr) => attr.id !== id);
    onAttributesChange(updated);

    // Regenerate variants
    const newVariants = generateVariants(updated);
    onVariantsChange(newVariants);

    // Reset group by if needed
    if (groupBy === id) {
      onGroupByChange(updated.find((a) => a.name)?.id || null);
    }

    setEditingAttributeId(null);
  };

  // Drag handlers for attributes
  const handleAttrDragStart = (index: number) => {
    setDraggedAttrIndex(index);
  };

  const handleAttrDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleAttrDrop = (e: React.DragEvent, targetIndex: number) => {
    e.preventDefault();
    if (draggedAttrIndex === null || draggedAttrIndex === targetIndex) return;

    const reordered = [...attributes];
    const [draggedAttr] = reordered.splice(draggedAttrIndex, 1);
    reordered.splice(targetIndex, 0, draggedAttr);

    onAttributesChange(reordered);
    setDraggedAttrIndex(null);

    // Update groupBy if needed
    if (groupBy) {
      const validAttrs = reordered.filter(
        (a) => a.name && a.values.some((v) => v.value)
      );
      if (validAttrs.length >= 2) {
        onGroupByChange(validAttrs[0].id);
      }
    }

    // Regenerate variants with new order
    const newVariants = generateVariants(reordered);
    onVariantsChange(newVariants);
  };

  // Drag handlers for option values
  const handleValueDragStart = (index: number) => {
    setDraggedValueIndex(index);
  };

  const handleValueDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleValueDrop = (
    e: React.DragEvent,
    attributeId: string,
    targetIndex: number
  ) => {
    e.preventDefault();
    if (draggedValueIndex === null || draggedValueIndex === targetIndex) return;

    const updated = attributes.map((attr) => {
      if (attr.id === attributeId) {
        const reordered = [...attr.values];
        const [draggedValue] = reordered.splice(draggedValueIndex, 1);
        reordered.splice(targetIndex, 0, draggedValue);
        return { ...attr, values: reordered };
      }
      return attr;
    });

    onAttributesChange(updated);
    setDraggedValueIndex(null);

    // Regenerate variants with new value order
    const newVariants = generateVariants(updated);
    onVariantsChange(newVariants);
  };

  // Done editing attribute
  const handleDoneEditing = () => {
    if (!editingAttributeId) return;

    const currentAttr = attributes.find((a) => a.id === editingAttributeId);
    if (!currentAttr) return;

    const errors: typeof validationErrors = {};

    // Validate attribute name
    const trimmedName = currentAttr.name.trim();
    if (!trimmedName) {
      errors.name = 'Attribute name is required';
    } else {
      // Check for duplicate attribute names (case-insensitive)
      const isDuplicateName = attributes.some(
        (attr) =>
          attr.id !== currentAttr.id &&
          attr.name.trim().toLowerCase() === trimmedName.toLowerCase()
      );
      if (isDuplicateName) {
        errors.duplicateName = true;
        errors.name = 'Attribute name must be unique';
      }
    }

    // Validate option values
    const validValues = currentAttr.values.filter((v) => v.value.trim());
    if (validValues.length === 0) {
      errors.values = 'At least one option value is required';
    } else {
      // Check for duplicate values (case-insensitive)
      const valueCounts = new Map<string, string[]>();
      currentAttr.values.forEach((val) => {
        const trimmed = val.value.trim().toLowerCase();
        if (trimmed) {
          if (!valueCounts.has(trimmed)) {
            valueCounts.set(trimmed, []);
          }
          valueCounts.get(trimmed)!.push(val.id);
        }
      });

      const duplicateValueIds = new Set<string>();
      valueCounts.forEach((ids) => {
        if (ids.length > 1) {
          ids.forEach((id) => duplicateValueIds.add(id));
        }
      });

      if (duplicateValueIds.size > 0) {
        errors.duplicateValues = duplicateValueIds;
        errors.values = 'Option values must be unique';
      }
    }

    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }

    // Clear validation errors and close editor
    setValidationErrors({});
    setEditingAttributeId(null);
  };

  // Update variant field
  const handleUpdateVariant = (
    id: string,
    field: 'price' | 'available' | 'sku',
    value: string | number
  ) => {
    const updated = variants.map((v) =>
      v.id === id ? { ...v, [field]: value } : v
    );
    onVariantsChange(updated);
  };

  // Toggle group expansion
  const toggleGroupExpansion = (groupKey: string) => {
    const newExpanded = new Set(expandedGroups);
    if (newExpanded.has(groupKey)) {
      newExpanded.delete(groupKey);
    } else {
      newExpanded.add(groupKey);
    }
    setExpandedGroups(newExpanded);
  };

  // Get attribute value by ids
  const getAttributeValue = (attrId: string, valueId: string): string => {
    const attr = attributes.find((a) => a.id === attrId);
    return attr?.values.find((v) => v.id === valueId)?.value || '';
  };

  // Build variant display name
  const getVariantName = (variant: Variant): string => {
    return attributes
      .map((attr) => {
        const valueId = variant.attributeValues[attr.id];
        if (!valueId) return '';
        return getAttributeValue(attr.id, valueId);
      })
      .filter(Boolean)
      .join(' / ');
  };

  // Check if should show variants table
  const shouldShowVariants =
    attributes.some((a) => a.name && a.values.some((v) => v.value)) &&
    variants.length > 0;

  // Check if should show grouping
  const shouldShowGrouping =
    attributes.filter((a) => a.name && a.values.some((v) => v.value)).length >=
    2;

  // Group variants
  const groupedVariants: Record<
    string,
    { variants: Variant[]; groupLabel: string }
  > = {};

  if (shouldShowGrouping && groupBy) {
    variants.forEach((variant) => {
      const groupValueId = variant.attributeValues[groupBy];

      // Skip if groupValueId is undefined
      if (!groupValueId) {
        return;
      }

      const groupLabel = getAttributeValue(groupBy, groupValueId);

      if (!groupedVariants[groupValueId]) {
        groupedVariants[groupValueId] = { variants: [], groupLabel };
      }
      groupedVariants[groupValueId].variants.push(variant);
    });
  }

  // Calculate aggregated values for group
  const getGroupPrice = (variantsInGroup: Variant[]): string => {
    const prices = variantsInGroup.map((v) => v.price);
    const min = Math.min(...prices);
    const max = Math.max(...prices);
    if (min === max) return min.toString();
    return `${min} – ${max}`;
  };

  const getGroupAvailable = (variantsInGroup: Variant[]): number => {
    return variantsInGroup.reduce((sum, v) => sum + v.available, 0);
  };

  // Media handlers
  const handleOpenMediaModal = (variantId: string) => {
    setSelectedVariantId(variantId);
    setMediaModalOpen(true);
  };

  const handleSaveMedia = (files: CreateProductVariantMediaDto[]) => {
    if (!selectedVariantId) return;

    const updated = variants.map((v) =>
      v.id === selectedVariantId ? { ...v, media: files } : v
    );
    onVariantsChange(updated);
  };

  const getVariantMedia = (
    variantId: string
  ): CreateProductVariantMediaDto[] => {
    return variants.find((v) => v.id === variantId)?.media || [];
  };

  const getMainMediaPreview = (variantId: string): string | null => {
    const media = getVariantMedia(variantId);
    const mainMedia = media.find((m) => m.isMain);

    if (!mainMedia) return null;

    return getMediaThumbnailUrl(mainMedia.mediaPublicId, mainMedia.mediaType);
  };

  return (
    <div className='bg-white rounded-lg border border-neutral-200 p-6'>
      <h2 className='text-base font-semibold text-neutral-900 mb-4'>
        Variants
      </h2>

      {/* Attributes Section */}
      <div className='space-y-3 mb-6'>
        {attributes.map((attr, attrIndex) => (
          <div
            key={attr.id}
            draggable={editingAttributeId !== attr.id}
            onDragStart={() => handleAttrDragStart(attrIndex)}
            onDragOver={handleAttrDragOver}
            onDrop={(e) => handleAttrDrop(e, attrIndex)}
          >
            {editingAttributeId === attr.id ? (
              // Attribute Editor Panel
              <div className='border border-neutral-300 rounded-lg p-4 bg-neutral-50'>
                <div className='mb-4'>
                  <label className='block text-sm font-medium text-neutral-700 mb-1'>
                    Option name
                  </label>
                  <input
                    type='text'
                    value={attr.name}
                    onChange={(e) => {
                      handleUpdateAttributeName(attr.id, e.target.value);
                      setValidationErrors({});
                    }}
                    placeholder='e.g., Color, Size'
                    className={`w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
                      validationErrors.name
                        ? 'border-red-500'
                        : 'border-neutral-300'
                    }`}
                  />
                  {validationErrors.name && (
                    <p className='mt-1 text-xs text-red-600'>
                      {validationErrors.name}
                    </p>
                  )}
                </div>

                <div className='mb-4'>
                  <label className='block text-sm font-medium text-neutral-700 mb-2'>
                    Option values
                  </label>
                  <div className='space-y-2'>
                    {attr.values.map((val, valIndex) => (
                      <div
                        key={val.id}
                        draggable={val.value !== ''}
                        onDragStart={() => handleValueDragStart(valIndex)}
                        onDragOver={handleValueDragOver}
                        onDrop={(e) => handleValueDrop(e, attr.id, valIndex)}
                        className='flex items-center gap-2'
                      >
                        <Bars3Icon
                          className={`w-4 h-4 shrink-0 ${
                            val.value
                              ? 'text-neutral-400 cursor-move'
                              : 'text-neutral-300'
                          }`}
                        />
                        <input
                          type='text'
                          value={val.value}
                          onChange={(e) => {
                            handleUpdateAttributeValue(
                              attr.id,
                              val.id,
                              e.target.value
                            );
                            setValidationErrors({});
                          }}
                          placeholder='Enter value'
                          className={`flex-1 px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
                            validationErrors.duplicateValues?.has(val.id)
                              ? 'border-red-500'
                              : 'border-neutral-300'
                          }`}
                        />
                        {attr.values.filter((v) => v.value).length > 1 &&
                          val.value && (
                            <button
                              type='button'
                              onClick={() =>
                                handleDeleteAttributeValue(attr.id, val.id)
                              }
                              className='cursor-pointer p-2 text-neutral-400 hover:text-red-600 transition-colors'
                            >
                              <TrashIcon className='w-4 h-4' />
                            </button>
                          )}
                      </div>
                    ))}
                  </div>
                  {validationErrors.values && (
                    <p className='mt-1 text-xs text-red-600'>
                      {validationErrors.values}
                    </p>
                  )}
                </div>

                <div className='flex items-center justify-between'>
                  <button
                    type='button'
                    onClick={() => handleDeleteAttribute(attr.id)}
                    className='cursor-pointer px-4 py-2 text-sm text-red-600 hover:text-red-700 font-medium transition-colors'
                  >
                    Delete
                  </button>
                  <button
                    type='button'
                    onClick={handleDoneEditing}
                    className='cursor-pointer px-4 py-2 text-sm bg-primary-600 text-white rounded-md hover:bg-primary-700 font-medium transition-colors'
                  >
                    Done
                  </button>
                </div>
              </div>
            ) : (
              // Attribute Summary Card
              <button
                type='button'
                onClick={() => setEditingAttributeId(attr.id)}
                className='w-full border border-neutral-200 rounded-lg p-4 text-left hover:border-neutral-300 hover:bg-neutral-50 transition-colors cursor-move'
              >
                <div className='flex items-center gap-2 mb-2'>
                  <Bars3Icon className='w-4 h-4 text-neutral-400' />
                  <span className='text-sm font-semibold text-neutral-900'>
                    {attr.name || 'Unnamed option'}
                  </span>
                </div>
                <div className='flex flex-wrap gap-2 pl-6'>
                  {attr.values
                    .filter((v) => v.value)
                    .map((val) => (
                      <span
                        key={val.id}
                        className='inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-neutral-100 text-neutral-700'
                      >
                        {val.value}
                      </span>
                    ))}
                </div>
              </button>
            )}
          </div>
        ))}

        {/* Add Attribute Button */}
        {attributes.length < 3 && (
          <button
            type='button'
            onClick={handleAddAttribute}
            className='cursor-pointer w-full px-4 py-3 border-2 border-dashed border-neutral-300 rounded-lg text-sm text-neutral-600 hover:border-neutral-400 hover:text-neutral-700 font-medium transition-colors'
          >
            {attributes.length === 0
              ? 'Add options like color or size'
              : 'Add another option'}
          </button>
        )}
      </div>

      {/* Variants Table */}
      {shouldShowVariants && (
        <div className='border border-neutral-200 rounded-lg overflow-hidden'>
          {/* Group By Selector */}
          {shouldShowGrouping && (
            <div className='px-4 py-3 bg-neutral-50 border-b border-neutral-200'>
              <label className='text-sm font-medium text-neutral-700 mr-3'>
                Group by:
              </label>
              <select
                value={groupBy || ''}
                onChange={(e) => onGroupByChange(e.target.value || null)}
                className='px-3 py-1.5 border border-neutral-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500'
              >
                {attributes
                  .filter((a) => a.name && a.values.some((v) => v.value))
                  .map((attr) => (
                    <option key={attr.id} value={attr.id}>
                      {attr.name}
                    </option>
                  ))}
              </select>
            </div>
          )}

          {/* Table Header */}
          <div className='grid grid-cols-[auto_auto_1fr_120px_120px_150px] gap-4 px-4 py-3 bg-neutral-50 border-b border-neutral-200 text-xs font-semibold text-neutral-700'>
            <div className='w-6'></div>
            <div className='w-12'></div>
            <div>Variant</div>
            <div>Price</div>
            <div>Available</div>
            <div>SKU</div>
          </div>

          {/* Table Body */}
          <div className='divide-y divide-neutral-100'>
            {shouldShowGrouping && groupBy
              ? // Grouped view
                Object.entries(groupedVariants).map(
                  ([groupValueId, { variants: groupVariants, groupLabel }]) => {
                    const isExpanded = expandedGroups.has(groupValueId);

                    return (
                      <div key={groupValueId}>
                        {/* Group Header Row */}
                        <div className='grid grid-cols-[auto_1fr_120px_120px_150px] gap-4 px-4 py-3 bg-white hover:bg-neutral-50'>
                          <div className='w-6 flex items-center'>
                            <input type='checkbox' className='rounded' />
                          </div>
                          <div className='flex flex-col'>
                            <span className='text-sm font-semibold text-neutral-900'>
                              {groupLabel}
                            </span>
                            <button
                              type='button'
                              onClick={() => toggleGroupExpansion(groupValueId)}
                              className='cursor-pointer text-xs text-primary-600 hover:text-primary-700 text-left mt-1 flex items-center gap-1'
                            >
                              <span>{groupVariants.length} variants</span>
                              {isExpanded ? (
                                <ChevronUpIcon className='w-3 h-3' />
                              ) : (
                                <ChevronDownIcon className='w-3 h-3' />
                              )}
                            </button>
                          </div>
                          <div>
                            <input
                              type='text'
                              value={getGroupPrice(groupVariants)}
                              readOnly
                              className='w-full px-2 py-1.5 border border-neutral-200 rounded text-sm bg-neutral-50 text-neutral-700 cursor-default'
                            />
                          </div>
                          <div>
                            <input
                              type='number'
                              value={getGroupAvailable(groupVariants)}
                              disabled
                              className='w-full px-2 py-1.5 border border-neutral-200 rounded text-sm bg-neutral-50 text-neutral-400'
                            />
                          </div>
                          <div>
                            <input
                              type='text'
                              disabled
                              className='w-full px-2 py-1.5 border border-neutral-200 rounded text-sm bg-neutral-50'
                            />
                          </div>
                        </div>

                        {/* Child Rows */}
                        {isExpanded &&
                          groupVariants.map((variant) => (
                            <div
                              key={variant.id}
                              className='grid grid-cols-[auto_auto_1fr_120px_120px_150px] gap-4 px-4 py-3 bg-neutral-50/30 hover:bg-neutral-50'
                            >
                              <div className='w-6 flex items-center pl-4'>
                                <input type='checkbox' className='rounded' />
                              </div>
                              <div className='flex items-center pl-4'>
                                <button
                                  type='button'
                                  onClick={() =>
                                    handleOpenMediaModal(variant.id)
                                  }
                                  className='cursor-pointer w-12 h-12 flex items-center justify-center border border-neutral-300 rounded hover:bg-neutral-100 transition-colors overflow-hidden bg-neutral-50'
                                >
                                  {getMainMediaPreview(variant.id) ? (
                                    <img
                                      src={getMainMediaPreview(variant.id)!}
                                      alt='Variant media'
                                      className='w-full h-full object-cover'
                                    />
                                  ) : (
                                    <PhotoIcon className='w-5 h-5 text-neutral-400' />
                                  )}
                                </button>
                              </div>
                              <div className='text-sm text-neutral-700 pl-4 flex items-center'>
                                {getVariantName(variant)}
                              </div>
                              <div>
                                <input
                                  type='number'
                                  value={variant.price}
                                  onChange={(e) =>
                                    handleUpdateVariant(
                                      variant.id,
                                      'price',
                                      parseFloat(e.target.value) || 0
                                    )
                                  }
                                  className='w-full px-2 py-1.5 border border-neutral-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500'
                                />
                              </div>
                              <div>
                                <input
                                  type='number'
                                  value={variant.available}
                                  onChange={(e) =>
                                    handleUpdateVariant(
                                      variant.id,
                                      'available',
                                      parseInt(e.target.value) || 0
                                    )
                                  }
                                  className='w-full px-2 py-1.5 border border-neutral-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500'
                                />
                              </div>
                              <div>
                                <input
                                  type='text'
                                  value={variant.sku}
                                  onChange={(e) =>
                                    handleUpdateVariant(
                                      variant.id,
                                      'sku',
                                      e.target.value
                                    )
                                  }
                                  className='w-full px-2 py-1.5 border border-neutral-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500'
                                />
                              </div>
                            </div>
                          ))}
                      </div>
                    );
                  }
                )
              : // Flat view (single attribute or no grouping)
                variants.map((variant) => (
                  <div
                    key={variant.id}
                    className='grid grid-cols-[auto_auto_1fr_120px_120px_150px] gap-4 px-4 py-3 hover:bg-neutral-50'
                  >
                    <div className='w-6 flex items-center'>
                      <input type='checkbox' className='rounded' />
                    </div>
                    <div className='flex items-center'>
                      <button
                        type='button'
                        onClick={() => handleOpenMediaModal(variant.id)}
                        className='cursor-pointer w-12 h-12 flex items-center justify-center border border-neutral-300 rounded hover:bg-neutral-100 transition-colors overflow-hidden bg-neutral-50'
                      >
                        {getMainMediaPreview(variant.id) ? (
                          <img
                            src={getMainMediaPreview(variant.id)!}
                            alt='Variant media'
                            className='w-full h-full object-cover'
                          />
                        ) : (
                          <PhotoIcon className='w-5 h-5 text-neutral-400' />
                        )}
                      </button>
                    </div>
                    <div className='text-sm text-neutral-700 flex items-center'>
                      {getVariantName(variant)}
                    </div>
                    <div>
                      <input
                        type='number'
                        value={variant.price}
                        onChange={(e) =>
                          handleUpdateVariant(
                            variant.id,
                            'price',
                            parseFloat(e.target.value) || 0
                          )
                        }
                        className='w-full px-2 py-1.5 border border-neutral-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500'
                      />
                    </div>
                    <div>
                      <input
                        type='number'
                        value={variant.available}
                        onChange={(e) =>
                          handleUpdateVariant(
                            variant.id,
                            'available',
                            parseInt(e.target.value) || 0
                          )
                        }
                        className='w-full px-2 py-1.5 border border-neutral-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500'
                      />
                    </div>
                    <div>
                      <input
                        type='text'
                        value={variant.sku}
                        onChange={(e) =>
                          handleUpdateVariant(variant.id, 'sku', e.target.value)
                        }
                        className='w-full px-2 py-1.5 border border-neutral-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500'
                      />
                    </div>
                  </div>
                ))}
          </div>
        </div>
      )}

      {/* Media Upload Modal */}
      <VariantMediaModal
        isOpen={mediaModalOpen}
        onClose={() => {
          setMediaModalOpen(false);
          setSelectedVariantId(null);
        }}
        onSave={handleSaveMedia}
        initialFiles={
          selectedVariantId ? getVariantMedia(selectedVariantId) : []
        }
      />
    </div>
  );
};
