using merxly.Application.DTOs.ProductAttributeValue;

namespace merxly.Application.DTOs.ProductAttribute
{
    public record CreateProductAttributeDto
    {
        public string Name { get; init; }
        public int DisplayOrder { get; init; }
        public List<CreateProductAttributeValueDto> ProductAttributeValues { get; init; } = new();
    }
}
