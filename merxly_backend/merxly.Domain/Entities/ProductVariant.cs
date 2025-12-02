using merxly.Domain.Interfaces;

namespace merxly.Domain.Entities
{
    public class ProductVariant : ICreatedDate, IModifiedDate
    {
        public Guid Id { get; set; }
        public string? SKU { get; set; }
        public decimal Price { get; set; }
        public decimal? Weight { get; set; }
        public decimal? Length { get; set; }
        public decimal? Width { get; set; }
        public decimal? Height { get; set; }
        public int StockQuantity { get; set; }
        public bool IsActive { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }

        // Foreign Keys
        public Guid ProductId { get; set; }

        // Navigation properties
        public Product Product { get; set; }
        public ICollection<ProductAttributeValue> AttributeValues { get; set; } = new List<ProductAttributeValue>();
        public ICollection<ProductVariantMedia> Media { get; set; } = new List<ProductVariantMedia>();
    }
}
