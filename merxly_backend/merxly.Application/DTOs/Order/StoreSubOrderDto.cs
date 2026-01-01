using merxly.Domain.Enums;

namespace merxly.Application.DTOs.Order
{
    public record StoreSubOrderDto
    {
        public Guid Id { get; init; }
        public required string SubOrderNumber { get; init; }
        public string CustomerFullName { get; init; }
        public string CustomerEmail { get; init; }
        public OrderStatus Status { get; init; }
        public int TotalItems { get; init; }
        public decimal TotalAmount { get; init; }
        public DateTime CreatedAt { get; init; }
        public DateTime? UpdatedAt { get; init; }
    }
}
