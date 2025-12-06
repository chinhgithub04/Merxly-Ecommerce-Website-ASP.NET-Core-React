using merxly.Application.DTOs.ProductVariant;

namespace merxly.Application.DTOs.ProductAttributeValue.Delete
{
    public record DeleteAttributeValuesWithVariantsDto
    {
        public List<Guid> AttributeValueIds { get; init; } = new();
        public List<CreateProductVariantDto> ProductVariants { get; init; } = new();
    }
}
