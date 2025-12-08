using AutoMapper;
using merxly.Application.DTOs.Common;
using merxly.Application.DTOs.Product;
using merxly.Application.DTOs.Product.Update;
using merxly.Application.DTOs.ProductAttribute;
using merxly.Application.DTOs.ProductAttribute.Delete;
using merxly.Application.DTOs.ProductAttribute.Update;
using merxly.Application.DTOs.ProductAttributeValue;
using merxly.Application.DTOs.ProductAttributeValue.Delete;
using merxly.Application.DTOs.ProductAttributeValue.Update;
using merxly.Application.DTOs.ProductVariant;
using merxly.Application.DTOs.ProductVariant.Delete;
using merxly.Application.DTOs.ProductVariant.Update;
using merxly.Application.DTOs.ProductVariantMedia.Update;
using merxly.Application.Interfaces;
using merxly.Application.Interfaces.Services;
using merxly.Domain.Entities;
using merxly.Domain.Exceptions;
using Microsoft.Extensions.Logging;

namespace merxly.Application.Services
{
    public class ProductService : IProductService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;
        private readonly ILogger<ProductService> _logger;

        public ProductService(
            IUnitOfWork unitOfWork,
            IMapper mapper,
            ILogger<ProductService> logger)
        {
            _unitOfWork = unitOfWork;
            _mapper = mapper;
            _logger = logger;
        }

        public async Task<PaginatedResultDto<ProductDto>> GetProductsAsync(
            ProductQueryParameters parameters,
            CancellationToken cancellationToken)
        {
            _logger.LogInformation("Retrieving products. PageNumber: {PageNumber}, PageSize: {PageSize}", parameters.PageNumber, parameters.PageSize);

            var paginatedProducts = await _unitOfWork.Product.GetPaginatedProductsWithQueryParametersAsync(parameters, cancellationToken);

            var paginatedResult = _mapper.Map<PaginatedResultDto<ProductDto>>(paginatedProducts);

            _logger.LogInformation("Products retrieved successfully. PageNumber: {PageNumber}, PageSize: {PageSize}", parameters.PageNumber, parameters.PageSize);

            return paginatedResult;
        }

        public async Task<DetailProductDto> GetProductByIdAsync(Guid productId, CancellationToken cancellationToken)
        {
            _logger.LogInformation("Getting product by ID: {ProductId}", productId);

            var product = await _unitOfWork.Product.GetFirstOrDefaultAsync(
                p => p.Id == productId && p.IsActive,
                cancellationToken,
                p => p.Category,
                p => p.Store,
                p => p.Variants);

            if (product == null)
            {
                _logger.LogWarning("Product not found: {ProductId}", productId);
                throw new NotFoundException("Product not found.");
            }

            _logger.LogInformation("Product retrieved successfully: {ProductId}", productId);

            return _mapper.Map<DetailProductDto>(product);
        }

        public async Task<StoreDetailProductDto> CreateProductAsync(
            CreateProductDto createProductDto,
            Guid storeId,
            CancellationToken cancellationToken)
        {
            _logger.LogInformation("Creating product for store: {StoreId}", storeId);

            var store = await _unitOfWork.Store.GetByIdAsync(storeId, cancellationToken);

            if (store == null)
            {
                _logger.LogWarning("Store not found: {StoreId}", storeId);
                throw new NotFoundException("Store not found.");
            }

            // Verify category exists
            var categoryExists = await _unitOfWork.Category.AnyAsync(
                c => c.Id == createProductDto.CategoryId,
                cancellationToken);

            if (!categoryExists)
            {
                _logger.LogWarning("Category not found: {CategoryId}", createProductDto.CategoryId);
                throw new NotFoundException("Category not found.");
            }

            // Validate maximum 3 attributes per product
            if (createProductDto.ProductAttributes.Count > 3)
            {
                _logger.LogWarning("Product cannot have more than 3 attributes. Requested: {Count}", createProductDto.ProductAttributes.Count);
                throw new InvalidOperationException("A product can have a maximum of 3 attributes.");
            }

            // Create product
            var product = _mapper.Map<Product>(createProductDto);
            product.StoreId = store.Id;

            _logger.LogInformation("Product created: {ProductId}", product.Id);

            // Prepare a map to track attribute value IDs
            // Key: AttributeName_Value , Value: ProductAttributeValueId
            // Ex: Color_Red : 123e4567-e89b-12d3-a456-426614174000
            var valueIdMap = new Dictionary<string, Guid>();

            // Create ProductAttributes and ProductAttributeValues
            foreach (var createProductAttributeDto in createProductDto.ProductAttributes)
            {
                // Create ProductAttribute
                var productAttribute = _mapper.Map<ProductAttribute>(createProductAttributeDto);

                _logger.LogInformation("Adding attribute: {AttributeName} to product: {ProductId}", productAttribute.Name, product.Id);

                foreach (var createValueDto in createProductAttributeDto.ProductAttributeValues)
                {
                    // Create ProductAttributeValue
                    var productAttributeValue = _mapper.Map<ProductAttributeValue>(createValueDto);
                    productAttribute.ProductAttributeValues.Add(productAttributeValue);

                    // Create key for the map
                    string key = $"{productAttribute.Name.Trim()}_{productAttributeValue.Value.Trim()}";
                    valueIdMap[key] = productAttributeValue.Id;

                    _logger.LogInformation("Added attribute value: {AttributeValue} to attribute: {AttributeName}", productAttributeValue.Value, productAttribute.Name);
                }
                product.ProductAttributes.Add(productAttribute);
            }

            // Create ProductVariants
            foreach (var createVariantDto in createProductDto.Variants)
            {
                var productVariant = _mapper.Map<ProductVariant>(createVariantDto);

                _logger.LogInformation("Adding variant to product: {ProductId}", product.Id);

                // Map AttributeValues
                foreach (var attributeValueDto in createVariantDto.AttributeSelections)
                {
                    string key = $"{attributeValueDto.AttributeName.Trim()}_{attributeValueDto.Value.Trim()}";
                    if (valueIdMap.TryGetValue(key, out Guid attributeValueId))
                    {
                        // Create ProductVariantAttributeValue
                        var variantAttributeValue = new ProductVariantAttributeValue
                        {
                            ProductVariantId = productVariant.Id,
                            ProductAttributeValueId = attributeValueId
                        };
                        productVariant.VariantAttributeValues.Add(variantAttributeValue);

                        _logger.LogInformation("Mapped attribute value: {AttributeValue} to variant {VariantId}", attributeValueDto.Value, productVariant.Id);
                    }
                    else
                    {
                        _logger.LogWarning("Attribute value not found for variant mapping: {AttributeValue}", attributeValueDto.Value);
                        throw new Exception($"Attribute value '{attributeValueDto.Value}' for attribute '{attributeValueDto.AttributeName}' not found.");
                    }
                }

                // Create Media
                foreach (var createMediaDto in createVariantDto.Media)
                {
                    var variantMedia = _mapper.Map<ProductVariantMedia>(createMediaDto);
                    productVariant.Media.Add(variantMedia);

                    _logger.LogInformation("Added media to variant {VariantId}", productVariant.Id);
                }
                EnsureSingleMainMediaPerVariant(productVariant);

                product.Variants.Add(productVariant);
            }

            UpdateProductPricesAndStock(product);
            UpdateProductMainMedia(product);

            await _unitOfWork.Product.AddAsync(product, cancellationToken);
            await _unitOfWork.SaveChangesAsync(cancellationToken);

            _logger.LogInformation("Product created successfully: {ProductId}", product.Id);

            return _mapper.Map<StoreDetailProductDto>(product);
        }

