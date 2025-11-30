namespace merxly.Application.DTOs.Product
{
    public record CreateProductDto
    {
        public string Name { get; init; }
        public string? Description { get; init; }
        public bool IsStoreFeatured { get; init; } = false;
        public Guid CategoryId { get; init; }
    }
}
