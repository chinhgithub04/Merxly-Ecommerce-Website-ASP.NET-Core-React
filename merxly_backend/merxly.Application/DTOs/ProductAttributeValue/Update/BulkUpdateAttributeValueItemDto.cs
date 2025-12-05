namespace merxly.Application.DTOs.ProductAttributeValue.Update
{
    public record BulkUpdateAttributeValueItemDto
    {
        public Guid Id { get; init; }
        public string? Value { get; init; }
        public int? DisplayOrder { get; init; }
    }
}
