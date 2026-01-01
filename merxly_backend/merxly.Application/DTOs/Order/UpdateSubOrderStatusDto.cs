using merxly.Domain.Enums;

namespace merxly.Application.DTOs.Order
{
    public record UpdateSubOrderStatusDto
    {
        public OrderStatus Status { get; init; }
        public string? Notes { get; init; }
        public string? Carrier { get; init; }
        public string? TrackingNumber { get; init; }
    }
}
