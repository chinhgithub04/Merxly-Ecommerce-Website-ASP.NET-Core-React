using merxly.Domain.Entities;

namespace merxly.Application.Interfaces.Repositories
{
    public interface ICategoryRepository : IGenericRepository<Category, Guid>
    {
    }
}
