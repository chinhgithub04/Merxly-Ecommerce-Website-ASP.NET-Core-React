namespace merxly.Application.DTOs.Review
{
    public record CreateReviewDto
    {
        public Guid OrderItemId { get; init; }
        public int Rating { get; init; }
        public string? Comment { get; init; }
        public List<CreateReviewMediaDto>? Medias { get; init; }
    }
}
