namespace merxly.Application.DTOs.ProductVariantMedia.Update
{
    public record BulkUpdateProductMediaRequestDto
    {
        public List<BulkUpdateVariantMediaWrapperDto> ProductVariantMedias { get; init; } = new();
    }
}