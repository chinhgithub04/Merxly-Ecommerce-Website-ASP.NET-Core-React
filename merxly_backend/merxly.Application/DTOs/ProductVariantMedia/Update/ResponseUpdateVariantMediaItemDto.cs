using merxly.Domain.Enums;

namespace merxly.Application.DTOs.ProductVariantMedia.Update
{
    public record ResponseUpdateVariantMediaItemDto
    {
        public Guid Id { get; init; }
        public string? MediaUrl { get; init; }
        public MediaType MediaType { get; init; }
        public int DisplayOrder { get; init; }
        public bool IsMain { get; init; }
    }
}
