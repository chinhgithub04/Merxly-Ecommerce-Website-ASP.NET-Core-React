using merxly.Domain.Enums;

namespace merxly.Application.DTOs.Order
{
    public record StoreSubOrderDetailDto
    {
        public Guid Id { get; init; }
        public required string SubOrderNumber { get; init; }
        public OrderStatus Status { get; init; }
        public decimal SubTotal { get; init; }
        public decimal? Tax { get; init; }
        public decimal? ShippingCost { get; init; }
        public decimal TotalAmount { get; init; }
        public string? Carrier { get; init; }
        public string? TrackingNumber { get; init; }
        public string? Notes { get; init; }

        //Customer Info
        public string CustomerFullName { get; init; }
        public string CustomerEmail { get; init; }

        public string CustomerFullAddress { get; init; }
        public string CustomerPostalCode { get; init; }
        public string? CustomerPhoneNumber { get; init; }

        public DateTime CreatedAt { get; init; }
        public DateTime? UpdatedAt { get; init; }
        public DateTime? CompletedAt { get; init; }
        public List<StoreOrderItemDto> OrderItems { get; init; } = new List<StoreOrderItemDto>();
        public List<OrderStatusHistoryDto> StatusHistory { get; init; } = new List<OrderStatusHistoryDto>();
    }
}
