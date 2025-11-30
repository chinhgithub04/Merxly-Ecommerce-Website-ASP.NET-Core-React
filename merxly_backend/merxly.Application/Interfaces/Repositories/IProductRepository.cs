using merxly.Application.DTOs.Common;
using merxly.Application.DTOs.Product;
using merxly.Domain.Entities;

namespace merxly.Application.Interfaces.Repositories
{
    public interface IProductRepository : IGenericRepository<Product, Guid>
    {
        Task<Product?> GetProductDetailsByIdAsync(Guid productId, CancellationToken cancellationToken = default);
        Task<PaginatedResultDto<Product>> GetPaginatedProductsWithQueryParametersAsync(ProductQueryParameters queryParameters, CancellationToken cancellationToken = default);
    }
}
