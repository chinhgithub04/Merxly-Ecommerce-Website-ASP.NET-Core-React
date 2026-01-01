using merxly.Application.DTOs.Common;
using merxly.Domain.Enums;

namespace merxly.Application.DTOs.Order
{
    public record StoreSubOrderFilterDto : PaginationQuery
    {
        public OrderStatus? Status { get; init; }
        public string? SearchTerm { get; init; }
        public DateTime? FromDate { get; init; }
        public DateTime? ToDate { get; init; }
    }
}
