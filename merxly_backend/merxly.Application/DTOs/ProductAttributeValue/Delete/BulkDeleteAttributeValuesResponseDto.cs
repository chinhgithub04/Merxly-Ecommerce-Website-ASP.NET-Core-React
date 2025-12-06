using merxly.Application.DTOs.ProductAttribute.Update;
using merxly.Application.DTOs.ProductVariant.Update;

namespace merxly.Application.DTOs.ProductAttributeValue.Delete
{
    public record BulkDeleteAttributeValuesResponseDto
    {
        public Guid ProductId { get; init; }
        public List<Guid> DeletedAttributeValueIds { get; init; } = new();
        public List<Guid> DeletedAttributeIds { get; init; } = new();
        public List<ResponseUpdateAttributeItemDto> RemainingAttributes { get; init; } = new();
        public List<ResponseUpdateVariantItemDto> RegeneratedVariants { get; init; } = new();
        public decimal NewMinPrice { get; init; }
        public decimal NewMaxPrice { get; init; }
        public int NewTotalStock { get; init; }
    }
}
