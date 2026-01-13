using merxly.Domain.Enums;

namespace merxly.Application.DTOs.StoreTransfer
{
    public record StoreTransferDetailDto
    {
        public Guid Id { get; init; }
        public string? StripeTransferId { get; init; }
        public decimal Amount { get; init; }
        public decimal Commission { get; init; }
        public StoreTransferStatus Status { get; init; }
        public string? FailureMessage { get; init; }
        public DateTime CreatedAt { get; init; }
        public DateTime? UpdatedAt { get; init; }
        public DateTime? TransferredAt { get; init; }

        // Related Order Information
        public Guid SubOrderId { get; init; }
        public string SubOrderNumber { get; init; }
        public decimal SubOrderTotal { get; init; }

        // Payment Information
        public Guid PaymentId { get; init; }
        public string PaymentIntentId { get; init; }
        public string Currency { get; init; }
    }
}
