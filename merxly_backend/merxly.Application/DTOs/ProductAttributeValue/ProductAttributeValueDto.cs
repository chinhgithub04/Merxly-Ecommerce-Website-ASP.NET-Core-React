namespace merxly.Application.DTOs.ProductAttributeValue
{
    public record ProductAttributeValueDto
    {
        public Guid Id { get; init; }
        public string Value { get; init; }
        public int DisplayOrder { get; init; }
    }
}
