using merxly.Domain.Entities;

namespace merxly.Application.Interfaces.Repositories
{
    public interface IProductAttributeRepository : IGenericRepository<ProductAttribute, Guid>
    {
        Task<ProductAttribute?> GetProductAttributeWithValuesByIdAsync(Guid productAttributeId, CancellationToken cancellationToken = default);
    }
}
