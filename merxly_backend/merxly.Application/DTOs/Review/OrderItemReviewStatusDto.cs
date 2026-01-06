namespace merxly.Application.DTOs.Review
{
    public record OrderItemReviewStatusDto
    {
        public Guid OrderItemId { get; init; }
        public Guid ProductId { get; init; }
        public Guid ProductVariantId { get; init; }
        public string ProductVariantName { get; init; }
        public string? MainMediaPublicId { get; init; }
        public bool HasBeenReviewed { get; init; }
        public ReviewDto? ExistingReview { get; init; }
    }
}
