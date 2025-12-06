using merxly.Application.DTOs.ProductAttribute.Update;
using merxly.Application.DTOs.ProductVariant.Update;

namespace merxly.Application.DTOs.ProductAttribute
{
    public record AddAttributesWithVariantsResponseDto
    {
        public Guid ProductId { get; init; }
        public List<ResponseUpdateAttributeItemDto> AddedAttributes { get; init; } = new();
        public List<ResponseUpdateVariantItemDto> RegeneratedVariants { get; init; } = new();
        public decimal NewMinPrice { get; init; }
        public decimal NewMaxPrice { get; init; }
        public int NewTotalStock { get; init; }
    }
}
