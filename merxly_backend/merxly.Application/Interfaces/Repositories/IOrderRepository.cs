using merxly.Domain.Entities;

namespace merxly.Application.Interfaces.Repositories
{
    public interface IOrderRepository : IGenericRepository<Order, Guid>
    {
    }
}
