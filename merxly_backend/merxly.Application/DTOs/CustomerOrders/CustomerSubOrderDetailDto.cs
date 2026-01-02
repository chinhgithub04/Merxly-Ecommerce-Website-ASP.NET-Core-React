using merxly.Application.DTOs.Order;
using merxly.Domain.Enums;

namespace merxly.Application.DTOs.CustomerOrders
{
    public record CustomerSubOrderDetailDto
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

        // Store Information
        public Guid StoreId { get; init; }
        public string StoreName { get; init; }
        public string? StoreLogoImagePublicId { get; init; }
        public string? StoreBannerImagePublicId { get; init; }
        public string StoreEmail { get; init; }
        public string StorePhoneNumber { get; init; }

        // Shipping Address
        public string ShippingFullAddress { get; init; }
        public string ShippingPostalCode { get; init; }
        public string? ShippingPhoneNumber { get; init; }

        public DateTime CreatedAt { get; init; }
        public DateTime? UpdatedAt { get; init; }
        public DateTime? CompletedAt { get; init; }

        public List<StoreOrderItemDto> OrderItems { get; init; } = new();
        public List<OrderStatusHistoryDto> StatusHistory { get; init; } = new();
    }
}
