namespace merxly.Application.DTOs.ProductVariant.Update
{
    public record BulkUpdateProductVariantsDto
    {
        public List<BulkUpdateVariantItemDto> UpdatedVariants { get; init; } = new();
        public List<Guid>? DeletedVariantIds { get; init; } = new();
    }
}