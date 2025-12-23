namespace merxly.Application.DTOs.Category
{
    /// <summary>
    /// This DTO is used to get the parent categories with images to make the "Shop with Categories" section on the interface.
    /// To get all the hierarchical categories, use CategoryDto
    /// </summary>
    public record ParentCategoryDto
    {
        public Guid Id { get; init; }
        public string Name { get; init; }
        public string? ImagePublicId { get; init; }
        public bool IsActive { get; init; }
    }
}
