using merxly.Application.DTOs.Common;
using merxly.Domain.Enums;

namespace merxly.Application.DTOs.CustomerOrders
{
    public record CustomerSubOrderFilterDto : PaginationQuery
    {
        public OrderStatus? Status { get; init; }
        public string? SearchTerm { get; init; } // Search by Sub Order Number
        public DateTime? FromDate { get; init; }
        public DateTime? ToDate { get; init; }
    }
}
