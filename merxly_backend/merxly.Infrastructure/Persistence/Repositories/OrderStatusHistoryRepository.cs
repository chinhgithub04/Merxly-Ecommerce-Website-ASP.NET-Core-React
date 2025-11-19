using merxly.Application.Interfaces.Repositories;
using merxly.Domain.Entities;

namespace merxly.Infrastructure.Persistence.Repositories
{
    public class OrderStatusHistoryRepository : GenericRepository<OrderStatusHistory, Guid>, IOrderStatusHistoryRepository
    {
        public OrderStatusHistoryRepository(ApplicationDbContext db) : base(db)
        {
        }
    }
}
