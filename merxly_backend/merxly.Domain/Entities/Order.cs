using merxly.Domain.Enums;
using merxly.Domain.Interfaces;

namespace merxly.Domain.Entities
{
    public class Order : ICreatedDate, IModifiedDate
    {
        public Guid Id { get; set; }
        public string OrderNumber { get; set; } // Id to show for user
        public OrderStatus Status { get; set; }
        public decimal SubTotal { get; set; }
        public decimal? Tax { get; set; } // Ignore this for now
        public decimal? ShippingCost { get; set; } // Ignore this for now
        public decimal TotalAmount { get; set; }
        public string? Carrier { get; set; }
        public string? Notes { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }
        public DateTime? ShippedAt { get; set; }
        public DateTime? DeliveredAt { get; set; }

        // Foreign Keys
        public string UserId { get; set; }
        public Guid ShippingAddressId { get; set; }
        public Guid BillingAddressId { get; set; }

        // Navigation properties
        public ApplicationUser User { get; set; }
        public Address ShippingAddress { get; set; }
        public Address BillingAddress { get; set; }
        public ICollection<OrderItem> OrderItems { get; set; } = new List<OrderItem>();
        public ICollection<OrderStatusHistory> StatusHistory { get; set; } = new List<OrderStatusHistory>();
        public Payment? Payment { get; set; }
    }
}