        public async Task<AddAttributesWithVariantsResponseDto> AddAttributesAndRegenerateVariantsAsync(
            Guid productId,
            AddAttributeWithVariantsDto addAttributeWithVariantsDto,
            Guid storeId,
            CancellationToken cancellationToken)
        {
            _logger.LogInformation("Adding attributes and regenerating variants for product: {ProductId}", productId);

            var product = await _unitOfWork.Product.GetProductWithAttributesByIdAsync(
                productId,
                cancellationToken);

            if (product == null)
            {
                _logger.LogWarning("Product not found: {ProductId}", productId);
                throw new NotFoundException("Product not found.");
            }

            // Verify ownership
            if (product.StoreId != storeId)
            {
                _logger.LogWarning("Store {StoreId} is not the owner of product {ProductId}", storeId, productId);
                throw new ForbiddenAccessException("You don't have permission to update this product.");
            }

            // Validate maximum 3 attributes per product (including new ones)
            int totalAttributesAfterAdd = product.ProductAttributes.Count + addAttributeWithVariantsDto.ProductAttributes.Count;
            if (totalAttributesAfterAdd > 3)
            {
                _logger.LogWarning("Product cannot have more than 3 attributes. Current: {Current}, Adding: {Adding}", 
                    product.ProductAttributes.Count, addAttributeWithVariantsDto.ProductAttributes.Count);
                throw new InvalidOperationException($"A product can have a maximum of 3 attributes. Current: {product.ProductAttributes.Count}, attempting to add: {addAttributeWithVariantsDto.ProductAttributes.Count}.");
            }

            // Track added attributes
            var addedAttributes = new List<ProductAttribute>();

            // Add new ProductAttributes and ProductAttributeValues
            foreach (var createProductAttributeDto in addAttributeWithVariantsDto.ProductAttributes)
            {
                // Check for duplicate attribute name
                bool isDuplicateName = product.ProductAttributes
                    .Any(a => a.Name.Equals(createProductAttributeDto.Name, StringComparison.OrdinalIgnoreCase));

                if (isDuplicateName)
                {
                    _logger.LogWarning("Duplicate attribute name: {AttributeName} for product: {ProductId}", createProductAttributeDto.Name, productId);
                    throw new ConflictException($"Attribute name '{createProductAttributeDto.Name}' already exists for this product.");
                }

                // Create ProductAttribute
                var productAttribute = _mapper.Map<ProductAttribute>(createProductAttributeDto);
                _logger.LogInformation("Adding attribute: {AttributeName} to product: {ProductId}", productAttribute.Name, product.Id);

                foreach (var createValueDto in createProductAttributeDto.ProductAttributeValues)
                {
                    // Create ProductAttributeValue
                    var productAttributeValue = _mapper.Map<ProductAttributeValue>(createValueDto);
                    productAttribute.ProductAttributeValues.Add(productAttributeValue);

                    _logger.LogInformation("Added attribute value: {AttributeValue} to attribute: {AttributeName}", 
                        productAttributeValue.Value, productAttribute.Name);
                }
                product.ProductAttributes.Add(productAttribute);
                addedAttributes.Add(productAttribute);
            }

            // Regenerate variants
            RegenerateVariantsInternal(product, addAttributeWithVariantsDto.ProductAttributeValues);

            UpdateProductPricesAndStock(product);
            UpdateProductMainMedia(product);

            _unitOfWork.Product.Update(product);
            await _unitOfWork.SaveChangesAsync(cancellationToken);

            _logger.LogInformation("Attributes added and variants regenerated successfully for product: {ProductId}", productId);

            return new AddAttributesWithVariantsResponseDto
            {
                ProductId = product.Id,
                AddedAttributes = _mapper.Map<List<ResponseUpdateAttributeItemDto>>(addedAttributes),
                RegeneratedVariants = _mapper.Map<List<ResponseUpdateVariantItemDto>>(product.Variants.Where(v => !v.IsDeleted && v.IsActive)),
                NewMinPrice = product.MinPrice ?? 0,
                NewMaxPrice = product.MaxPrice ?? 0,
                NewTotalStock = product.TotalStock
            };
        }

