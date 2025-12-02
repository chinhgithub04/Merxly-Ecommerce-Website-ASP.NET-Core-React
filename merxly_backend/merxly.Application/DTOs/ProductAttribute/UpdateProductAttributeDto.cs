namespace merxly.Application.DTOs.ProductAttribute
{
    public record UpdateProductAttributeDto
    {
        public string? Name { get; init; }
        public int? DisplayOrder { get; init; }
    }
}
