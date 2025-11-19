using merxly.Domain.Entities;

namespace merxly.Application.Interfaces.Repositories
{
    public interface IProductRepository : IGenericRepository<Product, Guid>
    {
    }
}
