namespace merxly.Application.DTOs.ProductAttribute.Update
{
    public record BulkUpdateProductAttributesDto
    {
        public List<BulkUpdateAttributeItemDto> Attributes { get; init; } = new();
    }
}