namespace merxly.Domain.Entities
{
    public class ProductAttribute
    {
        public Guid Id { get; set; }
        public string Name { get; set; }
        public int DisplayOrder { get; set; }
        public Guid ProductId { get; set; }

        // Navigation properties
        public Product Product { get; set; }
        public ICollection<ProductAttributeValue> ProductAttributeValues { get; set; } = new List<ProductAttributeValue>();
    }
}
