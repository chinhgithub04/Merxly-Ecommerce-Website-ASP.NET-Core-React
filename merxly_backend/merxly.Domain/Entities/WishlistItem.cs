using merxly.Domain.Interfaces;

namespace merxly.Domain.Entities
{
    public class WishlistItem : ICreatedDate
    {
        public Guid Id { get; set; }
        public DateTime CreatedAt { get; set; }

        // Foreign Keys
        public Guid WishlistId { get; set; }
        public Guid ProductId { get; set; }
        public Guid? ProductVariantId { get; set; }

        // Navigation properties
        public Wishlist Wishlist { get; set; }
        public Product Product { get; set; }
        public ProductVariant? ProductVariant { get; set; }
    }
}
