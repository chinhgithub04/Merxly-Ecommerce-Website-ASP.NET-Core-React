namespace merxly.Application.DTOs.ProductAttributeValue
{
    public record UpdateProductAttributeValueDto
    {
        public string? Value { get; init; }
        public int? DisplayOrder { get; init; }
    }
}
