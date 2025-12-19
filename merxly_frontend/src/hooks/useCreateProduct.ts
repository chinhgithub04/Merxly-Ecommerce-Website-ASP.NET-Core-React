import { useState, useEffect } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useNavigate, useParams } from 'react-router-dom';
import {
  createProduct,
  getProductById,
  updateProduct,
  addAttributeValues,
  updateAttributeValues,
  deleteAttributeValues,
} from '../services/productService';
import type {
  CreateProductDto,
  UpdateProductDto,
} from '../types/models/product';
import type { CreateProductAttributeDto } from '../types/models/productAttribute';
import type { CreateProductVariantDto } from '../types/models/productVariant';
import type { CreateProductVariantMediaDto } from '../types/models/productVariantMedia';
import type {
  AddAttributeValuesAndVariants,
  BulkUpdateProductAttributeValuesDto,
  DeleteAttributeValuesWithVariantsDto,
} from '../types/models/productAttributeValue';

// Internal types for UI state (matches ProductVariantsSection)
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

export const useCreateProduct = () => {
  const navigate = useNavigate();
  const { id: productId } = useParams<{ id: string }>();
  const isEditMode = !!productId;

  // Basic product information
  const [productName, setProductName] = useState('');
  const [description, setDescription] = useState('');
  const [categoryId, setCategoryId] = useState<string | null>(null);
  const [isActive, setIsActive] = useState(true);
  const [isStoreFeatured, setIsStoreFeatured] = useState(false);

  // Initial snapshot for edit mode (to track changes)
  const [initialBasicInfo, setInitialBasicInfo] = useState<{
    name: string;
    description: string;
    categoryId: string | null;
    isActive: boolean;
    isStoreFeatured: boolean;
  } | null>(null);

  // Initial attributes snapshot for edit mode (to track attribute value changes)
  const [initialAttributes, setInitialAttributes] = useState<Attribute[]>([]);

  // Track deleted attribute value IDs (for values that existed in initial snapshot)
  const [deletedAttributeValueIds, setDeletedAttributeValueIds] = useState<
    string[]
  >([]);

  // Attributes and variants (managed by ProductVariantsSection)
  const [attributes, setAttributes] = useState<Attribute[]>([]);
  const [variants, setVariants] = useState<Variant[]>([]);
  const [groupBy, setGroupBy] = useState<string | null>(null);

  // Validation errors
  const [errors, setErrors] = useState<{
    productName?: string;
    categoryId?: string;
    variants?: string;
  }>({});

  // Load product data if in edit mode
  const { data: productData, isLoading: isLoadingProduct } = useQuery({
    queryKey: ['product', productId],
    queryFn: () => getProductById(productId!),
    enabled: isEditMode,
  });

  // Map loaded product data to UI state
  useEffect(() => {
    if (productData?.data && isEditMode) {
      const product = productData.data;

      // Set basic info
      setProductName(product.name);
      setDescription(product.description || '');
      setCategoryId(product.categoryId);
      setIsActive(product.isActive);
      setIsStoreFeatured(product.isStoreFeatured);

      // Capture initial snapshot for change tracking
      setInitialBasicInfo({
        name: product.name,
        description: product.description || '',
        categoryId: product.categoryId,
        isActive: product.isActive,
        isStoreFeatured: product.isStoreFeatured,
      });

      // Map attributes
      const mappedAttributes: Attribute[] = product.productAttributes
        .filter((attr) => attr != null)
        .sort((a, b) => a.displayOrder - b.displayOrder)
        .map((attr) => ({
          id: attr.id,
          name: attr.name,
          values: (attr.productAttributeValues || [])
            .filter((val) => val != null)
            .sort((a, b) => a.displayOrder - b.displayOrder)
            .map((val) => ({
              id: val.id,
              value: val.value,
            })),
        }));

      // Capture initial attributes snapshot
      setInitialAttributes(JSON.parse(JSON.stringify(mappedAttributes)));

      // In edit mode, add one empty value input to each attribute for better UX
      const attributesWithEmptyInputs = mappedAttributes.map((attr) => ({
        ...attr,
        values: [
          ...attr.values,
          { id: `val-new-${Date.now()}-${attr.id}`, value: '' },
        ],
      }));

      setAttributes(attributesWithEmptyInputs);

      // Map variants
      const mappedVariants: Variant[] = product.variants
        .filter((variant) => variant != null)
        .map((variant) => {
          // Build attributeValues mapping from productAttributeValues
          const attributeValues: Record<string, string> = {};
          (variant.productAttributeValues || [])
            .filter((val) => val != null && val.id)
            .forEach((val) => {
              // Find which attribute this value belongs to
              const attr = mappedAttributes.find((a) =>
                a.values.some((v) => v.id === val.id)
              );
              if (attr) {
                attributeValues[attr.id] = val.id;
              }
            });

          // Map media
          const media: CreateProductVariantMediaDto[] = (
            variant.productVariantMedia || []
          )
            .filter((m) => m != null && m.mediaPublicId)
            .map((m) => ({
              mediaPublicId: m.mediaPublicId,
              fileName: '',
              fileExtension: '',
              fileSizeInBytes: 0,
              displayOrder: m.displayOrder,
              isMain: m.isMain,
              mediaType: m.mediaType,
            }));

          return {
            id: variant.id,
            attributeValues,
            price: variant.price,
            available: variant.stockQuantity,
            sku: variant.sku || '',
            media,
          };
        })
        // Sort variants by attribute value order
        .sort((a, b) => {
          // Compare variants by each attribute in order
          for (const attr of mappedAttributes) {
            const aValueId = a.attributeValues[attr.id];
            const bValueId = b.attributeValues[attr.id];

            if (!aValueId || !bValueId) continue;

            // Find the index of each value in the attribute's values array
            const aIndex = attr.values.findIndex((v) => v.id === aValueId);
            const bIndex = attr.values.findIndex((v) => v.id === bValueId);

            if (aIndex !== bIndex) {
              return aIndex - bIndex;
            }
          }
          return 0;
        });

      setVariants(mappedVariants);

      // Set default groupBy if needed
      if (mappedAttributes.length >= 2) {
        setGroupBy(mappedAttributes[0].id);
      }
    }
  }, [productData, isEditMode]);

  // Build DTO for submission
  const buildCreateProductDto = (): CreateProductDto | null => {
    // Reset errors
    const newErrors: typeof errors = {};

    // Validate product name
    if (!productName.trim()) {
      newErrors.productName = 'Product name is required';
    }

    // Validate category
    if (!categoryId) {
      newErrors.categoryId = 'Please select a category';
    }

    // Validate variants
    if (variants.length === 0) {
      newErrors.variants = 'Please add at least one variant';
    } else {
      // Validate each variant
      const invalidVariant = variants.find(
        (v) =>
          v.price < 0 ||
          v.available < 0 ||
          Object.keys(v.attributeValues).length === 0
      );

      if (invalidVariant) {
        newErrors.variants =
          'All variants must have valid price, stock quantity, and attribute selections';
      }
    }

    // If there are errors, set them and return null
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return null;
    }

    // Clear errors
    setErrors({});

    // Build product attributes DTO
    const productAttributesDto: CreateProductAttributeDto[] = attributes
      .filter(
        (attr) => attr.name.trim() && attr.values.some((v) => v.value.trim())
      )
      .map((attr, attrIndex) => ({
        name: attr.name.trim(),
        displayOrder: attrIndex,
        productAttributeValues: attr.values
          .filter((v) => v.value.trim())
          .map((v, valueIndex) => ({
            value: v.value.trim(),
            displayOrder: valueIndex,
          })),
      }));

    // Build variants DTO
    const variantsDto: CreateProductVariantDto[] = variants.map((variant) => {
      // Build attribute selections
      const attributeSelections = Object.entries(variant.attributeValues).map(
        ([attrId, valueId]) => {
          const attr = attributes.find((a) => a.id === attrId);
          const value = attr?.values.find((v) => v.id === valueId);

          return {
            attributeName: attr?.name || '',
            value: value?.value || '',
          };
        }
      );

      return {
        sku: variant.sku || null,
        price: variant.price,
        stockQuantity: variant.available,
        attributeSelections,
        media: variant.media || [],
      };
    });

    return {
      name: productName.trim(),
      description: description.trim() || null,
      isStoreFeatured,
      isActive,
      categoryId: categoryId!,
      productAttributes: productAttributesDto,
      variants: variantsDto,
    };
  };

  // Detect deleted attribute values (requires DELETE)
  const hasDeletedAttributeValues = (): boolean => {
    return deletedAttributeValueIds.length > 0;
  };

  // Detect new attribute values (requires POST)
  const hasNewAttributeValues = (): boolean => {
    if (!isEditMode || initialAttributes.length === 0) return false;

    const currentAttrsFiltered = attributes.map((attr) => ({
      ...attr,
      values: attr.values.filter((v) => v.value.trim()),
    }));

    for (const currentAttr of currentAttrsFiltered) {
      const initialAttr = initialAttributes.find(
        (a) => a.id === currentAttr.id
      );
      if (!initialAttr) continue;

      const initialValueIds = new Set(initialAttr.values.map((v) => v.id));
      for (const currVal of currentAttr.values) {
        if (!initialValueIds.has(currVal.id)) return true;
      }
    }

    return false;
  };

  // Detect updated attribute values (requires PATCH)
  const hasUpdatedAttributeValues = (): boolean => {
    if (!isEditMode || initialAttributes.length === 0) return false;

    const currentAttrsFiltered = attributes.map((attr) => ({
      ...attr,
      values: attr.values.filter((v) => v.value.trim()),
    }));

    for (const currentAttr of currentAttrsFiltered) {
      const initialAttr = initialAttributes.find(
        (a) => a.id === currentAttr.id
      );
      if (!initialAttr) continue;

      for (let i = 0; i < currentAttr.values.length; i++) {
        const currVal = currentAttr.values[i];
        const initialVal = initialAttr.values.find((v) => v.id === currVal.id);
        if (
          initialVal &&
          (initialVal.value !== currVal.value ||
            initialAttr.values.findIndex((v) => v.id === currVal.id) !== i)
        ) {
          return true;
        }
      }
    }

    return false;
  };

  // Check if attribute values have changed (for dirty state in attributes section)
  const hasAttributeChanges = (): boolean => {
    if (!isEditMode || initialAttributes.length === 0) return false;

    // Check for deleted values
    if (deletedAttributeValueIds.length > 0) return true;

    // Filter out empty values from current attributes
    const currentAttrsFiltered = attributes.map((attr) => ({
      ...attr,
      values: attr.values.filter((v) => v.value.trim()),
    }));

    for (const currentAttr of currentAttrsFiltered) {
      const initialAttr = initialAttributes.find(
        (a) => a.id === currentAttr.id
      );
      if (!initialAttr) continue;

      const initialValueIds = new Set(initialAttr.values.map((v) => v.id));

      // Check for new values
      for (const currVal of currentAttr.values) {
        if (!initialValueIds.has(currVal.id)) return true;
      }

      // Check for renamed or reordered values
      for (let i = 0; i < currentAttr.values.length; i++) {
        const currVal = currentAttr.values[i];
        const initialVal = initialAttr.values.find((v) => v.id === currVal.id);
        if (
          initialVal &&
          (initialVal.value !== currVal.value ||
            initialAttr.values.findIndex((v) => v.id === currVal.id) !== i)
        ) {
          return true;
        }
      }
    }

    return false;
  };

  // Separate dirty flags for precise detection
  const isBasicInfoDirty = isEditMode
    ? initialBasicInfo !== null &&
      (productName !== initialBasicInfo.name ||
        description !== initialBasicInfo.description ||
        categoryId !== initialBasicInfo.categoryId ||
        isActive !== initialBasicInfo.isActive ||
        isStoreFeatured !== initialBasicInfo.isStoreFeatured)
    : false;

  // Overall dirty state for button enablement
  const isDirty = isEditMode ? isBasicInfoDirty || hasAttributeChanges() : true; // In create mode, always allow save/discard (original behavior)

  // Create mutation
  const createMutation = useMutation({
    mutationFn: createProduct,
    onSuccess: () => {
      navigate('/store/products');
    },
    onError: (error: any) => {
      console.error('Failed to create product:', error);
      const errorMessage =
        error.response?.data?.message || 'Failed to create product';
      setErrors({ variants: errorMessage });
    },
  });

  // Update mutation
  const updateMutation = useMutation({
    mutationFn: (dto: UpdateProductDto) => updateProduct(productId!, dto),
    onSuccess: (response) => {
      // Update initial snapshot to new values
      const updated = response.data;
      if (updated) {
        setInitialBasicInfo({
          name: updated.name,
          description: updated.description || '',
          categoryId: updated.categoryId,
          isActive: updated.isActive,
          isStoreFeatured: updated.isStoreFeatured,
        });
      }
    },
    onError: (error: any) => {
      console.error('Failed to update product:', error);
      const errorMessage =
        error.response?.data?.message || 'Failed to update product';
      setErrors({ variants: errorMessage });
    },
  });

  // Delete attribute values mutation (regenerates variants)
  const deleteAttributeValuesMutation = useMutation({
    mutationFn: (data: DeleteAttributeValuesWithVariantsDto) =>
      deleteAttributeValues(productId!, data),
    onSuccess: (response) => {
      const data = response.data;
      if (data) {
        // Update initialAttributes to remove deleted values
        const updatedInitialAttrs = initialAttributes.map((attr) => ({
          ...attr,
          values: attr.values.filter(
            (v) => !data.deletedAttributeValueIds.includes(v.id)
          ),
        }));
        setInitialAttributes(updatedInitialAttrs);
        // Clear deleted tracking
        setDeletedAttributeValueIds([]);
      }
    },
    onError: (error: any) => {
      console.error('Failed to delete attribute values:', error);
      const errorMessage =
        error.response?.data?.message || 'Failed to delete attribute values';
      setErrors({ variants: errorMessage });
    },
  });

  // Add attribute values mutation (creates new variants)
  const addAttributeValuesMutation = useMutation({
    mutationFn: (data: AddAttributeValuesAndVariants) =>
      addAttributeValues(productId!, data),
    onSuccess: (response) => {
      const data = response.data;
      if (data) {
        // Update initialAttributes to include new values
        const updatedInitialAttrs = initialAttributes.map((attr) => {
          const newValues = data.addedAttributeValues.filter(
            (av) => av.productAttributeId === attr.id
          );
          if (newValues.length > 0) {
            return {
              ...attr,
              values: [
                ...attr.values,
                ...newValues.map((nv) => ({ id: nv.id, value: nv.value })),
              ],
            };
          }
          return attr;
        });
        setInitialAttributes(updatedInitialAttrs);
        // Alert shown at end of sequential execution
      }
    },
    onError: (error: any) => {
      console.error('Failed to add attribute values:', error);
      const errorMessage =
        error.response?.data?.message || 'Failed to add attribute values';
      setErrors({ variants: errorMessage });
    },
  });

  // Update attribute values mutation (no variant regeneration)
  const updateAttributeValuesMutation = useMutation({
    mutationFn: (data: {
      productAttributeId: string;
      dto: BulkUpdateProductAttributeValuesDto;
    }) => updateAttributeValues(data.productAttributeId, data.dto),
    onSuccess: (response) => {
      const data = response.data;
      if (data) {
        // Update initialAttributes with new values and display orders
        const updatedInitialAttrs = initialAttributes.map((attr) => {
          const hasUpdates = data.updatedAttributeValues.some(
            (av) => av.productAttributeId === attr.id
          );
          if (hasUpdates) {
            return {
              ...attr,
              values: data.updatedAttributeValues
                .filter((av) => av.productAttributeId === attr.id)
                .sort((a, b) => a.displayOrder - b.displayOrder)
                .map((av) => ({ id: av.id, value: av.value })),
            };
          }
          return attr;
        });
        setInitialAttributes(updatedInitialAttrs);
        // Alert moved to final step in sequential execution
      }
    },
    onError: (error: any) => {
      console.error('Failed to update attribute values:', error);
      const errorMessage =
        error.response?.data?.message || 'Failed to update attribute values';
      setErrors({ variants: errorMessage });
    },
  });

  const handleSubmit = async () => {
    if (isEditMode) {
      // Sequential execution: PATCH /basic → DELETE /attribute-values → PATCH /attribute-values → POST /attribute-values
      try {
        // Step 1: Update basic info if changed
        if (isBasicInfoDirty) {
          const updateDto: UpdateProductDto = {
            name: productName.trim(),
            description: description.trim() || null,
            categoryId: categoryId!,
            isActive,
            isStoreFeatured,
          };
          await updateMutation.mutateAsync(updateDto);
        }

        // Prepare attribute change data
        const currentAttrsFiltered = attributes.map((attr) => ({
          ...attr,
          values: attr.values.filter((v) => v.value.trim()),
        }));

        // Step 2: Delete attribute values if any deletions
        if (hasDeletedAttributeValues()) {
          const deleteDto: DeleteAttributeValuesWithVariantsDto = {
            attributeValueIds: deletedAttributeValueIds,
            productVariants: buildCreateProductDto()?.variants || [],
          };
          await deleteAttributeValuesMutation.mutateAsync(deleteDto);
        }

        // Step 3: Update existing attribute values (rename/reorder) if changed
        if (hasUpdatedAttributeValues()) {
          for (const currentAttr of currentAttrsFiltered) {
            const initialAttr = initialAttributes.find(
              (a) => a.id === currentAttr.id
            );
            if (!initialAttr) continue;

            const updates: Array<{
              id: string;
              value: string;
              displayOrder: number;
            }> = [];

            currentAttr.values.forEach((currVal, index) => {
              // Skip if this value was deleted
              if (deletedAttributeValueIds.includes(currVal.id)) return;

              const initialVal = initialAttr.values.find(
                (v) => v.id === currVal.id
              );
              const initialIndex = initialAttr.values.findIndex(
                (v) => v.id === currVal.id
              );
              if (
                initialVal &&
                (initialVal.value !== currVal.value || initialIndex !== index)
              ) {
                updates.push({
                  id: currVal.id,
                  value: currVal.value,
                  displayOrder: index,
                });
              }
            });

            if (updates.length > 0) {
              const updateDto: BulkUpdateProductAttributeValuesDto = {
                attributeValues: updates.map((u) => ({
                  id: u.id,
                  value: u.value,
                  displayOrder: u.displayOrder,
                })),
              };
              await updateAttributeValuesMutation.mutateAsync({
                productAttributeId: currentAttr.id,
                dto: updateDto,
              });
            }
          }
        }

        // Step 4: Add new attribute values (with variant regeneration) if added
        if (hasNewAttributeValues()) {
          for (const currentAttr of currentAttrsFiltered) {
            const initialAttr = initialAttributes.find(
              (a) => a.id === currentAttr.id
            );
            if (!initialAttr) continue;

            const initialValueIds = new Set(
              initialAttr.values.map((v) => v.id)
            );
            const newValues: AttributeValue[] = [];

            currentAttr.values.forEach((currVal) => {
              // Skip if this value was deleted
              if (deletedAttributeValueIds.includes(currVal.id)) return;

              if (!initialValueIds.has(currVal.id)) {
                newValues.push(currVal);
              }
            });

            if (newValues.length > 0) {
              const addDto: AddAttributeValuesAndVariants = {
                attributeValueAdditions: [
                  {
                    productAttributeId: currentAttr.id,
                    attributeValues: newValues.map((val) => {
                      // Find actual index in reordered list
                      const actualIndex = currentAttr.values.findIndex(
                        (v) => v.id === val.id
                      );
                      return {
                        value: val.value,
                        displayOrder: actualIndex,
                      };
                    }),
                  },
                ],
                productVariants: buildCreateProductDto()?.variants || [],
              };
              await addAttributeValuesMutation.mutateAsync(addDto);
            }
          }
        }

        // Show success message if any update was performed
        if (
          isBasicInfoDirty ||
          hasDeletedAttributeValues() ||
          hasUpdatedAttributeValues() ||
          hasNewAttributeValues()
        ) {
          alert('Product saved');

          // Reset dirty state by syncing snapshots with current state
          // This disables Save/Discard buttons after successful save
          setInitialBasicInfo({
            name: productName,
            description: description,
            categoryId: categoryId,
            isActive: isActive,
            isStoreFeatured: isStoreFeatured,
          });

          // Sync attributes snapshot (exclude empty values and deleted values)
          const syncedAttributes = attributes.map((attr) => ({
            ...attr,
            values: attr.values.filter(
              (v) => v.value.trim() && !deletedAttributeValueIds.includes(v.id)
            ),
          }));
          setInitialAttributes(JSON.parse(JSON.stringify(syncedAttributes)));

          // Clear deleted tracking
          setDeletedAttributeValueIds([]);

          // Update working attributes to match (re-add empty inputs for edit UX)
          const attributesWithEmptyInputs = syncedAttributes.map((attr) => ({
            ...attr,
            values: [
              ...attr.values,
              { id: `val-new-${Date.now()}-${attr.id}`, value: '' },
            ],
          }));
          setAttributes(attributesWithEmptyInputs);
        }
      } catch (error) {
        // Error already handled in mutation's onError
        console.error('Save failed:', error);
      }
    } else {
      // Create mode - existing logic
      const dto = buildCreateProductDto();
      if (dto) {
        createMutation.mutate(dto);
      }
    }
  };

  const handleBack = () => {
    navigate('/store/products');
  };

  const handleDiscard = () => {
    if (isEditMode && initialBasicInfo) {
      // Edit mode: restore original values
      setProductName(initialBasicInfo.name);
      setDescription(initialBasicInfo.description);
      setCategoryId(initialBasicInfo.categoryId);
      setIsActive(initialBasicInfo.isActive);
      setIsStoreFeatured(initialBasicInfo.isStoreFeatured);

      // Restore attributes to original state (with empty input for edit mode UX)
      if (initialAttributes.length > 0) {
        const attributesWithEmptyInputs = initialAttributes.map((attr) => ({
          ...attr,
          values: [
            ...JSON.parse(JSON.stringify(attr.values)),
            { id: `val-new-${Date.now()}-${attr.id}`, value: '' },
          ],
        }));
        setAttributes(attributesWithEmptyInputs);
      }
    } else {
      // Create mode: navigate back
      navigate('/store/products');
    }
  };

  return {
    // State
    productName,
    description,
    categoryId,
    isActive,
    isStoreFeatured,
    attributes,
    variants,
    groupBy,
    errors,

    // Setters
    setProductName,
    setDescription,
    setCategoryId,
    setIsActive,
    setIsStoreFeatured,
    setAttributes,
    setVariants,
    setGroupBy,
    setDeletedAttributeValueIds,

    // Actions
    handleSubmit,
    handleBack,
    handleDiscard,

    // Status
    isSubmitting:
      createMutation.isPending ||
      updateMutation.isPending ||
      deleteAttributeValuesMutation.isPending ||
      addAttributeValuesMutation.isPending ||
      updateAttributeValuesMutation.isPending,
    isLoading: isLoadingProduct,
    isEditMode,
    isDirty,
    hasAttributeChanges: hasAttributeChanges(),
  };
};
