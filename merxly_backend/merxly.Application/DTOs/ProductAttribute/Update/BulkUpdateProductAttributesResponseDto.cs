namespace merxly.Application.DTOs.ProductAttribute.Update
{
    public record BulkUpdateProductAttributesResponseDto
    {
        public List<ResponseUpdateAttributeItemDto> UpdatedAttributes { get; init; } = new();
    }
}