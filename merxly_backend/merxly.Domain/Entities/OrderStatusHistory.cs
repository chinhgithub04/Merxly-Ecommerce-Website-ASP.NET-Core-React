using merxly.Domain.Enums;
using merxly.Domain.Interfaces;

namespace merxly.Domain.Entities
{
    public class OrderStatusHistory : ICreatedDate
    {
        public Guid Id { get; set; }
        public OrderStatus Status { get; set; }
        public string? Notes { get; set; }
        public DateTime CreatedAt { get; set; }

        // Foreign Keys
        public Guid OrderId { get; set; }
        public string? UpdatedByUserId { get; set; }

        // Navigation properties
        public Order Order { get; set; }
        public ApplicationUser? UpdatedByUser { get; set; }
    }
}