        public async Task<AddAttributeValuesWithVariantsResponseDto> AddAttributeValuesAndRegenerateVariantsAsync(
            Guid productId,
            AddAttributeValuesAndVariants addAttributeValuesAndVariants,
            Guid storeId,
            CancellationToken cancellationToken)
        {
            _logger.LogInformation("Adding attribute values and regenerating variants for product: {ProductId}", productId);

            var product = await _unitOfWork.Product.GetProductWithAttributesByIdAsync(
                productId,
                cancellationToken);

            if (product == null)
            {
                _logger.LogWarning("Product not found: {ProductId}", productId);
                throw new NotFoundException("Product not found.");
            }

            // Verify ownership
            if (product.StoreId != storeId)
            {
                _logger.LogWarning("Store {StoreId} is not the owner of product {ProductId}", storeId, productId);
                throw new ForbiddenAccessException("You don't have permission to update this product.");
            }

            // Track added attribute values
            var addedAttributeValues = new List<ProductAttributeValue>();

            // Add new attribute values to existing attributes
            foreach (var attributeValueAddition in addAttributeValuesAndVariants.AttributeValueAdditions)
            {
                var productAttribute = product.ProductAttributes
                    .FirstOrDefault(a => a.Id == attributeValueAddition.ProductAttributeId);

                if (productAttribute == null)
                {
                    _logger.LogWarning("Product attribute not found: {AttributeId} for product: {ProductId}", 
                        attributeValueAddition.ProductAttributeId, productId);
                    throw new NotFoundException($"Product attribute with ID {attributeValueAddition.ProductAttributeId} not found for this product.");
                }

                // Check for duplicate attribute values
                foreach (var newValueDto in attributeValueAddition.AttributeValues)
                {
                    bool isDuplicateValue = productAttribute.ProductAttributeValues
                        .Any(av => av.Value.Equals(newValueDto.Value, StringComparison.OrdinalIgnoreCase));

                    if (isDuplicateValue)
                    {
                        _logger.LogWarning("Duplicate attribute value: {AttributeValue} for attribute: {AttributeId}", 
                            newValueDto.Value, attributeValueAddition.ProductAttributeId);
                        throw new ConflictException($"Attribute value '{newValueDto.Value}' already exists for this attribute.");
                    }

                    // Create new ProductAttributeValue
                    var productAttributeValue = _mapper.Map<ProductAttributeValue>(newValueDto);
                    productAttribute.ProductAttributeValues.Add(productAttributeValue);
                    addedAttributeValues.Add(productAttributeValue);

                    _logger.LogInformation("Added attribute value: {AttributeValue} to attribute: {AttributeId}", 
                        productAttributeValue.Value, productAttribute.Id);
                }
            }

            // Regenerate variants with new attribute values
            RegenerateVariantsInternal(product, addAttributeValuesAndVariants.ProductVariants);

            UpdateProductPricesAndStock(product);
            UpdateProductMainMedia(product);

            _unitOfWork.Product.Update(product);
            await _unitOfWork.SaveChangesAsync(cancellationToken);

            _logger.LogInformation("Attribute values added and variants regenerated successfully for product: {ProductId}", productId);

            return new AddAttributeValuesWithVariantsResponseDto
            {
                ProductId = product.Id,
                AddedAttributeValues = _mapper.Map<List<ResponseUpdateAttributeValueItemDto>>(addedAttributeValues),
                RegeneratedVariants = _mapper.Map<List<ResponseUpdateVariantItemDto>>(product.Variants.Where(v => !v.IsDeleted && v.IsActive)),
                NewMinPrice = product.MinPrice ?? 0,
                NewMaxPrice = product.MaxPrice ?? 0,
                NewTotalStock = product.TotalStock
            };
        }

        public async Task<ResponseUpdateProductDto> UpdateProductAsync(
            Guid productId,
            UpdateProductDto updateProductDto,
            Guid storeId,
            CancellationToken cancellationToken)
        {
            _logger.LogInformation("Updating product: {ProductId} by store: {StoreId}", productId, storeId);

            var product = await _unitOfWork.Product.GetByIdAsync(
                productId,
                cancellationToken);

            if (product == null)
            {
                _logger.LogWarning("Product not found: {ProductId}", productId);
                throw new NotFoundException("Product not found.");
            }

            // Verify ownership
            if (product.StoreId != storeId)
            {
                _logger.LogWarning("Store {StoreId} is not the owner of product {ProductId}", storeId, productId);
                throw new ForbiddenAccessException("You don't have permission to update this product.");
            }

            // Verify category if being updated
            if (updateProductDto.CategoryId.HasValue)
            {
                var categoryExists = await _unitOfWork.Category.AnyAsync(
                    c => c.Id == updateProductDto.CategoryId.Value,
                    cancellationToken);

                if (!categoryExists)
                {
                    _logger.LogWarning("Category not found: {CategoryId}", updateProductDto.CategoryId);
                    throw new NotFoundException("Category not found.");
                }
            }

            _mapper.Map(updateProductDto, product);
            _unitOfWork.Product.Update(product);
            await _unitOfWork.SaveChangesAsync(cancellationToken);

            _logger.LogInformation("Product updated successfully: {ProductId}", productId);

            return _mapper.Map<ResponseUpdateProductDto>(product);
        }


        public async Task<DetailProductDto> ToggleProductPlatformFeaturedAsync(Guid productId, ToggleProductPlatformFeaturedDto toggleDto, CancellationToken cancellationToken)
        {
            _logger.LogInformation("Toggling platform featured status for product: {ProductId}", productId);

            var product = await _unitOfWork.Product.GetByIdAsync(
                productId,
                cancellationToken);

            if (product == null)
            {
                _logger.LogWarning("Product not found: {ProductId}", productId);
                throw new NotFoundException("Product not found.");
            }

            if (product.IsPlatformFeatured != toggleDto.IsPlatformFeatured)
            {
                _mapper.Map(toggleDto, product);
            }

            _unitOfWork.Product.Update(product);
            await _unitOfWork.SaveChangesAsync(cancellationToken);

            _logger.LogInformation("Product platform featured status updated successfully: {ProductId}", productId);

            // Reload with navigation properties
            var updatedProduct = await _unitOfWork.Product.GetProductDetailsByIdAsync(
                product.Id,
                cancellationToken);

            return _mapper.Map<DetailProductDto>(updatedProduct);
        }

