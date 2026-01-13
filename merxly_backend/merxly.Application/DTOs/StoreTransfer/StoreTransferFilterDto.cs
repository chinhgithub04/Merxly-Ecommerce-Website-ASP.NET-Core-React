using merxly.Application.DTOs.Common;
using merxly.Domain.Enums;

namespace merxly.Application.DTOs.StoreTransfer
{
    public record StoreTransferFilterDto : PaginationQuery
    {
        public StoreTransferStatus? Status { get; init; }
        public string? SearchTerm { get; init; } // Search by Sub Order Number
        public DateTime? FromDate { get; init; }
        public DateTime? ToDate { get; init; }
        public decimal? MinAmount { get; init; }
        public decimal? MaxAmount { get; init; }
    }
}
