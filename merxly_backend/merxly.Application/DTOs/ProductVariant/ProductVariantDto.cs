namespace merxly.Application.DTOs.ProductVariant
{
    public record ProductVariantDto
    {
        public Guid Id { get; init; }
        public string Name { get; init; }
        public string? SKU { get; init; }
        public decimal Price { get; init; }
        public int StockQuantity { get; init; }
        public bool IsActive { get; init; }
    }
}