        public async Task<BulkDeleteVariantsResponseDto> DeleteProductVariantsAsync(
            Guid productId,
            BulkDeleteVariantsDto bulkDeleteVariantsDto,
            Guid storeId,
            CancellationToken cancellationToken)
        {
            _logger.LogInformation("Deleting variants for product: {ProductId}", productId);

            var product = await _unitOfWork.Product.GetProductWithVariantsByIdAsync(
                productId,
                cancellationToken);

            if (product == null)
            {
                _logger.LogWarning("Product not found: {ProductId}", productId);
                throw new NotFoundException("Product not found.");
            }

            // Verify ownership
            if (product.StoreId != storeId)
            {
                _logger.LogWarning("Store {StoreId} is not the owner of product {ProductId}", storeId, productId);
                throw new ForbiddenAccessException("You don't have permission to update this product.");
            }

            var deletedVariantIds = new List<Guid>();

            // Soft delete variants
            foreach (var variantId in bulkDeleteVariantsDto.VariantIds)
            {
                var variant = product.Variants.FirstOrDefault(v => v.Id == variantId && !v.IsDeleted);

                if (variant == null)
                {
                    _logger.LogWarning("Variant not found or already deleted: {VariantId} for product: {ProductId}", variantId, productId);
                    throw new NotFoundException($"Variant with ID {variantId} not found or already deleted for this product.");
                }

                // Soft delete the variant
                variant.IsDeleted = true;
                variant.IsActive = false;
                
                // Append timestamp to SKU to avoid conflicts
                if (!string.IsNullOrEmpty(variant.SKU))
                {
                    variant.SKU = $"{variant.SKU}_DELETED_{DateTime.UtcNow:yyyyMMddHHmmss}";
                }

                _unitOfWork.ProductVariant.Update(variant);
                deletedVariantIds.Add(variantId);

                _logger.LogInformation("Soft deleted variant: {VariantId} for product: {ProductId}", variantId, productId);
            }

            // Check if at least one variant remains active
            var remainingActiveVariants = product.Variants.Where(v => !v.IsDeleted && v.IsActive).ToList();
            
            if (!remainingActiveVariants.Any())
            {
                _logger.LogWarning("Cannot delete all variants. At least one variant must remain active for product: {ProductId}", productId);
                throw new InvalidOperationException("Cannot delete all variants. At least one variant must remain active.");
            }

            UpdateProductPricesAndStock(product);
            UpdateProductMainMedia(product);

            _unitOfWork.Product.Update(product);
            await _unitOfWork.SaveChangesAsync(cancellationToken);

            _logger.LogInformation("Variants deleted successfully for product: {ProductId}", productId);

            return new BulkDeleteVariantsResponseDto
            {
                ProductId = product.Id,
                DeletedVariantIds = deletedVariantIds,
                RemainingVariants = _mapper.Map<List<ResponseUpdateVariantItemDto>>(remainingActiveVariants),
                NewMinPrice = product.MinPrice ?? 0,
                NewMaxPrice = product.MaxPrice ?? 0,
                NewTotalStock = product.TotalStock
            };
        }

        public async Task DeleteProductAsync(Guid productId, Guid storeId, CancellationToken cancellationToken)
        {
            _logger.LogInformation("Deleting product: {ProductId} by store: {StoreId}", productId, storeId);

            var product = await _unitOfWork.Product.GetByIdAsync(
                productId,
                cancellationToken,
                p => p.Store);

            if (product == null)
            {
                _logger.LogWarning("Product not found: {ProductId}", productId);
                throw new NotFoundException("Product not found.");
            }

            // Verify ownership
            if (product.Store.Id != storeId)
            {
                _logger.LogWarning("Store {StoreId} is not the owner of product {ProductId}", storeId, productId);
                throw new ForbiddenAccessException("You don't have permission to delete this product.");
            }

            _unitOfWork.Product.Remove(product);
            await _unitOfWork.SaveChangesAsync(cancellationToken);

            _logger.LogInformation("Product deleted successfully: {ProductId}", productId);
        }

        public async Task<BulkUpdateProductAttributesResponseDto> UpdateProductAttributeAsync(Guid productId, BulkUpdateProductAttributesDto bulkUpdateProductAttributesDto, Guid storeId, CancellationToken cancellationToken)
        {
            _logger.LogInformation("Updating attributes for product: {ProductId}", productId);
            var product = await _unitOfWork.Product.GetProductWithAttributesByIdAsync(
                productId,
                cancellationToken);

            if (product == null)
            {
                _logger.LogWarning("Product not found: {ProductId}", productId);
                throw new NotFoundException("Product not found.");
            }

            // Verify ownership
            if (product.StoreId != storeId)
            {
                _logger.LogWarning("Store {StoreId} is not the owner of product {ProductId}", storeId, productId);
                throw new ForbiddenAccessException("You don't have permission to update this product.");
            }

            // Map of existing attributes for quick lookup
            var dbAttributesMap = product.ProductAttributes.ToDictionary(a => a.Id);
            foreach (var updateAttributeDto in bulkUpdateProductAttributesDto.Attributes)
            {
                if (dbAttributesMap.TryGetValue(updateAttributeDto.Id, out var attribute))
                {
                    if (!string.IsNullOrWhiteSpace(updateAttributeDto.Name) && !updateAttributeDto.Name.Trim().Equals(attribute.Name, StringComparison.OrdinalIgnoreCase))
                    {
                        // Check for duplicate attribute name
                        bool isDuplicateName = product.ProductAttributes
                            .Any(a => a.Id != updateAttributeDto.Id && a.Name.Equals(updateAttributeDto.Name, StringComparison.OrdinalIgnoreCase));

                        if (isDuplicateName)
                        {
                            _logger.LogWarning("Duplicate attribute name: {AttributeName} for product: {ProductId}", updateAttributeDto.Name, productId);
                            throw new ConflictException($"Attribute name '{updateAttributeDto.Name}' already exists for this product.");
                        }
                    }
                    _mapper.Map(updateAttributeDto, attribute);
                    _unitOfWork.ProductAttribute.Update(attribute);
                    _logger.LogInformation("Updated attribute: {AttributeId} for product: {ProductId}", attribute.Id, productId);
                }
                else
                {
                    _logger.LogWarning("Attribute not found: {AttributeId} for product: {ProductId}", updateAttributeDto.Id, productId);
                    throw new NotFoundException($"Attribute with ID {updateAttributeDto.Id} not found for this product.");
                }
            }

            await _unitOfWork.SaveChangesAsync(cancellationToken);
            _logger.LogInformation("Attributes updated successfully for product: {ProductId}", productId);
            return new BulkUpdateProductAttributesResponseDto
            {
                UpdatedAttributes = _mapper.Map<List<ResponseUpdateAttributeItemDto>>(product.ProductAttributes)
            };
        }

