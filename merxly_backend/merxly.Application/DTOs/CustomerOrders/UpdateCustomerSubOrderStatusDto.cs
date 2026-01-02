using merxly.Domain.Enums;

namespace merxly.Application.DTOs.CustomerOrders
{
    public record UpdateCustomerSubOrderStatusDto
    {
        public required OrderStatus Status { get; init; }
        public string? Notes { get; init; }
    }
}
