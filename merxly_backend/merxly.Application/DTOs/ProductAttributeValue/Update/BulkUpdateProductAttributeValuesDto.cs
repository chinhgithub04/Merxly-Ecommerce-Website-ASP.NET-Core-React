namespace merxly.Application.DTOs.ProductAttributeValue.Update
{
    public record BulkUpdateProductAttributeValuesDto
    {
        public List<BulkUpdateAttributeValueItemDto> AttributeValues { get; init; } = new();
    }
}
