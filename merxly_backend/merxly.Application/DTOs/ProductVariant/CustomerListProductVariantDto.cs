using merxly.Application.DTOs.ProductVariantMedia;

namespace merxly.Application.DTOs.ProductVariant
{
    public record CustomerListProductVariantDto
    {
        public Guid Id { get; init; }
        public string Title { get; init; }
        public decimal Price { get; init; }
        public int StockQuantity { get; init; }
        public List<ProductVariantMediaDto> Media { get; init; } = new();
    }
}