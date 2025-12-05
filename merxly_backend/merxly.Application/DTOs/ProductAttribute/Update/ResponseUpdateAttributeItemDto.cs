namespace merxly.Application.DTOs.ProductAttribute.Update
{
    public record ResponseUpdateAttributeItemDto
    {
        public Guid Id { get; init; }
        public string Name { get; init; }
        public int DisplayOrder { get; init; }
    }
}