using merxly.Application.DTOs.ProductAttributeValue;

namespace merxly.Application.DTOs.ProductAttribute
{
    public record ProductAttributeDto
    {
        public Guid Id { get; init; }
        public string Name { get; init; }
        public int DisplayOrder { get; init; }
        public List<ProductAttributeValueDto> ProductAttributeValues { get; init; } = new();
    }
}
