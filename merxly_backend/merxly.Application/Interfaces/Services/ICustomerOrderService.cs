using merxly.Application.DTOs.Common;
using merxly.Application.DTOs.CustomerOrders;

namespace merxly.Application.Interfaces.Services
{
    public interface ICustomerOrderService
    {
        Task<PaginatedResultDto<CustomerSubOrderDto>> GetCustomerOrdersAsync(
            string customerId,
            CustomerSubOrderFilterDto filter,
            CancellationToken cancellationToken = default);

        Task<CustomerSubOrderDetailDto> GetCustomerOrderByIdAsync(
            string customerId,
            Guid subOrderId,
            CancellationToken cancellationToken = default);

        Task<CustomerSubOrderDetailDto> UpdateCustomerSubOrderStatusAsync(
            string customerId,
            Guid subOrderId,
            UpdateCustomerSubOrderStatusDto dto,
            CancellationToken cancellationToken = default);
    }
}
