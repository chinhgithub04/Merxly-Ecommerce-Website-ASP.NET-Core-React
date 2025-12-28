using merxly.Domain.Enums;
using merxly.Domain.Interfaces;

namespace merxly.Domain.Entities
{
    public class StoreTransfer : ICreatedDate, IModifiedDate
    {
        public Guid Id { get; set; }
        public string? StripeTransferId { get; set; } // Stripe Transfer ID from platform to store's connected account
        public decimal Amount { get; set; } // Amount transferred to store (after commission)
        public decimal Commission { get; set; } // Commission deducted for this store's items
        public StoreTransferStatus Status { get; set; }
        public string? FailureMessage { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }
        public DateTime? TransferredAt { get; set; }

        // Foreign Keys
        public Guid PaymentId { get; set; }
        public Guid StoreId { get; set; }

        // Navigation properties
        public Payment Payment { get; set; }
        public Store Store { get; set; }
    }
}
