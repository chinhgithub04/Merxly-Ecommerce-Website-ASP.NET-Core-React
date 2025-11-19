using merxly.Domain.Interfaces;

namespace merxly.Domain.Entities
{
    public class Product : ICreatedDate, IModifiedDate
    {
        public Guid Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public string? ShortDescription { get; set; }
        public bool IsFeatured { get; set; } // A flag to mark products as Feature Product
        public bool IsActive { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }

        // Foreign Keys
        public Guid CategoryId { get; set; }
        public Guid StoreId { get; set; }

        // Navigation properties
        public Category Category { get; set; }
        public Store Store { get; set; }
        public ICollection<ProductVariant> Variants { get; set; } = new List<ProductVariant>();
        public ICollection<Review> Reviews { get; set; } = new List<Review>();
    }
}
