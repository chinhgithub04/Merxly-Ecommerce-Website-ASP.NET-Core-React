using merxly.Application.DTOs.Common;
using merxly.Application.DTOs.Order;
using merxly.Domain.Entities;

namespace merxly.Application.Interfaces.Repositories
{
    public interface ISubOrderRepository : IGenericRepository<SubOrder, Guid>
    {
        Task<SubOrder?> GetByIdWithDetailsAsync(Guid id, CancellationToken cancellationToken = default);
        Task<SubOrder?> GetBySubOrderNumberAsync(string subOrderNumber, CancellationToken cancellationToken = default);
        Task<List<SubOrder>> GetByOrderIdAsync(Guid orderId, CancellationToken cancellationToken = default);
        Task<List<SubOrder>> GetByStoreIdAsync(Guid storeId, CancellationToken cancellationToken = default);
        Task<PaginatedResultDto<SubOrder>> GetStoreOrdersAsync(Guid storeId, StoreSubOrderFilterDto filter, CancellationToken cancellationToken = default);
        Task AddRangeAsync(List<SubOrder> subOrders, CancellationToken cancellationToken = default);
    }
}
