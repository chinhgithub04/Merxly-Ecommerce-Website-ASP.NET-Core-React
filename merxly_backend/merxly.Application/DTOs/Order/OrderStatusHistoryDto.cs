using merxly.Domain.Enums;

namespace merxly.Application.DTOs.Order
{
    public record OrderStatusHistoryDto
    {
        public Guid Id { get; init; }
        public OrderStatus Status { get; init; }
        public string? Notes { get; init; }
        public DateTime CreatedAt { get; init; }
        public string? ChangedBy { get; init; } // e.g., "Customer", "StoreOwner", "Admin"
    }
}