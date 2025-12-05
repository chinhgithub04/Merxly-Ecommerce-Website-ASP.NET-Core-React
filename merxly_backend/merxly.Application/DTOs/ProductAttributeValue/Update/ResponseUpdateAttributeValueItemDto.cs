namespace merxly.Application.DTOs.ProductAttributeValue.Update
{
    public record ResponseUpdateAttributeValueItemDto
    {
        public Guid Id { get; init; }
        public string Value { get; init; }
        public int DisplayOrder { get; init; }
        public Guid ProductAttributeId { get; init; }
    }
}
