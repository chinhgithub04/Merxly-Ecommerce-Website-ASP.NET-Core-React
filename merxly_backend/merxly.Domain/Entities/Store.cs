using merxly.Domain.Interfaces;

namespace merxly.Domain.Entities
{
    public class Store : ICreatedDate, IModifiedDate
    {
        public Guid Id { get; set; }
        public string StoreName { get; set; }
        public string? Description { get; set; }
        public string? LogoUrl { get; set; }
        public string? BannerUrl { get; set; }
        public string? Email { get; set; }
        public string? PhoneNumber { get; set; }
        public string? Website { get; set; }
        public bool IsActive { get; set; }
        public bool IsVerified { get; set; }
        public decimal CommissionRate { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }

        // Stripe Connect Integration - for store payouts
        public string? StripeConnectAccountId { get; set; }

        // Foreign Keys
        public string OwnerId { get; set; }

        // Navigation properties
        public ApplicationUser Owner { get; set; }
        public ICollection<Product> Products { get; set; } = new List<Product>();
        public ICollection<OrderItem> OrderItems { get; set; } = new List<OrderItem>();
        public StoreAddress? Address { get; set; }
    }
}
