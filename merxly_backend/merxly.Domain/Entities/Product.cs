using merxly.Domain.Interfaces;

namespace merxly.Domain.Entities
{
    public class Product : ICreatedDate, IModifiedDate
    {
        public Guid Id { get; set; }
        public string Name { get; set; }
        public string? Description { get; set; }
        public bool IsStoreFeatured { get; set; } // A flag to mark products as Feature Product
        public bool IsPlatformFeatured { get; set; }
        public bool IsActive { get; set; }
        public decimal? MinPrice { get; set; }
        public decimal? MaxPrice { get; set; }
        public int TotalStock { get; set; }
        public string? MainMediaPublicId { get; set; }
        public double AverageRating { get; set; }
        public int ReviewCount { get; set; }
        public int TotalSold { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }

        // Foreign Keys
        public Guid CategoryId { get; set; }
        public Guid StoreId { get; set; }

        // Navigation properties
        public Category Category { get; set; }
        public Store Store { get; set; }
        public ICollection<ProductAttribute> ProductAttributes { get; set; } = new List<ProductAttribute>();
        public ICollection<ProductVariant> Variants { get; set; } = new List<ProductVariant>();
        public ICollection<Review> Reviews { get; set; } = new List<Review>();
    }
}
