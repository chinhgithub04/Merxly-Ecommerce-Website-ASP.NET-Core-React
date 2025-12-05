namespace merxly.Application.DTOs.ProductVariantMedia.Update
{
    public record BulkUpdateProductMediaResponseDto
    {
        public List<ResponseUpdateVariantMediaWrapperDto> ProductVariantMedias { get; init; } = new();
    }
}
