namespace merxly.Application.DTOs.ProductAttributeValue.Update
{
    public record BulkUpdateProductAttributeValuesResponseDto
    {
        public List<ResponseUpdateAttributeValueItemDto> UpdatedAttributeValues { get; init; } = new();
    }
}
