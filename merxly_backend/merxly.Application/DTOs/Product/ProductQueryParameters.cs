using merxly.Application.DTOs.Common;
using merxly.Domain.Enums;

namespace merxly.Application.DTOs.Product
{
    public record ProductQueryParameters : PaginationQuery
    {
        public string? SearchTerm { get; init; }
        public Guid? CategoryId { get; init; }
        public decimal? MinPrice { get; init; }
        public decimal? MaxPrice { get; init; }
        public double? MinRating { get; init; }
        public bool? IsStoreFeatured { get; init; }
        public bool? IsPlatformFeatured { get; init; }
        public Guid? StoreId { get; init; }

        public ProductSortBy SortBy { get; init; } = ProductSortBy.PlatformFeatured;
    }
}