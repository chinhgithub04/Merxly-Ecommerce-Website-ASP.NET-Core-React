namespace merxly.Application.DTOs.ProductAttributeValue.Delete
{
    public record BulkDeleteAttributeValuesDto
    {
        public List<Guid> AttributeValueIds { get; init; } = new();
    }
}