        public async Task<BulkUpdateProductAttributeValuesResponseDto> UpdateProductAttributeValueAsync(Guid productAttributeId, BulkUpdateProductAttributeValuesDto bulkUpdateProductAttributeValuesDto, Guid storeId, CancellationToken cancellationToken)
        {
            _logger.LogInformation("Updating attribute values for product attribute: {ProductAttributeId}", productAttributeId);
            var productAttribute = await _unitOfWork.ProductAttribute.GetProductAttributeWithValuesByIdAsync(
                productAttributeId,
                cancellationToken);

            if (productAttribute == null)
            {
                _logger.LogWarning("Product attribute not found: {ProductAttributeId}", productAttributeId);
                throw new NotFoundException("Product attribute not found.");
            }

            // Verify ownership
            if (productAttribute.Product.StoreId != storeId)
            {
                _logger.LogWarning("Store {StoreId} is not the owner of product attribute {ProductAttributeId}", storeId, productAttributeId);
                throw new ForbiddenAccessException("You don't have permission to update this product attribute.");
            }

            // Map of existing attribute values for quick lookup
            var dbAttributeValuesMap = productAttribute.ProductAttributeValues.ToDictionary(av => av.Id);
            foreach (var updateAttributeValueDto in bulkUpdateProductAttributeValuesDto.AttributeValues)
            {
                if (dbAttributeValuesMap.TryGetValue(updateAttributeValueDto.Id, out var attributeValue))
                {
                    if (!string.IsNullOrWhiteSpace(updateAttributeValueDto.Value) && !updateAttributeValueDto.Value.Trim().Equals(attributeValue.Value, StringComparison.OrdinalIgnoreCase))
                    {
                        // Check for duplicate attribute value
                        bool isDuplicateValue = productAttribute.ProductAttributeValues
                            .Any(av => av.Id != updateAttributeValueDto.Id && av.Value.Equals(updateAttributeValueDto.Value, StringComparison.OrdinalIgnoreCase));

                        if (isDuplicateValue)
                        {
                            _logger.LogWarning("Duplicate attribute value: {AttributeValue} for product attribute: {ProductAttributeId}", updateAttributeValueDto.Value, productAttributeId);
                            throw new ConflictException($"Attribute value '{updateAttributeValueDto.Value}' already exists for this attribute.");
                        }
                    }
                    _mapper.Map(updateAttributeValueDto, attributeValue);
                    _unitOfWork.ProductAttributeValue.Update(attributeValue);
                    _logger.LogInformation("Updated attribute value: {AttributeValueId} for product attribute: {ProductAttributeId}", attributeValue.Id, productAttributeId);
                }
                else
                {
                    _logger.LogWarning("Attribute value not found: {AttributeValueId} for product attribute: {ProductAttributeId}", updateAttributeValueDto.Id, productAttributeId);
                    throw new NotFoundException($"Attribute value with ID {updateAttributeValueDto.Id} not found for this product attribute.");
                }
            }

            UpdateProductVariantNames(productAttribute.Product);
            _unitOfWork.Product.Update(productAttribute.Product);

            await _unitOfWork.SaveChangesAsync(cancellationToken);
            _logger.LogInformation("Attribute values updated successfully for product attribute: {ProductAttributeId}", productAttributeId);
            return new BulkUpdateProductAttributeValuesResponseDto
            {
                UpdatedAttributeValues = _mapper.Map<List<ResponseUpdateAttributeValueItemDto>>(productAttribute.ProductAttributeValues)
            };
        }

        public async Task<BulkDeleteAttributeValuesResponseDto> DeleteAttributeValuesAndRegenerateVariantsAsync(
            Guid productId,
            DeleteAttributeValuesWithVariantsDto deleteAttributeValuesWithVariantsDto,
            Guid storeId,
            CancellationToken cancellationToken)
        {
            _logger.LogInformation("Deleting attribute values and regenerating variants for product: {ProductId}", productId);

            var product = await _unitOfWork.Product.GetProductWithAttributesByIdAsync(
                productId,
                cancellationToken);

            if (product == null)
            {
                _logger.LogWarning("Product not found: {ProductId}", productId);
                throw new NotFoundException("Product not found.");
            }

            // Verify ownership
            if (product.StoreId != storeId)
            {
                _logger.LogWarning("Store {StoreId} is not the owner of product {ProductId}", storeId, productId);
                throw new ForbiddenAccessException("You don't have permission to update this product.");
            }

            var deletedAttributeValueIds = new List<Guid>();
            var deletedAttributeIds = new List<Guid>();
            var attributesToDelete = new List<ProductAttribute>();

            // Delete attribute values
            foreach (var attributeValueId in deleteAttributeValuesWithVariantsDto.AttributeValueIds)
            {
                bool found = false;
                // Find the attribute containing this value
                foreach (var attribute in product.ProductAttributes)
                {
                    var attributeValue = attribute.ProductAttributeValues
                        .FirstOrDefault(av => av.Id == attributeValueId);

                    if (attributeValue != null)
                    {
                        attribute.ProductAttributeValues.Remove(attributeValue);
                        _unitOfWork.ProductAttributeValue.Remove(attributeValue);
                        deletedAttributeValueIds.Add(attributeValueId);
                        found = true;

                        _logger.LogInformation("Deleted attribute value: {AttributeValueId} from attribute: {AttributeId}", 
                            attributeValueId, attribute.Id);

                        // Check if this attribute now has 0 values
                        if (!attribute.ProductAttributeValues.Any())
                        {
                            if (!attributesToDelete.Contains(attribute))
                            {
                                attributesToDelete.Add(attribute);
                                _logger.LogInformation("Attribute {AttributeId} marked for deletion (no values remaining)", attribute.Id);
                            }
                        }
                        break;
                    }
                }

                if (!found)
                {
                    _logger.LogWarning("Attribute value not found: {ze} for product: {ProductId}", 
                        attributeValueId, productId);
                    throw new NotFoundException($"Attribute value with ID {attributeValueId} not found for this product.");
                }
            }

            // Delete attributes with no values
            foreach (var attribute in attributesToDelete)
            {
                product.ProductAttributes.Remove(attribute);
                _unitOfWork.ProductAttribute.Remove(attribute);
                deletedAttributeIds.Add(attribute.Id);
                _logger.LogInformation("Deleted attribute: {AttributeId} (no values remaining)", attribute.Id);
            }

            // Check if at least one attribute remains
            if (!product.ProductAttributes.Any())
            {
                _logger.LogWarning("Cannot delete all attributes. At least one attribute must remain for product: {ProductId}", productId);
                throw new InvalidOperationException("Cannot delete all attribute values. At least one attribute must remain for the product.");
            }

            // Regenerate variants with remaining attribute values
            RegenerateVariantsInternal(product, deleteAttributeValuesWithVariantsDto.ProductVariants);

            UpdateProductPricesAndStock(product);
            UpdateProductMainMedia(product);

            _unitOfWork.Product.Update(product);
            await _unitOfWork.SaveChangesAsync(cancellationToken);

            _logger.LogInformation("Attribute values deleted and variants regenerated successfully for product: {ProductId}", productId);

            return new BulkDeleteAttributeValuesResponseDto
            {
                ProductId = product.Id,
                DeletedAttributeValueIds = deletedAttributeValueIds,
                DeletedAttributeIds = deletedAttributeIds,
                RemainingAttributes = _mapper.Map<List<ResponseUpdateAttributeItemDto>>(product.ProductAttributes),
                RegeneratedVariants = _mapper.Map<List<ResponseUpdateVariantItemDto>>(product.Variants.Where(v => !v.IsDeleted && v.IsActive)),
                NewMinPrice = product.MinPrice ?? 0,
                NewMaxPrice = product.MaxPrice ?? 0,
                NewTotalStock = product.TotalStock
            };
        }

