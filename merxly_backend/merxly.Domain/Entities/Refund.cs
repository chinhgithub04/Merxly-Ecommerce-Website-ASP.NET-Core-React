using merxly.Domain.Enums;
using merxly.Domain.Interfaces;

namespace merxly.Domain.Entities
{
    public class Refund : ICreatedDate
    {
        public Guid Id { get; set; }
        public string RefundId { get; set; }
        public decimal Amount { get; set; }
        public string Reason { get; set; }
        public string? Notes { get; set; }
        public RefundStatus Status { get; set; }
        public DateTime CreatedAt { get; set; }

        // Foreign Keys
        public Guid PaymentId { get; set; }

        // Navigation properties
        public Payment Payment { get; set; }
    }
}
