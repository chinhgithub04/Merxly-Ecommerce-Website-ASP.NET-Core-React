using merxly.Domain.Interfaces;

namespace merxly.Domain.Entities
{
    public class CartItem : ICreatedDate, IModifiedDate
    {
        public Guid Id { get; set; }
        public int Quantity { get; set; }
        public decimal PriceAtAdd { get; set; } // Save the price at the time of creating the shopping cart, if the price changes later, the customer will be notified.
        public DateTime CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }

        // Foreign Keys
        public Guid CartId { get; set; }
        public Guid? ProductVariantId { get; set; }

        // Navigation properties
        public Cart Cart { get; set; }
        public ProductVariant? ProductVariant { get; set; }
    }
}