        public async Task<BulkDeleteAttributesResponseDto> DeleteAttributesAndRegenerateVariantsAsync(
            Guid productId,
            DeleteAttributesWithVariantsDto deleteAttributesWithVariantsDto,
            Guid storeId,
            CancellationToken cancellationToken)
        {
            _logger.LogInformation("Deleting attributes and regenerating variants for product: {ProductId}", productId);

            var product = await _unitOfWork.Product.GetProductWithAttributesByIdAsync(
                productId,
                cancellationToken);

            if (product == null)
            {
                _logger.LogWarning("Product not found: {ProductId}", productId);
                throw new NotFoundException("Product not found.");
            }

            // Verify ownership
            if (product.StoreId != storeId)
            {
                _logger.LogWarning("Store {StoreId} is not the owner of product {ProductId}", storeId, productId);
                throw new ForbiddenAccessException("You don't have permission to update this product.");
            }

            var deletedAttributeIds = new List<Guid>();

            // Delete attributes
            foreach (var attributeId in deleteAttributesWithVariantsDto.AttributeIds)
            {
                var attribute = product.ProductAttributes.FirstOrDefault(a => a.Id == attributeId);

                if (attribute == null)
                {
                    _logger.LogWarning("Attribute not found: {AttributeId} for product: {ProductId}", attributeId, productId);
                    throw new NotFoundException($"Attribute with ID {attributeId} not found for this product.");
                }

                product.ProductAttributes.Remove(attribute);
                _unitOfWork.ProductAttribute.Remove(attribute);
                deletedAttributeIds.Add(attributeId);

                _logger.LogInformation("Deleted attribute: {AttributeId} from product: {ProductId}", attributeId, productId);
            }

            // Check if at least one attribute remains
            if (!product.ProductAttributes.Any())
            {
                _logger.LogWarning("Cannot delete all attributes. At least one attribute must remain for product: {ProductId}", productId);
                throw new InvalidOperationException("Cannot delete all attributes. At least one attribute must remain for the product.");
            }

            // Regenerate variants with remaining attributes
            RegenerateVariantsInternal(product, deleteAttributesWithVariantsDto.ProductVariants);

            UpdateProductPricesAndStock(product);
            UpdateProductMainMedia(product);

            _unitOfWork.Product.Update(product);
            await _unitOfWork.SaveChangesAsync(cancellationToken);

            _logger.LogInformation("Attributes deleted and variants regenerated successfully for product: {ProductId}", productId);

            return new BulkDeleteAttributesResponseDto
            {
                ProductId = product.Id,
                DeletedAttributeIds = deletedAttributeIds,
                RemainingAttributes = _mapper.Map<List<ResponseUpdateAttributeItemDto>>(product.ProductAttributes),
                RegeneratedVariants = _mapper.Map<List<ResponseUpdateVariantItemDto>>(product.Variants.Where(v => !v.IsDeleted && v.IsActive)),
                NewMinPrice = product.MinPrice ?? 0,
                NewMaxPrice = product.MaxPrice ?? 0,
                NewTotalStock = product.TotalStock
            };
        }

        public async Task<BulkUpdateProductVariantsResponseDto> UpdateProductVariantAsync(Guid productId, BulkUpdateProductVariantsDto bulkUpdateProductVariantsDto, Guid storeId, CancellationToken cancellationToken)
        {
            _logger.LogInformation("Updating variants for product: {ProductId}", productId);
            var product = await _unitOfWork.Product.GetProductWithVariantsByIdAsync(
                productId,
                cancellationToken);

            if (product == null)
            {
                _logger.LogWarning("Product not found: {ProductId}", productId);
                throw new NotFoundException("Product not found.");
            }

            // Verify ownership
            if (product.StoreId != storeId)
            {
                _logger.LogWarning("Store {StoreId} is not the owner of product {ProductId}", storeId, productId);
                throw new ForbiddenAccessException("You don't have permission to update this product.");
            }

            // Map of existing variants for quick lookup
            var dbVariantsMap = product.Variants.ToDictionary(v => v.Id);

            foreach (var updateVariantDto in bulkUpdateProductVariantsDto.Variants)
            {
                if (dbVariantsMap.TryGetValue(updateVariantDto.Id, out var variant))
                {
                    _mapper.Map(updateVariantDto, variant);
                    _unitOfWork.ProductVariant.Update(variant);
                    _logger.LogInformation("Updated variant: {VariantId} for product: {ProductId}", variant.Id, productId);
                }
                else
                {
                    _logger.LogWarning("Variant not found: {VariantId} for product: {ProductId}", updateVariantDto.Id, productId);
                    throw new NotFoundException($"Variant with ID {updateVariantDto.Id} not found for this product.");
                }
            }

            UpdateProductPricesAndStock(product);
            _unitOfWork.Product.Update(product);

            await _unitOfWork.SaveChangesAsync(cancellationToken);
            _logger.LogInformation("Variants updated successfully for product: {ProductId}", productId);
            
            return new BulkUpdateProductVariantsResponseDto
            {
                ProductId = product.Id,
                NewMinPrice = product.MinPrice ?? 0,
                NewMaxPrice = product.MaxPrice ?? 0,
                NewTotalStock = product.TotalStock,
                UpdatedVariants = _mapper.Map<List<ResponseUpdateVariantItemDto>>(product.Variants)
            };
        }

