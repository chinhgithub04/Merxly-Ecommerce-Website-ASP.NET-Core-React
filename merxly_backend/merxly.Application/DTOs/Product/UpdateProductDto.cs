namespace merxly.Application.DTOs.Product
{
    public record UpdateProductDto
    {
        public string? Name { get; init; }
        public string? Description { get; init; }
        public bool? IsStoreFeatured { get; init; }
        public bool? IsActive { get; init; }
        public Guid? CategoryId { get; init; }
    }
}
