namespace merxly.Application.DTOs.Review
{
    public record ReviewDto
    {
        public Guid Id { get; init; }
        public int Rating { get; init; }
        public string? Comment { get; init; }
        public string? SellerReply { get; init; }
        public DateTime CreatedAt { get; init; }
        public DateTime? SellerRepliedAt { get; init; }

        // User info
        public string UserId { get; init; }
        public string UserName { get; init; }

        // Product info
        public Guid ProductId { get; init; }
        public string ProductVariantSelected { get; init; } // e.g., "Size: M, Color: Red"

        // Media
        public List<ReviewMediaDto> Medias { get; init; }
    }
}
