using merxly.Domain.Enums;

namespace merxly.Application.DTOs.ProductVariantMedia
{
    public record CreateProductVariantMediaDto
    {
        public string MediaPublicId { get; init; }
        public int DisplayOrder { get; init; }
        public bool IsMain { get; init; }
        public MediaType MediaType { get; init; }
    }
}