namespace merxly.Application.DTOs.ProductAttributeValue
{
    public record CreateProductAttributeValueDto
    {
        public string Value { get; init; }
        public int DisplayOrder { get; init; }
    }
}
