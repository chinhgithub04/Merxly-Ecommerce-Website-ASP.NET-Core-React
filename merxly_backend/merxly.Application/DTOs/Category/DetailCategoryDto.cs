using merxly.Application.DTOs.Product;

namespace merxly.Application.DTOs.Category
{
    public record DetailCategoryDto
    {
        public Guid Id { get; init; }
        public string Name { get; init; }
        public string? Description { get; init; }
        public string? ImageUrl { get; init; }
        public Guid? ParentCategoryId { get; init; }
        public bool IsActive { get; init; }
        public List<ProductDto> Products { get; init; } = new();
    }
}