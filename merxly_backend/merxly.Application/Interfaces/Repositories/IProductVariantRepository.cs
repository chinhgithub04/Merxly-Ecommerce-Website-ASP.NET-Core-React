using merxly.Domain.Entities;

namespace merxly.Application.Interfaces.Repositories
{
    public interface IProductVariantRepository : IGenericRepository<ProductVariant, Guid>
    {
        Task<string?> GetMainMediaIdByProductVariantIdAsync(Guid productVariantId, CancellationToken cancellationToken = default);
    }
}
