using merxly.Application.DTOs.ProductVariant.Update;

namespace merxly.Application.DTOs.ProductVariant.Delete
{
    public record BulkDeleteVariantsResponseDto
    {
        public Guid ProductId { get; init; }
        public List<Guid> DeletedVariantIds { get; init; } = new();
        public List<ResponseUpdateVariantItemDto> RemainingVariants { get; init; } = new();
        public decimal NewMinPrice { get; init; }
        public decimal NewMaxPrice { get; init; }
        public int NewTotalStock { get; init; }
    }
}
