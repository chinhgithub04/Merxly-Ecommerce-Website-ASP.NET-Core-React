namespace merxly.Application.DTOs.Product
{
    public record ProductDto
    {
        public Guid Id { get; init; }
        public string Name { get; init; }
        public decimal? MinPrice { get; init; }
        public decimal? MaxPrice { get; init; }
        public int TotalStock { get; init; }
        public string? MainMediaPublicId { get; init; }
        public double AverageRating { get; init; }
        public int ReviewCount { get; init; }
        public bool IsStoreFeatured { get; init; }
        public bool IsPlatformFeatured { get; init; }
        public int TotalSold { get; init; }
        public string CategoryName { get; init; }
        public Guid CategoryId { get; init; }
        public DateTime CreatedAt { get; init; }
    }
}