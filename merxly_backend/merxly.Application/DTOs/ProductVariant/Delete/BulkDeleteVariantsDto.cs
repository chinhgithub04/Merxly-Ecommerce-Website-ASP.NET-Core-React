namespace merxly.Application.DTOs.ProductVariant.Delete
{
    public record BulkDeleteVariantsDto
    {
        public List<Guid> VariantIds { get; init; } = new();
    }
}