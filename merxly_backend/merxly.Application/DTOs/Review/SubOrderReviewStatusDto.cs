namespace merxly.Application.DTOs.Review
{
    public record SubOrderReviewStatusDto
    {
        public Guid SubOrderId { get; init; }
        public string SubOrderNumber { get; init; }
        public DateTime CompletedAt { get; init; }
        public bool IsWithinReviewWindow { get; init; }
        public int DaysRemainingToReview { get; init; }
        public bool CanLeaveReview { get; init; } // True if at least one item can be reviewed
        public List<OrderItemReviewStatusDto> OrderItems { get; init; }
    }
}