        public async Task<BulkUpdateProductMediaResponseDto> UpdateProductVariantMediaAsync(Guid productId, BulkUpdateProductMediaRequestDto bulkUpdateProductMediaRequestDto, Guid storeId, CancellationToken cancellationToken)
        {
            _logger.LogInformation("Updating variant media for product: {ProductId}", productId);
            var product = await _unitOfWork.Product.GetProductWithVariantsAndMediaByIdAsync(
                productId,
                cancellationToken);

            if (product == null)
            {
                _logger.LogWarning("Product not found: {ProductId}", productId);
                throw new NotFoundException("Product not found.");
            }

            // Verify ownership
            if (product.StoreId != storeId)
            {
                _logger.LogWarning("Store {StoreId} is not the owner of product {ProductId}", storeId, productId);
                throw new ForbiddenAccessException("You don't have permission to update this product.");
            }

            var responseWrappers = new List<ResponseUpdateVariantMediaWrapperDto>();

            foreach (var variantMediaWrapper in bulkUpdateProductMediaRequestDto.ProductVariantMedias)
            {
                var variant = product.Variants.FirstOrDefault(v => v.Id == variantMediaWrapper.ProductVariantId);
                
                if (variant == null)
                {
                    _logger.LogWarning("Variant not found: {VariantId} for product: {ProductId}", variantMediaWrapper.ProductVariantId, productId);
                    throw new NotFoundException($"Variant with ID {variantMediaWrapper.ProductVariantId} not found for this product.");
                }

                // Get all media IDs from DTO
                var dtoMediaIds = variantMediaWrapper.VariantMedias
                    .Where(m => m.Id.HasValue)
                    .Select(m => m.Id!.Value)
                    .ToHashSet();

                // Delete media items that exist in database but not in DTO
                var mediaToDelete = variant.Media
                    .Where(m => !dtoMediaIds.Contains(m.Id))
                    .ToList();

                foreach (var mediaToRemove in mediaToDelete)
                {
                    variant.Media.Remove(mediaToRemove);
                    _unitOfWork.ProductVariantMedia.Remove(mediaToRemove);
                    _logger.LogInformation("Deleted media item: {MediaId} for variant: {VariantId}", mediaToRemove.Id, variant.Id);
                }

                var updatedMediaItems = new List<ProductVariantMedia>();

                foreach (var mediaItemDto in variantMediaWrapper.VariantMedias)
                {
                    if (mediaItemDto.Id.HasValue)
                    {
                        // Update existing media item
                        var existingMedia = variant.Media.FirstOrDefault(m => m.Id == mediaItemDto.Id.Value);
                        
                        if (existingMedia == null)
                        {
                            _logger.LogWarning("Media item not found: {MediaId} for variant: {VariantId}", mediaItemDto.Id.Value, variant.Id);
                            throw new NotFoundException($"Media item with ID {mediaItemDto.Id.Value} not found for this variant.");
                        }

                        _mapper.Map(mediaItemDto, existingMedia);
                        _unitOfWork.ProductVariantMedia.Update(existingMedia);
                        updatedMediaItems.Add(existingMedia);
                        _logger.LogInformation("Updated media item: {MediaId} for variant: {VariantId}", existingMedia.Id, variant.Id);
                    }
                    else
                    {
                        // Add new media item
                        var newMedia = _mapper.Map<ProductVariantMedia>(mediaItemDto);
                        newMedia.ProductVariantId = variant.Id;
                        variant.Media.Add(newMedia);
                        await _unitOfWork.ProductVariantMedia.AddAsync(newMedia, cancellationToken);
                        updatedMediaItems.Add(newMedia);
                        _logger.LogInformation("Added new media item for variant: {VariantId}", variant.Id);
                    }
                }

                // Ensure only one main media per variant
                EnsureSingleMainMediaPerVariant(variant);

                responseWrappers.Add(new ResponseUpdateVariantMediaWrapperDto
                {
                    ProductVariantId = variant.Id,
                    VariantMedias = _mapper.Map<List<ResponseUpdateVariantMediaItemDto>>(updatedMediaItems)
                });
            }

            UpdateProductMainMedia(product);
            _unitOfWork.Product.Update(product);

            await _unitOfWork.SaveChangesAsync(cancellationToken);
            _logger.LogInformation("Variant media updated successfully for product: {ProductId}", productId);
            
            return new BulkUpdateProductMediaResponseDto
            {
                ProductVariantMedias = responseWrappers
            };
        }

        public Task DeleteProductAsync(Guid productId, CancellationToken cancellationToken)
        {
            throw new NotImplementedException();
        }

