using merxly.Application.DTOs.Common;
using merxly.Application.DTOs.Product;
using merxly.Domain.Entities;

namespace merxly.Application.Interfaces.Repositories
{
    public interface IProductRepository : IGenericRepository<Product, Guid>
    {
        Task<Product?> GetProductDetailsByIdAsync(Guid productId, CancellationToken cancellationToken = default);
        Task<PaginatedResultDto<Product>> GetPaginatedProductsWithQueryParametersAsync(ProductQueryParameters queryParameters, CancellationToken cancellationToken = default);
        Task<List<Product>> GetTop10FeaturedProductsAsync(Guid? categoryId, CancellationToken cancellationToken = default);

        // Store
        Task<PaginatedResultDto<Product>> GetPaginatedProductsForStoreAsync(Guid storeId, ProductQueryParametersForStore queryParameters, CancellationToken cancellationToken = default);
        Task<Product?> GetProductWithVariantsByIdAsync(Guid productId, CancellationToken cancellationToken = default);
        Task<Product?> GetProductWithAttributesByIdAsync(Guid productId, CancellationToken cancellationToken = default);
        Task<Product?> GetProductWithVariantsAndMediaByIdAsync(Guid productId, CancellationToken cancellationToken = default);
        Task<Product?> GetProductDetailByIdForStoreAsync(Guid productId, CancellationToken cancellationToken = default);
    }
}
