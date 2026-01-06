using merxly.Domain.Entities;

namespace merxly.Application.Interfaces.Repositories
{
    public interface IOrderItemRepository : IGenericRepository<OrderItem, Guid>
    {
        Task<List<OrderItem>> GetByOrderIdAsync(Guid orderId, CancellationToken cancellationToken = default);
        Task AddRangeAsync(List<OrderItem> orderItems, CancellationToken cancellationToken = default);
        Task<OrderItem?> GetByIdWithDetailsAsync(Guid orderItemId, CancellationToken cancellationToken = default);
    }
}
