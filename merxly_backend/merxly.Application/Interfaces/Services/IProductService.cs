using merxly.Application.DTOs.Common;
using merxly.Application.DTOs.Product;

namespace merxly.Application.Interfaces.Services
{
    public interface IProductService
    {
        Task<PaginatedResultDto<ProductDto>> GetProductsAsync(ProductQueryParameters parameters, CancellationToken cancellationToken);
        Task<DetailProductDto> GetProductByIdAsync(Guid productId, CancellationToken cancellationToken);
        Task<DetailProductDto> CreateProductAsync(CreateProductDto createProductDto, Guid storeId, CancellationToken cancellationToken);
        Task<DetailProductDto> UpdateProductAsync(Guid productId, UpdateProductDto updateProductDto, Guid storeId, CancellationToken cancellationToken);
        Task<DetailProductDto> ToggleProductPlatformFeaturedAsync(Guid productId, ToggleProductPlatformFeaturedDto toggleDto, CancellationToken cancellationToken);
        Task DeleteProductAsync(Guid productId, Guid storeId, CancellationToken cancellationToken);
    }
}
