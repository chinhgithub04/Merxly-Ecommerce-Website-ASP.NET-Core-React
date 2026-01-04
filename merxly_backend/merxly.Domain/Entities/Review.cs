using merxly.Domain.Interfaces;

namespace merxly.Domain.Entities
{
    public class Review : ICreatedDate, IModifiedDate
    {
        public Guid Id { get; set; }
        public int Rating { get; set; }
        public string? Comment { get; set; }
        public string? SellerReply { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }
        public DateTime? SellerRepliedAt { get; set; }

        // Foreign Keys
        public string UserId { get; set; }
        public Guid OrderItemId { get; set; }
        public Guid ProductId { get; set; }
        public Guid ProductVariantId { get; set; }
        public Guid StoreId { get; set; }

        // Navigation properties
        public ApplicationUser User { get; set; }
        public OrderItem OrderItem { get; set; }
        public Product Product { get; set; }
        public ProductVariant ProductVariant { get; set; }
        public Store Store { get; set; }
        public ICollection<ReviewMedia> Medias { get; set; } = new List<ReviewMedia>();
    }
}
