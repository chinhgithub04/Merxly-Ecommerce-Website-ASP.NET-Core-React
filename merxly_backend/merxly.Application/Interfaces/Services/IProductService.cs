using merxly.Application.DTOs.Common;
using merxly.Application.DTOs.Product;
using merxly.Application.DTOs.Product.Update;
using merxly.Application.DTOs.ProductAttribute;
using merxly.Application.DTOs.ProductAttribute.Update;
using merxly.Application.DTOs.ProductAttributeValue;
using merxly.Application.DTOs.ProductAttributeValue.Delete;
using merxly.Application.DTOs.ProductAttributeValue.Update;
using merxly.Application.DTOs.ProductVariant.Delete;
using merxly.Application.DTOs.ProductVariant.Update;
using merxly.Application.DTOs.ProductVariantMedia.Update;

namespace merxly.Application.Interfaces.Services
{
    public interface IProductService
    {
        // Customer
        Task<PaginatedResultDto<ProductDto>> GetProductsAsync(ProductQueryParameters parameters, CancellationToken cancellationToken);
        Task<DetailProductDto> GetProductByIdAsync(Guid productId, CancellationToken cancellationToken);
        
        // Store
        Task<StoreDetailProductDto> CreateProductAsync(CreateProductDto createProductDto, Guid storeId, CancellationToken cancellationToken);
        Task<AddAttributesWithVariantsResponseDto> AddAttributesAndRegenerateVariantsAsync(Guid productId, AddAttributeWithVariantsDto addAttributeWithVariantsDto, Guid storeId, CancellationToken cancellationToken);
        Task<AddAttributeValuesWithVariantsResponseDto> AddAttributeValuesAndRegenerateVariantsAsync(Guid productId, AddAttributeValuesAndVariants addAttributeValuesAndVariants, Guid storeId, CancellationToken cancellationToken);
        Task<ResponseUpdateProductDto> UpdateProductAsync(Guid productId, UpdateProductDto updateProductDto, Guid storeId, CancellationToken cancellationToken);
        Task<BulkUpdateProductAttributesResponseDto> UpdateProductAttributeAsync(Guid productId, BulkUpdateProductAttributesDto bulkUpdateProductAttributesDto, Guid storeId, CancellationToken cancellationToken);
        Task<BulkUpdateProductAttributeValuesResponseDto> UpdateProductAttributeValueAsync(Guid productAttributeId, BulkUpdateProductAttributeValuesDto bulkUpdateProductAttributeValuesDto, Guid storeId, CancellationToken cancellationToken);
        Task<BulkDeleteAttributeValuesResponseDto> DeleteAttributeValuesAndRegenerateVariantsAsync(Guid productId, DeleteAttributeValuesWithVariantsDto deleteAttributeValuesWithVariantsDto, Guid storeId, CancellationToken cancellationToken);
        Task<BulkUpdateProductVariantsResponseDto> UpdateProductVariantAsync(Guid productId, BulkUpdateProductVariantsDto bulkUpdateProductVariantsDto, Guid storeId,CancellationToken cancellationToken);
        Task<BulkUpdateProductMediaResponseDto> UpdateProductVariantMediaAsync(Guid productId, BulkUpdateProductMediaRequestDto bulkUpdateProductMediaRequestDto, Guid storeId, CancellationToken cancellationToken);
        Task<BulkDeleteVariantsResponseDto> DeleteProductVariantsAsync(Guid productId, BulkDeleteVariantsDto bulkDeleteVariantsDto, Guid storeId, CancellationToken cancellationToken);
        Task DeleteProductAsync(Guid productId, CancellationToken cancellationToken);

        // Admin
        Task<DetailProductDto> ToggleProductPlatformFeaturedAsync(Guid productId, ToggleProductPlatformFeaturedDto toggleDto, CancellationToken cancellationToken);

    }
}
