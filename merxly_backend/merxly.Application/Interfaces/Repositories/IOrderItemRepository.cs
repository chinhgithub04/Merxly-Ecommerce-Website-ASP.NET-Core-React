using merxly.Domain.Entities;

namespace merxly.Application.Interfaces.Repositories
{
    public interface IOrderItemRepository : IGenericRepository<OrderItem, Guid>
    {
    }
}
