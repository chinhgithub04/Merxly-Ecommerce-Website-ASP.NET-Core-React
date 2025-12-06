using merxly.Application.DTOs.ProductVariant;

namespace merxly.Application.DTOs.ProductAttributeValue
{
    public record AddAttributeValuesAndVariants
    {
        public List<AttributeValueAdditionDto> AttributeValueAdditions { get; init; } = new();
        public List<CreateProductVariantDto> ProductVariants { get; init; } = new();
    }
}