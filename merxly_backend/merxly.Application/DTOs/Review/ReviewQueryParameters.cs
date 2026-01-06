using merxly.Application.DTOs.Common;
using merxly.Domain.Enums;

namespace merxly.Application.DTOs.Review
{
    public record ReviewQueryParameters : PaginationQuery
    {
        public Guid? ProductId { get; init; }
        public Guid? StoreId { get; init; }
        public int? Rating { get; init; }
        public bool? HasMedia { get; init; }
        public SortOrder SortOrder { get; init; } = SortOrder.Descending;
    }
}