        private void RegenerateVariantsInternal(
            Product product,
            List<CreateProductVariantDto> newVariantDtos)
        {
            _logger.LogInformation("Regenerating variants for product: {ProductId}", product.Id);

            // Build valueIdMap from all product attributes
            var valueIdMap = new Dictionary<string, Guid>();
            foreach (var attribute in product.ProductAttributes)
            {
                foreach (var attributeValue in attribute.ProductAttributeValues)
                {
                    string key = $"{attribute.Name.Trim()}_{attributeValue.Value.Trim()}";
                    valueIdMap[key] = attributeValue.Id;
                }
            }

            // Soft delete all existing variants
            foreach (var existingVariant in product.Variants.Where(v => !v.IsDeleted).ToList())
            {
                existingVariant.IsDeleted = true;
                existingVariant.IsActive = false;
                // Append timestamp to SKU to avoid conflicts
                if (!string.IsNullOrEmpty(existingVariant.SKU))
                {
                    existingVariant.SKU = $"{existingVariant.SKU}_DELETED_{DateTime.UtcNow:yyyyMMddHHmmss}";
                }
                _unitOfWork.ProductVariant.Update(existingVariant);
                _logger.LogInformation("Soft deleted variant: {VariantId}", existingVariant.Id);
            }

            // Create new variants from DTO
            foreach (var createVariantDto in newVariantDtos)
            {
                var productVariant = _mapper.Map<ProductVariant>(createVariantDto);
                _logger.LogInformation("Creating new variant for product: {ProductId}", product.Id);

                // Map AttributeValues
                foreach (var attributeValueDto in createVariantDto.AttributeSelections)
                {
                    string key = $"{attributeValueDto.AttributeName.Trim()}_{attributeValueDto.Value.Trim()}";
                    if (valueIdMap.TryGetValue(key, out Guid attributeValueId))
                    {
                        // Create ProductVariantAttributeValue
                        var variantAttributeValue = new ProductVariantAttributeValue
                        {
                            ProductVariantId = productVariant.Id,
                            ProductAttributeValueId = attributeValueId
                        };
                        productVariant.VariantAttributeValues.Add(variantAttributeValue);
                        _logger.LogInformation("Mapped attribute value: {AttributeValue} to new variant {VariantId}", 
                            attributeValueDto.Value, productVariant.Id);
                    }
                    else
                    {
                        _logger.LogWarning("Attribute value not found for variant mapping: {AttributeName}_{Value}", 
                            attributeValueDto.AttributeName, attributeValueDto.Value);
                        throw new NotFoundException($"Attribute value '{attributeValueDto.Value}' for attribute '{attributeValueDto.AttributeName}' not found.");
                    }
                }

                // Create Media
                foreach (var createMediaDto in createVariantDto.Media)
                {
                    var variantMedia = _mapper.Map<ProductVariantMedia>(createMediaDto);
                    productVariant.Media.Add(variantMedia);
                    _logger.LogInformation("Added media to new variant {VariantId}", productVariant.Id);
                }

                EnsureSingleMainMediaPerVariant(productVariant);
                product.Variants.Add(productVariant);
            }

            UpdateProductVariantNames(product);
            _logger.LogInformation("Variants regenerated successfully for product: {ProductId}", product.Id);
        }

        private void UpdateProductPricesAndStock(Product product)
        {
            if (product.Variants == null || !product.Variants.Any())
            {
                product.MinPrice = null;
                product.MaxPrice = null;
                product.TotalStock = 0;
                return;
            }

            var activeVariants = product.Variants.Where(v => v.IsActive && !v.IsDeleted).ToList();

            if (!activeVariants.Any())
            {
                product.MinPrice = null;
                product.MaxPrice = null;
                product.TotalStock = 0;
                return;
            }

            product.MinPrice = activeVariants.Min(v => v.Price);
            product.MaxPrice = activeVariants.Max(v => v.Price);
            product.TotalStock = activeVariants.Sum(v => v.StockQuantity);
        }

        private void UpdateProductMainMedia(Product product)
        {
            if (product.Variants == null || !product.Variants.Any())
            {
                product.MainMediaPublicId = null;
                return;
            }

            var mainMedia = product.Variants
                .Where(v => v.IsActive && !v.IsDeleted)
                .SelectMany(v => v.Media)
                .OrderBy(m => m.DisplayOrder)
                .FirstOrDefault(m => m.IsMain);

            if (mainMedia == null)
            {
                mainMedia = product.Variants
                    .Where(v => v.IsActive && !v.IsDeleted)
                    .SelectMany(v => v.Media)
                    .OrderBy(m => m.DisplayOrder)
                    .FirstOrDefault();
            }

            product.MainMediaPublicId = mainMedia?.MediaPublicId;
        }

        private void UpdateProductVariantNames(Product product)
        {
            if (product.Variants == null || !product.Variants.Any())
            {
                return;
            }

            foreach (var variant in product.Variants)
            {
                if (variant.VariantAttributeValues == null || !variant.VariantAttributeValues.Any())
                {
                    variant.Name = product.Name;
                    continue;
                }

                // Get attribute values ordered by the attribute's display order
                var attributeValues = variant.VariantAttributeValues
                    .OrderBy(vav => vav.ProductAttributeValue.ProductAttribute.DisplayOrder)
                    .Select(vav => vav.ProductAttributeValue.Value)
                    .ToList();

                // Create variant name: Product Name - Attribute Value 1 / Attribute Value 2
                var variantAttributesString = string.Join(" / ", attributeValues);
                variant.Name = $"{product.Name} - {variantAttributesString}";
            }
        }

        private void EnsureSingleMainMediaPerVariant(ProductVariant variant)
        {
            if (variant.Media == null || !variant.Media.Any())
            {
                return;
            }

            // Get all media ordered by display order
            var orderedMedia = variant.Media.OrderBy(m => m.DisplayOrder).ToList();

            // Get all media marked as main
            var mainMediaItems = orderedMedia.Where(m => m.IsMain).ToList();

            if (mainMediaItems.Count > 1)
            {
                // Multiple main media found - keep only the first one based on display order
                var firstMain = mainMediaItems.First();
                foreach (var media in mainMediaItems.Where(m => m.Id != firstMain.Id))
                {
                    media.IsMain = false;
                    _unitOfWork.ProductVariantMedia.Update(media);
                }
                _logger.LogInformation("Ensured single main media for variant: {VariantId}, kept media: {MediaId}", variant.Id, firstMain.Id);
            }
            else if (!mainMediaItems.Any())
            {
                // No main media found - set the first one as main
                var firstMedia = orderedMedia.First();
                firstMedia.IsMain = true;
                _unitOfWork.ProductVariantMedia.Update(firstMedia);
                _logger.LogInformation("Set first media as main for variant: {VariantId}, media: {MediaId}", variant.Id, firstMedia.Id);
            }
        }
    }
}
