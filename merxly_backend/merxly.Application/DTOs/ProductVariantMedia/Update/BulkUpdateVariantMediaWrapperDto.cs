namespace merxly.Application.DTOs.ProductVariantMedia.Update
{
    public record BulkUpdateVariantMediaWrapperDto
    {
        public Guid ProductVariantId { get; init; }
        public List<BulkUpdateVariantMediaItemDto> VariantMedias { get; init; } = new();
    }
}