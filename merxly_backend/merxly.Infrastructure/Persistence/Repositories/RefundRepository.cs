using merxly.Application.Interfaces.Repositories;
using merxly.Domain.Entities;

namespace merxly.Infrastructure.Persistence.Repositories
{
    public class RefundRepository : GenericRepository<Refund, Guid>, IRefundRepository
    {
        public RefundRepository(ApplicationDbContext db) : base(db)
        {
        }
    }
}
