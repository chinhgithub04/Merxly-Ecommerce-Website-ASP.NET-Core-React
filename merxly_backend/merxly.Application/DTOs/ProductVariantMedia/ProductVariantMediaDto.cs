using merxly.Domain.Enums;

namespace merxly.Application.DTOs.ProductVariantMedia
{
    public record ProductVariantMediaDto
    {
        public Guid Id { get; init; }
        public string MediaUrl { get; init; }
        public MediaType MediaType { get; init; }
        public int DisplayOrder { get; init; }
        public bool IsPrimary { get; init; }
    }
}