namespace merxly.Application.DTOs.ProductVariantMedia.Update
{
    public record ResponseUpdateVariantMediaWrapperDto
    {
        public Guid ProductVariantId { get; init; }
        public List<ResponseUpdateVariantMediaItemDto> VariantMedias { get; init; } = new();
    }
}
