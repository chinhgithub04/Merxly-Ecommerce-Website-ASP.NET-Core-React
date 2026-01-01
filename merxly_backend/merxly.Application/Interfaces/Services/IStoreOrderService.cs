using merxly.Application.DTOs.Common;
using merxly.Application.DTOs.Order;

namespace merxly.Application.Interfaces.Services
{
    public interface IStoreOrderService
    {
        Task<PaginatedResultDto<StoreSubOrderDto>> GetStoreOrdersAsync(Guid storeId, StoreSubOrderFilterDto filter, CancellationToken cancellationToken = default);
        Task<StoreSubOrderDetailDto> GetStoreOrderByIdAsync(Guid storeId, Guid subOrderId, CancellationToken cancellationToken = default);
        Task<StoreSubOrderDetailDto> UpdateSubOrderStatusAsync(Guid storeId, Guid subOrderId, UpdateSubOrderStatusDto dto, CancellationToken cancellationToken = default);
    }
}
