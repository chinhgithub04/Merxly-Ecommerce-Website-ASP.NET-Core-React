using merxly.Application.DTOs.ProductAttributeValue.Update;
using merxly.Application.DTOs.ProductVariant.Update;

namespace merxly.Application.DTOs.ProductAttributeValue
{
    public record AddAttributeValuesWithVariantsResponseDto
    {
        public Guid ProductId { get; init; }
        public List<ResponseUpdateAttributeValueItemDto> AddedAttributeValues { get; init; } = new();
        public List<ResponseUpdateVariantItemDto> RegeneratedVariants { get; init; } = new();
        public decimal NewMinPrice { get; init; }
        public decimal NewMaxPrice { get; init; }
        public int NewTotalStock { get; init; }
    }
}
