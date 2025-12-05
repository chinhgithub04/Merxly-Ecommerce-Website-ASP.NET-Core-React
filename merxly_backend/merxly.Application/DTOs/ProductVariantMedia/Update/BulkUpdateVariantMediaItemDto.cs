using merxly.Domain.Enums;

namespace merxly.Application.DTOs.ProductVariantMedia.Update
{
    public record BulkUpdateVariantMediaItemDto
    {
        public Guid? Id { get; init; } // If null: new media item to be added
        public string? MediaPublicId { get; init; }
        public MediaType? MediaType { get; init; }
        public int? DisplayOrder { get; init; }
        public bool? IsMain { get; init; }
    }
}