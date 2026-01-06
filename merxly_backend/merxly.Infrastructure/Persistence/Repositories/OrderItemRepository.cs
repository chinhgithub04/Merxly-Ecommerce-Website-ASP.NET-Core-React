using merxly.Application.Interfaces.Repositories;
using merxly.Domain.Entities;
using merxly.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace merxly.Infrastructure.Persistence.Repositories
{
    public class OrderItemRepository : GenericRepository<OrderItem, Guid>, IOrderItemRepository
    {
        public OrderItemRepository(ApplicationDbContext db) : base(db)
        {
        }

        public async Task<List<OrderItem>> GetByOrderIdAsync(Guid orderId, CancellationToken cancellationToken = default)
        {
            return await _dbSet
                .Include(oi => oi.SubOrder)
                    .ThenInclude(so => so.Order)
                .Where(oi => oi.SubOrder.OrderId == orderId)
                .Include(oi => oi.ProductVariant)
                .Include(oi => oi.Store)
                .ToListAsync(cancellationToken);
        }

        public async Task AddRangeAsync(List<OrderItem> orderItems, CancellationToken cancellationToken = default)
        {
            await _dbSet.AddRangeAsync(orderItems, cancellationToken);
        }

        public async Task<OrderItem?> GetByIdWithDetailsAsync(Guid orderItemId, CancellationToken cancellationToken = default)
        {
            return await _dbSet
                .AsNoTracking()
                .Include(oi => oi.SubOrder)
                    .ThenInclude(so => so.Order)
                .Include(oi => oi.ProductVariant)
                    .ThenInclude(pv => pv.Product)
                .Include(oi => oi.Store)
                .FirstOrDefaultAsync(oi => oi.Id == orderItemId, cancellationToken);
        }
    }
}
