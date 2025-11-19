using merxly.Application.Interfaces.Repositories;
using merxly.Domain.Entities;

namespace merxly.Infrastructure.Persistence.Repositories
{
    public class OrderRepository : GenericRepository<Order, Guid>, IOrderRepository
    {
        public OrderRepository(ApplicationDbContext db) : base(db)
        {
        }
    }
}
