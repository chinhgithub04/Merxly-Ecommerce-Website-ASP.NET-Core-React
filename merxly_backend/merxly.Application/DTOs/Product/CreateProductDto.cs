using merxly.Application.DTOs.ProductAttribute;
using merxly.Application.DTOs.ProductVariant;

namespace merxly.Application.DTOs.Product
{
    public record CreateProductDto
    {
        public string Name { get; init; }
        public string? Description { get; init; }
        public bool IsStoreFeatured { get; init; } = false;
        public Guid CategoryId { get; init; }
        public List<CreateProductAttributeDto> ProductAttributes { get; init; } = new();
        public List<CreateProductVariantDto> Variants { get; init; } = new();
    }
}
