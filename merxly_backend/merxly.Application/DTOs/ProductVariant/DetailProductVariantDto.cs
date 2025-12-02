namespace merxly.Application.DTOs.ProductVariant
{
    public record DetailProductVariantDto
    {
        public Guid Id { get; init; }
        public string Title { get; init; }
        public string? MainMediaUrl { get; init; }
        public string? SKU { get; init; }
        public decimal Price { get; init; }
        public decimal? Weight { get; init; }
        public decimal? Length { get; init; }
        public decimal? Width { get; init; }
        public decimal? Height { get; init; }
        public int StockQuantity { get; init; }
        public bool IsActive { get; init; }
    }
}