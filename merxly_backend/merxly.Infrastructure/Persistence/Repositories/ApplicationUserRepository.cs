using merxly.Application.Interfaces.Repositories;
using merxly.Domain.Entities;
using merxly.Domain.Enums;
using Microsoft.EntityFrameworkCore;

namespace merxly.Infrastructure.Persistence.Repositories
{
    public class ApplicationUserRepository : GenericRepository<ApplicationUser, string>, IApplicationUserRepository
    {
        private readonly ApplicationDbContext _context;

        public ApplicationUserRepository(ApplicationDbContext db) : base(db)
        {
            _context = db;
        }

        public async Task<int> GetTotalOrdersCountAsync(string userId, CancellationToken cancellationToken = default)
        {
            return await _context.Orders
                .Where(o => o.UserId == userId)
                .CountAsync(cancellationToken);
        }

        public async Task<int> GetPendingOrdersCountAsync(string userId, CancellationToken cancellationToken = default)
        {
            return await _context.SubOrders
                .Where(so => so.Order.UserId == userId &&
                             so.Status != OrderStatus.Completed &&
                             so.Status != OrderStatus.Cancelled)
                .CountAsync(cancellationToken);
        }

        public async Task<int> GetCompletedOrdersCountAsync(string userId, CancellationToken cancellationToken = default)
        {
            return await _context.SubOrders
                .Where(so => so.Order.UserId == userId &&
                             so.Status == OrderStatus.Completed)
                .CountAsync(cancellationToken);
        }
    }
}
