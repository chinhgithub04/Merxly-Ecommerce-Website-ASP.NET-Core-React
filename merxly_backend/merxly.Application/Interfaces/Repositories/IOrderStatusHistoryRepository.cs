using merxly.Domain.Entities;

namespace merxly.Application.Interfaces.Repositories
{
    public interface IOrderStatusHistoryRepository : IGenericRepository<OrderStatusHistory, Guid>
    {
    }
}
