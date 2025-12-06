namespace merxly.Application.DTOs.ProductAttributeValue
{
    public record AttributeValueAdditionDto
    {
        public Guid ProductAttributeId { get; init; }
        public List<CreateProductAttributeValueDto> AttributeValues { get; init; } = new();
    }
}