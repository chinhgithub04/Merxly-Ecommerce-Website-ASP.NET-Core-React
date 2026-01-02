using merxly.Domain.Enums;

namespace merxly.Application.DTOs.CustomerOrders
{
    public record CustomerSubOrderDto
    {
        public Guid Id { get; init; }
        public required string SubOrderNumber { get; init; }
        public OrderStatus Status { get; init; }
        public int TotalItems { get; init; }
        public decimal TotalAmount { get; init; }
        public DateTime CreatedAt { get; init; }
        public DateTime? UpdatedAt { get; init; }
    }
}
