using merxly.Application.DTOs.ProductVariant;

namespace merxly.Application.DTOs.ProductAttribute.Delete
{
    public record DeleteAttributesWithVariantsDto
    {
        public List<Guid> AttributeIds { get; init; } = new();
        public List<CreateProductVariantDto> ProductVariants { get; init; } = new();
    }
}
