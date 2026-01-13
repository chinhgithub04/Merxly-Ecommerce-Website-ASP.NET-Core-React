using merxly.Domain.Enums;

namespace merxly.Application.DTOs.StoreTransfer
{
    public record StoreTransferDto
    {
        public Guid Id { get; init; }
        public string? StripeTransferId { get; init; }
        public decimal Amount { get; init; }
        public decimal Commission { get; init; }
        public StoreTransferStatus Status { get; init; }
        public string SubOrderNumber { get; init; }
        public string OrderNumber { get; init; }
        public DateTime CreatedAt { get; init; }
        public DateTime? TransferredAt { get; init; }
    }
}
