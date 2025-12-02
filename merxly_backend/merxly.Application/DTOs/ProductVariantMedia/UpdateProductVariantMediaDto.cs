namespace merxly.Application.DTOs.ProductVariantMedia
{
    public record UpdateProductVariantMediaDto
    {
        public int DisplayOrder { get; init; }
        public bool IsPrimary { get; init; }
    }
}